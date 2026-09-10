export const SHEET_ID = '1KKuhEQjb6X2RpvwluT4TeTayDK6ocur51YPWKlSUpN8';
export const SHEET_GID = '0';
export const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=${SHEET_GID}#gid=${SHEET_GID}`;
export const SHEET_CSV_PATH = '/api/sheet';

export async function fetchSheetCsv() {
  const res = await fetch(`${SHEET_CSV_PATH}?t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Gagal mengambil spreadsheet (HTTP ${res.status})`);
  }
  const csv = await res.text();
  const trimmed = csv.trim();
  if (!trimmed || trimmed.startsWith('<')) {
    throw new Error('Spreadsheet tidak bisa dibaca. Set sharing ke Anyone with the link.');
  }
  return csv;
}
