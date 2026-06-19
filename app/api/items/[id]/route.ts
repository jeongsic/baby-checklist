import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(req: NextRequest, ctx: RouteContext<'/api/items/[id]'>) {
  const { id } = await ctx.params;
  const body = await req.json();
  const { name, memo } = body;

  const db = getDb();
  await db.execute({
    sql: `UPDATE items SET name = ?, memo = ? WHERE id = ?`,
    args: [name, memo ?? null, id],
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/items/[id]'>) {
  const { id } = await ctx.params;
  const db = getDb();

  await db.batch(
    [
      { sql: `DELETE FROM item_status WHERE item_id = ?`, args: [id] },
      { sql: `DELETE FROM items WHERE id = ?`, args: [id] },
    ],
    'write'
  );

  return NextResponse.json({ ok: true });
}
