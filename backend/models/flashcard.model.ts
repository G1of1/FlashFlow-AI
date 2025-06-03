import { Schema, model, Types, Document } from 'mongoose';

export interface IFlashcard extends Document {
  _id: Types.ObjectId
  user: Types.ObjectId;
  question: string;
  answer: string;
  known?: boolean;
}

const flashcardSchema = new Schema<IFlashcard>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
}, {
  timestamps: true
});

export const Flashcard = model<IFlashcard>('Flashcard', flashcardSchema);