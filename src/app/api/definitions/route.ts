import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Definition from '@/models/Definition';
import { checkHighlightExpiration } from '@/lib/checkHighlightExpiration';
import { LeanDefinition } from '@/types/definition';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');

    await connectDB();

    let query = {};
    if (ids) {
      const idArray = ids.split(',');
      query = { _id: { $in: idArray } };
    }

    const definitions = await Definition.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Check highlight expiration for each definition
    const updatedDefinitions = await Promise.all(
      definitions.map(async (definition) => {
        const updatedDefinition = await checkHighlightExpiration((definition as unknown as LeanDefinition)._id.toString());
        return updatedDefinition || definition;
      })
    );

    return NextResponse.json({ definitions: updatedDefinitions });
  } catch (error) {
    console.error('Error fetching definitions:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar definições' },
      { status: 500 }
    );
  }
} 