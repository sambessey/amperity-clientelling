# ChatGPT Function Calling - Test Guide

ChatGPT can now access your CRM data through function calls! Here are some test queries to try:

## 🧪 Test Queries

### Customer Lookup
- "Look up customer sarah.johnson@email.com"
- "Find customer information for Mike Chen"
- "What do you know about customer dada@sa.com?"
- "Show me details for customer cust_001"

### Order History
- "What orders does sarah.johnson@email.com have?"
- "Show me order history for customer cust_002"
- "Look up order ord_003"
- "What recent orders do we have?"

### Product Information
- "Tell me about Wireless Headphones"
- "What products do we have in Electronics category?"
- "Is the Smart Watch in stock?"
- "Show me product prod_001 details"

### Complex Queries
- "What orders has dada@sa.com placed and what's their total spent?"
- "Find all Electronics products and tell me which ones are in stock"
- "Look up Sarah Johnson's customer info and recent orders"

## 🎯 What Happens Behind the Scenes

1. **User asks a question** about customers, orders, or products
2. **ChatGPT analyzes** the query and determines it needs data
3. **Function call is made** to your CRM API endpoints
4. **Real data is fetched** from your mock database
5. **ChatGPT processes** the data and responds naturally

## 📊 Available Functions

### `lookup_customer`
- **Purpose**: Find customer by email, ID, or name
- **Endpoint**: `/api/crm/customers`
- **Parameters**: `email`, `customerId`, `name`

### `get_orders` 
- **Purpose**: Get order history or specific order details
- **Endpoint**: `/api/crm/orders`
- **Parameters**: `customerId`, `customerEmail`, `orderId`

### `get_products`
- **Purpose**: Search products or get product details
- **Endpoint**: `/api/crm/products` 
- **Parameters**: `productId`, `name`, `category`

## 🔧 Adding Your Own Endpoints

To add more endpoints that ChatGPT can call:

1. **Create the API endpoint** in `/app/api/crm/`
2. **Add function definition** in `/lib/functions.ts`
3. **Add execution logic** in the `executeFunction` function

Example structure:
```typescript
your_new_function: {
  name: 'your_new_function',
  description: 'What this function does',
  parameters: {
    type: 'object',
    properties: {
      param1: {
        type: 'string',
        description: 'Description of parameter'
      }
    },
    required: ['param1']
  }
}
```

## 🎉 Try It Now!

Go to your chat interface and try asking:
**"What orders does dada@sa.com have?"**

You should see ChatGPT automatically look up the customer data and provide a detailed response about their order history!

## 💡 Pro Tips

- Be specific in your queries for better results
- You can ask follow-up questions about the same data
- ChatGPT remembers the conversation context
- Function calls happen automatically - no special syntax needed