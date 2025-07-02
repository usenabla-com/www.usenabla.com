import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CodeBlock } from './code-block'
import { Badge } from '@/components/ui/badge'

interface ResponseViewerProps {
  responses: {
    status: number
    title: string
    description?: string
    content: string
    contentType?: string
  }[]
}

export function ResponseViewer({ responses }: ResponseViewerProps) {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-500'
    if (status >= 400 && status < 500) return 'bg-orange-500' 
    if (status >= 500) return 'bg-red-500'
    return 'bg-gray-500'
  }

  const getLanguageFromContentType = (contentType: string = 'application/json') => {
    if (contentType.includes('json')) return 'json'
    if (contentType.includes('xml')) return 'xml'
    if (contentType.includes('html')) return 'html'
    if (contentType.includes('text')) return 'text'
    return 'text'
  }

  if (responses.length === 1) {
    const response = responses[0]
    return (
      <div className="my-6">
        <div className="flex items-center gap-3 mb-4">
          <Badge className={`${getStatusColor(response.status)} text-white px-2 py-1 font-sans`}>
            {response.status}
          </Badge>
          <h4 className="text-lg font-semibold font-sans">{response.title}</h4>
        </div>
        
        {response.description && (
          <p className="text-muted-foreground mb-4 font-sans">{response.description}</p>
        )}
        
        <CodeBlock 
          language={getLanguageFromContentType(response.contentType)}
          title={`${response.status} Response`}
        >
          {response.content}
        </CodeBlock>
      </div>
    )
  }

  return (
    <div className="my-6">
      <h4 className="text-lg font-semibold mb-4 font-sans">Responses</h4>
      
      <Tabs defaultValue={responses[0]?.status.toString()} className="w-full">
        <TabsList className="grid w-full grid-cols-auto gap-1 h-auto p-1">
          {responses.map((response) => (
            <TabsTrigger 
              key={response.status} 
              value={response.status.toString()}
              className="flex items-center gap-2 data-[state=active]:bg-background font-sans"
            >
              <Badge 
                className={`${getStatusColor(response.status)} text-white px-2 py-0.5 text-xs font-sans`}
              >
                {response.status}
              </Badge>
              <span className="hidden sm:inline font-sans">{response.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {responses.map((response) => (
          <TabsContent 
            key={response.status} 
            value={response.status.toString()}
            className="mt-4"
          >
            {response.description && (
              <p className="text-muted-foreground mb-4 font-sans">{response.description}</p>
            )}
            
            <CodeBlock 
              language={getLanguageFromContentType(response.contentType)}
              title={`${response.status} Response`}
            >
              {response.content}
            </CodeBlock>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

interface CalloutProps {
  type: 'info' | 'warning' | 'error' | 'success'
  title?: string
  children: React.ReactNode
}

export function Callout({ type, title, children }: CalloutProps) {
  const styles = {
    info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100',
    error: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
    success: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100'
  }

  const icons = {
    info: '💡',
    warning: '⚠️',
    error: '❌',
    success: '✅'
  }

  return (
    <div className={`border-l-4 p-4 my-6 rounded-r-lg font-sans ${styles[type]}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg">{icons[type]}</span>
        <div className="flex-1">
          {title && (
            <p className="font-semibold mb-1 font-sans">{title}</p>
          )}
          <div className="text-sm font-sans">{children}</div>
        </div>
      </div>
    </div>
  )
}
