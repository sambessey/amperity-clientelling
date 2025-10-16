import { NextRequest, NextResponse } from 'next/server'

// Configuration for Amperity CDP API
const AMPERITY_CONFIG = {
  baseUrl: process.env.AMPERITY_API_BASE_URL || 'https://acme.amperity.com/prof',
  apiKey: process.env.AMPERITY_API_KEY,
  tenantId: process.env.AMPERITY_TENANT_ID || 'acme2',
  timeout: 15000 // 15 seconds - Amperity queries can take a bit longer
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const customerId = searchParams.get('customerId')
  const name = searchParams.get('name')

  try {
    // Use the dynamic customer ID from the request, with fallback for demo
    const collectionId = 'apc-mSgLnRKd' // This could also be dynamic in production
    
    // Determine which profile ID to use
    let profileIdToUse = null
    
    if (customerId) {
      // Use the customer ID directly as the profile ID
      profileIdToUse = customerId
      console.log(`Using customer ID from query string: ${customerId}`)
    } else if (email === 'sambessey@gmail.com') {
      // Fallback to demo profile for the demo email
      profileIdToUse = '00cf575b-4b03-34c1-acfe-49c6f5cbeb25'
      console.log(`Using demo profile for email: ${email}`)
    } else {
      // Return error if no valid identifier provided
      return NextResponse.json(
        { 
          error: 'Customer identifier required', 
          message: 'Please provide either a customerId or email parameter'
        },
        { status: 400 }
      )
    }
    
    // Build the Amperity URL with the dynamic profile ID
    const amperityUrl = `${AMPERITY_CONFIG.baseUrl}/profiles/${collectionId}/${profileIdToUse}`

    console.log('Calling Amperity API:', amperityUrl)

    // Make the request to your actual Amperity API
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
      console.error(`Amperity API error: ${response.status} ${response.statusText}`)
      
      // If API fails and we're looking for the demo customer, return fallback data
      if (profileIdToUse === '00cf575b-4b03-34c1-acfe-49c6f5cbeb25') {
        console.log('Amperity API failed for demo customer, using fallback demo data')
        return getFallbackDemoData()
      }
      
      return NextResponse.json(
        { error: `Amperity API error: ${response.status} - Customer ID ${profileIdToUse} may not exist in your Amperity system` },
        { status: response.status }
      )
    }

    const amperityData = await response.json()
    console.log('Amperity response received:', JSON.stringify(amperityData, null, 2))

    // Transform the Amperity data to our expected format
    const transformedCustomer = transformAmperityCustomerData(amperityData)
    console.log('Transformed customer data:', JSON.stringify(transformedCustomer, null, 2))

    if (!transformedCustomer) {
      return NextResponse.json(
        { error: 'Customer not found in Amperity response' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      customer: transformedCustomer,
      source: 'amperity_live_api',
      debug: { 
        url: amperityUrl,
        customerId: profileIdToUse,
        requestedId: customerId || email,
        amperityResponse: amperityData 
      }
    })

  } catch (error) {
    console.error('Amperity customer lookup error:', error)
    
    // If there's an error and we're looking for the demo customer, provide fallback
    if (customerId === '00cf575b-4b03-34c1-acfe-49c6f5cbeb25' || email === 'sambessey@gmail.com') {
      console.log('Error occurred for demo customer, using fallback demo data')
      return getFallbackDemoData()
    }
    
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Amperity API timeout' },
        { status: 504 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to look up customer from Amperity' },
      { status: 500 }
    )
  }
}// Fallback demo data function
function getFallbackDemoData() {
  const mockAmperityResponse = {
    created_at: "2025-10-08T11:30:56.025296896Z",
    updated_at: "2025-10-08T12:59:29.498466816Z",
    collection_id: "apc-5VqU3c41",
    profile_id: "00cf575b-4b03-34c1-acfe-49c6f5cbeb25",
    attributes: {
      one_and_done: false,
      amperity_id: "00cf575b-4b03-34c1-acfe-49c6f5cbeb25",
      full_name: "Tina Rhodesz",
      city: "North Gregoryland",
      lifetime_preferred_purchase_channel: "web",
      customer_type: "purchaser",
      Experience_Views_L7D: 0,
      Preferred_Product_Type: "Spa",
      gender: "F",
      email: "sambessxey@gmail.com",
      given_name: "Tina",
      lifetime_preferred_purchase_brand: "Curated Yarra",
      lifetime_average_order_value: 201.04,
      first_order_datetime: "2017-11-27T00:00:00Z",
      postal: "46581",
      surname: "Rhodes",
      address: "1231 Andrew Manor Road",
      Preferred_Product_Category: "Wellness",
      lifetime_order_frequency: 11,
      multi_purchase_channel: false,
      latest_order_datetime: "2023-11-15T00:00:00Z",
      phone: "(719)928-4317x961",
      email_contactable: true,
      Most_Visited_Experience_Cat_L7D: "Chocolate",
      state: "OH",
      birthdate: "1976-01-13",
      web_id: "MDBjZjU3NWItNGIw",
      lifetime_order_revenue: 2211.48,
      multi_purchase_brand: false
    }
  }

  const transformedCustomer = transformAmperityCustomerData(mockAmperityResponse)

  return NextResponse.json({
    success: true,
    customer: transformedCustomer,
    source: 'fallback_demo_data',
    debug: { 
      message: 'Fallback mode: API failed, using local demo data',
      amperityResponse: mockAmperityResponse 
    }
  })
}

// Transform Amperity's data format to our expected format
function transformAmperityCustomerData(amperityResponse: any) {
  // Handle the actual Amperity response structure
  let customerData = null
  
  if (amperityResponse.attributes) {
    // Direct Amperity profile response
    customerData = amperityResponse.attributes
  } else if (Array.isArray(amperityResponse)) {
    // If it's an array, take the first match
    customerData = amperityResponse.length > 0 ? amperityResponse[0].attributes || amperityResponse[0] : null
  } else if (amperityResponse.data && Array.isArray(amperityResponse.data)) {
    // If wrapped in a data array
    customerData = amperityResponse.data.length > 0 ? amperityResponse.data[0].attributes || amperityResponse.data[0] : null
  } else {
    // Direct object response
    customerData = amperityResponse
  }

  if (!customerData) {
    return null
  }

  // Map actual Amperity fields from your response to our standard format
  return {
    // Basic identifiers
    id: customerData.amperity_id || customerData.profile_id,
    amperity_id: customerData.amperity_id,
    email: customerData.email,
    
    // Name fields
    full_name: customerData.full_name,
    given_name: customerData.given_name,
    surname: customerData.surname,
    name: customerData.full_name || 
          [customerData.given_name, customerData.surname].filter(Boolean).join(' '),
    
    // Contact info
    phone: customerData.phone,
    
    // Address
    address: customerData.address,
    city: customerData.city,
    state: customerData.state,
    postal: customerData.postal,
    zipCode: customerData.postal,
    
    // Customer status and tier
    status: 'active', // Assuming active if in Amperity
    tier: customerData.lifetime_order_revenue > 2000 ? 'premium' : 
          customerData.lifetime_order_revenue > 1000 ? 'gold' : 'standard',
    
    // Dates
    joinDate: customerData.first_order_datetime,
    first_order_datetime: customerData.first_order_datetime,
    latest_order_datetime: customerData.latest_order_datetime,
    birthdate: customerData.birthdate,
    
    // Financial data - Keep both old and new field names for compatibility
    totalSpent: customerData.lifetime_order_revenue || 0,
    lifetime_order_revenue: customerData.lifetime_order_revenue || 0,
    averageOrderValue: customerData.lifetime_average_order_value || 0,
    lifetime_average_order_value: customerData.lifetime_average_order_value || 0,
    
    // Activity data
    lastPurchaseDate: customerData.latest_order_datetime,
    
    // Amperity-specific enriched data - Keep original field names
    orderFrequency: customerData.lifetime_order_frequency,
    lifetime_order_frequency: customerData.lifetime_order_frequency,
    
    // Real-time digital engagement attributes
    Experience_Views_Count_L7D: customerData.Experience_Views_Count_L7D,
    Experience_Views_Count_L1D: customerData.Experience_Views_Count_L1D, 
    Experience_Views_Count_L1H: customerData.Experience_Views_Count_L1H,
    Was_Category_Viewed_Today: customerData.Was_Category_Viewed_Today || [],
    Was_Viewed_In_Last_Hour: customerData.Was_Viewed_In_Last_Hour || [],
    Current_Preferred_Product_Category: customerData.Current_Preferred_Product_Category,
    
    // Legacy experience views fields for compatibility
    experienceViewsL7D: customerData.Experience_Views_Count_L7D,
    Experience_Views_L7D: customerData.Experience_Views_Count_L7D,
    
    // Product preferences
    preferredProductType: customerData.Preferred_Product_Type,
    Preferred_Product_Type: customerData.Preferred_Product_Type,
    preferredProductCategory: customerData.Preferred_Product_Category,
    Preferred_Product_Category: customerData.Preferred_Product_Category,
    mostVisitedCategoryL7D: customerData.Most_Visited_Experience_Cat_L7D,
    Most_Visited_Experience_Cat_L7D: customerData.Most_Visited_Experience_Cat_L7D,
    preferredPurchaseChannel: customerData.lifetime_preferred_purchase_channel,
    lifetime_preferred_purchase_channel: customerData.lifetime_preferred_purchase_channel,
    preferredPurchaseBrand: customerData.lifetime_preferred_purchase_brand,
    lifetime_preferred_purchase_brand: customerData.lifetime_preferred_purchase_brand,
    
    // Behavioral insights
    customerType: customerData.customer_type,
    customer_type: customerData.customer_type,
    gender: customerData.gender,
    emailContactable: customerData.email_contactable,
    email_contactable: customerData.email_contactable,
    multiPurchaseChannel: customerData.multi_purchase_channel,
    multi_purchase_channel: customerData.multi_purchase_channel,
    multiPurchaseBrand: customerData.multi_purchase_brand,
    multi_purchase_brand: customerData.multi_purchase_brand,
    oneAndDone: customerData.one_and_done,
    one_and_done: customerData.one_and_done,
    webId: customerData.web_id,
    web_id: customerData.web_id
  }
}