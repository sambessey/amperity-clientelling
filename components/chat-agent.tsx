import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Settings } from 'lucide-react'
import { ChatHistory } from '@/components/chat-history'
import { ChatInput } from '@/components/chat-input'
import { ChatMessage, ChatState } from '@/lib/types/chat'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export function ChatAgent() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null
  })

  const generateId = () => Math.random().toString(36).substring(2, 15)

  const sendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date()
    }

    // Add user message and set loading state
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }))

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...chatState.messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }

      // Add assistant response and clear loading state
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }))

    } catch (error) {
      console.error('Chat error:', error)
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }))
    }
  }

  const clearChat = () => {
    setChatState(prev => ({
      ...prev,
      messages: [],
      error: null
    }))
  }

  const clearError = () => {
    setChatState(prev => ({ ...prev, error: null }))
  }

  return (
    <Card className="h-full lg:sticky lg:top-8 flex flex-col max-h-[600px]">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-light flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Assistant
          </CardTitle>
          {chatState.messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {chatState.error && (
          <div className="px-4 pb-2">
            <Alert variant="destructive" className="text-sm">
              <AlertDescription>
                {chatState.error}
                <button 
                  onClick={clearError}
                  className="ml-2 underline hover:no-underline"
                >
                  Dismiss
                </button>
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        <ChatHistory 
          messages={chatState.messages} 
          isLoading={chatState.isLoading}
        />
        
        <div className="flex-shrink-0">
          <ChatInput 
            onSendMessage={sendMessage}
            isLoading={chatState.isLoading}
          />
        </div>
      </CardContent>
    </Card>
  )
}