"use client"

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { GripVertical, TrendingUp, AlertTriangle, CheckCircle2, Activity } from "lucide-react";

function DashboardComparisonFeature() {
  const [inset, setInset] = useState<number>(50);
  const [onMouseDown, setOnMouseDown] = useState<boolean>(false);

  const onMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!onMouseDown) return;

    const rect = e.currentTarget.getBoundingClientRect();
    let x = 0;

    if ("touches" in e && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
    } else if ("clientX" in e) {
      x = e.clientX - rect.left;
    }

    const percentage = (x / rect.width) * 100;
    setInset(percentage);
  };

  return (
    <div className="w-full py-20 lg:py-40 bg-muted/30">
      <div className="container mx-auto">
        <div className="flex flex-col gap-4">
          <div>
            <Badge>Live Comparison</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular">
              Static reports vs. live dashboards
            </h2>
            <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">
              See the difference between outdated screenshots and real-time compliance intelligence.
            </p>
          </div>
          <div className="pt-12 w-full">
            <div
              className="relative aspect-video w-full h-full overflow-hidden rounded-2xl select-none"
              onMouseMove={onMouseMove}
              onMouseUp={() => setOnMouseDown(false)}
              onTouchMove={onMouseMove}
              onTouchEnd={() => setOnMouseDown(false)}
            >
              <div
                className="bg-muted h-full w-1 absolute z-20 top-0 -ml-1 select-none"
                style={{
                  left: inset + "%",
                }}
              >
                <button
                  className="bg-muted rounded hover:scale-110 transition-all w-5 h-10 select-none -translate-y-1/2 absolute top-1/2 -ml-2 z-30 cursor-ew-resize flex justify-center items-center"
                  onTouchStart={(e) => {
                    setOnMouseDown(true);
                    onMouseMove(e);
                  }}
                  onMouseDown={(e) => {
                    setOnMouseDown(true);
                    onMouseMove(e);
                  }}
                  onTouchEnd={() => setOnMouseDown(false)}
                  onMouseUp={() => setOnMouseDown(false)}
                >
                  <GripVertical className="h-4 w-4 select-none" />
                </button>
              </div>

              {/* Live Dashboard View - Left Side */}
              <div
                className="absolute left-0 top-0 z-10 w-full h-full aspect-video rounded-2xl select-none border bg-gradient-to-br from-slate-950 to-slate-900"
                style={{
                  clipPath: "inset(0 0 0 " + inset + "%)",
                }}
              >
                <div className="w-full h-full p-6 flex flex-col gap-4">
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Infrastructure Security Posture</h3>
                      <p className="text-xs text-slate-400">Live data • Auto-updated</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs text-green-400">Live</span>
                    </div>
                  </div>

                  {/* Key Metrics Cards */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-slate-400">Compliance Score</p>
                          <p className="text-2xl font-bold text-white mt-1">94%</p>
                          <div className="flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-green-400">+3% this week</span>
                          </div>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-slate-400">Active Controls</p>
                          <p className="text-2xl font-bold text-white mt-1">156</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Activity className="w-3 h-3 text-blue-400" />
                            <span className="text-xs text-slate-400">of 168 total</span>
                          </div>
                        </div>
                        <Activity className="w-4 h-4 text-blue-400" />
                      </div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-slate-400">Open Findings</p>
                          <p className="text-2xl font-bold text-white mt-1">7</p>
                          <div className="flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3 text-orange-400 rotate-180" />
                            <span className="text-xs text-orange-400">-2 today</span>
                          </div>
                        </div>
                        <AlertTriangle className="w-4 h-4 text-orange-400" />
                      </div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-slate-400">Next Audit</p>
                          <p className="text-2xl font-bold text-white mt-1">23d</p>
                          <div className="flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-green-400">On track</span>
                          </div>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                    </div>
                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    {/* Compliance Trend Chart */}
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-white">Compliance Trend</p>
                        <span className="text-xs text-slate-400">Last 30 days</span>
                      </div>
                      <div className="h-24 flex items-end justify-between gap-1">
                        {[72, 78, 75, 82, 85, 88, 86, 90, 91, 94].map((height, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-green-500/80 to-green-400/80 rounded-t" style={{ height: `${height}%` }}></div>
                        ))}
                      </div>
                    </div>

                    {/* Control Status Breakdown */}
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-white">Control Status</p>
                        <span className="text-xs text-slate-400">Updated now</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-xs text-slate-300">Passing</span>
                          </div>
                          <span className="text-xs font-semibold text-white">156</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '93%' }}></div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <span className="text-xs text-slate-300">Needs Review</span>
                          </div>
                          <span className="text-xs font-semibold text-white">7</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5">
                          <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '4%' }}></div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                            <span className="text-xs text-slate-300">Not Configured</span>
                          </div>
                          <span className="text-xs font-semibold text-white">5</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5">
                          <div className="bg-slate-600 h-1.5 rounded-full" style={{ width: '3%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                    <span className="text-xs text-slate-400">Powered by Nabla API • Data refreshes every 60s</span>
                    <button className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                      Export Report
                    </button>
                  </div>
                </div>
              </div>

              {/* Static PowerPoint View - Right Side */}
              <div className="absolute left-0 top-0 w-full h-full aspect-video rounded-2xl select-none border bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                <div className="w-full h-full flex flex-col">
                  {/* PowerPoint Header */}
                  <div className="h-12 bg-slate-200 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 flex items-center px-4 gap-2">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Q3_2024_Compliance_Status_FINAL_v3.pptx</div>
                    <div className="flex-1"></div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Last saved: Sep 28, 2024</div>
                  </div>

                  {/* PowerPoint Content */}
                  <div className="flex-1 p-8 flex flex-col gap-6">
                    {/* Title */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Infrastructure Security Status</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Q3 2024 • Prepared for Audit</p>
                    </div>

                    {/* Static Metrics Grid */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg p-3 text-center">
                        <p className="text-xs text-slate-600 dark:text-slate-400">Compliance</p>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-200 mt-1">89%</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">As of Sep 28</p>
                      </div>
                      <div className="bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg p-3 text-center">
                        <p className="text-xs text-slate-600 dark:text-slate-400">Controls</p>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-200 mt-1">142</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Active</p>
                      </div>
                      <div className="bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg p-3 text-center">
                        <p className="text-xs text-slate-600 dark:text-slate-400">Findings</p>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-200 mt-1">18</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Open Items</p>
                      </div>
                      <div className="bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg p-3 text-center">
                        <p className="text-xs text-slate-600 dark:text-slate-400">Status</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">At Risk</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Per Q3 review</p>
                      </div>
                    </div>

                    {/* Static Chart Placeholders */}
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div className="bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg p-4">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Compliance Progress</p>
                        <div className="h-20 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center">
                          <span className="text-xs text-slate-500 dark:text-slate-400">[Chart from screenshot]</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">* Data may be outdated</p>
                      </div>
                      <div className="bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg p-4">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Control Breakdown</p>
                        <div className="h-20 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center">
                          <span className="text-xs text-slate-500 dark:text-slate-400">[Manually created chart]</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">* Updated quarterly</p>
                      </div>
                    </div>

                    {/* Warning Footer */}
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-2 text-center">
                      <p className="text-xs text-yellow-800 dark:text-yellow-400">
                        ⚠ This presentation contains point-in-time data • Manual updates required • May not reflect current state
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { DashboardComparisonFeature };
