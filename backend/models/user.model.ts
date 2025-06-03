import mongoose, { Document, Schema, Types, Model } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId; 
  username: string;
  password: string;
  email: string;
  fullName: string;
  profilePic?: string;
  flashcardDecks: Types.ObjectId[];
  notes: Types.ObjectId[];
  createdAt: string;
  savedNotes: Types.ObjectId[];
  savedFlashcardDecks: Types.ObjectId[];
  twoFactorEnabled: Boolean;
  twoFactorSecret: string;
  resetPasswordToken: string | undefined;
  resetPasswordExpires: Date | undefined;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  profilePic: { type: String },
  flashcardDecks: [{type: Schema.Types.ObjectId, ref: 'FlashcardDeck'}],
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note'}],
  savedNotes: [{type: Schema.Types.ObjectId, ref: 'Note'}],
  savedFlashcardDecks: [{type: Schema.Types.ObjectId, ref: 'FlashcardDeck'}],
  twoFactorEnabled : {type: Boolean, default: false, required: true},
  twoFactorSecret: {type: String},
  resetPasswordToken: {type: String},
  resetPasswordExpires: {type: Date}
}, {
  timestamps: true
});

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

