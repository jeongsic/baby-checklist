import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAccountId } from '@/lib/auth';

export async function PUT(req: NextRequest, ctx: RouteContext<'/api/items/[id]'>) {
  const accountId = await getAccountId();
  if (!accountId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json();
  const { name, memo, priority } = body;

  const db = getDb();
  await db.execute({
    sql: `UPDATE items SET name = ?, memo = ?, priority = ? WHERE id = ? AND account_id = ?`,
    args: [name, memo ?? null, priority ?? 0, id, accountId],
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/items/[id]'>) {
  const accountId = await getAccountId();
  if (!accountId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await ctx.params;
  const db = getDb();

  await db.batch(
    [
      { sql: `DELETE FROM item_status WHERE item_id = ?`, args: [id] },
      { sql: `DELETE FROM items WHERE id = ? AND account_id = ?`, args: [id, accountId] },
    ],
    'write'
  );

  return NextResponse.json({ ok: true });
}
