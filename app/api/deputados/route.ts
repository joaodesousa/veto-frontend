import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const allDeputies = []
    let offset = 0
    let hasMore = true

    // Fetch all pages
    while (hasMore) {
      const response = await fetch(`https://legis.veto.pt/api/deputados?status=Efetivo&limit=50&offset=${offset}&includeBiographical=true`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`External API error: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success || !result.data) {
        throw new Error('Invalid API response format')
      }

      allDeputies.push(...result.data)

      // Check if there are more pages
      hasMore = result.pagination && result.data.length === result.pagination.limit &&
                allDeputies.length < result.pagination.total
      offset += 50
    }

    // Return combined data in the same format as the original API
    const combinedData = {
      success: true,
      data: allDeputies,
      pagination: {
        limit: allDeputies.length,
        offset: 0,
        total: allDeputies.length
      }
    }

    return NextResponse.json(combinedData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error('Error proxying deputados API:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch deputies data'
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}