const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateRefCode() {
  const seg = (n) => Array.from({length: n}, () =>
    CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
  return `TEH-${seg(3)}-${seg(3)}`;
}

export function saveToLocal(refCode, data) {
  const record = { refCode, ...data, status: 'Talep alındı', createdAt: new Date().toISOString() };
  const existing = JSON.parse(localStorage.getItem('tehas_requests') || '[]');
  existing.push(record);
  localStorage.setItem('tehas_requests', JSON.stringify(existing));
  return record;
}

export function queryByRefAndPhone(refCode, phoneLast4, district = '') {
  const existing = JSON.parse(localStorage.getItem('tehas_requests') || '[]');
  return existing.find(r => {
    const refMatch      = r.refCode === refCode;
    const phoneMatch    = r.phone?.slice(-4) === phoneLast4;
    const districtTrim  = district.trim();
    const districtMatch = !districtTrim ||
      (r.ilce || '').toLowerCase().includes(districtTrim.toLowerCase());
    return refMatch && phoneMatch && districtMatch;
  }) || null;
}
