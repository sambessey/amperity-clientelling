# Customer ID Mapping System

This project now uses a centralized GitHub-based customer ID mapping system to keep customer mappings synchronized across multiple projects.

## How It Works

1. **Central JSON File**: `customer-mappings.json` contains all friendly ID → Amperity ID mappings
2. **Service Class**: `lib/customer-mapping-service.ts` loads mappings from GitHub with caching
3. **Components**: Both `website-interactions.tsx` and `customer-profile.tsx` use the service

## Setup Instructions

### 1. Upload the Mappings to GitHub

1. Commit and push `customer-mappings.json` to your GitHub repository
2. Make sure the repository is public, or use a GitHub token for private repos
3. Update the GitHub URL in `lib/customer-mapping-service.ts`:

```typescript
// Replace with your actual GitHub repository
private static readonly GITHUB_RAW_URL = 'https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO/main/customer-mappings.json'
```

### 2. Using in Other Projects

To use these mappings in another project:

1. Copy `lib/customer-mapping-service.ts` to the new project
2. Update the GitHub URL to point to your repository
3. Use the service in your components:

```typescript
import { customerMappingService } from '@/lib/customer-mapping-service'

// Get a single mapping
const amperityId = await customerMappingService.getMapping('martinh')

// Get all mappings
const allMappings = await customerMappingService.getAllMappings()
```

## Benefits

- ✅ **Single Source of Truth**: One JSON file for all projects
- ✅ **No Deployment Required**: Changes to mappings don't require app redeployment
- ✅ **Automatic Sync**: All projects automatically get updated mappings
- ✅ **Caching**: Service caches mappings for performance (5-minute refresh)
- ✅ **Fallback**: Falls back to direct ID if mapping not found

## Updating Mappings

1. Edit `customer-mappings.json` in this repository
2. Commit and push the changes
3. All projects using the service will automatically pick up the changes within 5 minutes

## Current Mappings

The system includes 47 customer mappings, including:
- `martinh` → Martin Hansen
- `sarahj` → Sarah Johnson
- `miket` → Mike Thompson
- And 44 more...

## Testing

Test the system by visiting:
- `/dashboard?id=martinh` (uses friendly ID)
- `/dashboard?customerId=00cf575b-4b03-34c1-acfe-49c6f5cbeb25` (direct Amperity ID)

Both should load the same customer data.