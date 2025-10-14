import { NextRequest, NextResponse } from 'next/server'

// Mock order data - in real app, this would come from your database
const orders = [
  {
    id: 'ord_001',
    customerId: 'cust_001',
    customerEmail: 'sarah.johnson@email.com',
    date: '2024-10-01',
    status: 'delivered',
    total: 245.99,
    items: [
      { name: 'Wireless Headphones', quantity: 1, price: 199.99 },
      { name: 'Phone Case', quantity: 1, price: 45.99 }
    ],
    shipping: {
      address: '123 Main St, San Francisco, CA 94105',
      method: 'express'
    }
  },
  {
    id: 'ord_002',
    customerId: 'cust_001',
    customerEmail: 'sarah.johnson@email.com',
    date: '2024-09-15',
    status: 'delivered',
    total: 89.50,
    items: [
      { name: 'Screen Protector', quantity: 2, price: 44.75 }
    ],
    shipping: {
      address: '123 Main St, San Francisco, CA 94105',
      method: 'standard'
    }
  },
  {
    id: 'ord_003',
    customerId: 'cust_002',
    customerEmail: 'mike.chen@email.com',
    date: '2024-10-03',
    status: 'processing',
    total: 156.00,
    items: [
      { name: 'Laptop Stand', quantity: 1, price: 89.99 },
      { name: 'USB Cable', quantity: 2, price: 33.00 }
    ],
    shipping: {
      address: '456 Oak Ave, Portland, OR 97201',
      method: 'standard'
    }
  },
  {
    id: 'ord_004',
    customerId: 'cust_003',
    customerEmail: 'dada@sa.com',
    date: '2024-09-28',
    status: 'shipped',
    total: 599.99,
    items: [
      { name: 'Smart Watch', quantity: 1, price: 599.99 }
    ],
    shipping: {
      address: '789 Pine St, Seattle, WA 98101',
      method: 'express'
    }
  }
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const customerId = searchParams.get('customerId')
  const customerEmail = searchParams.get('customerEmail')
  const orderId = searchParams.get('orderId')

  try {
    let result = []

    if (orderId) {
      const order = orders.find(o => o.id === orderId)
      result = order ? [order] : []
    } else if (customerId) {
      result = orders.filter(o => o.customerId === customerId)
    } else if (customerEmail) {
      result = orders.filter(o => 
        o.customerEmail.toLowerCase() === customerEmail.toLowerCase()
      )
    } else {
      // Return recent orders if no filter specified
      result = orders.slice(0, 5)
    }

    return NextResponse.json({
      success: true,
      orders: result,
      total: result.length
    })

  } catch (error) {
    console.error('Orders lookup error:', error)
    return NextResponse.json(
      { error: 'Failed to look up orders' },
      { status: 500 }
    )
  }
}