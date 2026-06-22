import { createClient } from '@libsql/client';

let client: ReturnType<typeof createClient> | null = null;

export function getDb() {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

export async function initDb() {
  const db = getDb();
  await db.batch(
    [
      `CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        category_main TEXT NOT NULL,
        category_sub TEXT NOT NULL,
        category_person TEXT,
        name TEXT NOT NULL,
        memo TEXT,
        priority INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS item_status (
        id TEXT PRIMARY KEY,
        item_id TEXT NOT NULL UNIQUE,
        is_ready INTEGER NOT NULL DEFAULT 0,
        method TEXT,
        price INTEGER,
        store TEXT,
        from_whom TEXT,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
      )`,
    ],
    'write'
  );
  try {
    await db.execute(`ALTER TABLE item_status ADD COLUMN store TEXT`);
  } catch {
    // 이미 존재하는 컬럼
  }
  try {
    await db.execute(`ALTER TABLE items ADD COLUMN priority INTEGER NOT NULL DEFAULT 0`);
  } catch {
    // 이미 존재하는 컬럼
  }
}
