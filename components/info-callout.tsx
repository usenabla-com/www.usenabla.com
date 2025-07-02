import { AlertCircle, CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react'

interface InfoCalloutProps {
  type?: 'info' | 'warning' | 'error' | 'success' | 'note'
  title?: string
  children: React.ReactNode
}

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  success: CheckCircle,
  note: AlertCircle
}

const colorMap = {
  info: {
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-800'
  },
  warning: {
    border: 'border-yellow-200',
    bg: 'bg-yellow-50',
    iconColor: 'text-yellow-500',
    titleColor: 'text-yellow-800'
  },
  error: {
    border: 'border-red-200',
    bg: 'bg-red-50',
    iconColor: 'text-red-500',
    titleColor: 'text-red-800'
  },
  success: {
    border: 'border-green-200',
    bg: 'bg-green-50',
    iconColor: 'text-green-500',
    titleColor: 'text-green-800'
  },
  note: {
    border: 'border-gray-200',
    bg: 'bg-gray-50',
    iconColor: 'text-gray-500',
    titleColor: 'text-gray-800'
  }
}

export function InfoCallout({ type = 'info', title, children }: InfoCalloutProps) {
  const Icon = iconMap[type]
  const colors = colorMap[type]

  return (
    <div className={`rounded-lg border ${colors.border} ${colors.bg} p-4 my-6`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 ${colors.iconColor} mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          {title && (
            <h4 className={`font-semibold ${colors.titleColor} mb-2 font-sans`}>
              {title}
            </h4>
          )}
          <div className={`text-sm ${colors.titleColor.replace('800', '700')} font-sans`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 