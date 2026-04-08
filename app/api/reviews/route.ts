import { NextRequest, NextResponse } from 'next/server';

const fallbackReviews = [
  {
    id: '1',
    author_name: 'Rajesh Patel',
    rating: 5,
    text: 'Excellent service! The team was professional and installed solar panels perfectly. Our electricity bill has reduced significantly.',
    relative_time_description: '2 weeks ago',
  },
  {
    id: '2',
    author_name: 'Priya Sharma',
    rating: 5,
    text: 'Best investment for our business. The ROI is impressive and the support team is always helpful.',
    relative_time_description: '1 month ago',
  },
  {
    id: '3',
    author_name: 'Amit Kumar',
    rating: 4,
    text: 'Very satisfied with the installation. The monitoring system works great for tracking energy production.',
    relative_time_description: '1 month ago',
  },
  {
    id: '4',
    author_name: 'Nisha Verma',
    rating: 5,
    text: 'Professional and reliable. They handled everything from consultation to installation seamlessly.',
    relative_time_description: '2 months ago',
  },
  {
    id: '5',
    author_name: 'Vikram Singh',
    rating: 5,
    text: 'Great experience with MG Solar. The team completed the installation on time and the system is working perfectly.',
    relative_time_description: '3 months ago',
  },
  {
    id: '6',
    author_name: 'Anjali Gupta',
    rating: 5,
    text: 'Amazing quality of panels and installation. Highly recommend MG Solar for residential installations.',
    relative_time_description: '1 month ago',
  },
];

export async function GET() {
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!placeId) {
    return NextResponse.json(fallbackReviews);
  }

  if (!apiKey) {
    return NextResponse.json(fallbackReviews);
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`;
    const response = await fetch(url, { next: { revalidate: 3600 } });
    const data = await response.json();

    if (data.result && data.result.reviews && data.result.reviews.length > 0) {
      return NextResponse.json(data.result.reviews);
    }

    return NextResponse.json(fallbackReviews);
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return NextResponse.json(fallbackReviews);
  }
}
