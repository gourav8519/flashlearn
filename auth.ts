import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { dbConnect } from '@/lib/db';
import { User } from '@/lib/models';
import { verifyPassword } from '@/lib/password';
import { seedUserDecks } from '@/lib/seed';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const hasGoogle =
  !!process.env.GOOGLE_CLIENT_ID &&
  !!process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_ID !== 'placeholder';

const providers: NextAuthConfig['providers'] = [
  Credentials({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(creds, req) {
      const email = (creds?.email as string | undefined)?.trim().toLowerCase();
      const password = creds?.password as string | undefined;
      if (!email || !password) return null;

      const ip = req instanceof Request ? getClientIp(req) : 'unknown';
      const ipLimit = checkRateLimit(`login-ip:${ip}`, 20, 15 * 60 * 1000);
      const emailLimit = checkRateLimit(`login-email:${email}`, 5, 15 * 60 * 1000);
      if (!ipLimit.ok || !emailLimit.ok) return null;

      await dbConnect();
      const user = await User.findOne({ email });
      if (!user || !user.passwordHash) return null;
      const ok = await verifyPassword(password, user.passwordHash);
      if (!ok) return null;
      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      };
    },
  }),
];

if (hasGoogle) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: '/login' },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'google') return true;

      const email = (profile?.email ?? user.email)?.toLowerCase();
      if (!email) return false;

      await dbConnect();
      let existing = await User.findOne({ email });
      if (!existing) {
        existing = await User.create({
          email,
          name: profile?.name ?? user.name ?? email.split('@')[0],
          passwordHash: 'oauth:google',
        });
        await seedUserDecks(existing._id);
      }
      user.id = existing._id.toString();
      user.name = existing.name;
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user?.id) token.userId = user.id;
      if (trigger === 'update' && token.userId) {
        await dbConnect();
        const fresh = await User.findById(token.userId);
        if (fresh) {
          token.name = fresh.name;
          token.email = fresh.email;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId && session.user) {
        (session.user as { id?: string }).id = token.userId as string;
      }
      return session;
    },
  },
});

export const googleEnabled = hasGoogle;
