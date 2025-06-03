// models/note.model.ts
import { Schema, model, Types, Document } from 'mongoose';

export interface INotes extends Document {
  user: Types.ObjectId;
  topic: string;
  content: string;
  isPublic: boolean;
  saves: Types.ObjectId[];
}

const notesSchema = new Schema<INotes>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  content: { type: String, required: true },
  isPublic: { type: Boolean, default: false, required: true },
  saves: [{type: Schema.Types.ObjectId, ref: 'User', default: []}]
}, {
    timestamps: true
});

export const Notes = model<INotes>('Note', notesSchema);