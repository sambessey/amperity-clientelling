import { NextRequest, NextResponse } from 'next/server'

// Mock product data - in real app, this would come from your database
const products = [
  {
    id: 'prod_001',
    name: 'Wireless Headphones',
    price: 199.99,
    category: 'Electronics',
    inStock: true,
    stockCount: 45,
    description: 'Premium wireless headphones with noise cancellation',
    features: ['Noise cancellation', '30hr battery', 'Bluetooth 5.0'],
    rating: 4.5,
    reviews: 1250
  },
  {
    id: 'prod_002',
    name: 'Phone Case',
    price: 45.99,
    category: 'Accessories',
    inStock: true,
    stockCount: 120,
    description: 'Protective phone case with drop protection',
    features: ['Drop protection', 'Wireless charging compatible', 'Clear design'],
    rating: 4.3,
    reviews: 890
  },
  {
    id: 'prod_003',
    name: 'Smart Watch',
    price: 599.99,
    category: 'Electronics',
    inStock: true,
    stockCount: 23,
    description: 'Advanced fitness tracking smartwatch with GPS',
    features: ['GPS tracking', 'Heart rate monitor', '7-day battery', 'Water resistant'],
    rating: 4.7,
    reviews: 2100
  },
  {
    id: 'prod_004',
    name: 'Laptop Stand',
    price: 89.99,
    category: 'Office',
    inStock: false,
    stockCount: 0,
    description: 'Adjustable aluminum laptop stand for ergonomic working',
    features: ['Adjustable height', 'Aluminum construction', 'Foldable design'],
    rating: 4.4,
    reviews: 650
  }
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')
  const name = searchParams.get('name')
  const category = searchParams.get('category')

  try {
    let result = []

    if (productId) {
      const product = products.find(p => p.id === productId)
      result = product ? [product] : []
    } else if (name) {
      result = products.filter(p => 
        p.name.toLowerCase().includes(name.toLowerCase())
      )
    } else if (category) {
      result = products.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      )
    } else {
      // Return all products if no filter specified
      result = products
    }

    return NextResponse.json({
      success: true,
      products: result,
      total: result.length
    })

  } catch (error) {
    console.error('Products lookup error:', error)
    return NextResponse.json(
      { error: 'Failed to look up products' },
      { status: 500 }
    )
  }
}