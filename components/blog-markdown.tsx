import React from 'react'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'

// Component map for rendering markdown with custom table components
export const blogMarkdownComponents = {
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="my-8">
      <Table>{children}</Table>
    </div>
  ),
  thead: ({ children }: { children: React.ReactNode }) => (
    <TableHeader>{children}</TableHeader>
  ),
  tbody: ({ children }: { children: React.ReactNode }) => (
    <TableBody>{children}</TableBody>
  ),
  tr: ({ children }: { children: React.ReactNode }) => (
    <TableRow>{children}</TableRow>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <TableHead>{children}</TableHead>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <TableCell>{children}</TableCell>
  ),
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-4xl font-semibold tracking-tight mb-6 mt-8 leading-tight text-foreground">
      {children}
    </h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-3xl font-semibold tracking-tight mb-5 mt-10 leading-tight text-foreground">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-2xl font-semibold tracking-tight mb-4 mt-8 leading-tight text-foreground">
      {children}
    </h3>
  ),
  h4: ({ children }: { children: React.ReactNode }) => (
    <h4 className="text-xl font-semibold tracking-tight mb-3 mt-6 text-foreground">
      {children}
    </h4>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="text-muted-foreground leading-relaxed mb-6 text-base lg:text-lg">
      {children}
    </p>
  ),
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <a
      href={href}
      className="text-primary font-medium no-underline hover:underline transition-all"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="text-foreground font-semibold">{children}</strong>
  ),
  em: ({ children }: { children: React.ReactNode }) => (
    <em className="text-muted-foreground italic">{children}</em>
  ),
  code: ({ children }: { children: React.ReactNode }) => (
    <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground">
      {children}
    </code>
  ),
  pre: ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-muted border border-border rounded-lg p-4 overflow-x-auto my-6">
      {children}
    </pre>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="text-muted-foreground leading-relaxed mb-2">{children}</li>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-primary/20 bg-muted/20 rounded-r-lg py-4 px-6 my-8 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr className="border-border my-12" />
  ),
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <img
      src={src}
      alt={alt}
      className="rounded-lg shadow-sm border border-border/50 my-6"
    />
  ),
}
