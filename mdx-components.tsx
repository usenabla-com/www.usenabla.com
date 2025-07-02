import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import { CodeBlock } from '@/components/code-block'
import { Badge } from '@/components/ui/badge'

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold tracking-tight mb-6 border-b pb-3 font-sans">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold tracking-tight mt-8 mb-4 border-b pb-2 font-sans">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold tracking-tight mt-6 mb-3 font-sans">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold tracking-tight mt-4 mb-2 font-sans">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-lg font-semibold tracking-tight mt-3 mb-2 font-sans">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-base font-semibold tracking-tight mt-2 mb-1 font-sans">
        {children}
      </h6>
    ),
    p: ({ children }) => (
      <p className="mb-4 text-muted-foreground leading-7 font-sans">
        {children}
      </p>
    ),
    code: ({ children, className }) => {
      const isBlock = className?.includes('language-')
      
      if (isBlock) {
        const language = className?.replace('language-', '') || 'text'
        return (
          <CodeBlock language={language}>
            {String(children).replace(/\n$/, '')}
          </CodeBlock>
        )
      }
      
      return (
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium font-sans">
          {children}
        </code>
      )
    },
    pre: ({ children, ...props }) => {
      // Extract the code element and its props
      const codeElement = Array.isArray(children) ? children[0] : children
      
      if (typeof codeElement === 'object' && codeElement && 'props' in codeElement) {
        const { className, children: codeChildren } = codeElement.props
        const language = className?.replace('language-', '') || 'text'
        
        if (typeof codeChildren === 'string') {
          return (
            <CodeBlock language={language}>
              {codeChildren.trim()}
            </CodeBlock>
          )
        }
      }
      
      // Fallback for other cases
      return (
        <CodeBlock>
          {typeof children === 'string' ? children : ''}
        </CodeBlock>
      )
    },
    ul: ({ children }) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2 font-sans">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 font-sans">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-7 font-sans">
        {children}
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 pl-6 italic text-muted-foreground font-sans">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className="w-full border-collapse border border-border font-sans">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-muted/50 font-sans">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="font-sans">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="border-b border-border hover:bg-muted/30 transition-colors font-sans">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="border border-border px-4 py-2 text-left font-semibold font-sans">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-border px-4 py-2 font-sans">
        {children}
      </td>
    ),
    hr: () => (
      <hr className="border-border my-8" />
    ),
    a: ({ href, children, ...props }) => {
      const isExternal = href?.startsWith('http')
      
      if (isExternal) {
        return (
          <a
            href={href}
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors font-sans"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          >
            {children}
          </a>
        )
      }
      
      return (
        <Link 
          href={href || '#'} 
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors font-sans"
          {...props}
        >
          {children}
        </Link>
      )
    },
    strong: ({ children }) => (
      <strong className="font-semibold font-sans">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic font-sans">
        {children}
      </em>
    ),
    // Custom wrapper for sections
    section: ({ children, className, ...props }) => (
      <section 
        className={`max-w-none prose-lg ${className || ''} font-sans`}
        {...props}
      >
        {children}
      </section>
    ),
    Badge,
    ...components,
  }
} 