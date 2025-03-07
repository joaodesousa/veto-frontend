// app/api/og/route.tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Helper function to calculate font size based on title length
function calculateFontSize(length: number): string {
  if (length > 200) return '24px';
  if (length > 100) return '30px';
  if (length > 70) return '36px';
  if (length > 40) return '42px';
  return '48px';
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Get title from search params or use default
    const title = searchParams.get('title') || 'Veto';
    const subtitle = searchParams.get('subtitle') || 'Acompanhamento Legislativo';
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            position: 'relative',
          }}
        >
          {/* Left side accent bar - Portuguese flag colors */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '12px',
            height: '100%',
            background: 'linear-gradient(to bottom, #DA291C 50%, #046A38 50%)',
            display: 'flex',
          }} />
          
          {/* Main content container */}
          <div style={{
            display: 'flex',
            width: '90%',
            height: '80%',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #f0f4f9 0%, #e2eaf2 100%)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Decorative elements */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'rgba(4, 106, 56, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(218, 41, 28, 0.1)',
                display: 'flex',
              }} />
            </div>
            
            {/* Armillary sphere inspired element (Portuguese symbol) */}
            <div style={{
              position: 'absolute',
              bottom: '30px',
              right: '40px',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              border: '2px solid rgba(4, 106, 56, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                border: '2px solid rgba(218, 41, 28, 0.2)',
                transform: 'rotate(45deg)',
                display: 'flex',
              }} />
            </div>
            
            {/* Left side content */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '60px',
              width: '70%',
              position: 'relative',
            }}>
              {/* Building icon with Portuguese-inspired styling */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '30px',
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '12px',
                  background: '#1C3F94',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '20px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}>
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 22V2a1 1 0 0 1 1-1h9.97a1 1 0 0 1 .97.97V22" />
                    <path d="M18 10h3a1 1 0 0 1 1 1v11" />
                    <path d="M2 22h20" />
                    <path d="M9 2v4" />
                    <path d="M9 10v4" />
                    <path d="M9 18v4" />
                    <path d="M14 2v4" />
                    <path d="M14 10v4" />
                    <path d="M14 18v4" />
                  </svg>
                </div>
                
                {/* Title and subtitle */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  maxWidth: '700px',
                }}>
                  <h1 style={{
                    fontSize: calculateFontSize(title.length),
                    fontWeight: 'bold',
                    color: '#1C3F94',
                    margin: 0,
                    lineHeight: 1.2,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {title}
                  </h1>
                  <p style={{
                    fontSize: '22px',
                    color: '#555555',
                    margin: 0,
                    marginTop: '8px',
                    maxWidth: '100%',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: '1',
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {subtitle}
                  </p>
                </div>
              </div>
              
              {/* Tagline with legislative theme */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '20px',
              }}>
                <div style={{
                  width: '40px',
                  height: '2px',
                  background: 'rgba(28, 63, 148, 0.3)',
                  marginRight: '16px',
                  display: 'flex',
                }} />
                <p style={{
                  fontSize: '16px',
                  color: '#666666',
                  margin: 0,
                }}>
                  Acompanhamento legislativo português
                </p>
              </div>
            </div>
            
            {/* Right side decorative element - stylized parliament columns */}
            <div style={{
              width: '30%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'space-around',
              }}>
                {/* Stylized columns representing parliament */}
                <div style={{ width: '20px', height: '100%', background: 'rgba(28, 63, 148, 0.1)', borderRadius: '4px 4px 0 0', display: 'flex' }} />
                <div style={{ width: '20px', height: '100%', background: 'rgba(28, 63, 148, 0.05)', borderRadius: '4px 4px 0 0', display: 'flex' }} />
                <div style={{ width: '20px', height: '100%', background: 'rgba(28, 63, 148, 0.1)', borderRadius: '4px 4px 0 0', display: 'flex' }} />
                <div style={{ width: '20px', height: '100%', background: 'rgba(28, 63, 148, 0.05)', borderRadius: '4px 4px 0 0', display: 'flex' }} />
                <div style={{ width: '20px', height: '100%', background: 'rgba(28, 63, 148, 0.1)', borderRadius: '4px 4px 0 0', display: 'flex' }} />
              </div>
            </div>
          </div>
          
          {/* Bottom accent - Portuguese flag colors */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            display: 'flex',
            alignItems: 'center',
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#DA291C',
              marginRight: '8px',
              display: 'flex',
            }} />
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#046A38',
              display: 'flex',
            }} />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}