import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GeneratedImage from '@/models/GeneratedImage';
import { logger } from '@/utils/logger';

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string[] }> },
) {
    try {
        const id = (await params).id;

        await connectDB();

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
        logger.error('Erro ao buscar imagens da definição:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar imagens da definição' },
            { status: 500 }
        );
    }
} 