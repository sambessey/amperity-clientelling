'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Mail, Phone, MapPin, Calendar, Tag, TrendingUp, ShoppingBag, Star, Globe, Heart } from "lucide-react"

// Friendly ID to Amperity ID mapping - keep in sync with website-interactions.tsx
// UPDATE THIS MAPPING: Replace the placeholder Amperity IDs with real ones from your system
// Usage: /dashboard?id=martinh will map to Amperity ID and call the real API
const CUSTOMER_ID_MAPPING: Record<string, string> = {
  'martinh': '00cf575b-4b03-34c1-acfe-49c6f5cbeb25',        // Martin Hansen
  'sarahj': '05483448-a958-3335-b521-aea5f3a82f3a',         // Sarah Johnson
  'miket': '0551df4d-a090-3d6e-b22d-83683d8ba6ff',          // Mike Thompson
  'emilyr': '22ef797d-6d25-56e3-cfff-6be8f7edf447',         // Emily Rodriguez
  'davidw': '052c8b51-a506-3907-b9a0-9b55e1ed5b8f',        // David Wilson
  'lisac': '05219129-6927-3734-a67c-c63c0642d429',         // Lisa Chen
  'johnm': '55hi0cag-9g58-89h6-f222-9e1bgahgh77a',         // John Martinez
  'jennyk': '66ij1dbh-ah69-9ai7-g333-af2chbhih88b',        // Jenny Kim
  'robertp': '77jk2eci-bi7a-abj8-h444-bg3diciji99c',       // Robert Phillips
  'mariab': '88kl3fdj-cj8b-bck9-i555-ch4ejdjka0ad',        // Maria Brown
  'chriss': '99lm4gek-dk9c-cdla-j666-di5fkeclb1be',        // Chris Smith
  'amandah': 'aaln5hfl-el0d-demb-k777-ej6glfmmc2cf',       // Amanda Harris
  'stevenr': 'bbmo6igm-fm1e-efnc-l888-fk7hmgnnd3dg',       // Steven Roberts
  'jessican': 'ccnp7jhn-gn2f-fgod-m999-gl8inhope4eh',      // Jessica Nelson
  'brandonl': 'ddoq8kio-ho3g-ghpe-naaa-hm9joipqf5fi',      // Brandon Lewis
  'ashleyt': 'eepр9ljp-ip4h-hiqf-obbb-in0kpjqrg6gj',       // Ashley Taylor
  'kylem': 'ffqs0mkq-jq5i-ijrg-pccc-jo1lqkrsh7hk',         // Kyle Miller
  'rachelw': 'ggrt1nlr-kr6j-jksh-qddd-kp2mrlsti8il',       // Rachel Wright
  'nathanc': 'hhsu2oms-ls7k-klti-reed-lq3nsmtuj9jm',       // Nathan Cooper
  'laurad': 'iitv3pnt-mt8l-lmuj-sfee-mr4otnuvkaкn',        // Laura Davis
  'alexm': 'jjuw4qou-nu9m-mnvk-tgff-ns5puovwlblo',         // Alex Moore
  'kimberlys': 'kkvx5rpv-ov0n-nowl-uhgg-ot6qvpwxmcmp',     // Kimberly Scott
  'josephb': 'llwy6sqw-pw1o-opxm-vihh-pu7rwqxyndnq',       // Joseph Bell
  'nicolep': 'mmxz7trx-qx2p-pqyn-wjii-qv8sxryzoer',        // Nicole Parker
  'ryang': 'nnyya8usy-ry3q-qrzo-xkjj-rw9tysaZpfs',         // Ryan Garcia
  'meganf': 'oozzb9vtz-sz4r-rsap-ylkk-sx0uztrbqgt',         // Megan Foster
  'aarond': 'ppac0wua-ta5s-stbq-zmll-ty1vauscrhu',          // Aaron Davis
  'stephaniej': 'qqbd1xvb-ub6t-tucr-anmm-uz2wbvtdsiv',     // Stephanie Jones
  'kevinp': 'rrce2ywc-vc7u-uvds-bonn-va3xcwuetjw',         // Kevin Peterson
  'tiffanyk': 'ssdf3zxd-wd8v-vwet-cpoo-wb4ydxvfukx',       // Tiffany King
  'jamesh': 'tteg40ye-xe9w-wxfu-dqpp-xc5zeywgvly',          // James Hughes
  'catherinem': 'uufh51zf-yf0x-xygv-erqq-yd6afzxhwmz',     // Catherine Murphy
  'danielr': 'vvgi62ag-zg1y-yzhw-fsrr-ze7bgayixna',        // Daniel Rivera
  'michellel': 'wwhj73bh-ah2z-zaix-gtss-af8chbzjyob',      // Michelle Lee
  'brianw': 'xxik84ci-bi30-abjy-hutt-bg9dicakzpc',         // Brian White
  'angelam': 'yyjl95dj-cj41-bckz-ivuu-ch0ejdblaqd',        // Angela Martinez
  'gregoryb': 'aaklnb7f-el63-demb-kxww-ej2glfqnccf',       // Gregory Baker
  'heatherc': 'bblmoc8g-fm74-efnc-lyxx-fk3hmgorddg',       // Heather Collins
  'scottj': 'ccmnpd9h-gn85-fgod-mzyy-gl4inhoseleh',        // Scott Jackson
  'lindas': 'ddnoqeai-ho96-ghpe-nazz-hm5joipfaafi',        // Linda Stewart
  'timothyg': 'eepofbjp-ip07-hiag-oabb-in6kpjqrog7j',      // Timothy Green
  'rebeccah': 'ffqpgckq-jq18-ijbh-pbcc-jo7lqkrspn8k',      // Rebecca Hall
  'anthonyk': 'ggrqhdlr-kr29-jkci-qcdd-kp8mrlstqi9l',      // Anthony King
  'melissal': 'hhsriems-ls3a-kldr-rded-lq9nsmtujaam',      // Melissa Lopez
  'joshuam': 'iittfjnt-mt4b-lmek-sefe-mr0otnuvkbbn',       // Joshua Martin
  'samanthan': 'jjuugkou-nu5c-mnfl-tfff-ns1puovwlcco',     // Samantha Nelson
  'adamr': 'kkvvhlpv-ov6d-nogm-uggg-ot2qvpwxmddp',         // Adam Rodriguez
  'jennifers': 'llwwimqw-pw7e-ophn-vhhh-pu3rwqxyneeq',     // Jennifer Smith
  'matthewt': 'mmxxjnrx-qx8f-pqio-wiii-qv4sxryzofrr',      // Matthew Taylor
  'andreat': 'nnyykosz-ry9g-qrjp-xjjj-rw5tsazapgss'        // Andrea Thomas
}

interface AmperityCustomer {
  amperity_id: string
  full_name: string
  given_name: string
  surname: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postal: string
  birthdate: string
  gender: string
  customer_type: string
  lifetime_order_revenue: number
  lifetime_average_order_value: number
  lifetime_order_frequency: number
  first_order_datetime: string
  latest_order_datetime: string
  lifetime_preferred_purchase_channel: string
  lifetime_preferred_purchase_brand: string
  Preferred_Product_Type: string
  Preferred_Product_Category: string
  Experience_Views_L7D: number
  Most_Visited_Experience_Cat_L7D: string
  email_contactable: boolean
  multi_purchase_channel: boolean
  multi_purchase_brand: boolean
  one_and_done: boolean
  web_id: string
}

export function CustomerProfile() {
  const [customer, setCustomer] = useState<AmperityCustomer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        // Get customer identifier from URL parameters
        const email = searchParams.get("email")
        const customerId = searchParams.get("customerId")
        const friendlyId = searchParams.get("id") // New friendly ID parameter
        
        let apiUrl = '/api/crm/customers'
        
        // Map friendly ID to Amperity ID if provided
        if (friendlyId && CUSTOMER_ID_MAPPING[friendlyId]) {
          const actualCustomerId = CUSTOMER_ID_MAPPING[friendlyId]
          apiUrl += `?customerId=${encodeURIComponent(actualCustomerId)}`
        } else if (customerId) {
          apiUrl += `?customerId=${encodeURIComponent(customerId)}`
        } else if (email) {
          apiUrl += `?email=${encodeURIComponent(email)}`
        } else {
          // Fallback to demo customer if no parameters
          apiUrl += '?email=sambessey@gmail.com'
        }
        
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          throw new Error('Failed to fetch customer data')
        }

        const data = await response.json()
        
        if (data.success && data.customer) {
          setCustomer(data.customer)
        } else {
          throw new Error('Customer not found')
        }
      } catch (err) {
        console.error('Error fetching customer:', err)
        setError(err instanceof Error ? err.message : 'Failed to load customer data')
        
        // Fallback to static data for demo if API fails
        setCustomer({
          amperity_id: "00cf575b-4b03-34c1-acfe-49c6f5cbeb25",
          full_name: "Tina Rhodes",
          given_name: "Tina",
          surname: "Rhodes",
          email: "sambessey@gmail.com",
          phone: "(719)928-4317x961",
          address: "1231 Andrew Manor Road",
          city: "North Gregoryland",
          state: "OH",
          postal: "46581",
          birthdate: "1976-01-13",
          gender: "F",
          customer_type: "purchaser",
          lifetime_order_revenue: 2211.48,
          lifetime_average_order_value: 201.04,
          lifetime_order_frequency: 11,
          first_order_datetime: "2017-11-27T00:00:00Z",
          latest_order_datetime: "2023-11-15T00:00:00Z",
          lifetime_preferred_purchase_channel: "web",
          lifetime_preferred_purchase_brand: "TrendyBear",
          Preferred_Product_Type: "Spa",
          Preferred_Product_Category: "Wellness",
          Experience_Views_L7D: 0,
          Most_Visited_Experience_Cat_L7D: "Chocolate",
          email_contactable: true,
          multi_purchase_channel: false,
          multi_purchase_brand: false,
          one_and_done: false,
          web_id: "MDBjZjU3NWItNGIw"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCustomerData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-light">Customer Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-16 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-md" />
                <div>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && !customer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-light">Customer Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-2">Error loading customer data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!customer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-light">Customer Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No customer data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate age from birthdate
  const age = customer.birthdate ? new Date().getFullYear() - new Date(customer.birthdate).getFullYear() : 'Unknown'
  
  // Format dates
  const customerSince = customer.first_order_datetime ? 
    new Date(customer.first_order_datetime).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    }) : 'Unknown'
  
  const lastOrder = customer.latest_order_datetime ? 
    new Date(customer.latest_order_datetime).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short',
      day: 'numeric'
    }) : 'Unknown'

  // Determine customer tier based on lifetime value
  const getCustomerTier = () => {
    const revenue = customer.lifetime_order_revenue || 0
    if (revenue > 2000) return { label: "Premium", variant: "default" as const }
    if (revenue > 1000) return { label: "Gold", variant: "secondary" as const }
    return { label: "Standard", variant: "outline" as const }
  }

  const tier = getCustomerTier()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-light">Customer Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer Name & Status */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-light text-foreground mb-1">{customer.full_name || 'Unknown Customer'}</h2>
            <div className="flex gap-2 mb-2">
              <Badge variant={tier.variant} className="bg-primary/10 text-primary border-primary/20">
                {tier.label} Customer
              </Badge>
              <Badge variant="outline" className="capitalize">
                {customer.customer_type || 'customer'}
              </Badge>
              {customer.email_contactable && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Email OK
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {customer.gender === 'F' ? 'Female' : customer.gender === 'M' ? 'Male' : 'Unknown'} • Age {age} •
              {customer.one_and_done ? ' One-time buyer' : ' Repeat customer'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Amperity ID</p>
            <p className="font-mono text-xs">
              {customer.amperity_id ? customer.amperity_id.slice(0, 8) + '...' : 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Web ID</p>
            <p className="font-mono text-xs">{customer.web_id || 'N/A'}</p>
          </div>
        </div>        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-2 bg-muted rounded-md">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{customer.email || 'No email provided'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 p-2 bg-muted rounded-md">
              <Phone className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">{customer.phone || 'No phone provided'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 p-2 bg-muted rounded-md">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="text-sm font-medium">{customer.address || 'No address provided'}</p>
              <p className="text-sm text-muted-foreground">
                {customer.city || 'Unknown'}, {customer.state || 'Unknown'} {customer.postal || ''}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 p-2 bg-muted rounded-md">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Customer Since</p>
              <p className="text-sm font-medium">{customerSince}</p>
              <p className="text-xs text-muted-foreground">Last order: {lastOrder}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 p-2 bg-muted rounded-md">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lifetime Value</p>
              <p className="text-sm font-medium">
                ${(customer.lifetime_order_revenue || 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                Avg: ${(customer.lifetime_average_order_value || 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 p-2 bg-muted rounded-md">
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Frequency</p>
              <p className="text-sm font-medium">{customer.lifetime_order_frequency || 0} orders</p>
              <p className="text-xs text-muted-foreground">
                {customer.multi_purchase_channel ? 'Multi-channel' : 'Single channel'}
              </p>
            </div>
          </div>
        </div>

        {/* Preferences & Behavior */}
        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-medium text-foreground mb-3">Preferences & Behavior</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 bg-muted rounded-md">
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Preferred Channel</p>
                <p className="text-sm font-medium capitalize">
                  {customer.lifetime_preferred_purchase_channel || 'Unknown'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 bg-muted rounded-md">
                <Star className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Preferred Brand</p>
                <p className="text-sm font-medium">
                  {customer.lifetime_preferred_purchase_brand || 'Unknown'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 bg-muted rounded-md">
                <Heart className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Preferred Category</p>
                <p className="text-sm font-medium">
                  {customer.Preferred_Product_Category || 'Unknown'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Type: {customer.Preferred_Product_Type || 'Unknown'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 bg-muted rounded-md">
                <Tag className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recent Activity (7 days)</p>
                <p className="text-sm font-medium">
                  {customer.Experience_Views_L7D || 0} page views
                </p>
                <p className="text-xs text-muted-foreground">
                  Most viewed: {customer.Most_Visited_Experience_Cat_L7D || 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              {customer.lifetime_preferred_purchase_channel || 'Unknown'} Shopper
            </Badge>
            <Badge variant="outline">
              {customer.Preferred_Product_Category || 'Unknown'} Lover
            </Badge>
            <Badge variant="outline">
              {customer.lifetime_preferred_purchase_brand || 'Unknown'} Fan
            </Badge>
            {!customer.one_and_done && <Badge variant="outline">Loyal Customer</Badge>}
            {customer.email_contactable && <Badge variant="outline">Email Subscriber</Badge>}
            <Badge variant="outline">Active Browsing</Badge>
          </div>
        </div>

        {/* Birth Date */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Birthday:</span>
            <span className="text-sm font-medium">
              {customer.birthdate ? 
                new Date(customer.birthdate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'Unknown'
              }
            </span>
            {error && (
              <span className="text-xs text-amber-600 ml-2">
                (Using fallback data - API: {error})
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
