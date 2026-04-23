import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { User } from '@/lib/models';
import { hashPassword } from '@/lib/password';
import { publicUser } from '@/lib/auth-server';
import { seedUserDecks } from '@/lib/seed';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { withErrorHandling, parseBody } from '@/lib/api-helpers';
import { signupSchema } from '@/lib/validation';

export const POST = withErrorHandling(async (req: NextRequest) => {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`signup:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many signup attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    );
  }

  const { name, email, password } = await parseBody(req, signupSchema);
  const lowerEmail = email.toLowerCase();

  await dbConnect();

  const existing = await User.findOne({ email: lowerEmail });
  if (existing) {
    return NextResponse.json(
      { error: 'An account with this email already exists.' },
      { status: 409 },
    );
  }

  const user = await User.create({
    email: lowerEmail,
    name: name.trim(),
    passwordHash: await hashPassword(password),
  });

  await seedUserDecks(user._id);

  return NextResponse.json({ user: publicUser(user) });
});
