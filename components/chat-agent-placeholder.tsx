import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ChatAgentPlaceholder() {
  return (
    <Card className="h-full lg:sticky lg:top-8">
      <CardHeader>
        <CardTitle className="text-2xl font-light flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>

          <h3 className="text-lg font-medium text-foreground mb-2">Chat Agent Placeholder</h3>

          <p className="text-sm text-muted-foreground max-w-xs mb-6">
            This space is reserved for your AI chat agent. Integrate your preferred chat solution to enable real-time
            customer conversations and support.
          </p>

          <div className="w-full space-y-3 mb-6">
            <div className="p-4 bg-muted/50 rounded-lg text-left">
              <p className="text-xs font-medium text-foreground mb-1">Suggested Features:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Real-time messaging</li>
                <li>• AI-powered responses</li>
                <li>• Conversation history</li>
                <li>• Quick reply templates</li>
              </ul>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent">
            <Sparkles className="h-4 w-4 mr-2" />
            Configure Chat Agent
          </Button>

          <div className="mt-6 pt-6 border-t border-border w-full">
            <p className="text-xs text-muted-foreground">
              Ready to integrate with popular platforms like Intercom, Drift, or custom AI solutions
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
