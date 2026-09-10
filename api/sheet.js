const SHEET_ID = '1KKuhEQjb6X2RpvwluT4TeTayDK6ocur51YPWKlSUpN8';
const GID = '0';
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`;

export default async function handler(req, res) {
  try {
    const upstream = await fetch(SHEET_CSV_URL, { redirect: 'follow' });
    if (!upstream.ok) {
      res.status(502).send(`Google Sheets responded with ${upstream.status}. Make sure the sheet is shared as "Anyone with the link".`);
      return;
    }
    const csv = await upstream.text();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(csv);
  } catch (err) {
    res.status(502).send(`Could not reach Google Sheets: ${err.message}`);
  }
}
