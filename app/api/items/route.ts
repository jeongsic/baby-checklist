import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { getAccountId } from '@/lib/auth';
import { randomUUID } from 'crypto';

export async function GET() {
  await initDb();
  const accountId = await getAccountId();
  if (!accountId) return NextResponse.json([]);

  const db = getDb();
  const result = await db.execute({
    sql: `SELECT i.*,
      s.id as status_id, s.is_ready, s.method, s.price, s.store, s.from_whom, s.updated_at as status_updated
      FROM items i
      LEFT JOIN item_status s ON i.id = s.item_id
      WHERE i.account_id = ?
      ORDER BY i.created_at ASC`,
    args: [accountId],
  });
  const rows = result.rows.map((row: Record<string, unknown>) => ({
    ...row,
    is_ready: row.is_ready === 1,
  }));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const accountId = await getAccountId();
  if (!accountId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { category_main, category_sub, category_person, name, memo, priority } = body;

  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();

  await db.execute({
    sql: `INSERT INTO items (id, account_id, category_main, category_sub, category_person, name, memo, priority, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, accountId, category_main, category_sub, category_person ?? null, name, memo ?? null, priority ?? 0, now],
  });

  return NextResponse.json({ id });
}
