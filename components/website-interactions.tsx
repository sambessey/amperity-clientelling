'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MousePointer, Eye, ShoppingCart, Clock, Globe, Heart, TrendingUp, Calendar, RefreshCw, Play, Pause } from "lucide-react"

// Friendly ID to Amperity ID mapping
// UPDATE THIS MAPPING: Replace the placeholder Amperity IDs with real ones from your system
// Usage: /dashboard?id=martinh will map to Amperity ID and call the real API
// Format: 'friendlyname': 'real-amperity-uuid-here'
const CUSTOMER_ID_MAPPING: Record<string, string> = {
  'martinh': '00cf575b-4b03-34c1-acfe-49c6f5cbeb25',        // Martin Hansen
  'sarahj': '05483448-a958-3335-b521-aea5f3a82f3a',         // Sarah Johnson
  'miket': '0551df4d-a090-3d6e-b22d-83683d8ba6ff',          // Mike Thompson
  'emilyr': '22ef797d-6d25-56e3-cfff-6be8f7edf447',         // Emily Rodriguez
  'davidw': '33fg8a8e-7e36-67f4-d000-7cf9f8fef558',        // David Wilson
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
  'gregoryb': 'aaklnb7f-el63-demb-kxww-ej2glfqnccf',      // Gregory Baker
  'heatherc': 'bblmoc8g-fm74-efnc-lyxx-fk3hmgorddg',      // Heather Collins
  'scottj': 'ccmnpd9h-gn85-fgod-mzyy-gl4inhoseleh',       // Scott Jackson
  'lindas': 'ddnoqeai-ho96-ghpe-nazz-hm5joipfaafi',       // Linda Stewart
  'timothyg': 'eepofbjp-ip07-hiag-oabb-in6kpjqrog7j',     // Timothy Green
  'rebeccah': 'ffqpgckq-jq18-ijbh-pbcc-jo7lqkrspn8k',     // Rebecca Hall
  'anthonyk': 'ggrqhdlr-kr29-jkci-qcdd-kp8mrlstqi9l',     // Anthony King
  'melissal': 'hhsriems-ls3a-kldr-rded-lq9nsmtujaam',     // Melissa Lopez
  'joshuam': 'iittfjnt-mt4b-lmek-sefe-mr0otnuvkbbn',      // Joshua Martin
  'samanthan': 'jjuugkou-nu5c-mnfl-tfff-ns1puovwlcco',    // Samantha Nelson
  'adamr': 'kkvvhlpv-ov6d-nogm-uggg-ot2qvpwxmddp',        // Adam Rodriguez
  'jennifers': 'llwwimqw-pw7e-ophn-vhhh-pu3rwqxyneeq',    // Jennifer Smith
  'matthewt': 'mmxxjnrx-qx8f-pqio-wiii-qv4sxryzofrr',     // Matthew Taylor
  'andreat': 'nnyykosz-ry9g-qrjp-xjjj-rw5tsazapgss'       // Andrea Thomas
}

interface InteractionData {
  Experience_Views_L7D: number
  Current_Preferred_Product_Category: string
  lifetime_preferred_purchase_channel: string
  Preferred_Product_Category: string
  Preferred_Product_Type: string
  lifetime_order_frequency: number
  lifetime_average_order_value: number
  latest_order_datetime: string
}

interface Segment {
  segment_id: string
  segment_name: string
}

export function WebsiteInteractions() {
  const [interactionData, setInteractionData] = useState<InteractionData | null>(null)
  const [previousData, setPreviousData] = useState<InteractionData | null>(null)
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set())
  const [segments, setSegments] = useState<Segment[]>([])
  const [previousSegments, setPreviousSegments] = useState<Segment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(5)
  const [refreshCount, setRefreshCount] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true)
  const searchParams = useSearchParams()

  const fetchInteractionData = async (isManual = false) => {
    if (isManual) {
      setIsRefreshing(true)
    }
    
    try {
      // Get customer identifier from URL parameters
      const email = searchParams.get("email")
      const customerId = searchParams.get("customerId")
      const friendlyId = searchParams.get("id") // New friendly ID parameter
      
      let apiUrl = '/api/crm/customers'
      let actualCustomerId = customerId
      
      // Map friendly ID to Amperity ID if provided
      if (friendlyId && CUSTOMER_ID_MAPPING[friendlyId]) {
        actualCustomerId = CUSTOMER_ID_MAPPING[friendlyId]
        apiUrl += `?customerId=${encodeURIComponent(actualCustomerId)}`
      } else if (customerId) {
        apiUrl += `?customerId=${encodeURIComponent(customerId)}`
      } else if (email) {
        apiUrl += `?email=${encodeURIComponent(email)}`
      } else {
        // Fallback to demo customer if no parameters
        apiUrl += '?email=sambessey@gmail.com'
      }
      
      // Fetch customer data and segments in parallel
      const [customerResponse, segmentsResponse] = await Promise.all([
        fetch(apiUrl),
        actualCustomerId ? fetch(`/api/crm/segments?customerId=${encodeURIComponent(actualCustomerId)}`) : Promise.resolve(null)
      ])
      
      // Handle customer data
      if (!customerResponse.ok) {
        throw new Error('Failed to fetch interaction data')
      }

      const customerData = await customerResponse.json()
      
      if (customerData.success && customerData.customer) {
        const newInteractionData = {
          Experience_Views_L7D: customerData.customer.experienceViewsL7D || customerData.customer.Experience_Views_L7D || 0,
          Current_Preferred_Product_Category: customerData.customer.Current_Preferred_Product_Category || "Wellness",
          lifetime_preferred_purchase_channel: customerData.customer.preferredPurchaseChannel || customerData.customer.lifetime_preferred_purchase_channel || "web",
          Preferred_Product_Category: customerData.customer.preferredProductCategory || customerData.customer.Preferred_Product_Category || "Wellness",
          Preferred_Product_Type: customerData.customer.preferredProductType || customerData.customer.Preferred_Product_Type || "Spa",
          lifetime_order_frequency: customerData.customer.orderFrequency || customerData.customer.lifetime_order_frequency || 11,
          lifetime_average_order_value: customerData.customer.averageOrderValue || customerData.customer.lifetime_average_order_value || 201.04,
          latest_order_datetime: customerData.customer.lastPurchaseDate || customerData.customer.latest_order_datetime || "2023-11-15T00:00:00Z"
        }
        
        // Handle segments data
        let newSegments: Segment[] = []
        if (segmentsResponse && segmentsResponse.ok) {
          const segmentsData = await segmentsResponse.json()
          if (segmentsData.success) {
            newSegments = segmentsData.segments || []
          }
        } else if (!customerId) {
          // No segments for email-only lookups
          newSegments = []
        }
        
        // Detect changes
        const changed = new Set<string>()
        
        // Check interaction data changes
        if (interactionData) {
          Object.entries(newInteractionData).forEach(([key, value]) => {
            if (interactionData[key as keyof InteractionData] !== value) {
              changed.add(key)
            }
          })
        }
        
        // Check segments changes
        if (segments.length > 0 || newSegments.length > 0) {
          const prevSegmentIds = new Set(segments.map(s => s.segment_id))
          const newSegmentIds = new Set(newSegments.map(s => s.segment_id))
          
          // Check for new segments
          for (const segmentId of newSegmentIds) {
            if (!prevSegmentIds.has(segmentId)) {
              changed.add(`segment-${segmentId}`)
            }
          }
          
          // Check for removed segments
          for (const segmentId of prevSegmentIds) {
            if (!newSegmentIds.has(segmentId)) {
              changed.add(`segment-${segmentId}`)
            }
          }
        }
        
        // Update state
        setPreviousData(interactionData)
        setPreviousSegments(segments)
        setInteractionData(newInteractionData)
        setSegments(newSegments)
        setChangedFields(changed)
        
        // Clear changed fields after animation
        if (changed.size > 0) {
          setTimeout(() => setChangedFields(new Set()), 2000)
        }
        
        setError(null)
        setRefreshCount(prev => prev + 1)
      } else {
        throw new Error('Customer interaction data not found')
      }
    } catch (err) {
      console.error('Error fetching interaction data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load interaction data')
      
      // Fallback to static data for demo
      setInteractionData({
        Experience_Views_L7D: 0,
        Current_Preferred_Product_Category: "None",
        lifetime_preferred_purchase_channel: "web",
        Preferred_Product_Category: "None",
        Preferred_Product_Type: "None",
        lifetime_order_frequency: 11,
        lifetime_average_order_value: 201.04,
        latest_order_datetime: "2023-11-15T00:00:00Z"
      })
      setSegments([])
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleManualRefresh = () => {
    setCountdown(5) // Reset countdown
    fetchInteractionData(true)
  }

  const toggleAutoRefresh = () => {
    setIsAutoRefreshEnabled(prev => {
      const newState = !prev
      if (newState) {
        setCountdown(5) // Reset countdown when enabling
      }
      return newState
    })
  }

  useEffect(() => {
    // Initial fetch
    fetchInteractionData()
  }, [searchParams])

  // Auto-refresh timer effect
  useEffect(() => {
    if (!isAutoRefreshEnabled) return

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Time to refresh
          fetchInteractionData()
          return 5 // Reset countdown
        }
        return prev - 1
      })
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [searchParams, isAutoRefreshEnabled]) // Re-setup timer when searchParams or auto-refresh state changes

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-light">Digital Engagement & Activity</CardTitle>
            <Skeleton className="h-5 w-20" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center p-4 bg-muted/50 rounded-lg">
                <Skeleton className="h-5 w-5 mx-auto mb-2" />
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!interactionData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-light">Digital Engagement & Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No interaction data available</p>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>
        </CardContent>
      </Card>
    )
  }

  const lastOrderDaysAgo = Math.floor((new Date().getTime() - new Date(interactionData.latest_order_datetime).getTime()) / (1000 * 3600 * 24))
  
  // Get current ID info for display
  const friendlyId = searchParams?.get("id")
  const customerId = searchParams?.get("customerId")
  const email = searchParams?.get("email")
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-light">Digital Engagement & Activity</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              From Amperity {error && "(Fallback)"}
            </Badge>
            {friendlyId && CUSTOMER_ID_MAPPING[friendlyId] && (
              <Badge variant="outline" className="text-xs">
                ID: {friendlyId} → {CUSTOMER_ID_MAPPING[friendlyId].slice(0, 8)}...
              </Badge>
            )}
            {customerId && !friendlyId && (
              <Badge variant="outline" className="text-xs">
                Direct ID: {customerId.slice(0, 8)}...
              </Badge>
            )}
            {email && !friendlyId && !customerId && (
              <Badge variant="outline" className="text-xs">
                Email: {email}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                !isAutoRefreshEnabled ? 'bg-gray-400' :
                isRefreshing ? 'bg-blue-500 animate-spin' : 
                countdown <= 2 ? 'bg-orange-500 animate-pulse' : 'bg-green-500'
              }`} />
              {!isAutoRefreshEnabled ? 'Auto-refresh paused' :
               isRefreshing ? 'Refreshing...' : `Refresh in ${countdown}s`}
            </Badge>
            {refreshCount > 1 && (
              <Badge variant="outline" className="text-xs">
                #{refreshCount}
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleAutoRefresh}
              className={`h-6 w-6 p-0 ${isAutoRefreshEnabled ? 'text-green-600' : 'text-gray-500'}`}
              title={isAutoRefreshEnabled ? 'Pause auto-refresh' : 'Start auto-refresh'}
            >
              {isAutoRefreshEnabled ? (
                <Pause className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="h-6 w-6 p-0"
              title="Manual refresh"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats from Amperity */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-border">
            <div className={`text-center p-4 bg-muted/50 rounded-lg transition-all duration-300 ${changedFields.has('Experience_Views_L7D') ? 'pulse-change' : ''}`}>
              <Eye className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-light text-foreground">{interactionData.Experience_Views_L7D}</p>
              <p className="text-xs text-muted-foreground">Views (7 days)</p>
            </div>
            <div className={`text-center p-4 bg-muted/50 rounded-lg transition-all duration-300 ${changedFields.has('Current_Preferred_Product_Category') ? 'pulse-change' : ''}`}>
              <Heart className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-lg font-light text-foreground">{interactionData.Current_Preferred_Product_Category}</p>
              <p className="text-xs text-muted-foreground">Current Category</p>
            </div>
            <div className={`text-center p-4 bg-muted/50 rounded-lg transition-all duration-300 ${changedFields.has('lifetime_order_frequency') ? 'pulse-change' : ''}`}>
              <ShoppingCart className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-light text-foreground">{interactionData.lifetime_order_frequency}</p>
              <p className="text-xs text-muted-foreground">Total Orders</p>
            </div>
            <div className={`text-center p-4 bg-muted/50 rounded-lg transition-all duration-300 ${changedFields.has('lifetime_average_order_value') ? 'pulse-change' : ''}`}>
              <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-xl font-light text-foreground">${interactionData.lifetime_average_order_value.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Avg Order Value</p>
            </div>
          </div>

          {/* Channel & Preference Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-b border-border">
            <div className={`flex items-start gap-3 p-2 rounded-lg transition-all duration-300 ${changedFields.has('lifetime_preferred_purchase_channel') ? 'pulse-change' : ''}`}>
              <div className="mt-1 p-2 bg-muted rounded-md">
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Preferred Channel</p>
                <p className="text-sm font-medium capitalize">{interactionData.lifetime_preferred_purchase_channel}</p>
                <p className="text-xs text-muted-foreground">Primary shopping method</p>
              </div>
            </div>

            <div className={`flex items-start gap-3 p-2 rounded-lg transition-all duration-300 ${changedFields.has('Preferred_Product_Category') || changedFields.has('Preferred_Product_Type') ? 'pulse-change' : ''}`}>
              <div className="mt-1 p-2 bg-muted rounded-md">
                <Heart className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Preferred Categories</p>
                <p className="text-sm font-medium">{interactionData.Preferred_Product_Category}</p>
                <p className="text-xs text-muted-foreground">Type: {interactionData.Preferred_Product_Type}</p>
              </div>
            </div>
          </div>

          {/* Recent Engagement Activity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Recent Activity Insights</h3>
              <Badge variant="outline" className="text-xs">
                {isRefreshing ? 'Updating...' : 
                 !isAutoRefreshEnabled ? 'Auto-refresh paused' :
                 `Live Data (${refreshCount > 0 ? `#${refreshCount}` : 'Initial'})`}
              </Badge>
            </div>

            <div className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full mt-2" />
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium">High Recent Engagement</p>
                <p className="text-sm text-muted-foreground">
                  {interactionData.Experience_Views_L7D} page views in the last 7 days - above average activity
                </p>
                <p className="text-xs text-muted-foreground">Real-time from Amperity CDP</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
              <div className="flex-1">
                <p className="text-sm text-foreground">Current Focus: {interactionData.Current_Preferred_Product_Category}</p>
                <p className="text-sm text-muted-foreground">
                  Current preferred product category
                </p>
                <p className="text-xs text-muted-foreground">From Amperity CDP</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div className="flex-1">
                <p className="text-sm text-foreground">Purchase Pattern: {interactionData.lifetime_preferred_purchase_channel.toUpperCase()} Shopper</p>
                <p className="text-sm text-muted-foreground">
                  Consistent {interactionData.lifetime_preferred_purchase_channel} channel preference with {interactionData.lifetime_order_frequency} lifetime orders
                </p>
                <p className="text-xs text-muted-foreground">Behavioral insight</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div className="flex-1">
                <p className="text-sm text-foreground">Customer Status: Active</p>
                <p className="text-sm text-muted-foreground">
                  Last order was {lastOrderDaysAgo} days ago - recent engagement suggests potential for re-purchase
                </p>
                <p className="text-xs text-muted-foreground">CDP insight</p>
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-medium text-foreground mb-3">Engagement Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Purchase Frequency</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {interactionData.lifetime_order_frequency} orders since first purchase
                </p>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Recent Activity</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {interactionData.Experience_Views_L7D} views in 7 days - High engagement
                </p>
              </div>
            </div>
          </div>

          {/* Customer Segments */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground">Customer Segments</h3>
              <Badge variant="outline" className="text-xs">
                {segments.length} active
              </Badge>
            </div>
            
            {segments.length > 0 ? (
              <div className="space-y-2">
                {segments.map((segment, index) => (
                  <div 
                    key={segment.segment_id} 
                    className={`flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg transition-all duration-300 ${changedFields.has(`segment-${segment.segment_id}`) ? 'pulse-change' : ''}`}
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {segment.segment_name}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        ID: {segment.segment_id}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  </div>
                ))}
                <div className="mt-2 p-2 bg-muted/10 rounded text-center">
                  <p className="text-xs text-muted-foreground">
                    Real-time segments from Amperity • Last updated: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center bg-muted/10 rounded-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-3">
                  <TrendingUp className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">No Active Segments</p>
                <p className="text-xs text-muted-foreground">
                  {searchParams.get("customerId") ? 
                    'This customer is not currently in any segments' : 
                    'Customer ID required for segment lookup'}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
