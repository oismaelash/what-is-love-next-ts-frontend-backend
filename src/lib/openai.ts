import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function moderateContent(content: string): Promise<{
  isApproved: boolean;
  reason?: string;
}> {
  try {
    const response = await openai.moderations.create({
      input: content,
      model: process.env.OPENAI_MODEL
    });

    const result = response.results[0];
    
    // Check if the content is flagged for any category
    if (result.flagged) {
      return {
        isApproved: false,
        reason: 'O conteúdo contém material inapropriado ou ofensivo.',
      };
    }

    return {
      isApproved: true,
    };
  } catch (error) {
    console.error('Error moderating content:', error);
    // In case of API error, we'll approve the content to not block legitimate submissions
    return {
      isApproved: false,
      reason: 'Erro ao validar conteúdo. Por favor, tente novamente.',
    };
  }
} 