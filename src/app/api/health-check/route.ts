import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { logger } from '@/utils/logger';

export async function GET() {
  try {
    await connectDB();
    // If MongoDB connection is successful, return status ok
    return NextResponse.json({ status: 'ok', mongodb: 'connected' });
  } catch (error) {
    logger.error('Health check failed:', error);
    return NextResponse.json(
      { error: 'Health check failed', mongodb: 'disconnected' },
      { status: 500 }
    );
  }
}

