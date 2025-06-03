import { NextRequest, NextResponse } from 'next/server'

// Cache warming endpoint - can be called by cron job every 7 days
export async function POST(request: NextRequest) {
  try {
    console.log('Starting deputy image cache warming...')
    
    // Fetch all deputies data
    const deputiesResponse = await fetch('https://legis.veto.pt/api/deputados/efetivos?limit=230')
    
    if (!deputiesResponse.ok) {
      throw new Error(`Failed to fetch deputies: ${deputiesResponse.status}`)
    }
    
    const result = await deputiesResponse.json()
    
    if (!result.success || !result.data) {
      throw new Error('Invalid deputies API response')
    }
    
    const deputies = result.data
    let successCount = 0
    let errorCount = 0
    
    console.log(`Found ${deputies.length} deputies to cache images for`)
    
    // Process images in batches of 10 to avoid overwhelming the external API
    const batchSize = 10
    for (let i = 0; i < deputies.length; i += batchSize) {
      const batch = deputies.slice(i, i + batchSize)
      
      await Promise.allSettled(
        batch.map(async (deputy: any) => {
          try {
            const photoId = deputy.DepCadId
            if (!photoId) return
            
            // Pre-fetch the image through our own API to cache it
            const imageResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/deputy-image/${photoId}`,
              {
                method: 'GET',
                headers: { 'Cache-Control': 'no-cache' } // Force fresh fetch
              }
            )
            
            if (imageResponse.ok) {
              successCount++
              console.log(`✓ Cached image for deputy ${deputy.DepNomeParlamentar} (ID: ${photoId})`)
            } else {
              errorCount++
              console.log(`✗ Failed to cache image for deputy ${deputy.DepNomeParlamentar} (ID: ${photoId})`)
            }
          } catch (error) {
            errorCount++
            console.error(`Error caching image for deputy ${deputy.DepNomeParlamentar}:`, error)
          }
        })
      )
      
      // Small delay between batches to be respectful to the external API
      if (i + batchSize < deputies.length) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
    
    console.log(`Cache warming completed: ${successCount} success, ${errorCount} errors`)
    
    return NextResponse.json({
      success: true,
      message: 'Deputy image cache warming completed',
      stats: {
        total: deputies.length,
        cached: successCount,
        errors: errorCount
      }
    })
    
  } catch (error) {
    console.error('Error during cache warming:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

// Allow GET requests too for manual testing
export async function GET(request: NextRequest) {
  return POST(request)
} 