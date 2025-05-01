import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    
    console.log('Session cookie:', session);

    if (!session) {
      console.log('No session found');
      return NextResponse.json({ user: null }, { status: 200 });
    }

    await connectDB();

    const user = await User.findById(session.value);
    console.log('User found:', user ? user._id : null);

    if (!user) {
      console.log('No user found for session');
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Remove password from response
    // eslint-disable-next-line
    const { password: _password, ...userWithoutPassword } = user.toObject();

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