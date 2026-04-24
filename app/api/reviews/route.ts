import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_PLACE_ID;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!placeId || !apiKey) {
    return NextResponse.json([]);
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`;
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    const data = await response.json();

    if (data.result && data.result.reviews && data.result.reviews.length > 0) {
      return NextResponse.json(data.result.reviews);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return NextResponse.json([]);
  }
}
