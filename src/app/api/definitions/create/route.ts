import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Definition from '@/models/Definition';
import { moderateContent } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { content, author } = await request.json();

    // Validate input
    if (!content || !author) {
      return NextResponse.json(
        { error: 'Conteúdo e autor são obrigatórios' },
        { status: 400 }
      );
    }

    if (content.length < 10 || content.length > 500) {
      return NextResponse.json(
        { error: 'A definição deve ter entre 10 e 500 caracteres' },
        { status: 400 }
      );
    }

    // Moderate content using OpenAI
    const moderationResult = await moderateContent(content);
    if (!moderationResult.isApproved) {
      return NextResponse.json(
        { error: moderationResult.reason || 'Conteúdo não aprovado' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Create new definition
    const definition = await Definition.create({
      content,
      author,
      likes: 0,
    });

    return NextResponse.json(definition, { status: 201 });
  } catch (error) {
    console.error('Error creating definition:', error);
    return NextResponse.json(
      { error: 'Erro ao criar definição' },
      { status: 500 }
    );
  }
} 