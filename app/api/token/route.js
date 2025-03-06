// app/api/token/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const API_BASE_URL = process.env.API_BASE_URL || 'https://legis.veto.pt';
  
    const response = await fetch(`${API_BASE_URL}/api/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Use environment variables that are defined only on the server
      body: JSON.stringify({
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD,
      }),
    });
  
    if (!response.ok) {
      console.error(`Token request failed: ${response.status} - ${response.statusText}`);
      return NextResponse.json(
        { error: 'Failed to get access token' }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({ access: data.access }, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in token API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}