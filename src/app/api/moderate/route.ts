import { NextResponse } from 'next/server';
import { moderateContent } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'O conteúdo é obrigatório' },
        { status: 400 }
      );
    }

    const moderationResult = await moderateContent(content);

    return NextResponse.json({
      isApproved: moderationResult.isApproved,
      reason: moderationResult.reason,
      content: content,
    });
  } catch (error) {
    console.error('Error testing moderation:', error);
    return NextResponse.json(
      { error: 'Erro ao testar moderação' },
      { status: 500 }
    );
  }
} 