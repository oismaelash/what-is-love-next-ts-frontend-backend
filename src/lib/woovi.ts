import { HIGHLIGHT_PRICES, IMAGE_GENERATION_PRICE } from '@/utils/constants';
import axios from 'axios';

const wooviApi = axios.create({
  baseURL: 'https://api.openpix.com.br/api/v1',
  headers: {
    'Authorization': process.env.WOOVI_API_KEY!,
    'Content-Type': 'application/json',
  },
});

export type HighlightDuration = keyof typeof HIGHLIGHT_PRICES;

export const createPixCharge = async (
  definitionId: string,
  durationInDays: HighlightDuration,
  userId: string,
  isImageGeneration: boolean = false
) => {
  const price = isImageGeneration ? IMAGE_GENERATION_PRICE : HIGHLIGHT_PRICES[durationInDays];
  
  const response = await wooviApi.post('/charge', {
    correlationID: `${definitionId}-${userId}-${Date.now()}`,
    value: price,
    comment: isImageGeneration ? 'Geração de Imagem' : `Destaque de Definição por ${durationInDays} dias`,
    identifier: userId,
    additionalInfo: [
      {
        key: 'definitionId',
        value: definitionId,
      },
      {
        key: 'durationInDays',
        value: durationInDays.toString(),
      },
      {
        key: 'isImageGeneration',
        value: isImageGeneration.toString(),
      },
    ],
  });

  return response.data;
}; 