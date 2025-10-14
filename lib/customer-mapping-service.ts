/**
 * Customer ID Mapping Loader
 * 
 * Loads customer friendly ID to Amperity ID mappings from a local API endpoint.
 * The API serves mappings from the local customer-mappings.json file or falls back to GitHub.
 * This avoids CORS issues when fetching directly from GitHub in the browser.
 */

interface CustomerMappings {
  version: string
  mappings: Record<string, string>
  metadata: {
    total_customers: number
    last_updated: string
    updated_by: string
    description: string
  }
}

class CustomerMappingService {
  private mappings: Record<string, string> = {}
  private lastLoaded: Date | null = null
  private isLoading = false
  
  // Configuration
  private readonly API_URL = '/api/customer-mappings'
  private readonly CACHE_DURATION_MS = 5 * 60 * 1000 // 5 minutes
  private readonly FALLBACK_MAPPINGS: Record<string, string> = {
    // Fallback mappings in case GitHub is unreachable
    'martinh': '00cf575b-4b03-34c1-acfe-49c6f5cbeb25',
    'sarahj': '05483448-a958-3335-b521-aea5f3a82f3a',
    'lisac': '05219129-6927-3734-a67c-c63c0642d429',
    'miket': '0551df4d-a090-3d6e-b22d-83683d8ba6ff'
  }

  /**
   * Get customer mapping by friendly ID
   */
  async getMapping(friendlyId: string): Promise<string | null> {
    await this.ensureMappingsLoaded()
    return this.mappings[friendlyId] || null
  }

  /**
   * Get all current mappings
   */
  async getAllMappings(): Promise<Record<string, string>> {
    await this.ensureMappingsLoaded()
    return { ...this.mappings }
  }

  /**
   * Check if mappings exist for a friendly ID
   */
  async hasMapping(friendlyId: string): Promise<boolean> {
    await this.ensureMappingsLoaded()
    return friendlyId in this.mappings
  }

  /**
   * Force reload mappings from API
   */
  async reloadMappings(): Promise<void> {
    this.lastLoaded = null
    await this.loadMappingsFromAPI()
  }

  /**
   * Ensure mappings are loaded and fresh
   */
  private async ensureMappingsLoaded(): Promise<void> {
    const now = new Date()
    const needsRefresh = !this.lastLoaded || 
      (now.getTime() - this.lastLoaded.getTime()) > this.CACHE_DURATION_MS

    if (needsRefresh && !this.isLoading) {
      await this.loadMappingsFromAPI()
    }
  }

  /**
   * Load mappings from API with fallback
   */
  private async loadMappingsFromAPI(): Promise<void> {
    if (this.isLoading) return
    
    this.isLoading = true
    
    try {
      console.log('🔄 Loading customer mappings from API...')
      
      // Add cache busting timestamp
      const cacheBustUrl = `${this.API_URL}?t=${Date.now()}`
      
      const response = await fetch(cacheBustUrl, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        // Add timeout
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`API fetch failed: ${response.status} ${response.statusText}`)
      }

      const apiResponse = await response.json()
      
      if (!apiResponse.success || !apiResponse.data?.mappings) {
        throw new Error('Invalid mappings format from API')
      }

      const data = apiResponse.data
      this.mappings = data.mappings
      this.lastLoaded = new Date()

      console.log(`✅ Loaded ${Object.keys(this.mappings).length} customer mappings from API`)
      console.log(`📅 Version: ${data.version}`)
      console.log(`🔗 Source: ${apiResponse.source}`)
      console.log(`👤 Updated by: ${data.metadata?.updated_by}`)

    } catch (error) {
      console.error('❌ Failed to load mappings from API:', error)
      
      // Fall back to local mappings if we don't have any cached
      if (Object.keys(this.mappings).length === 0) {
        console.log('🔄 Using fallback mappings...')
        this.mappings = { ...this.FALLBACK_MAPPINGS }
      } else {
        console.log('📋 Keeping existing cached mappings')
      }
    } finally {
      this.isLoading = false
    }
  }

  /**
   * Get mapping statistics
   */
  async getStats(): Promise<{
    totalMappings: number
    lastLoaded: Date | null
    isStale: boolean
  }> {
    const now = new Date()
    const isStale = !this.lastLoaded || 
      (now.getTime() - this.lastLoaded.getTime()) > this.CACHE_DURATION_MS

    return {
      totalMappings: Object.keys(this.mappings).length,
      lastLoaded: this.lastLoaded,
      isStale
    }
  }
}

// Export singleton instance
export const customerMappingService = new CustomerMappingService()

// Export types
export type { CustomerMappings }