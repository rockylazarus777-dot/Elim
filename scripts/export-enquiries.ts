/**
 * CSV exporter for the enquiries table.
 *
 * Usage:
 *   npm run export:enquiries
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 * Writes to ./exports/enquiries-<timestamp>.csv
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error.message);
    process.exit(1);
  }

  const rows = data || [];
  const header = [
    'created_at',
    'name',
    'hospital_name',
    'phone',
    'email',
    'message',
    'source',
    'ip',
    'user_agent',
    'id',
  ];
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push(header.map((h) => csvEscape((r as Record<string, unknown>)[h])).join(','));
  }

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = join(process.cwd(), 'exports');
  await mkdir(outDir, { recursive: true });
  const outPath = join(outDir, `enquiries-${ts}.csv`);
  await writeFile(outPath, lines.join('\n'), 'utf8');
  console.log(`Exported ${rows.length} enquiries -> ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
