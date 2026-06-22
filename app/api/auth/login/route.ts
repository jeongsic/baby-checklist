import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';
import { createHash } from 'crypto';

function hashPin(pin: string) {
  return createHash('sha256').update(pin).digest('hex');
}

export async function POST(req: NextRequest) {
  const { baby_name, pin } = await req.json();

  if (!baby_name?.trim() || !pin) {
    return NextResponse.json({ error: '아기 이름과 PIN을 입력해주세요.' }, { status: 400 });
  }

  const db = getDb();
  const pinHash = hashPin(pin);

  const result = await db.execute({
    sql: 'SELECT id, baby_name FROM accounts WHERE baby_name = ? AND pin_hash = ?',
    args: [(baby_name as string).trim(), pinHash],
  });

  if (result.rows.length === 0) {
    return NextResponse.json({ error: '아기 이름 또는 PIN이 맞지 않아요.' }, { status: 401 });
  }

  const account = result.rows[0];
  const cookieStore = await cookies();
  cookieStore.set('baby_account', account.id as string, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 3600,
    path: '/',
  });

  return NextResponse.json({ ok: true, baby_name: account.baby_name });
}
