import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import { moderateContent } from '@/lib/openai';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const definitionId = searchParams.get('definitionId');

    if (!definitionId) {
      return NextResponse.json(
        { error: 'ID da definição é obrigatório' },
        { status: 400 }
      );
    }

    await connectDB();

    const comments = await Comment.find({ definition: definitionId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar comentários' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { content, author, definitionId } = await request.json();

    // Validate input
    if (!content || !author || !definitionId) {
      return NextResponse.json(
        { error: 'Conteúdo, autor e ID da definição são obrigatórios' },
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

    await connectDB();

    // Create new comment
    const comment = await Comment.create({
      content,
      author,
      definition: definitionId,
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Erro ao criar comentário' },
      { status: 500 }
    );
  }
} 