import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  author: string;
  definition: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    minlength: [1, 'Comment must be at least 1 character long'],
    maxlength: [500, 'Comment cannot exceed 500 characters'],
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
  },
  definition: {
    type: Schema.Types.ObjectId,
    ref: 'Definition',
    required: [true, 'Definition is required'],
  },
}, {
  timestamps: true,
});

// Create the model if it doesn't exist, otherwise use the existing one
export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema); 