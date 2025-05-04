import mongoose, { Schema, model, Types, Document } from 'mongoose';

export interface IGeneratedImage extends Document {
  definition: Types.ObjectId;
  user: Types.ObjectId;      // Agora obrigatório, pois só usuários logados podem gerar
  imageUrl: string;
  createdAt: Date;
  likes: number;
  isFree: boolean;           // Indica se foi gerada gratuitamente
  status: 'pending' | 'completed' | 'failed'; // Status da geração
  error?: string;            // Mensagem de erro, se houver
}

const GeneratedImageSchema = new Schema<IGeneratedImage>({
  definition: { type: Schema.Types.ObjectId, ref: 'Definition', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  isFree: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  error: { type: String }
});

export default mongoose.models.GeneratedImage || mongoose.model<IGeneratedImage>('GeneratedImage', GeneratedImageSchema);