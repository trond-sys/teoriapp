// Eksport av all progresjon som JSON-fil (v1-synk). Import kommer i Fase 4.
import { db, type TeoriDB } from './db';

export const EXPORT_SCHEMA_VERSION = 1;

export async function buildExport(database: TeoriDB = db) {
  const [settings, attempts, exams, thReports] = await Promise.all([
    database.settings.toArray(),
    database.attempts.toArray(),
    database.exams.toArray(),
    database.thReports.toArray(),
  ]);
  return {
    app: 'teori-b',
    schemaVersion: EXPORT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    // srs tas ikke med: den regnes ut på nytt fra attempts ved import.
    tables: { settings, attempts, exams, thReports },
  };
}

export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportAll() {
  const date = new Date().toISOString().slice(0, 10);
  downloadJson(await buildExport(), `teori-b-${date}.json`);
}

export async function exportThaiReports() {
  const reports = await db.thReports.toArray();
  const date = new Date().toISOString().slice(0, 10);
  downloadJson({ app: 'teori-b', kind: 'thai-reports', exportedAt: new Date().toISOString(), reports }, `teori-b-thai-rapporter-${date}.json`);
  await db.thReports.where('status').equals('new').modify({ status: 'exported' });
}
