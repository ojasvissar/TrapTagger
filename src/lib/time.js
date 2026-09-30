// British Columbia stopped changing its clocks in March 2026 and stays on UTC−7 all year.
// A fixed zone keeps the clock right even where a browser's time-zone data still expects a November fall-back.
export const VAN = "Etc/GMT+7";
export const JHB = "Africa/Johannesburg";
export const THEM = [8, 17]; // WildEye's working day, Johannesburg time (assumed)
export const SHIFT = 8;      // length of my working day, hours

export function fmt(tz, opts, d = new Date()) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: tz, ...opts }).format(d);
}

export function hoursIn(tz, d = new Date()) {
  const [h, m] = fmt(tz, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }, d).split(":");
  return +h + +m / 60;
}

// minutes east of UTC for a zone at a given instant
export function offset(tz, d = new Date()) {
  const p = {};
  new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })
    .formatToParts(d).forEach((x) => { p[x.type] = x.value; });
  return Math.round((Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) - (d.getTime() - d.getMilliseconds())) / 60000);
}

export const gap = () => (offset(JHB) - offset(VAN)) / 60;

export function hm(h) {
  h = ((h % 24) + 24) % 24;
  return String(Math.floor(h)).padStart(2, "0") + ":" + String(Math.round((h % 1) * 60)).padStart(2, "0");
}

export const nice = (n) => (n % 1 ? n.toFixed(1) : String(n));

export function mood(h) {
  if (h < 6) return "Night, most people asleep";
  if (h < 8) return "Early morning";
  if (h < 12) return "Morning, work hours";
  if (h < 17) return "Afternoon, work hours";
  if (h < 21) return "Evening, after work";
  return "Night, most people asleep";
}

// split [start, start + len) on a 24-hour ring into pieces that don't wrap
export function pieces(start, len) {
  const a = ((start % 24) + 24) % 24, b = a + len;
  return b <= 24 ? [[a, b]] : [[a, 24], [0, b - 24]];
}

export function intersect(xs, ys) {
  const out = [];
  xs.forEach((x) => ys.forEach((y) => {
    const s = Math.max(x[0], y[0]), e = Math.min(x[1], y[1]);
    if (e > s) out.push([s, e]);
  }));
  return out;
}

export const total = (xs) => xs.reduce((t, x) => t + x[1] - x[0], 0);

// approximate subsolar point [lon, lat]; good to a few degrees, plenty for a day/night shadow
export function sunPosition(d = new Date()) {
  const day = (d - Date.UTC(d.getUTCFullYear(), 0, 0)) / 864e5;
  const decl = -23.44 * Math.cos((2 * Math.PI / 365) * (day + 10));
  const utcH = d.getUTCHours() + d.getUTCMinutes() / 60;
  return [-(utcH - 12) * 15, decl];
}
