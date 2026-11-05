const cv = $("game"),
  ctx = cv.getContext("2d");
let W = 0,
  H = 0,
  DPR = 1,
  L = {},
  bg = null,
  G = null,
  state = "menu",
  paused = false,
  hover = null;
let PROG = { unlocked: 1 };
try {
  const sv = JSON.parse(localStorage.getItem("dvz-prog") || "null");
  if (sv && sv.unlocked) PROG = sv;
} catch (e) {}
PROG.unlocked = Math.max(1, Math.min(LEVELS.length, PROG.unlocked | 0));
try {
  if (localStorage.getItem("dvz-sound") === "off") S.on = false;
  const mv = localStorage.getItem("dvz-music");
  if (mv !== null && isFinite(+mv)) S.mvol = Math.max(0, Math.min(1, +mv));
} catch (e) {}
function saveProg() {
  try {
    localStorage.setItem("dvz-prog", JSON.stringify(PROG));
  } catch (e) {}
}
function resize() {
  const r = cv.parentElement.getBoundingClientRect();
  W = r.width;
  H = r.height;
  DPR = Math.min(3, window.devicePixelRatio || 1);
  cv.width = Math.max(1, Math.round(W * DPR));
  cv.height = Math.max(1, Math.round(H * DPR));
  const ch = H / (ROWS + 1.6),
    cw = W / COLS;
  L = { cw, ch, top: ch * 0.7, s: Math.min(cw, ch * 1.05) };
  L.fieldBottom = L.top + ch * ROWS;
  buildBg();
  sizeBgCanvas($("titleCv"));
  sizeBgCanvas($("finalCv"));
}
function sizeBgCanvas(c) {
  const r = c.getBoundingClientRect();
  if (!r.width) return;
  c.width = Math.round(r.width * DPR);
  c.height = Math.round(r.height * DPR);
  c._w = r.width;
  c._h = r.height;
}
const colX = (c) => (c + 0.5) * L.cw,
  rowY = (r) => L.top + r * L.ch;
function lawnPt(rnd) {
  return [rnd() * W, L.top + rnd() * L.ch * ROWS];
}
function bgDecor(b, th, rnd) {
  const kind = th.decor || "flowers";
  if (kind === "leaves")
    for (let i = 0; i < 70; i++) {
      const [x, y] = lawnPt(rnd);
      E(
        b,
        x,
        y,
        5,
        2.6,
        ["#E07A2E", "#D9473B", "#F0B945", "#B5652A"][i % 4],
        0,
        rnd() * 3,
      );
    }
  if (kind === "snow")
    for (let i = 0; i < 50; i++) {
      const [x, y] = lawnPt(rnd);
      E(b, x, y, rnd() * 10 + 6, rnd() * 3 + 2, "rgba(255,255,255,.7)");
    }
  if (kind === "stones")
    for (let i = 0; i < 28; i++) {
      const [x, y] = lawnPt(rnd),
        r = 2 + rnd() * 3;
      E(b, x, y, r * 1.3, r, "#8E959C", 1);
      E(b, x - r * 0.3, y - r * 0.3, r * 0.4, r * 0.3, "rgba(255,255,255,.35)");
    }
  if (kind === "puddles")
    for (let i = 0; i < 9; i++) {
      const [x, y] = lawnPt(rnd),
        r = L.s * (0.18 + rnd() * 0.14);
      E(b, x, y, r, r * 0.45, "rgba(70,90,120,.55)");
      E(b, x - r * 0.3, y - r * 0.12, r * 0.35, r * 0.1, "rgba(220,235,255,.45)");
    }
  if (kind === "flowers" || kind === "puddles")
    for (let i = 0; i < 16; i++) {
      const [x, y] = lawnPt(rnd),
        col = ["#fff", "#FFE36B", "#FFB3C8"][i % 3];
      for (let p = 0; p < 5; p++) {
        const a = (p / 5) * Math.PI * 2;
        E(b, x + Math.cos(a) * 3, y + Math.sin(a) * 3, 2.4, 2.4, col);
      }
      E(b, x, y, 1.8, 1.8, "#F0B945");
    }
}
function bgFence(b, th, rnd) {
  const fh = L.top * 0.62,
    pw = L.cw / 3,
    kind = th.fence || "wood";
  b.fillStyle = "rgba(0,0,0,.18)";
  b.fillRect(0, L.top - 2, W, 5);
  if (kind === "iron") {
    b.fillStyle = "#2B2830";
    b.fillRect(0, L.top - fh * 0.8, W, 3);
    b.fillRect(0, L.top - fh * 0.25, W, 3);
    for (let x = pw / 2; x < W; x += pw / 1.5) {
      b.fillRect(x - 1.5, L.top - fh, 3, fh);
      T(
        b,
        [x - 4, L.top - fh],
        [x, L.top - fh - 7],
        [x + 4, L.top - fh],
        "#2B2830",
      );
    }
    return;
  }
  if (kind === "hedge") {
    for (let x = 0; x < W + 20; x += 18) {
      const r = 11 + rnd() * 5;
      E(b, x, L.top - fh * 0.45, r, fh * 0.55, "#3F8A3A", 1);
    }
    for (let x = 6; x < W; x += 18)
      E(b, x, L.top - fh * 0.62, 6, 4, "rgba(255,255,255,.12)");
    return;
  }
  for (let x = 0, i = 0; x < W; x += pw, i++) {
    if (i % 7 === 3) continue;
    const h = fh * (0.85 + rnd() * 0.2);
    rr(b, x + 3, L.top - h, pw - 6, h + 3, 2, "#EADDC3", 1);
    b.fillStyle = "rgba(0,0,0,.08)";
    b.fillRect(x + pw - 8, L.top - h + 3, 2, h);
    if (kind === "snow") E(b, x + pw / 2, L.top - h, pw / 2 - 1, 4, "#FFFFFF");
  }
  b.fillStyle = "#CDBB9A";
  b.fillRect(0, L.top - fh * 0.55, W, 4);
}
function buildBg() {
  if (!W) return;
  bg = bg || document.createElement("canvas");
  bg.width = cv.width;
  bg.height = cv.height;
  const b = bg.getContext("2d");
  b.setTransform(DPR, 0, 0, DPR, 0, 0);
  const th = THEMES[G ? G.lv.theme : "day"],
    rnd = mulberry(11);
  b.fillStyle = th.street;
  b.fillRect(0, 0, W, L.top + 2);
  for (let i = 0; i < 140; i++) {
    b.fillStyle = rnd() < 0.5 ? "rgba(0,0,0,.09)" : "rgba(255,255,255,.07)";
    b.fillRect(rnd() * W, rnd() * L.top, 2, 2);
  }
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      b.fillStyle = (r + c) % 2 ? th.g1 : th.g2;
      b.fillRect(c * L.cw, L.top + r * L.ch, L.cw + 1, L.ch + 1);
    }
  b.strokeStyle = th.snow ? "rgba(120,150,180,.25)" : "rgba(30,90,20,.28)";
  b.lineWidth = 1.4;
  b.lineCap = "round";
  for (let i = 0; i < 260; i++) {
    const [x, y] = lawnPt(rnd);
    b.beginPath();
    b.moveTo(x, y);
    b.lineTo(x - 2, y - 5);
    b.moveTo(x + 2, y);
    b.lineTo(x + 3, y - 6);
    b.stroke();
  }
  bgDecor(b, th, rnd);
  bgFence(b, th, rnd);
  const dy = L.fieldBottom;
  b.fillStyle = th.deck;
  b.fillRect(0, dy, W, H - dy);
  b.strokeStyle = "rgba(60,30,10,.28)";
  b.lineWidth = 1.5;
  for (let y = dy + 8; y < H; y += 12) {
    b.beginPath();
    b.moveTo(0, y);
    b.lineTo(W, y);
    b.stroke();
  }
  b.fillStyle = "rgba(0,0,0,.22)";
  b.fillRect(0, dy, W, 4);
  for (let c = 0; c < COLS; c++)
    E(
      b,
      colX(c),
      dy + L.ch * 0.45 + 2,
      L.s * 0.34,
      L.s * 0.15,
      "rgba(60,30,10,.22)",
    );
  if (th.tint) {
    b.fillStyle = th.tint;
    b.fillRect(0, 0, W, H);
  }
  if (th.stars) {
    for (let i = 0; i < 30; i++) {
      b.fillStyle = "rgba(255,255,230," + (0.4 + rnd() * 0.5) + ")";
      b.fillRect(rnd() * W, rnd() * L.top * 0.6, 1.6, 1.6);
    }
    const mr = L.top * (th.bigMoon ? 0.3 : 0.18),
      mx = W * 0.86,
      my = L.top * 0.32;
    if (th.bigMoon) {
      const g = b.createRadialGradient(mx, my, mr, mx, my, mr * 3);
      g.addColorStop(0, "rgba(255,244,200,.35)");
      g.addColorStop(1, "rgba(255,244,200,0)");
      b.fillStyle = g;
      b.fillRect(mx - mr * 3, my - mr * 3, mr * 6, mr * 6);
    }
    E(b, mx, my, mr, mr, G && G.lv.theme === "boss" ? "#FF8A7A" : "#FFF4C8");
    if (th.bigMoon) {
      E(b, mx - mr * 0.3, my - mr * 0.2, mr * 0.2, mr * 0.2, "rgba(0,0,0,.08)");
      E(b, mx + mr * 0.35, my + mr * 0.3, mr * 0.14, mr * 0.14, "rgba(0,0,0,.08)");
    }
  }
  if (th.lamps)
    for (const lx of [W * 0.12, W * 0.62]) {
      const ly = L.top * 0.22;
      const g = b.createRadialGradient(lx, ly, 0, lx, ly, L.top * 1.3);
      g.addColorStop(0, "rgba(255,220,140,.42)");
      g.addColorStop(1, "rgba(255,220,140,0)");
      b.fillStyle = g;
      b.fillRect(lx - L.top * 1.3, 0, L.top * 2.6, L.top * 1.6);
      b.fillStyle = "#2B2830";
      b.fillRect(lx - 1.5, ly, 3, L.top - ly);
      E(b, lx, ly, 4.5, 4.5, "#FFE9A8", 1);
    }
  const v = b.createRadialGradient(
    W / 2,
    H / 2,
    Math.min(W, H) * 0.3,
    W / 2,
    H / 2,
    Math.max(W, H) * 0.75,
  );
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,.25)");
  b.fillStyle = v;
  b.fillRect(0, 0, W, H);
}
