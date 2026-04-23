import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { User } from '@/lib/models';
import { hashPassword, validatePasswordStrength } from '@/lib/password';
import { publicUser } from '@/lib/auth-server';
import { seedUserDecks } from '@/lib/seed';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`signup:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many signup attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    );
  }

  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email and password are required.' }, { status: 400 });
    }
    const pwError = validatePasswordStrength(password);
    if (pwError) {
      return NextResponse.json({ error: pwError }, { status: 400 });
    }

    await dbConnect();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const user = await User.create({
      email: email.toLowerCase(),
      name,
      passwordHash: await hashPassword(password),
    });

    await seedUserDecks(user._id);

    return NextResponse.json({ user: publicUser(user) });
  } catch (err) {
    console.error('signup error', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
