import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get('session');

    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    await connectDB();

    const user = await User.findById(session.value);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      { user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in session route:', error);
    return NextResponse.json(
      { message: 'Erro ao verificar sessão' },
      { status: 500 }
    );
  }
} 