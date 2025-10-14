// Function definitions for ChatGPT to understand what endpoints it can call
export const availableFunctions = {
  lookup_customer: {
    name: 'lookup_customer',
    description: 'Look up customer information by email, customer ID, or name',
    parameters: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Customer email address'
        },
        customerId: {
          type: 'string', 
          description: 'Customer ID'
        },
        name: {
          type: 'string',
          description: 'Customer name (partial match supported)'
        }
      },
      required: [],
      additionalProperties: false
    }
  },
  
  get_orders: {
    name: 'get_orders',
    description: 'Get order history for a customer or look up a specific order',
    parameters: {
      type: 'object',
      properties: {
        customerId: {
          type: 'string',
          description: 'Customer ID to get orders for'
        },
        customerEmail: {
          type: 'string',
          description: 'Customer email to get orders for'
        },
        orderId: {
          type: 'string',
          description: 'Specific order ID to look up'
        }
      },
      required: [],
      additionalProperties: false
    }
  },

  get_products: {
    name: 'get_products',
    description: 'Search for products by name, category, or get product details',
    parameters: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description: 'Specific product ID to look up'
        },
        name: {
          type: 'string',
          description: 'Product name to search for (partial match supported)'
        },
        category: {
          type: 'string',
          description: 'Product category to filter by (Electronics, Accessories, Office)'
        }
      },
      required: [],
      additionalProperties: false
    }
  }
}

// Function to execute the actual API calls
export async function executeFunction(functionName: string, parameters: any) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'
  
  try {
    switch (functionName) {
      case 'lookup_customer': {
        const { email, customerId, name } = parameters
        const params = new URLSearchParams()
        if (email) params.append('email', email)
        if (customerId) params.append('customerId', customerId)
        if (name) params.append('name', name)
        
        const response = await fetch(`${baseUrl}/api/crm/customers?${params}`)
        return await response.json()
      }
      
      case 'get_orders': {
        const { customerId, customerEmail, orderId } = parameters
        const params = new URLSearchParams()
        if (customerId) params.append('customerId', customerId)
        if (customerEmail) params.append('customerEmail', customerEmail)
        if (orderId) params.append('orderId', orderId)
        
        const response = await fetch(`${baseUrl}/api/crm/orders?${params}`)
        return await response.json()
      }
      
      case 'get_products': {
        const { productId, name, category } = parameters
        const params = new URLSearchParams()
        if (productId) params.append('productId', productId)
        if (name) params.append('name', name)
        if (category) params.append('category', category)
        
        const response = await fetch(`${baseUrl}/api/crm/products?${params}`)
        return await response.json()
      }
      
      default:
        throw new Error(`Unknown function: ${functionName}`)
    }
  } catch (error) {
    console.error(`Error executing function ${functionName}:`, error)
    return { error: `Failed to execute ${functionName}` }
  }
}