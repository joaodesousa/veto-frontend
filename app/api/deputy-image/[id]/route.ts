import { NextRequest, NextResponse } from 'next/server'

const CACHE_DURATION = 60 * 60 * 24 * 7 // 7 days in seconds

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Fetch image from Portuguese Parliament
    const imageResponse = await fetch(
      `https://app.parlamento.pt/webutils/getimage.aspx?id=${id}&type=deputado`,
      {
        next: { revalidate: CACHE_DURATION } // Cache for 7 days
      }
    )
    
    if (!imageResponse.ok) {
      return new NextResponse('Image not found', { status: 404 })
    }
    
    const imageBuffer = await imageResponse.arrayBuffer()
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': imageResponse.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': `public, max-age=${CACHE_DURATION}, immutable`,
        'CDN-Cache-Control': `public, max-age=${CACHE_DURATION}`,
      },
    })
  } catch (error) {
    console.error('Error fetching deputy image:', error)
    return new NextResponse('Error fetching image', { status: 500 })
  }
} 