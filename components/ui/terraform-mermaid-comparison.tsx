"use client"

import React, { useMemo, useState } from "react"
import { GripVertical } from "lucide-react"
import { CodeBlock, CodeBlockCode } from "@/components/ui/code-block"
import { useTheme } from "next-themes"

type TerraformMermaidComparisonProps = {
  terraform: string
  mermaid: string
  leftLabel?: string
  rightLabel?: string
  height?: number | string
  lightTheme?: string
  darkTheme?: string
}

function TerraformMermaidComparison({
  terraform,
  mermaid,
  leftLabel = "Terraform input",
  rightLabel = "Mermaid output",
  height = 520,
  lightTheme = "github-light",
  darkTheme = "github-dark",
}: TerraformMermaidComparisonProps) {
  const [inset, setInset] = useState<number>(50)
  const [dragging, setDragging] = useState<boolean>(false)
  const { resolvedTheme } = useTheme()

  const containerHeight = useMemo(() => {
    return typeof height === "number" ? `${height}px` : height
  }, [height])
  const codeTheme = resolvedTheme === "dark" ? darkTheme : lightTheme

  const onPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    let x = 0
    if ("touches" in e && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left
    } else if ("clientX" in e) {
      x = (e as React.MouseEvent).clientX - rect.left
    }
    const next = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setInset(next)
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl select-none border bg-card"
      style={{ height: containerHeight }}
      onMouseMove={onPointerMove}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchMove={onPointerMove}
      onTouchEnd={() => setDragging(false)}
    >
      {/* Slider handle */}
      <div
        className="bg-muted h-full w-1 absolute z-20 top-0 -ml-1"
        style={{ left: `${inset}%` }}
      >
        <button
          className="bg-muted rounded hover:scale-110 transition-all w-5 h-10 -translate-y-1/2 absolute top-1/2 -ml-2 z-30 cursor-ew-resize flex justify-center items-center"
          onTouchStart={(e) => {
            setDragging(true)
            onPointerMove(e)
          }}
          onMouseDown={(e) => {
            setDragging(true)
            onPointerMove(e)
          }}
          onTouchEnd={() => setDragging(false)}
          onMouseUp={() => setDragging(false)}
          aria-label="Drag to compare"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(inset)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault()
              setInset((v) => Math.max(0, v - 2))
            } else if (e.key === "ArrowRight") {
              e.preventDefault()
              setInset((v) => Math.min(100, v + 2))
            }
          }}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Left: Terraform input (clipped) */}
      <div
        className="absolute inset-0 z-10 bg-card"
        style={{ clipPath: `inset(0 0 0 ${inset}%)` }}
      >
        <div className="h-full flex flex-col">
          <div className="px-4 py-3 border-b text-sm text-muted-foreground">{leftLabel}</div>
          <div className="flex-1 min-h-0">
            <CodeBlock className="h-full rounded-none border-0">
              <CodeBlockCode code={terraform} language="hcl" className="h-full" theme={codeTheme} />
            </CodeBlock>
          </div>
        </div>
      </div>

      {/* Right: Mermaid output (base layer) */}
      <div className="absolute inset-0">
        <div className="h-full flex flex-col">
          <div className="px-4 py-3 border-b text-sm text-muted-foreground">{rightLabel}</div>
          <div className="flex-1 min-h-0">
            <CodeBlock className="h-full rounded-none border-0">
              <CodeBlockCode code={mermaid} language="markdown" className="h-full" theme={codeTheme} />
            </CodeBlock>
          </div>
        </div>
      </div>
    </div>
  )
}

export { TerraformMermaidComparison }
