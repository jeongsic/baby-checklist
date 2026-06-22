import { cookies } from 'next/headers';
import { getDb, initDb } from '@/lib/db';
import MainClient from '@/components/MainClient';
import AuthScreen from '@/components/AuthScreen';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;

  if (params.mode === 'browse') {
    return <MainClient readOnly />;
  }

  await initDb();

  const cookieStore = await cookies();
  const accountId = cookieStore.get('baby_account')?.value;

  if (accountId) {
    const db = getDb();
    const result = await db.execute({
      sql: 'SELECT id, baby_name FROM accounts WHERE id = ?',
      args: [accountId],
    });
    const account = result.rows[0];
    if (account) {
      return (
        <MainClient
          accountId={account.id as string}
          babyName={account.baby_name as string}
        />
      );
    }
    cookieStore.delete('baby_account');
  }

  return <AuthScreen />;
}
