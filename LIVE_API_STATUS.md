# 🔗 Live Amperity API Integration

Your dashboard now calls the **real Amperity API**! Here's what's configured:

## 🎯 API Configuration

**Endpoint**: `https://acme.amperity.com/prof/profiles/apc-5VqU3c41/00cf575b-4b03-34c1-acfe-49c6f5cbeb25`

**Headers**:
- `Authorization: Bearer [your-token]`
- `amperity-tenant: acme2`
- `Content-Type: application/json`

## 🔄 How It Works

1. **User visits dashboard** → Component loads
2. **API call made** → `GET /api/crm/customers?email=sambessey@gmail.com`
3. **Server calls Amperity** → Uses your exact curl structure
4. **Live data returned** → Real Tina Rhodes profile from Amperity
5. **UI updates** → Shows live CDP data

## 🚀 Features

### ✅ Live API Integration
- Real HTTP calls to `acme.amperity.com`
- Your actual bearer token
- Proper tenant headers (`amperity-tenant: acme2`)

### ✅ Fallback Protection
- If API fails → Uses demo data
- Graceful error handling
- Clear indicators of data source

### ✅ Debug Information
- Console logs for API calls
- Response debugging
- Source indicators in UI

## 🧪 Testing

### Check Browser Network Tab:
1. Open DevTools → Network
2. Reload dashboard
3. Look for call to `/api/crm/customers`
4. Check if it shows "amperity_live_api" or "fallback_demo_data"

### Check Server Logs:
- `Calling Amperity API: https://acme.amperity.com/prof/profiles/...`
- `Amperity response received: [JSON data]`

## 🎯 What You'll See

### If API Works:
- Badge shows "From Amperity"
- Debug shows `"source": "amperity_live_api"`
- Real-time Tina Rhodes data

### If API Fails:
- Badge shows "From Amperity (Fallback)"
- Debug shows `"source": "fallback_demo_data"`
- Same data but from local fallback

## 🔧 Production Ready

To make this fully production-ready:

1. **Dynamic Profile Lookup**: Map emails to profile IDs
2. **Multiple Customers**: Support lookups beyond Tina Rhodes  
3. **Caching**: Add response caching for performance
4. **Error Monitoring**: Add proper error tracking

Your dashboard is now **live-connected** to Amperity! 🎉