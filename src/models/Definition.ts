import mongoose, { Schema, Document } from 'mongoose';

export interface IDefinition extends Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  author: string;
  likes: number;
  shares: number;
  isHighlighted: boolean;
  highlightExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DefinitionSchema: Schema = new Schema({
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    minlength: [10, 'Content must be at least 10 characters long'],
    maxlength: [500, 'Content cannot exceed 500 characters'],
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  shares: {
    type: Number,
    default: 0,
  },
  isHighlighted: {
    type: Boolean,
    default: false,
  },
  highlightExpiresAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Create the model if it doesn't exist, otherwise use the existing one
export default mongoose.models.Definition || mongoose.model<IDefinition>('Definition', DefinitionSchema); 