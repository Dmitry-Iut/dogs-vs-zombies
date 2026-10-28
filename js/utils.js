/* ================== Утилиты ================== */
const $ = (id) => document.getElementById(id);
const rand = (a, b) => a + Math.random() * (b - a);
const INK = "#33241C";
function mulberry(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function wpick(mix) {
  let s = 0;
  for (const k in mix) s += mix[k];
  let r = Math.random() * s;
  for (const k in mix) {
    r -= mix[k];
    if (r <= 0) return k;
  }
  return Object.keys(mix)[0];
}
function E(c, x, y, rx, ry, fill, lw, rot) {
  c.beginPath();
  c.ellipse(
    x,
    y,
    Math.max(0.1, rx),
    Math.max(0.1, ry),
    rot || 0,
    0,
    Math.PI * 2,
  );
  if (fill) {
    c.fillStyle = fill;
    c.fill();
  }
  if (lw) {
    c.lineWidth = lw;
    c.strokeStyle = INK;
    c.stroke();
  }
}
function T(c, a, b, d, fill, lw) {
  c.beginPath();
  c.moveTo(a[0], a[1]);
  c.lineTo(b[0], b[1]);
  c.lineTo(d[0], d[1]);
  c.closePath();
  if (fill) {
    c.fillStyle = fill;
    c.fill();
  }
  if (lw) {
    c.lineWidth = lw;
    c.lineJoin = "round";
    c.strokeStyle = INK;
    c.stroke();
  }
}
function rr(c, x, y, w, h, r, fill, lw) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
  if (fill) {
    c.fillStyle = fill;
    c.fill();
  }
  if (lw) {
    c.lineWidth = lw;
    c.strokeStyle = INK;
    c.stroke();
  }
}
function heart(c, x, y, s, fill) {
  c.beginPath();
  c.moveTo(x, y + s * 0.35);
  c.bezierCurveTo(
    x - s * 0.9,
    y - s * 0.25,
    x - s * 0.35,
    y - s * 0.85,
    x,
    y - s * 0.35,
  );
  c.bezierCurveTo(
    x + s * 0.35,
    y - s * 0.85,
    x + s * 0.9,
    y - s * 0.25,
    x,
    y + s * 0.35,
  );
  c.closePath();
  c.fillStyle = fill;
  c.fill();
}

