"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Package,
  Shield,
  AlertTriangle,
  CheckCircle,
  Hash,
  FileText,
  Activity,
  XCircle,
  Plus,
  Copy,
  Check,
  Download,
} from "lucide-react";
import supabase from "@/lib/supabase";
import { format, subMonths } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { JSONTree } from "react-json-tree";

interface BinaryInfo {
  id: string;
  name: string;
  size: string | number;
  format: string;
  arch: string;
  version: string;
  hash: string;
  languages: string;
  timestamp: string;
}

export default function SecurityDashboard() {
  const searchParams = useSearchParams();
  const keyId = searchParams.get("keyId");
  console.log('Component mounted, keyId:', keyId);

  // Initialize tab state with default value, update from localStorage on client
  const [tab, setTab] = useState("overview");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();
  const [selectedSBOM, setSelectedSBOM] = useState<any>(null);
  const [selectedPackageReport, setSelectedPackageReport] = useState<any>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Load persisted tab state from localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('selectedTab');
      if (savedTab && ["overview", "binaries", "packages"].includes(savedTab)) {
        setTab(savedTab);
      }
    }
  }, []);

  // Save tab state to localStorage whenever it changes, only on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedTab', tab);
    }
  }, [tab]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const fetchBinaries = async () => {
    if (!keyId) return;
    
    try {
      const client = supabase.supabase;
      const { data: allBinaries, error: binariesError } = await client
        .from('binaries')
        .select('id, analysis_data, created_at, hash_sha256, key_id')
        .eq('key_id', keyId)
        .order('created_at', { ascending: false });

      if (binariesError) {
        console.error('Error fetching binaries:', binariesError.message);
        setError(`Failed to fetch binaries: ${binariesError.message}`);
        return;
      }

      setBinaries(allBinaries || []);
      setLastUpdate(new Date());

      if (allBinaries) {
        const validBinaries = allBinaries.filter(b => b.analysis_data?.sbom?.metadata?.component);
        setMetrics((prev: any) => ({
          ...prev,
          binaries: allBinaries.length,
          issues: allBinaries.reduce((acc, b) => {
            const threats = b.analysis_data?.threats?.length || 0;
            const vulns = b.analysis_data?.vulnerabilities?.length || 0;
            return acc + threats + vulns;
          }, 0),
          avgScore: validBinaries.length
            ? (
                validBinaries.reduce(
                  (acc, b) => {
                    const score = b.analysis_data?.security_score || 0;
                    return acc + score;
                  },
                  0
                ) / validBinaries.length
              ).toFixed(1)
            : "N/A",
        }));
      }
    } catch (e) {
      const error = e as Error;
      console.error('Dashboard fetch error:', error);
      setError(`Failed to load dashboard data: ${error.message}`);
    }
  };

  const fetchPackages = async () => {
    if (!keyId) return;
    
    try {
      const client = supabase.supabase;
      const { data: allPackages, error: packagesError } = await client
        .from('packages')
        .select('*')
        .eq('key_id', keyId)
        .order('created_at', { ascending: false });

      if (packagesError) {
        console.error('Error fetching packages:', packagesError.message);
        setError(`Failed to fetch packages: ${packagesError.message}`);
        return;
      }

      setPackages(allPackages || []);
      setLastUpdate(new Date());

      if (allPackages) {
        setMetrics((prev: any) => ({
          ...prev,
          packages: allPackages.length,
        }));
      }
    } catch (e) {
      const error = e as Error;
      console.error('Package fetch error:', error);
      setError(`Failed to load package data: ${error.message}`);
    }
  };

  const fetchApiKey = async () => {
    if (!keyId) return;
    try {
      const client = supabase.supabase;
      const { data: apiKeyData, error: keyError } = await client
        .from('api_keys')
        .select('api_key')
        .eq('id', keyId)
        .maybeSingle();

      if (keyError) {
        console.error('Error fetching API key:', keyError.message);
        setError(`Failed to fetch API key: ${keyError.message}`);
        return;
      }
      if (apiKeyData) {
        setApiKey(apiKeyData.api_key);
      }
    } catch (e) {
      const error = e as Error;
      console.error('API key fetch error:', error);
      setError(`Failed to load API key: ${error.message}`);
    }
  };

  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      await Promise.all([fetchBinaries(), fetchPackages(), fetchApiKey()]);
      setLoading(false);
    };

    initialFetch();
  }, [keyId]);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (tab === 'binaries') {
      pollInterval = setInterval(fetchBinaries, 10000);
    } else if (tab === 'packages') {
      pollInterval = setInterval(fetchPackages, 10000);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [tab, keyId]);

  const curlCommand = apiKey
    ? `curl -X POST https://platform.atelierlogos.studio/binary \\
    -H "Authorization: Bearer ${apiKey}" \\
    -F "file=@/path/to/binary" \\
    -v`
    : `curl -X POST https://platform.atelierlogos.studio/binary \\
    -H "Authorization: Bearer [YOUR_API_KEY]" \\
    -F "file=@/path/to/binary" \\
    -v`;

  const packageCurlCommand = apiKey
    ? `curl -X POST https://platform.atelierlogos.studio/packages \\    
    -H "Authorization: Bearer ${apiKey}" \\
    -H "Content-Type: application/json" \\
    -d '{"name": [PACKAGE_NAME], "version": [PACKAGE_VERSION]' \\
    -v`
    : `curl -X POST https://platform.atelierlogos.studio/packages \\    
    -H "Authorization: Bearer [YOUR_API_KEY]" \\
    -H "Content-Type: application/json" \\
    -d '{"name": [PACKAGE_NAME], "version": [PACKAGE_VERSION]' \\
    -v`;

  const [metrics, setMetrics] = useState<any>({
    binaries: 0,
    packages: 0,
    issues: 0,
    avgScore: "N/A",
    delta: "0.0",
  });
  const [binaries, setBinaries] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'created_at', direction: 'desc' });

  const extractBinaryInfo = (binary: any): BinaryInfo => {
    const sbom = binary.analysis_data?.sbom;
    const component = sbom?.metadata?.component;
    const properties = component?.properties || [];

    return {
      id: binary.id,
      name: component?.name || binary.file_name || 'Unknown',
      size: properties.find((p: any) => p.name === 'size_bytes')?.value || 0,
      format: properties.find((p: any) => p.name === 'format')?.value || 'Unknown',
      arch: properties.find((p: any) => p.name === 'architecture')?.value || 'Unknown',
      version: component?.version || 'Unknown',
      hash: component?.hashes?.find((h: any) => h.alg === 'SHA-256')?.content || binary.hash_sha256 || '',
      languages: properties.find((p: any) => p.name === 'languages')?.value || 'Unknown',
      timestamp: sbom?.metadata?.timestamp || binary.created_at,
    };
  };

  const handleDownloadReport = async (binary: any) => {
    try {
      if (!binary.analysis_data?.sbom) {
        toast({ variant: "destructive", description: "No SBOM data found" });
        return;
      }

      const response = await fetch("/api/generate-sbom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(binary.analysis_data.sbom),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileName = binary.analysis_data.sbom.metadata?.component?.name || "sbom-report";
      const safeFileName = fileName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      link.download = `${safeFileName}-sbom.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating report:", error);
      toast({ variant: "destructive", description: "Failed to generate PDF report" });
      setError("Failed to generate PDF report");
    }
  };

  const sortData = (data: any[], key: string) => {
    return [...data].sort((a, b) => {
      const infoA = extractBinaryInfo(a);
      const infoB = extractBinaryInfo(b);
      
      switch (key) {
        case 'name':
          return sortConfig.direction === 'asc' 
            ? infoA.name.localeCompare(infoB.name)
            : infoB.name.localeCompare(infoA.name);
        case 'timestamp':
          return sortConfig.direction === 'asc'
            ? new Date(infoA.timestamp).getTime() - new Date(infoB.timestamp).getTime()
            : new Date(infoB.timestamp).getTime() - new Date(infoA.timestamp).getTime();
        default:
          const valueA = infoA[key as keyof BinaryInfo];
          const valueB = infoB[key as keyof BinaryInfo];
          if (!valueA) return sortConfig.direction === 'asc' ? 1 : -1;
          if (!valueB) return sortConfig.direction === 'asc' ? -1 : 1;
          return sortConfig.direction === 'asc'
            ? String(valueA).localeCompare(String(valueB))
            : String(valueB).localeCompare(String(valueA));
      }
    });
  };

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const getSecurityBadge = (score: number) => {
    if (score >= 90)
      return <Badge className="bg-green-100 text-green-800">High</Badge>;
    if (score >= 70)
      return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
    return <Badge className="bg-red-100 text-red-800">Low</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "analyzed":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Analyzed
          </Badge>
        );
      case "analyzing":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Activity className="w-3 h-3 mr-1" />
            Analyzing
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadSBOM = (sbom: any) => {
    const sbomString = JSON.stringify(sbom, null, 2);
    const blob = new Blob([sbomString], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = sbom.metadata?.component?.name || "sbom";
    const safeFileName = fileName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    link.download = `${safeFileName}-sbom.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const downloadPackageReport = (report: any) => {
    const reportString = JSON.stringify(report, null, 2);
    const blob = new Blob([reportString], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = report?.name || "package-report";
    const safeFileName = fileName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    link.download = `${safeFileName}-report.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <main className="relative z-10">
        <Navbar />

        <section className="py-20 lg:py-32">
          <div className="container max-w-6xl">
            <h1 className="text-3xl font-bold mb-4">Example SCA/SAST Dashboard</h1>
            <p className="text-muted-foreground mb-8">
              Here's an example of a security dashboard that can be built using the Atelier Logos platform and using real data from the API. 
            </p>
            <h3 className="text-xl font-semibold mb-4">IMPORTANT: This is an DEMONSTRATION dashboard, do not send any sensitive binaries</h3>

            <Tabs value={tab} onValueChange={setTab} className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="binaries">Binaries</TabsTrigger>
                <TabsTrigger value="packages">Packages</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {["binaries", "packages", "issues", "avgScore"].map((key) => (
                    <Card key={key}>
                      <CardHeader className="pb-2 flex flex-row justify-between items-center">
                        <CardTitle className="text-sm font-medium">
                          {key === "binaries" && "Total Binaries"}
                          {key === "packages" && "Packages Analyzed"}
                          {key === "issues" && "Security Issues"}
                          {key === "avgScore" && "Avg Score"}
                        </CardTitle>
                        {key === "binaries" && (
                          <Package className="h-4 w-4 text-muted-foreground" />
                        )}
                        {key === "packages" && (
                          <Shield className="h-4 w-4 text-muted-foreground" />
                        )}
                        {key === "issues" && (
                          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        )}
                        {key === "avgScore" && (
                          <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <Skeleton className="h-8 w-20" />
                        ) : (
                          <div className="text-2xl font-bold">
                            {key === "avgScore"
                              ? metrics.avgScore
                              : metrics[key]}
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {key === "binaries"
                            ? `${metrics?.delta || 0}% vs last month`
                            : "This month"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="binaries">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Binary Analysis Results</CardTitle>
                      <CardDescription className="flex flex-col gap-1">
                        <span>Detailed binary analysis metrics and security insights.</span>
                        {tab === 'binaries' && (
                          <span className="text-xs text-muted-foreground">
                            Last updated: {formatDate(lastUpdate.toISOString())}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Upload Binary
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Upload Binary for Analysis</DialogTitle>
                          <DialogDescription className="text-muted-foreground">
                            Use this curl command to upload a binary file for analysis.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="relative mt-4">
                          <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap break-all">
                            {curlCommand}
                          </pre>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8"
                            onClick={() => copyToClipboard(curlCommand)}
                          >
                            {copied ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead 
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleSort('name')}
                            >
                              Name {getSortIcon('name')}
                            </TableHead>
                            <TableHead>Format</TableHead>
                            <TableHead>Architecture</TableHead>
                            <TableHead>Languages</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead 
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleSort('timestamp')}
                            >
                              Analyzed {getSortIcon('timestamp')}
                            </TableHead>
                            <TableHead>Hash</TableHead>
                            <TableHead>SBOM</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={8}>
                                <Skeleton className="h-6 w-full" />
                              </TableCell>
                            </TableRow>
                          ) : sortData(binaries, sortConfig.key).length ? (
                            sortData(binaries, sortConfig.key).map((b) => {
                              const info = extractBinaryInfo(b);
                              const sbom = b.analysis_data?.sbom || null;
                              console.log('Binary ID:', b.id, 'SBOM:', sbom);
                              return (
                                <TableRow key={b.id} className="group hover:bg-muted/50">
                                  <TableCell className="font-medium">{info.name}</TableCell>
                                  <TableCell>
                                    <Badge variant="secondary">{info.format}</Badge>
                                  </TableCell>
                                  <TableCell>{info.arch}</TableCell>
                                  <TableCell>{info.languages}</TableCell>
                                  <TableCell>{formatFileSize(typeof info.size === 'string' ? parseInt(info.size) : info.size)}</TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {formatDate(info.timestamp)}
                                  </TableCell>
                                  <TableCell>
                                    <code className="px-2 py-1 rounded bg-muted font-mono text-xs">
                                      {info.hash.slice(0, 8)}...{info.hash.slice(-8)}
                                    </code>
                                  </TableCell>
                                  <TableCell>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="default"
                                          className="bg-blue-500 text-white hover:bg-blue-600 opacity-100"
                                          onClick={() => {
                                            setSelectedSBOM(sbom || { error: "No SBOM data available" });
                                            console.log('Setting SBOM for ID:', b.id, 'SBOM:', sbom);
                                          }}
                                        >
                                          <FileText className="h-4 w-4 mr-2" />
                                          View SBOM
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-5xl">
                                        <DialogHeader>
                                          <DialogTitle>SBOM Details for {info.name}</DialogTitle>
                                          <DialogDescription>
                                            Navigate and explore the SBOM structure.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="mt-4 flex space-x-6">
                                          <div className="w-1/2 max-h-[60vh] overflow-auto">
                                            {selectedSBOM && typeof selectedSBOM === 'object' && !('error' in selectedSBOM) ? (
                                              <JSONTree data={selectedSBOM} />
                                            ) : (
                                              <p className="text-red-500">No SBOM data available for this binary.</p>
                                            )}
                                          </div>
                                          <div className="w-1/2">
                                            <Table>
                                              <TableHeader>
                                                <TableRow>
                                                  <TableHead>Property</TableHead>
                                                  <TableHead>Value</TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {selectedSBOM?.metadata?.component && !('error' in selectedSBOM) && (
                                                  <>
                                                    <TableRow>
                                                      <TableCell>Name</TableCell>
                                                      <TableCell>{selectedSBOM.metadata.component.name}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                      <TableCell>Version</TableCell>
                                                      <TableCell>{selectedSBOM.metadata.component.version}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                      <TableCell>Timestamp</TableCell>
                                                      <TableCell>{selectedSBOM.metadata.timestamp}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                      <TableCell>Hash (SHA-256)</TableCell>
                                                      <TableCell>{selectedSBOM.metadata.component.hashes?.find((h: any) => h.alg === 'SHA-256')?.content || 'N/A'}</TableCell>
                                                    </TableRow>
                                                  </>
                                                )}
                                              </TableBody>
                                            </Table>
                                          </div>
                                        </div>
                                        <Button
                                          onClick={() => downloadSBOM(selectedSBOM)}
                                          className="mt-4"
                                          disabled={!selectedSBOM || 'error' in selectedSBOM}
                                        >
                                          <Download className="w-4 h-4 mr-2" />
                                          Download SBOM
                                        </Button>
                                      </DialogContent>
                                    </Dialog>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center text-muted-foreground">
                                No binaries found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="packages">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Package Analysis Results</CardTitle>
                      <CardDescription className="flex flex-col gap-1">
                        <span>Detailed package analysis metrics and security insights.</span>
                        {tab === 'packages' && (
                          <span className="text-xs text-muted-foreground">
                            Last updated: {formatDate(lastUpdate.toISOString())}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Package
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Add Package for Analysis</DialogTitle>
                          <DialogDescription className="text-muted-foreground">
                            Use this curl command to add a package for analysis.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="relative mt-4">
                          <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap break-all">
                            {packageCurlCommand}
                          </pre>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8"
                            onClick={() => copyToClipboard(packageCurlCommand)}
                          >
                            {copied ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead 
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleSort('package_name')}
                            >
                              Name {getSortIcon('package_name')}
                            </TableHead>
                            <TableHead>Version</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Vulnerabilities</TableHead>
                            <TableHead>Unsafe Usage</TableHead>
                            <TableHead>Licenses</TableHead>
                            <TableHead 
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleSort('created_at')}
                            >
                              Analyzed {getSortIcon('created_at')}
                            </TableHead>
                            <TableHead>Details</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={8}>
                                <Skeleton className="h-6 w-full" />
                              </TableCell>
                            </TableRow>
                          ) : packages.length ? (
                            packages.map((pkg) => {
                              const unsafeUsageCount = pkg.unsafe_usage_locations?.count ?? 0;
                              console.log('Package ID:', pkg.id, 'Unsafe Usage Locations:', pkg.unsafe_usage_locations);
                              return (
                                <TableRow key={pkg.id} className="group hover:bg-muted/50">
                                  <TableCell className="font-medium">{pkg.package_name}</TableCell>
                                  <TableCell>
                                    <Badge variant="secondary">v{pkg.version}</Badge>
                                  </TableCell>
                                  <TableCell>{pkg.security_score}</TableCell>
                                  <TableCell>{pkg.cargo_audit_report?.vulnerabilities?.count ?? 0}</TableCell>
                                  <TableCell>{unsafeUsageCount}</TableCell>
                                  <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                      {Array.isArray(pkg.licenses)
                                        ? pkg.licenses.map((license: string, i: number) => (
                                            <Badge key={i} variant="outline">{license}</Badge>
                                          ))
                                        : typeof pkg.licenses === 'string'
                                        ? <Badge variant="outline">{pkg.licenses}</Badge>
                                        : <Badge variant="outline">N/A</Badge>}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {formatDate(pkg.created_at)}
                                  </TableCell>
                                  <TableCell>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="default"
                                          className="bg-blue-500 text-white hover:bg-blue-600 opacity-100"
                                          onClick={() => {
                                            const report = pkg.security_report || { error: "No report data available" };
                                            setSelectedPackageReport(report);
                                            console.log('Setting report for package ID:', pkg.id, 'Report:', report);
                                          }}
                                        >
                                          <FileText className="h-4 w-4 mr-2" />
                                          View Details
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-5xl">
                                        <DialogHeader>
                                          <DialogTitle>Details for {pkg.package_name}</DialogTitle>
                                          <DialogDescription>
                                            Navigate and explore the package report structure.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="mt-4 flex space-x-6">
                                          <div className="w-1/2 max-h-[60vh] overflow-auto">
                                            {selectedPackageReport && typeof selectedPackageReport === 'object' && !('error' in selectedPackageReport) ? (
                                              <JSONTree data={selectedPackageReport} />
                                            ) : (
                                              <p className="text-red-500">No report data available for this package.</p>
                                            )}
                                          </div>
                                          <div className="w-1/2">
                                            <Table>
                                              <TableHeader>
                                                <TableRow>
                                                  <TableHead>Property</TableHead>
                                                  <TableHead>Value</TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {selectedPackageReport?.metadata && !('error' in selectedPackageReport) && (
                                                  <>
                                                    <TableRow>
                                                      <TableCell>Name</TableCell>
                                                      <TableCell>{selectedPackageReport.metadata.name}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                      <TableCell>Version</TableCell>
                                                      <TableCell>{selectedPackageReport.metadata.version}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                      <TableCell>Timestamp</TableCell>
                                                      <TableCell>{selectedPackageReport.metadata.timestamp}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                      <TableCell>Vulnerabilities</TableCell>
                                                      <TableCell>{selectedPackageReport.vulnerabilities?.length || 'N/A'}</TableCell>
                                                    </TableRow>
                                                  </>
                                                )}
                                              </TableBody>
                                            </Table>
                                          </div>
                                        </div>
                                        <Button
                                          onClick={() => downloadPackageReport(selectedPackageReport)}
                                          className="mt-4"
                                          disabled={!selectedPackageReport || 'error' in selectedPackageReport}
                                        >
                                          <Download className="w-4 h-4 mr-2" />
                                          Download Report
                                        </Button>
                                      </DialogContent>
                                    </Dialog>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center text-muted-foreground">
                                No packages found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="relative bg-gradient-to-b from-muted/30 to-background">
          <Footer />
        </section>
      </main>

      <div className="fixed top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse" />
      <div className="fixed bottom-1/4 -right-48 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse delay-1000" />
    </div>
  );
}