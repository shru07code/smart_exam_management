function pad2(value) {
  return String(value).padStart(2, '0');
}

function normalizeCsvHeader(header) {
  if (header == null) return header;
  return String(header)
    .replace(/^\uFEFF/, '')
    .trim()
    .toLowerCase()
    .replace(/[\s\-]+/g, '_');
}

function excelSerialToIsoDate(serial) {
  const base = Date.UTC(1899, 11, 30);
  const ms = base + serial * 24 * 60 * 60 * 1000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function toIsoDate(value) {
  if (value == null) return null;
  const raw = String(value).trim();
  if (!raw) return null;

  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(raw)) {
    const [y, m, d] = raw.split('-').map(Number);
    if (!y || m < 1 || m > 12 || d < 1 || d > 31) return null;
    return `${y}-${pad2(m)}-${pad2(d)}`;
  }

  if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(raw)) {
    const [y, m, d] = raw.split('/').map(Number);
    if (!y || m < 1 || m > 12 || d < 1 || d > 31) return null;
    return `${y}-${pad2(m)}-${pad2(d)}`;
  }

  if (/^\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}$/.test(raw)) {
    const parts = raw.split(/[\/-]/).map(Number);
    let [a, b, c] = parts;
    if (String(c).length === 2) c = 2000 + c;

    const assumeDmy = a > 12 || b <= 12;
    const d = assumeDmy ? a : b;
    const m = assumeDmy ? b : a;
    const y = c;
    if (!y || m < 1 || m > 12 || d < 1 || d > 31) return null;
    return `${y}-${pad2(m)}-${pad2(d)}`;
  }

  if (/^\d+(\.\d+)?$/.test(raw)) {
    const serial = Number(raw);
    if (serial > 0) return excelSerialToIsoDate(serial);
  }

  return null;
}

module.exports = {
  normalizeCsvHeader,
  toIsoDate
};
