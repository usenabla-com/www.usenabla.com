"use client"

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { GripVertical } from "lucide-react";

function ExcelComparisonFeature() {
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
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-4">
          <div>
            <Badge>Before & After</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular">
              The old way vs. the new way
            </h2>
            <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">
              Drag the slider to see how a single API call replaces hours of manual Excel work.
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

              {/* API Code View - Left Side */}
              <div
                className="absolute left-0 top-0 z-10 w-full h-full aspect-video rounded-2xl select-none border bg-slate-950"
                style={{
                  clipPath: "inset(0 0 0 " + inset + "%)",
                }}
              >
                <div className="w-full h-full p-8 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-4 text-sm text-slate-400">api-request.js</span>
                  </div>
                  <pre className="text-xs md:text-sm text-slate-100 font-mono overflow-auto flex-1">
                    <code>{`const url = 'https://api.usenabla.com/v1/evidence/terraform';
const options = {
  method: 'POST',
  headers: {
    'X-Customer-Key': '<api-key>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'production-infrastructure',
    format: 'json',
    content_base64: 'eyJ2ZXJzaW9uIjo0LCJ0ZXJyYWZvcm0...',
    include_diagram: false
  })
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
  // ✓ Evidence generated in < 2 seconds
  // ✓ Zero manual work
  // ✓ Always up-to-date
} catch (error) {
  console.error(error);
}`}</code>
                  </pre>
                  <div className="flex gap-2 items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-green-400">Automated • Real-time • Scalable</span>
                  </div>
                </div>
              </div>

              {/* Excel Spreadsheet View - Right Side */}
              <div className="absolute left-0 top-0 w-full h-full aspect-video rounded-2xl select-none border bg-white dark:bg-slate-900">
                <div className="w-full h-full flex flex-col">
                  {/* Excel Toolbar */}
                  <div className="h-12 border-b bg-slate-50 dark:bg-slate-800 flex items-center px-4 gap-2">
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">Compliance Evidence.xlsx</div>
                    <div className="flex-1"></div>
                    <div className="text-xs text-slate-500">Manually Updated: 2 hours ago</div>
                  </div>

                  {/* Excel Ribbon */}
                  <div className="h-8 border-b bg-slate-100 dark:bg-slate-800 flex items-center px-2 gap-1">
                    <div className="text-xs px-2 py-1 bg-white dark:bg-slate-700 rounded border text-slate-600 dark:text-slate-300">File</div>
                    <div className="text-xs px-2 py-1 text-slate-600 dark:text-slate-400">Home</div>
                    <div className="text-xs px-2 py-1 text-slate-600 dark:text-slate-400">Insert</div>
                    <div className="text-xs px-2 py-1 text-slate-600 dark:text-slate-400">Formulas</div>
                  </div>

                  {/* Column Headers */}
                  <div className="grid grid-cols-12 border-b bg-slate-50 dark:bg-slate-800">
                    <div className="border-r p-1 text-center text-xs font-semibold text-slate-600 dark:text-slate-300"></div>
                    <div className="border-r p-1 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">A</div>
                    <div className="border-r p-1 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">B</div>
                    <div className="border-r p-1 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">C</div>
                    <div className="border-r p-1 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">D</div>
                    <div className="border-r p-1 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">E</div>
                    <div className="border-r p-1 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">F</div>
                    <div className="border-r p-1 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">G</div>
                    <div className="border-r p-1 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">H</div>
                    <div className="border-r p-1 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">I</div>
                    <div className="border-r p-1 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">J</div>
                    <div className="p-1 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">K</div>
                  </div>

                  {/* Excel Rows */}
                  <div className="flex-1 overflow-hidden">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 border-b bg-blue-50 dark:bg-blue-900/20">
                      <div className="border-r p-1 text-center text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">1</div>
                      <div className="border-r p-1 text-xs font-bold col-span-2 text-slate-800 dark:text-slate-200">Resource Name</div>
                      <div className="border-r p-1 text-xs font-bold col-span-2 text-slate-800 dark:text-slate-200">Type</div>
                      <div className="border-r p-1 text-xs font-bold col-span-2 text-slate-800 dark:text-slate-200">Environment</div>
                      <div className="border-r p-1 text-xs font-bold col-span-2 text-slate-800 dark:text-slate-200">Compliance Status</div>
                      <div className="border-r p-1 text-xs font-bold col-span-2 text-slate-800 dark:text-slate-200">Last Updated</div>
                      <div className="p-1 text-xs font-bold text-slate-800 dark:text-slate-200">Owner</div>
                    </div>

                    {/* Data Rows */}
                    <div className="grid grid-cols-12 border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <div className="border-r p-1 text-center text-xs bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">2</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-700 dark:text-slate-300">prod-db-instance</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-700 dark:text-slate-300">RDS PostgreSQL</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-700 dark:text-slate-300">Production</div>
                      <div className="border-r p-1 text-xs col-span-2 text-green-600 dark:text-green-400">✓ Compliant</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-700 dark:text-slate-300">2024-10-10</div>
                      <div className="p-1 text-xs text-slate-700 dark:text-slate-300">DevOps</div>
                    </div>

                    <div className="grid grid-cols-12 border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <div className="border-r p-1 text-center text-xs bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">3</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-700 dark:text-slate-300">api-gateway</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-700 dark:text-slate-300">API Gateway</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-700 dark:text-slate-300">Production</div>
                      <div className="border-r p-1 text-xs col-span-2 text-yellow-600 dark:text-yellow-400">⚠ Review</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-700 dark:text-slate-300">2024-10-08</div>
                      <div className="p-1 text-xs text-slate-700 dark:text-slate-300">Platform</div>
                    </div>

                    <div className="grid grid-cols-12 border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <div className="border-r p-1 text-center text-xs bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">4</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-700 dark:text-slate-300">s3-backups</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-700 dark:text-slate-300">S3 Bucket</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-700 dark:text-slate-300">Production</div>
                      <div className="border-r p-1 text-xs col-span-2 text-green-600 dark:text-green-400">✓ Compliant</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-700 dark:text-slate-300">2024-10-12</div>
                      <div className="p-1 text-xs text-slate-700 dark:text-slate-300">Security</div>
                    </div>

                    <div className="grid grid-cols-12 border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <div className="border-r p-1 text-center text-xs bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">5</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-700 dark:text-slate-300">vpc-main</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-700 dark:text-slate-300">VPC</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-700 dark:text-slate-300">Production</div>
                      <div className="border-r p-1 text-xs col-span-2 text-red-600 dark:text-red-400">✗ Non-compliant</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-700 dark:text-slate-300">2024-09-28</div>
                      <div className="p-1 text-xs text-slate-700 dark:text-slate-300">Network</div>
                    </div>

                    <div className="grid grid-cols-12 border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <div className="border-r p-1 text-center text-xs bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">6</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-400 dark:text-slate-500">...</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-400 dark:text-slate-500">...</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-400 dark:text-slate-500">...</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-400 dark:text-slate-500">...</div>
                      <div className="border-r p-1 text-xs col-span-2 text-slate-400 dark:text-slate-500">...</div>
                      <div className="p-1 text-xs text-slate-400 dark:text-slate-500">...</div>
                    </div>
                  </div>

                  {/* Excel Status Bar */}
                  <div className="h-6 border-t bg-slate-50 dark:bg-slate-800 flex items-center px-4 text-xs text-slate-600 dark:text-slate-400">
                    <span>Ready • Manual updates required • Prone to errors</span>
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

export { ExcelComparisonFeature };
