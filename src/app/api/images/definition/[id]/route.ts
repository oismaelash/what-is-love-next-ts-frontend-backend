import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import GeneratedImage from '@/models/GeneratedImage';

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string[] }> },
) {
    try {
        const id = (await params).id;
        const cookieStore = await cookies();
        const session = cookieStore.get('session');

        if (!session) {
            return NextResponse.json(
                { error: 'Usuário não autenticado' },
                { status: 401 }
            );
        }

        await connectDB();

        const user = await User.findById(session.value);

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 401 }
            );
        }

        const images = await GeneratedImage.find({
            definition: id,
            status: 'completed'
        }).sort({ createdAt: -1 });

        return NextResponse.json({
            images: images.map(img => ({
                id: img._id,
                imageUrl: img.imageUrl,
                createdAt: img.createdAt,
                isFree: img.isFree
            }))
        });
    } catch (error) {
        console.error('Erro ao buscar imagens da definição:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar imagens da definição' },
            { status: 500 }
        );
    }
} 