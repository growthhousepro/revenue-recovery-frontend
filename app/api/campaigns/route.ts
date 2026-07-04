import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const campaignId = request.nextUrl.searchParams.get('id');
    const authHeader = request.headers.get('authorization');
    
    console.log('API Route - Campaign ID:', campaignId);
    console.log('API Route - Auth Header:', authHeader);
    
    if (!authHeader) {
      return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
    }

    if (!campaignId) {
      return NextResponse.json({ detail: 'Campaign ID required' }, { status: 400 });
    }

    const backendUrl = `http://localhost:8000/api/campaigns/${campaignId}`;
    console.log('API Route - Calling backend:', backendUrl);

    const res = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    console.log('API Route - Backend response status:', res.status);

    if (!res.ok) {
      const errText = await res.text();
      console.log('API Route - Backend error:', errText);
      return NextResponse.json({ detail: `Backend error: ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    console.log('API Route - Got data:', data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('API Route - Catch error:', error);
    return NextResponse.json({ detail: `Server error: ${error}` }, { status: 500 });
  }
}