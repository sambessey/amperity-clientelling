"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HomePage() {
  const [customerId, setCustomerId] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customerId) {
      router.push(`/dashboard?Id=${encodeURIComponent(customerId)}`)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-serif font-light tracking-tight text-foreground mb-3">Clienteling CRM</h1>
          <p className="text-muted-foreground text-lg">Enter a Customer ID to access the customer dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="customerId" className="text-sm font-medium text-foreground">
              Enter a Customer ID
            </label>
            <Input
              id="customerId"
              type="text"
              placeholder="Enter your Amperity Customer ID"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
              className="h-12 text-base font-mono"
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base font-medium">
            Access Dashboard
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Demo: Try using an Amperity Customer ID from your CDP
        </p>
      </div>
    </div>
  )
}
