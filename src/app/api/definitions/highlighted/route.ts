import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Definition from '@/models/Definition';
import { checkHighlightExpiration } from '@/lib/checkHighlightExpiration';
import { LeanDefinition } from '@/types/definition';

export async function GET() {
  try {
    await connectDB();

    // Find all definitions that are currently highlighted
    const definitions = await Definition.find({ isHighlighted: true })
      .sort({ createdAt: -1 })
      .lean();

    // Check highlight expiration for each definition
    const updatedDefinitions = await Promise.all(
      definitions.map(async (definition) => {
        const updatedDefinition = await checkHighlightExpiration((definition as unknown as LeanDefinition)._id.toString());
        return updatedDefinition || definition;
      })
    );

    // Filter out definitions that are no longer highlighted after expiration check
    const activeHighlightedDefinitions = updatedDefinitions.filter(
      (definition) => definition.isHighlighted
    );

    return NextResponse.json({ definitions: activeHighlightedDefinitions });
  } catch (error) {
    console.error('Error fetching highlighted definitions:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar definições em destaque' },
      { status: 500 }
    );
  }
} 