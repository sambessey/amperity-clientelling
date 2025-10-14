# Real CRM Integration Guide

This guide shows you how to replace the mock data with calls to your actual CRM API.

## 🔧 Quick Setup

### 1. Update Environment Variables

Add your CRM API details to `.env.local`:

```bash
# Your CRM API Configuration
CRM_API_BASE_URL=https://your-crm-api.com/api
CRM_API_KEY=your_crm_api_key_here
```

### 2. Customize the Data Transformation

The `transformCustomerData` function maps your CRM's response format to what ChatGPT expects. Update it based on your CRM's API structure.

## 🏢 Popular CRM Integrations

### Salesforce
```bash
CRM_API_BASE_URL=https://your-instance.salesforce.com/services/data/v58.0
CRM_API_KEY=your_salesforce_access_token
```

Example transformation for Salesforce:
```typescript
function transformCustomerData(crmResponse: any) {
  const records = crmResponse.records || []
  if (records.length === 0) return null
  
  const customer = records[0]
  return {
    id: customer.Id,
    email: customer.Email,
    name: customer.Name,
    phone: customer.Phone,
    status: customer.IsActive ? 'active' : 'inactive',
    tier: customer.Customer_Tier__c || 'standard',
    joinDate: customer.CreatedDate,
    totalSpent: customer.Total_Purchase_Amount__c || 0,
    lastLogin: customer.LastLoginDate
  }
}
```

### HubSpot
```bash
CRM_API_BASE_URL=https://api.hubapi.com/crm/v3
CRM_API_KEY=your_hubspot_private_app_token
```

Example transformation for HubSpot:
```typescript
function transformCustomerData(crmResponse: any) {
  const results = crmResponse.results || []
  if (results.length === 0) return null
  
  const customer = results[0]
  const props = customer.properties
  
  return {
    id: customer.id,
    email: props.email,
    name: `${props.firstname || ''} ${props.lastname || ''}`.trim(),
    phone: props.phone,
    status: props.lifecyclestage === 'customer' ? 'active' : 'inactive',
    tier: props.customer_tier || 'standard',
    joinDate: props.createdate,
    totalSpent: parseFloat(props.total_revenue || '0'),
    lastLogin: props.last_activity_date
  }
}
```

### Pipedrive
```bash
CRM_API_BASE_URL=https://api.pipedrive.com/v1
CRM_API_KEY=your_pipedrive_api_token
```

### Custom REST API
```bash
CRM_API_BASE_URL=https://your-company.com/api/v1
CRM_API_KEY=your_api_key
```

## 🔄 API Patterns

### Different Authentication Methods

**Bearer Token:**
```typescript
headers: {
  'Authorization': `Bearer ${CRM_CONFIG.apiKey}`,
  'Content-Type': 'application/json'
}
```

**API Key in Header:**
```typescript
headers: {
  'X-API-Key': CRM_CONFIG.apiKey,
  'Content-Type': 'application/json'
}
```

**API Key in Query:**
```typescript
const url = `${CRM_CONFIG.baseUrl}/customers?api_key=${CRM_CONFIG.apiKey}&email=${email}`
```

### Different Response Formats

**Direct Object:**
```typescript
// Response: { id: 1, name: "John", email: "john@example.com" }
function transformCustomerData(crmResponse: any) {
  return {
    id: crmResponse.id,
    email: crmResponse.email,
    name: crmResponse.name,
    // ... other fields
  }
}
```

**Wrapped in Data:**
```typescript
// Response: { data: { id: 1, name: "John" }, status: "success" }
function transformCustomerData(crmResponse: any) {
  const customer = crmResponse.data
  return {
    id: customer.id,
    email: customer.email,
    name: customer.name,
    // ... other fields
  }
}
```

**Array Response:**
```typescript
// Response: [{ id: 1, name: "John" }]
function transformCustomerData(crmResponse: any) {
  if (!Array.isArray(crmResponse) || crmResponse.length === 0) return null
  const customer = crmResponse[0]
  return {
    id: customer.id,
    email: customer.email,
    name: customer.name,
    // ... other fields
  }
}
```

## 🛠 Updating Orders and Products

Apply the same pattern to `/app/api/crm/orders/route.ts` and `/app/api/crm/products/route.ts`:

1. Replace mock data with real API calls
2. Add proper authentication headers
3. Transform the response data format
4. Handle errors appropriately

## 🧪 Testing Your Integration

### 1. Test API Endpoints Directly
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "https://your-crm-api.com/api/customers?email=test@example.com"
```

### 2. Test Through Your Proxy
```bash
curl "http://localhost:3002/api/crm/customers?email=test@example.com"
```

### 3. Test with ChatGPT
Ask: "Look up customer test@example.com"

## 🔒 Security Best Practices

1. **Never expose your CRM API key** - keep it in environment variables
2. **Use HTTPS only** for your CRM endpoints
3. **Implement rate limiting** if your CRM has limits
4. **Add request timeout** to prevent hanging requests
5. **Log errors** but don't expose sensitive data

## 🚨 Error Handling

The updated code includes:
- API timeout protection
- Proper HTTP status code forwarding
- Detailed error logging
- Graceful fallbacks

## 📝 Common Issues & Solutions

**Issue**: "CRM API timeout"
**Solution**: Increase timeout or optimize your CRM query

**Issue**: "Authentication failed"
**Solution**: Check your API key and authentication method

**Issue**: "Customer not found"
**Solution**: Verify the search parameters match your CRM's expected format

**Issue**: "Data transformation error"
**Solution**: Check your CRM's response format and update the transform function

## 🎯 Next Steps

1. Update your environment variables with real CRM details
2. Modify the `transformCustomerData` function for your CRM's format
3. Test with a few known customers
4. Apply the same pattern to orders and products endpoints
5. Add any CRM-specific features (custom fields, etc.)

Your ChatGPT assistant will now have access to your real customer data! 🚀