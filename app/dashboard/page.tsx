"use client"

import { useState, useEffect } from "react"
import { CustomerProfile } from "@/components/customer-profile"
import { WebsiteInteractions } from "@/components/website-interactions"
import { ChatAgent } from "@/components/chat-agent"
import { Header } from "@/components/header"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function DashboardContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const customerId = searchParams.get("customerId")
  const [customerName, setCustomerName] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomerName = async () => {
      try {
        let apiUrl = '/api/crm/customers'
        if (customerId) {
          apiUrl += `?customerId=${encodeURIComponent(customerId)}`
        } else if (email) {
          apiUrl += `?email=${encodeURIComponent(email)}`
        } else {
          setCustomerName("Customer Profile")
          setLoading(false)
          return
        }
        
        const response = await fetch(apiUrl)
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.customer) {
            setCustomerName(data.customer.full_name || "Customer Profile")
          }
        }
      } catch (error) {
        console.error('Error fetching customer name:', error)
        setCustomerName("Customer Profile")
      } finally {
        setLoading(false)
      }
    }

    fetchCustomerName()
  }, [customerId, email])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-light tracking-tight text-foreground mb-2">
            {loading ? "Loading..." : customerName}
          </h1>
          <p className="text-muted-foreground">
            Customer profile from Amperity CDP
            {customerId && <span className="ml-2 text-accent">• ID: {customerId.slice(0, 8)}...</span>}
            {email && <span className="ml-2 text-accent">• {email}</span>}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer Profile & Interactions */}
          <div className="lg:col-span-2 space-y-6">
            <CustomerProfile />
            <WebsiteInteractions />
          </div>

          {/* Right Column - Chat Agent */}
          <div className="lg:col-span-1">
            <ChatAgent />
          </div>
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <DashboardContent />
    </Suspense>
  )
}
