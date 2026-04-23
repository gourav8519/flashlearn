import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import mongoose from 'mongoose';

type Handler<Ctx> = (req: NextRequest, ctx: Ctx) => Promise<NextResponse> | NextResponse;

export function withErrorHandling<Ctx = unknown>(handler: Handler<Ctx>) {
  return async (req: NextRequest, ctx: Ctx): Promise<NextResponse> => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      if (err instanceof ZodError) {
        const first = err.issues[0];
        const field = first?.path
          .filter((p): p is string => typeof p === 'string')
          .join('.') || 'body';
        return NextResponse.json(
          { error: `${field}: ${first?.message ?? 'Invalid input'}` },
          { status: 400 },
        );
      }
      if (err instanceof mongoose.Error.CastError) {
        return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      if (err instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
      }
      console.error('Unhandled route error:', err);
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
  };
}

export async function parseBody<T extends z.ZodType>(
  req: NextRequest,
  schema: T,
): Promise<z.infer<T>> {
  const raw = await req.json();
  return schema.parse(raw);
}

export function isValidObjectId(id: string): boolean {
  return mongoose.isValidObjectId(id);
}
