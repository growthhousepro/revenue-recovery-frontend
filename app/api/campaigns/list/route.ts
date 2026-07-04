import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
    }

    const backendUrl = `http://localhost:8000/api/campaigns/`;

    const res = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ detail: `Backend error: ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('API Route - Catch error:', error);
    return NextResponse.json({ detail: `Server error: ${error}` }, { status: 500 });
  }
}