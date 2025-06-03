import { Schema, model, Types, Document } from 'mongoose';
import { Flashcard } from './flashcard.model';

export interface IFlashcardDeck extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    flashcards: Types.ObjectId[]
    topic: String;
    isPublic: Boolean;
    saves: Types.ObjectId[];
}

const flashcardDeckSchema = new Schema<IFlashcardDeck>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    flashcards : [{type: Schema.Types.ObjectId, ref: 'Flashcard', required: true}],
    topic: {type: String, required: true },
    isPublic: {type: Boolean, default: false, required: true},
    saves: [{type: Schema.Types.ObjectId, ref: 'User', default: []}]
}, {
    timestamps: true
})

flashcardDeckSchema.pre('findOneAndDelete', async function (next) {
  const deck = await this.model.findOne(this.getFilter());
  if (deck && deck.flashcards?.length) {
    await Flashcard.deleteMany({ _id: { $in: deck.flashcards } });
  }
  next();
});

export const FlashcardDeck = model<IFlashcardDeck>('FlashcardDeck', flashcardDeckSchema);
