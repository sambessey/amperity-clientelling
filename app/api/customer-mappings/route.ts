import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

/**
 * API endpoint to serve customer ID mappings
 * This avoids CORS issues when fetching from GitHub directly in the browser
 */
export async function GET(request: NextRequest) {
  try {
    // Try to read the local customer-mappings.json file first
    const filePath = path.join(process.cwd(), 'customer-mappings.json')
    
    let mappingsData
    
    if (fs.existsSync(filePath)) {
      // Read from local file
      const fileContent = fs.readFileSync(filePath, 'utf8')
      mappingsData = JSON.parse(fileContent)
      console.log('📋 Serving customer mappings from local file')
    } else {
      // Fallback to fetching from GitHub (server-side, no CORS issues)
      console.log('🔄 Fetching customer mappings from GitHub...')
      
      const githubUrl = 'https://raw.githubusercontent.com/sambessey/amperity-clientelling/main/customer-mappings.json'
      const response = await fetch(githubUrl, {
        headers: {
          'Cache-Control': 'no-cache',
          'User-Agent': 'Amperity-Clientelling-App'
        }
      })
      
      if (!response.ok) {
        throw new Error(`GitHub fetch failed: ${response.status}`)
      }
      
      mappingsData = await response.json()
      console.log('✅ Fetched customer mappings from GitHub')
    }

    // Add cache headers to control client-side caching
    const responseHeaders = {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300, s-maxage=300', // 5 minutes cache
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    }

    return NextResponse.json({
      success: true,
      data: mappingsData,
      source: fs.existsSync(filePath) ? 'local' : 'github',
      timestamp: new Date().toISOString()
    }, {
      headers: responseHeaders
    })

  } catch (error) {
    console.error('❌ Error serving customer mappings:', error)
    
    // Return fallback mappings
    const fallbackMappings = {
      version: '1.0.0-fallback',
      mappings: {
        'martinh': '00cf575b-4b03-34c1-acfe-49c6f5cbeb25',
        'sarahj': '05483448-a958-3335-b521-aea5f3a82f3a',
        'lisac': '05219129-6927-3734-a67c-c63c0642d429',
        'miket': '0551df4d-a090-3d6e-b22d-83683d8ba6ff'
      },
      metadata: {
        total_customers: 4,
        last_updated: new Date().toISOString(),
        updated_by: 'fallback-system',
        description: 'Fallback customer mappings when primary source is unavailable'
      }
    }

    return NextResponse.json({
      success: true,
      data: fallbackMappings,
      source: 'fallback',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 200, // Still return 200 since we have fallback data
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60', // Shorter cache for fallback
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}