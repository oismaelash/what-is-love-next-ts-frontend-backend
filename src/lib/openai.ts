import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function moderateContent(content: string): Promise<{
  isApproved: boolean;
  reason?: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL!,
      messages: [
        {
          role: "system",
          content: "Você é um moderador de conteúdo. Analise o conteúdo a seguir e determine se é apropriado para o tema: o que é amor. Responda com 'APROVADO' se for apropriado, ou 'REJEITADO' seguido de uma razão se for inapropriado."
        },
        {
          role: "user",
          content: content
        }
      ],
      temperature: 0.1,
      max_tokens: 50
    });

    const result = response.choices[0].message.content;
    
    if (result?.startsWith('REJEITADO')) {
      return {
        isApproved: false,
        reason: result.replace('REJEITADO', '').trim() || 'O conteúdo contém material inapropriado ou ofensivo.',
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