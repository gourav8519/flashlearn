import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-server';
import { hashPassword, verifyPassword, validatePasswordStrength } from '@/lib/password';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const rl = checkRateLimit(`pw:${user._id.toString()}`, 5, 15 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    );
  }

  const { currentPassword, newPassword } = await req.json();

  if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
    return NextResponse.json({ error: 'Current and new password are required.' }, { status: 400 });
  }
  if (user.passwordHash === 'oauth:google') {
    return NextResponse.json(
      { error: 'Your account uses Google sign-in — no password to change.' },
      { status: 400 },
    );
  }

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
  }

  const pwError = validatePasswordStrength(newPassword);
  if (pwError) return NextResponse.json({ error: pwError }, { status: 400 });

  if (currentPassword === newPassword) {
    return NextResponse.json(
      { error: 'New password must be different from the current password.' },
      { status: 400 },
    );
  }

  user.passwordHash = await hashPassword(newPassword);
  await user.save();

  return NextResponse.json({ ok: true });
}
