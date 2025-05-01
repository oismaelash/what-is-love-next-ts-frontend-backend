import { HIGHLIGHT_PRICES } from '@/utils/constants';
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
  userId: string
) => {
  const price = HIGHLIGHT_PRICES[durationInDays];
  
  const response = await wooviApi.post('/charge', {
    correlationID: `${definitionId}-${userId}-${Date.now()}`,
    value: price,
    comment: `Destaque de Definição por ${durationInDays} dias`,
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
    ],
  });

  return response.data;
}; 