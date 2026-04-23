import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { User } from '@/lib/models';
import { requireUser, publicUser } from '@/lib/auth-server';
import { encryptSecret, maskSecret } from '@/lib/crypto';
import { withErrorHandling, parseBody } from '@/lib/api-helpers';
import { profilePatchSchema } from '@/lib/validation';

export const PATCH = withErrorHandling(async (req: NextRequest) => {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { name, email, groqApiKey } = await parseBody(req, profilePatchSchema);
  await dbConnect();

  if (email && email.toLowerCase() !== user.email) {
    const taken = await User.findOne({ email: email.toLowerCase() });
    if (taken) return NextResponse.json({ error: 'Email is already taken' }, { status: 409 });
    user.email = email.toLowerCase();
  }
  if (typeof name === 'string' && name.trim()) user.name = name.trim();

  if (groqApiKey !== undefined) {
    if (groqApiKey === null || groqApiKey === '') {
      user.groqApiKey = undefined;
      user.groqApiKeyMask = undefined;
    } else {
      const trimmed = groqApiKey.trim();
      if (!trimmed.startsWith('gsk_') || trimmed.length < 20) {
        return NextResponse.json(
          { error: 'Invalid Groq API key. It should start with "gsk_".' },
          { status: 400 },
        );
      }
      user.groqApiKey = encryptSecret(trimmed);
      user.groqApiKeyMask = maskSecret(trimmed);
    }
  }

  await user.save();
  return NextResponse.json({ user: publicUser(user) });
});
