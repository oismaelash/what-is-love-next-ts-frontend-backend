import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Definition from '@/models/Definition';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const headersList = await headers();
    const signature = headersList.get('x-webhook-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 400 }
      );
    }

    if (payload.evento == "teste_webhook") {
      return NextResponse.json(
        { received: true },
        { status: 200 }
      );
    }

    // TODO: Verify webhook signature with Woovi secret
    // For now, we'll trust the webhook

    let definitionId = '';
    let durationInDays = '';
    let isImageGeneration = 'false';

    payload.charge.additionalInfo.forEach((info: { key: string; value: string }) => {
      if (info.key === 'definitionId') {
        definitionId = info.value;
      } else if (info.key === 'durationInDays') {
        durationInDays = info.value;
      } else if (info.key === 'isImageGeneration') {
        isImageGeneration = info.value;
      }
    });

    if (!definitionId) {
      return NextResponse.json(
        { error: 'Missing additional info' },
        { status: 400 }
      );
    }

    await connectDB();

    if (isImageGeneration === 'true') {
      // For image generation, we don't need to update the definition
      return NextResponse.json({ success: true });
    }

    // Calculate expiration date
    const highlightExpiresAt = new Date();
    highlightExpiresAt.setDate(highlightExpiresAt.getDate() + Number(durationInDays));

    // Update the definition
    await Definition.updateOne(
      { _id: definitionId },
      {
        isHighlighted: true,
        highlightExpiresAt,
      },
      { new: true }
    );

    const updatedDefinition = await Definition.findById(definitionId);

    if (!updatedDefinition) {
      return NextResponse.json(
        { error: 'Definição não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedDefinition);
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
} 