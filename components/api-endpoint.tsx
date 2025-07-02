import { Badge } from '@/components/ui/badge'
import { CodeBlock } from './code-block'

interface ApiEndpointProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  description?: string
  baseUrl?: string
}

interface ParameterProps {
  name: string
  type: string
  required?: boolean
  default?: string
  description: string
}

interface ParameterTableProps {
  title: string
  parameters: ParameterProps[]
}

export function ApiEndpoint({ method, path, description, baseUrl = 'https://www.atelierlogos.studio/api/ferropipe' }: ApiEndpointProps) {
  const getMethodColor = (method: string) => {
    const colors = {
      'GET': 'bg-blue-500 hover:bg-blue-600',
      'POST': 'bg-green-500 hover:bg-green-600',
      'PUT': 'bg-orange-500 hover:bg-orange-600',
      'DELETE': 'bg-red-500 hover:bg-red-600',
      'PATCH': 'bg-purple-500 hover:bg-purple-600'
    }
    return colors[method as keyof typeof colors] || 'bg-gray-500'
  }

  return (
    <div className="my-8">
      <div className="flex items-center gap-3 mb-4">
        <Badge className={`${getMethodColor(method)} text-white font-mono text-xs px-3 py-1 font-sans`}>
          {method}
        </Badge>
        <code className="text-lg font-mono bg-muted px-3 py-1 rounded font-sans">
          {path}
        </code>
      </div>
      
      {description && (
        <p className="text-muted-foreground mb-4 font-sans">{description}</p>
      )}
      
      <div className="bg-muted/30 border rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-2 font-sans">Base URL</p>
        <code className="text-sm font-mono bg-background px-2 py-1 rounded border font-sans">
          {baseUrl}{path}
        </code>
      </div>
    </div>
  )
}

export function ParameterTable({ title, parameters }: ParameterTableProps) {
  return (
    <div className="my-6">
      <h4 className="text-lg font-semibold mb-4 font-sans">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold text-sm font-sans">Parameter</th>
              <th className="text-left py-3 px-4 font-semibold text-sm font-sans">Type</th>
              <th className="text-left py-3 px-4 font-semibold text-sm font-sans">Required</th>
              <th className="text-left py-3 px-4 font-semibold text-sm font-sans">Default</th>
              <th className="text-left py-3 px-4 font-semibold text-sm font-sans">Description</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((param, index) => (
              <tr key={index} className="border-b border-border/50 hover:bg-muted/30">
                <td className="py-3 px-4">
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded font-sans">
                    {param.name}
                  </code>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="outline" className="text-xs font-sans">
                    {param.type}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge 
                    variant={param.required ? "destructive" : "secondary"}
                    className="text-xs font-sans"
                  >
                    {param.required ? 'Required' : 'Optional'}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground font-sans">
                  {param.default ? (
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-sans">
                      {param.default}
                    </code>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground font-sans">
                  {param.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ResponseExample({ title, children }: { title: string; children: string }) {
  return (
    <div className="my-6">
      <h4 className="text-lg font-semibold mb-4 font-sans">{title}</h4>
      <CodeBlock language="json" title="Response">
        {children}
      </CodeBlock>
    </div>
  )
}
