import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const correlationID = searchParams.get('correlationID');

    if (!correlationID) {
      return NextResponse.json(
        { error: 'Correlation ID is required' },
        { status: 400 }
      );
    }

    console.log('Checking PIX status for correlationID:', correlationID);

    const response = await fetch(
      `https://api.openpix.com.br/api/v1/charge/${correlationID}`,
      {
        headers: {
          'Authorization': process.env.WOOVI_API_KEY!,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to check payment status');
    }

    const data = await response.json();
    console.log('PIX status response:', data);
    
    const isPaid = data.charge.status === 'COMPLETED';
    console.log('Is paid?', isPaid);
    
    return NextResponse.json({
      paid: isPaid,
    });
  } catch (error) {
    console.error('Error checking PIX status:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
} 