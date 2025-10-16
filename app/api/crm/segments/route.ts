import { NextRequest, NextResponse } from 'next/server'

// Configuration for Amperity CDP API
const AMPERITY_CONFIG = {
  baseUrl: process.env.AMPERITY_API_BASE_URL || 'https://acme.amperity.com/prof',
  apiKey: process.env.AMPERITY_API_KEY,
  tenantId: process.env.AMPERITY_TENANT_ID || 'acme2',
  timeout: 15000 // 15 seconds
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const customerId = searchParams.get('customerId')

  if (!customerId) {
    return NextResponse.json(
      { error: 'Customer ID is required' },
      { status: 400 }
    )
  }

  try {
    // Use the dynamic customer ID for segments lookup
    const collectionId = 'apc-mSgLnRKd' // This could also be dynamic in production
    
    // Build the Amperity segments URL
    const amperityUrl = `${AMPERITY_CONFIG.baseUrl}/profiles/${collectionId}/${customerId}/segments`

    console.log('Calling Amperity Segments API:', amperityUrl)

    // Make the request to your actual Amperity segments API
    const response = await fetch(amperityUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AMPERITY_CONFIG.apiKey}`,
        'amperity-tenant': AMPERITY_CONFIG.tenantId,
        'Content-Type': 'application/json',
        'User-Agent': 'ChatGPT-CRM-Integration/1.0'
      },
      signal: AbortSignal.timeout(AMPERITY_CONFIG.timeout)
    })

    if (!response.ok) {
      console.error(`Amperity Segments API error: ${response.status} ${response.statusText}`)
      
      // Return empty segments for demo if API fails
      return NextResponse.json({
        success: true,
        segments: [],
        source: 'amperity_segments_api_failed',
        debug: { 
          url: amperityUrl,
          customerId: customerId,
          error: `API returned ${response.status}`
        }
      })
    }

    const segmentsData = await response.json()
    console.log('Amperity segments response received:', JSON.stringify(segmentsData, null, 2))

    // Extract segments from the response
    const segments = segmentsData.data || []

    return NextResponse.json({
      success: true,
      segments: segments,
      total: segmentsData.total || segments.length,
      source: 'amperity_segments_api',
      debug: { 
        url: amperityUrl,
        customerId: customerId,
        segmentsResponse: segmentsData 
      }
    })

  } catch (error) {
    console.error('Amperity segments lookup error:', error)
    
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Amperity Segments API timeout' },
        { status: 504 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to look up customer segments from Amperity' },
      { status: 500 }
    )
  }
}