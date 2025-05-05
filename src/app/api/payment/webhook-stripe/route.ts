import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Definition from '@/models/Definition';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    // console.log('Body:', body);
    const signature = (await headers()).get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    if (event.type === 'checkout.session.completed') {
      // console.log('Event received:', event.type);
      const session = (event.data.object as unknown) as {
        metadata: {
          definitionId: string;
          durationInDays: string;
          isImageGeneration: string;
        };
      };
      const { definitionId, durationInDays, isImageGeneration } = session.metadata;

      if (!definitionId) {
        return NextResponse.json(
          { error: 'Missing metadata' },
          { status: 400 }
        );
      }

      await connectDB();

      if (isImageGeneration === 'true') {
        // Call the image generation endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/images/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            definitionId,
            isFree: false
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate image');
        }

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

      console.log('Updated definition:', updatedDefinition);

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