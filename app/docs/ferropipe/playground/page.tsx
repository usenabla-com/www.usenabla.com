'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Copy, Play, Download, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ApiError {
  error: string
  details?: string
  code?: string
}

export default function PlaygroundPage() {
  const [endpoint, setEndpoint] = useState('crate')
  const [crateName, setCrateName] = useState('serde')
  const [version, setVersion] = useState('latest')
  const [depth, setDepth] = useState('basic')
  const [fresh, setFresh] = useState(false)
  const [examples, setExamples] = useState(false)
  const [dependencies, setDependencies] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | string | null>(null)
  const { toast } = useToast()

  const buildUrl = () => {
    const baseUrl = 'https://www.atelierlogos.studio/api/ferropipe'
    let url = `${baseUrl}/${endpoint}`
    
    if (endpoint === 'crate') {
      url += `/${crateName}`
      const params = new URLSearchParams()
      
      if (version !== 'latest') params.append('version', version)
      if (depth !== 'basic') params.append('depth', depth)
      if (fresh) params.append('fresh', 'true')
      if (examples) params.append('examples', 'true')
      if (dependencies) params.append('dependencies', 'true')
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }
    }
    
    return url
  }

  const generateCurlCommand = () => {
    const url = buildUrl()
    return `curl -H "x-api-key: ${apiKey || 'YOUR_API_KEY'}" \\\n  "${url}"`
  }

  const generateJavaScript = () => {
    const url = buildUrl()
    return `const response = await fetch('${url}', {
  headers: {
    'x-api-key': '${apiKey || 'YOUR_API_KEY'}'
  }
})

const data = await response.json()
console.log(data)`
  }

  const generatePython = () => {
    const url = buildUrl()
    return `import requests

headers = {'x-api-key': '${apiKey || 'YOUR_API_KEY'}'}
response = requests.get('${url}', headers=headers)
data = response.json()
print(data)`
  }

  const generateRust = () => {
    const url = buildUrl()
    return `use reqwest::Client;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new();
    let response = client
        .get("${url}")
        .header("x-api-key", "${apiKey || 'YOUR_API_KEY'}")
        .send()
        .await?;
    
    let data: serde_json::Value = response.json().await?;
    println!("{:#}", data);
    
    Ok(())
}`
  }

  const makeRequest = async () => {
    if (!apiKey) {
      setError('API key is required')
      return
    }

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const url = buildUrl()
      const res = await fetch(url, {
        headers: {
          'x-api-key': apiKey
        }
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data)
      } else {
        setResponse(data)
      }
    } catch (err) {
      setError({
        error: 'Network error',
        details: err instanceof Error ? err.message : 'Unknown error occurred'
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied to clipboard',
      description: 'Code has been copied to your clipboard.',
    })
  }

  const downloadResponse = () => {
    if (!response) return
    
    const blob = new Blob([JSON.stringify(response, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ferropipe-${crateName}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
          API Playground
        </h1>
        <p className="text-xl text-muted-foreground">
          Test Ferropipe API endpoints interactively and generate code for your applications.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Request Configuration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="endpoint">Endpoint</Label>
                <Select value={endpoint} onValueChange={setEndpoint}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crate">Get Crate</SelectItem>
                    <SelectItem value="search">Search Crates</SelectItem>
                    <SelectItem value="popular">Popular Crates</SelectItem>
                    <SelectItem value="debug">Debug Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {endpoint === 'crate' && (
                <>
                  <div>
                    <Label htmlFor="crateName">Crate Name</Label>
                    <Input
                      id="crateName"
                      value={crateName}
                      onChange={(e) => setCrateName(e.target.value)}
                      placeholder="Enter crate name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="version">Version</Label>
                    <Input
                      id="version"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      placeholder="latest"
                    />
                  </div>

                  <div>
                    <Label htmlFor="depth">Extraction Depth</Label>
                    <Select value={depth} onValueChange={setDepth}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="full">Full</SelectItem>
                        <SelectItem value="deep">Deep</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="fresh"
                      checked={fresh}
                      onCheckedChange={setFresh}
                    />
                    <Label htmlFor="fresh">Force Fresh Data</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="examples"
                      checked={examples}
                      onCheckedChange={setExamples}
                    />
                    <Label htmlFor="examples">Include Examples</Label>
                    <Badge variant="secondary">Full+</Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="dependencies"
                      checked={dependencies}
                      onCheckedChange={setDependencies}
                    />
                    <Label htmlFor="dependencies">Include Dependencies</Label>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                />
              </div>

              <Button 
                onClick={makeRequest} 
                disabled={loading || !apiKey}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Making Request...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Send Request
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Code */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Code</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="curl">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="rust">Rust</TabsTrigger>
                </TabsList>
                
                <TabsContent value="curl" className="mt-4">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{generateCurlCommand()}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(generateCurlCommand())}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="javascript" className="mt-4">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{generateJavaScript()}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(generateJavaScript())}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="python" className="mt-4">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{generatePython()}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(generatePython())}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="rust" className="mt-4">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{generateRust()}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(generateRust())}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Response */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Response</CardTitle>
              {response && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={downloadResponse}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <h4 className="font-medium text-destructive mb-2">Error</h4>
                  <pre className="text-sm overflow-x-auto">
                    <code>{JSON.stringify(error, null, 2)}</code>
                  </pre>
                </div>
              )}

              {response && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto max-h-96">
                    <code>{JSON.stringify(response, null, 2)}</code>
                  </pre>
                </div>
              )}

              {!response && !error && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  Configure your request and click "Send Request" to see the response here.
                </div>
              )}

              {loading && (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Making request...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Request URL */}
          <Card>
            <CardHeader>
              <CardTitle>Request URL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <code className="block bg-muted p-3 rounded text-sm break-all">
                  {buildUrl()}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(buildUrl())}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Higher extraction depths require paid tiers and provide more detailed information</li>
            <li>• Fresh data requests count double against your rate limit</li>
            <li>• Examples and dependencies require Full tier or higher</li>
            <li>• Generated code can be copied and used directly in your applications</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
