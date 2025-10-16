import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'

export function ChatAgent() {
  return (
    <Card className="h-full lg:sticky lg:top-8 flex flex-col max-h-[600px]">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-2xl font-light flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <div className="text-muted-foreground mb-2">
            💬 Chat functionality coming soon
          </div>
          <div className="text-sm text-muted-foreground">
            AI assistant will be available in the next update
          </div>
        </div>
      </CardContent>
    </Card>
  )
}