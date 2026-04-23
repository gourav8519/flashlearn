import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80),
  email: z.string().trim().email('Invalid email').max(254),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

export const profilePatchSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  email: z.string().trim().email().max(254).optional(),
  groqApiKey: z.union([z.string(), z.null()]).optional(),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters').max(128),
});

export const deckCreateSchema = z.object({
  name: z.string().trim().min(1, 'Deck name is required').max(80),
  description: z.string().trim().max(500).optional().default(''),
});

export const cardCreateSchema = z.object({
  front: z.string().trim().min(1, 'Front is required').max(2000),
  back: z.string().trim().min(1, 'Back is required').max(2000),
});

export const cardPatchSchema = z.object({
  front: z.string().trim().min(1).max(2000),
  back: z.string().trim().min(1).max(2000),
  due: z.number().finite().positive().optional(),
});

export const reviewCreateSchema = z.object({
  cardId: z.string().min(1),
  rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  durationMs: z.number().finite().min(0).max(10 * 60 * 1000).optional().default(0),
});

export const aiGenerateSchema = z.object({
  notes: z.string().trim().min(20, 'Provide at least 20 characters of notes').max(20_000),
  count: z.number().int().min(1).max(25).optional().default(8),
});
