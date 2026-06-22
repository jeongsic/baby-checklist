import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET() {
  await initDb();
  const db = getDb();
  const result = await db.execute(`
    SELECT i.*,
      s.id as status_id, s.is_ready, s.method, s.price, s.store, s.from_whom, s.updated_at as status_updated
    FROM items i
    LEFT JOIN item_status s ON i.id = s.item_id
    ORDER BY i.created_at ASC
  `);
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { category_main, category_sub, category_person, name, memo } = body;

  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();

  await db.execute({
    sql: `INSERT INTO items (id, category_main, category_sub, category_person, name, memo, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [id, category_main, category_sub, category_person ?? null, name, memo ?? null, now],
  });

  return NextResponse.json({ id });
}
