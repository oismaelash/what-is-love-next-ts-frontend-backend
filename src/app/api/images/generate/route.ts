import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import GeneratedImage from '@/models/GeneratedImage';
import Definition from '@/models/Definition';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
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

    const { definitionId, isFree } = await request.json();

    // Busca a definição para pegar o conteúdo
    const definition = await Definition.findById(definitionId);
    
    if (!definition) {
      return NextResponse.json(
        { error: 'Definição não encontrada' },
        { status: 404 }
      );
    }

    // Verifica se é uma geração gratuita
    if (isFree) {
      const freeImageCount = await GeneratedImage.countDocuments({
        user: user._id,
        isFree: true
      });

      if (freeImageCount > 0) {
        return NextResponse.json(
          { error: 'Você já usou sua geração gratuita' },
          { status: 400 }
        );
      }
    }

    // Cria registro da imagem
    const imageRecord = await GeneratedImage.create({
      definition: definitionId,
      user: user._id,
      isFree,
      status: 'pending'
    });

    try {
      // Gera a imagem usando OpenAI
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Crie uma imagem abstrata que represente o amor, baseada nesta definição: "${definition.content}"`,
        n: 1,
        size: "1024x1024",
      });

      if (!response.data?.[0]?.url) {
        throw new Error('URL da imagem não retornada');
      }

      const imageUrl = response.data[0].url;

      // Atualiza o registro com a URL da imagem
      await GeneratedImage.findByIdAndUpdate(imageRecord._id, {
        imageUrl,
        status: 'completed'
      });

      return NextResponse.json({
        imageUrl,
        imageId: imageRecord._id
      });
    } catch (error) {
      // Em caso de erro na geração, atualiza o status
      await GeneratedImage.findByIdAndUpdate(imageRecord._id, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Erro na geração da imagem'
      });

      throw error;
    }
  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar imagem' },
      { status: 500 }
    );
  }
} 