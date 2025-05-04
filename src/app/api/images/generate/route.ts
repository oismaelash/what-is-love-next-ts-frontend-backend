import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GeneratedImage from '@/models/GeneratedImage';
import Definition from '@/models/Definition';
import { OpenAI } from 'openai';
import { uploadToS3 } from '@/lib/s3';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    await connectDB();

    const { definitionId, isFree } = await request.json();

    // Busca a definição para pegar o conteúdo
    const definition = await Definition.findById(definitionId);
    
    if (!definition) {
      return NextResponse.json(
        { error: 'Definição não encontrada' },
        { status: 404 }
      );
    }

    // Cria registro da imagem
    const imageRecord = await GeneratedImage.create({
      definition: definitionId,
      user: null, // Allow null for non-authenticated users
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

      // Atualiza o registro com a URL temporária da imagem
      await GeneratedImage.findByIdAndUpdate(imageRecord._id, {
        imageUrl,
        status: 'processing'
      });

      // Inicia o processo de upload para o S3 de forma assíncrona
      const s3Key = `images/${imageRecord._id}.png`;
      uploadToS3(imageUrl, s3Key)
        .then(async (s3Url) => {
          // Atualiza o registro com a URL do S3
          await GeneratedImage.findByIdAndUpdate(imageRecord._id, {
            imageUrl: s3Url,
            status: 'completed'
          });
        })
        .catch(async (error) => {
          console.error('Erro ao fazer upload para S3:', error);
          await GeneratedImage.findByIdAndUpdate(imageRecord._id, {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Erro ao fazer upload para S3'
          });
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