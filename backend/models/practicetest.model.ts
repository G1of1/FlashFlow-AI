import { Schema, model, Document, Types } from 'mongoose';

interface TestQuestion {
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
}

export interface IPracticeTest extends Document {
  user: Types.ObjectId;
  title: string;
  topic: string;
  questions: TestQuestion[];
}

const practiceTestSchema = new Schema<IPracticeTest>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  topic: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: { type: [String], default: undefined }, // optional
      answer: { type: String, required: true },
      explanation: { type: String }, // optional
    },
  ],
}, {
  timestamps: true, // adds createdAt and updatedAt
});

export const PracticeTest = model<IPracticeTest>('PracticeTest', practiceTestSchema);