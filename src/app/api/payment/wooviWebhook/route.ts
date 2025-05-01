import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Definition from '@/models/Definition';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const headersList = await headers();
    const signature = headersList.get('x-webhook-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 400 }
      );
    }

    // TODO: Verify webhook signature with Woovi secret
    // For now, we'll trust the webhook

    if (body.status === 'COMPLETED') {
      const { definitionId, durationInDays } = body.additionalInfo.reduce(
        (acc: any, info: { key: string; value: string }) => {
          acc[info.key] = info.value;
          return acc;
        },
        {}
      );

      if (!definitionId || !durationInDays) {
        return NextResponse.json(
          { error: 'Missing metadata' },
          { status: 400 }
        );
      }

      await connectDB();

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
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
} 