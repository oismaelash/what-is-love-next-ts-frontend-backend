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

    if (event.type === 'checkout.session.completed' || event.type === 'charge.succeeded') {
      // console.log('Event received:', event.type);
      const session = event.data.object as any;
      const { definitionId, durationInDays } = session.metadata;

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