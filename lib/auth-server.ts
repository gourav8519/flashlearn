import { HydratedDocument } from 'mongoose';
import { auth } from '@/auth';
import { dbConnect } from './db';
import { User, IUser } from './models';

export async function requireUser(): Promise<HydratedDocument<IUser> | null> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return null;
  await dbConnect();
  return User.findById(userId);
}

export function publicUser(u: IUser) {
  return {
    id: u._id.toString(),
    email: u.email,
    name: u.name,
    createdAt: u.createdAt,
    streak: u.streak,
    lastReviewDate: u.lastReviewDate,
    xp: u.xp,
    level: u.level,
    hasGroqApiKey: !!u.groqApiKey,
    groqApiKeyPreview: u.groqApiKeyMask ?? null,
  };
}
