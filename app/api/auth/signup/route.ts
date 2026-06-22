import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';
import { randomUUID, createHash } from 'crypto';

function hashPin(pin: string) {
  return createHash('sha256').update(pin).digest('hex');
}

export async function POST(req: NextRequest) {
  const { baby_name, pin } = await req.json();

  if (!baby_name?.trim() || !/^\d{4}$/.test(pin)) {
    return NextResponse.json({ error: '아기 이름과 4자리 숫자 PIN을 입력해주세요.' }, { status: 400 });
  }

  const db = getDb();
  const trimmedName = (baby_name as string).trim();
  const pinHash = hashPin(pin);

  const existing = await db.execute({
    sql: 'SELECT id FROM accounts WHERE baby_name = ? AND pin_hash = ?',
    args: [trimmedName, pinHash],
  });
  if (existing.rows.length > 0) {
    return NextResponse.json({ error: '이미 같은 이름과 PIN으로 만들어진 계정이 있어요.' }, { status: 400 });
  }

  const id = randomUUID();
  const now = new Date().toISOString();

  await db.execute({
    sql: 'INSERT INTO accounts (id, baby_name, pin_hash, created_at) VALUES (?, ?, ?, ?)',
    args: [id, trimmedName, pinHash, now],
  });

  // 기존 데이터(account_id NULL)를 첫 번째 계정에 귀속
  await db.execute({
    sql: 'UPDATE items SET account_id = ? WHERE account_id IS NULL',
    args: [id],
  });

  const cookieStore = await cookies();
  cookieStore.set('baby_account', id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 3600,
    path: '/',
  });

  return NextResponse.json({ ok: true, baby_name: trimmedName });
}
