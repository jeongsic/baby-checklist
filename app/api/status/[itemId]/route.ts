import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAccountId } from '@/lib/auth';
import { randomUUID } from 'crypto';

export async function PUT(req: NextRequest, ctx: RouteContext<'/api/status/[itemId]'>) {
  const accountId = await getAccountId();
  if (!accountId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { itemId } = await ctx.params;
  const body = await req.json();
  const { is_ready, method, price, store, from_whom } = body;

  const db = getDb();

  const check = await db.execute({
    sql: 'SELECT id FROM items WHERE id = ? AND account_id = ?',
    args: [itemId, accountId],
  });
  if (check.rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const now = new Date().toISOString();

  await db.execute({
    sql: `INSERT INTO item_status (id, item_id, is_ready, method, price, store, from_whom, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(item_id) DO UPDATE SET
            is_ready = excluded.is_ready,
            method = excluded.method,
            price = excluded.price,
            store = excluded.store,
            from_whom = excluded.from_whom,
            updated_at = excluded.updated_at`,
    args: [
      randomUUID(),
      itemId,
      is_ready ? 1 : 0,
      method ?? null,
      price ?? null,
      store ?? null,
      from_whom ?? null,
      now,
    ],
  });

  return NextResponse.json({ ok: true });
}
