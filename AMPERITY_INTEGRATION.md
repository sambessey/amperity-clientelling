# Amperity CDP Integration Guide

This guide shows you how to integrate ChatGPT with your Amperity Customer Data Platform.

## 🔧 Amperity Setup

### 1. Get Your Amperity API Credentials

1. Log into your Amperity tenant
2. Go to **Settings** → **API Keys** 
3. Create a new API key with profile read permissions
4. Note your tenant URL (e.g., `https://your-company.amperity.com`)

### 2. Update Environment Variables

```bash
# Amperity CDP Configuration
AMPERITY_API_BASE_URL=https://your-tenant.amperity.com/api
AMPERITY_API_KEY=your_amperity_api_key_here
AMPERITY_TENANT_ID=your_tenant_id
```

### 3. Amperity Field Mapping

The integration automatically maps Amperity's fields to standard customer data:

| Amperity Field | Mapped To | Description |
|---|---|---|
| `LifeTimeValue` | `totalSpent` | Customer's total lifetime value |
| `NumberofInteractions` | `numberOfInteractions` | Total customer touchpoints |
| `given_name`, `surname` | `name` | Customer's full name |
| `amperity_id` | `id` | Unique customer identifier |
| `email` | `email` | Primary email address |
| `customer_segment` | `customerSegment` | Amperity's customer segmentation |
| `churn_risk` | `churnRisk` | Customer churn probability |
| `engagement_score` | `engagementScore` | Customer engagement level |

## 🎯 Amperity-Specific Features

### Rich Customer Insights
ChatGPT can now provide insights like:
- **Lifetime Value Analysis**: "This customer has a high LTV of $2,450"
- **Engagement Patterns**: "Based on 47 interactions, they're highly engaged"
- **Churn Risk**: "Customer shows low churn risk with high engagement"
- **Segmentation**: "Premium customer in the 'High Value' segment"

### Advanced Queries You Can Ask
- "What's the lifetime value of customer john@example.com?"
- "Show me high-value customers with low engagement"
- "Which customers are at risk of churning?"
- "Tell me about the engagement patterns for sarah@company.com"

## 🧪 Testing with Amperity

### 1. Test Amperity API Directly
```bash
curl -H "Authorization: Bearer YOUR_AMPERITY_TOKEN" \
     -H "X-Amperity-Tenant: YOUR_TENANT_ID" \
     "https://your-tenant.amperity.com/api/v1/profiles?email=test@example.com"
```

### 2. Test Through Your Integration
```bash
curl "http://localhost:3002/api/crm/customers?email=test@example.com"
```

### 3. ChatGPT Test Queries
- "Look up customer with email test@example.com"
- "What's the lifetime value of this customer?"
- "Show me their interaction history"

## 📊 Amperity Data Structure

Expected Amperity response format:
```json
{
  "amperity_id": "amp_12345",
  "email": "customer@example.com",
  "given_name": "John",
  "surname": "Doe",
  "LifeTimeValue": 2450.50,
  "NumberofInteractions": 47,
  "customer_segment": "High Value",
  "churn_risk": 0.15,
  "engagement_score": 8.7,
  "last_purchase_date": "2024-09-15",
  "preferred_channel": "email",
  "city": "San Francisco",
  "state": "CA"
}
```

## 🔄 Customization

### Adding More Amperity Fields

To include additional Amperity fields, update the `transformAmperityCustomerData` function:

```typescript
// Add your custom Amperity fields
customField: customerData.your_custom_field,
predictiveScore: customerData.predictive_score,
preferredProducts: customerData.preferred_products
```

### Different Amperity Endpoints

Amperity offers various endpoints:
- `/v1/profiles` - Customer profiles
- `/v1/segments` - Customer segments  
- `/v1/campaigns` - Campaign data
- `/v1/predictions` - Predictive models

## 🎭 Enhanced ChatGPT Capabilities

With Amperity integration, ChatGPT can now:

1. **Analyze Customer Value**: "This customer has a LifeTimeValue of $2,450 with 47 interactions"
2. **Predict Behavior**: "Based on engagement score of 8.7, they're likely to convert"
3. **Segment Insights**: "Customer belongs to 'High Value' segment"
4. **Risk Assessment**: "Low churn risk (15%) with high engagement"
5. **Channel Preferences**: "Prefers email communication based on interaction data"

## 🚨 Amperity-Specific Considerations

### API Limits
- Amperity APIs have rate limits (typically 100 requests/minute)
- Profile queries can take 5-15 seconds for complex segments
- Consider caching for frequently accessed customers

### Data Freshness
- Amperity data is typically updated daily
- Real-time data might not be immediately available
- Consider mentioning data freshness in ChatGPT responses

### Privacy & Compliance
- Amperity handles PII with strict privacy controls
- Ensure your API key has appropriate permissions
- Consider data masking for sensitive fields

## 🎉 What You Get

Your ChatGPT assistant now has access to:
- ✅ Complete 360° customer profiles from Amperity
- ✅ Lifetime value and interaction history
- ✅ Customer segmentation and behavioral insights  
- ✅ Churn risk and engagement scoring
- ✅ Personalized recommendations based on CDP data

Ask ChatGPT: **"Look up the customer profile for [email] and tell me their lifetime value and engagement level"** to see the magic! 🚀