import { Types } from 'mongoose';

export interface LeanDefinition {
  _id: Types.ObjectId;
  content: string;
  author: string;
  likes: number;
  isHighlighted: boolean;
  highlightExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
} 