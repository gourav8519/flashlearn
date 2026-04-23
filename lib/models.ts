import mongoose, { Schema, Model, Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: number;
  streak: number;
  lastReviewDate: string | null;
  xp: number;
  level: number;
  groqApiKey?: string;
  groqApiKeyMask?: string;
}

export interface IDeck {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  description: string;
  color: string;
  createdAt: number;
}

export interface ICard {
  _id: Types.ObjectId;
  deckId: Types.ObjectId;
  front: string;
  back: string;
  interval: number;
  ease: number;
  reps: number;
  due: number;
  lapses: number;
  createdAt: number;
}

export interface IReview {
  _id: Types.ObjectId;
  cardId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: 1 | 2 | 3 | 4;
  reviewedAt: number;
  durationMs: number;
}

const UserSchema = new Schema<IUser>({
  email:          { type: String, required: true, unique: true, lowercase: true, index: true },
  name:           { type: String, required: true },
  passwordHash:   { type: String, required: true },
  createdAt:      { type: Number, default: () => Date.now() },
  streak:         { type: Number, default: 0 },
  lastReviewDate: { type: String, default: null },
  xp:             { type: Number, default: 0 },
  level:          { type: Number, default: 1 },
  groqApiKey:     { type: String, default: null },
  groqApiKeyMask: { type: String, default: null },
});

const DeckSchema = new Schema<IDeck>({
  userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name:        { type: String, required: true },
  description: { type: String, default: '' },
  color:       { type: String, required: true },
  createdAt:   { type: Number, default: () => Date.now() },
});

const CardSchema = new Schema<ICard>({
  deckId:    { type: Schema.Types.ObjectId, ref: 'Deck', required: true, index: true },
  front:     { type: String, required: true },
  back:      { type: String, required: true },
  interval:  { type: Number, default: 0 },
  ease:      { type: Number, default: 2.5 },
  reps:      { type: Number, default: 0 },
  due:       { type: Number, default: () => Date.now(), index: true },
  lapses:    { type: Number, default: 0 },
  createdAt: { type: Number, default: () => Date.now() },
});

const ReviewSchema = new Schema<IReview>({
  cardId:     { type: Schema.Types.ObjectId, ref: 'Card', required: true, index: true },
  userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rating:     { type: Number, required: true },
  reviewedAt: { type: Number, default: () => Date.now() },
  durationMs: { type: Number, default: 0 },
});

function defineModel<T>(name: string, schema: Schema<T>): Model<T> {
  if (process.env.NODE_ENV !== 'production' && mongoose.models[name]) {
    mongoose.deleteModel(name);
  }
  return mongoose.models[name] as Model<T> || mongoose.model<T>(name, schema);
}

export const User = defineModel<IUser>('User', UserSchema);
export const Deck = defineModel<IDeck>('Deck', DeckSchema);
export const Card = defineModel<ICard>('Card', CardSchema);
export const Review = defineModel<IReview>('Review', ReviewSchema);
