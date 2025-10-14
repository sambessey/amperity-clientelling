import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { availableFunctions, executeFunction } from '@/lib/functions'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are ChatGPT, an AI assistant created by OpenAI, integrated into a CRM system powered by Amperity CDP. You have access to comprehensive customer data including LifeTimeValue, NumberofInteractions, behavioral insights, and 360-degree customer profiles. When users ask about customers, orders, or products, use the available functions to look up real data from Amperity. Provide insights about customer value, engagement patterns, churn risk, and personalized recommendations based on the rich CDP data. Be professional, friendly, and data-driven in your responses. You can acknowledge that you are ChatGPT when asked directly.'
        },
        ...messages
      ],
      functions: Object.values(availableFunctions),
      function_call: 'auto',
      temperature: 0.7,
      max_tokens: 500,
    })

    const responseMessage = completion.choices[0]?.message

    if (!responseMessage) {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      )
    }

    // Check if ChatGPT wants to call a function
    if (responseMessage.function_call) {
      const functionName = responseMessage.function_call.name
      const functionArgs = JSON.parse(responseMessage.function_call.arguments || '{}')
      
      // Execute the function
      const functionResult = await executeFunction(functionName, functionArgs)
      
      // Send the function result back to ChatGPT
      const followUpCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are ChatGPT, an AI assistant created by OpenAI, integrated into a CRM system to help with customer service. You have access to customer data, order history, and product information through function calls. When users ask about customers, orders, or products, use the available functions to look up real data. Be professional, friendly, and concise in your responses. You can acknowledge that you are ChatGPT when asked directly.'
          },
          ...messages,
          responseMessage,
          {
            role: 'function',
            name: functionName,
            content: JSON.stringify(functionResult)
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      })

      const finalResponse = followUpCompletion.choices[0]?.message

      if (!finalResponse) {
        return NextResponse.json(
          { error: 'No response generated after function call' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: finalResponse.content,
        role: finalResponse.role,
        functionCalled: functionName,
        functionResult: functionResult
      })
    }

    return NextResponse.json({
      message: responseMessage.content,
      role: responseMessage.role
    })

  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}