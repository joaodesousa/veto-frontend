import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // Get title from search params or use default
    const title = searchParams.get("title") || "VETO"
    const subtitle = searchParams.get("subtitle") || "Transparência no processo legislativo português"


    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
          fontFamily: 'Gill Sans, Mona Sans',
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Portuguese flag-inspired elements - modern interpretation */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "12px",
            height: "100%",
            background: "linear-gradient(to bottom, #DA291C 50%, #046A38 50%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "12px",
            height: "100%",
            background: "linear-gradient(to bottom, #046A38 50%, #DA291C 50%)",
          }}
        />

        {/* Background elements - fluid shapes */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(4, 106, 56, 0.05) 0%, rgba(4, 106, 56, 0) 70%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "-15%",
            left: "15%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(218, 41, 28, 0.05) 0%, rgba(218, 41, 28, 0) 70%)",
          }}
        />

        {/* Subtle grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "85%",
            maxWidth: "1000px",
            zIndex: 10,
          }}
        >
          {/* Logo and title section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            {/* Logo with Portuguese colors */}
            <div
              style={{
                position: "relative",
                width: "80px",
                height: "80px",
                borderRadius: "20px",
                background: "#1E293B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "30px",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                overflow: "hidden",
              }}
            >
              {/* Portuguese color accents on logo */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "6px",
                  height: "100%",
                  background: "#DA291C",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  width: "6px",
                  height: "100%",
                  background: "#046A38",
                }}
              />
              <svg
                width="42"
                height="42"
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h1
                style={{
                  fontSize: "56px",
                  fontWeight: "bold",
                  color: "#1E293B",
                  margin: 0,
                  lineHeight: 1.1,
                  fontFamily: 'Gill Sans, Mona Sans',
                }}
              >
                {title}
              </h1>
              <p
                style={{
                  fontSize: "26px",
                  color: "#64748B",
                  margin: 0,
                  marginTop: "10px",
                }}
              >
                {subtitle}
              </p>
            </div>
          </div>

          {/* Decorative element inspired by Portuguese design */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                height: "3px",
                width: "60px",
                background: "linear-gradient(to right, #DA291C, #046A38)",
                marginRight: "20px",
                borderRadius: "3px",
              }}
            />
            <p
              style={{
                fontSize: "22px",
                color: "#475569",
                margin: 0,
              }}
            >
              Transparência no processo legislativo português
            </p>
          </div>
        </div>

        {/* Decorative elements - Portuguese-inspired pattern (simplified) */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: "#DA291C",
            }}
          />
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: "#046A38",
            }}
          />
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: "#1E293B",
            }}
          />
        </div>

        {/* Subtle armillary sphere inspired element (Portuguese symbol) */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "60px",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            border: "1px solid rgba(4, 106, 56, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              border: "1px solid rgba(218, 41, 28, 0.2)",
              transform: "rotate(45deg)",
            }}
          />
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e) {
    console.error(e)
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}

