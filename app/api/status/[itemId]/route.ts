import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function PUT(req: NextRequest, ctx: RouteContext<'/api/status/[itemId]'>) {
  const { itemId } = await ctx.params;
  const body = await req.json();
  const { is_ready, method, price, from_whom } = body;

  const db = getDb();
  const now = new Date().toISOString();

  await db.execute({
    sql: `INSERT INTO item_status (id, item_id, is_ready, method, price, from_whom, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(item_id) DO UPDATE SET
            is_ready = excluded.is_ready,
            method = excluded.method,
            price = excluded.price,
            from_whom = excluded.from_whom,
            updated_at = excluded.updated_at`,
    args: [
      randomUUID(),
      itemId,
      is_ready ? 1 : 0,
      method ?? null,
      price ?? null,
      from_whom ?? null,
      now,
    ],
  });

  return NextResponse.json({ ok: true });
}
