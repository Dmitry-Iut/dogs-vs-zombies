/* ================== Состояние ================== */
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
  b.strokeStyle = "rgba(30,90,20,.28)";
  b.lineWidth = 1.4;
  b.lineCap = "round";
  for (let i = 0; i < 260; i++) {
    const x = rnd() * W,
      y = L.top + rnd() * L.ch * ROWS;
    b.beginPath();
    b.moveTo(x, y);
    b.lineTo(x - 2, y - 5);
    b.moveTo(x + 2, y);
    b.lineTo(x + 3, y - 6);
    b.stroke();
  }
  if (th.leaves)
    for (let i = 0; i < 70; i++) {
      const x = rnd() * W,
        y = L.top + rnd() * L.ch * ROWS;
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
  if (th.snow)
    for (let i = 0; i < 50; i++) {
      E(
        b,
        rnd() * W,
        L.top + rnd() * L.ch * ROWS,
        rnd() * 10 + 6,
        rnd() * 3 + 2,
        "rgba(255,255,255,.7)",
      );
    }
  for (let i = 0; i < (th.snow ? 0 : 16); i++) {
    const x = rnd() * W,
      y = L.top + rnd() * L.ch * ROWS,
      col = ["#fff", "#FFE36B", "#FFB3C8"][i % 3];
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2;
      E(b, x + Math.cos(a) * 3, y + Math.sin(a) * 3, 2.4, 2.4, col);
    }
    E(b, x, y, 1.8, 1.8, "#F0B945");
  }
  // забор
  const fh = L.top * 0.62,
    pw = L.cw / 3;
  b.fillStyle = "rgba(0,0,0,.18)";
  b.fillRect(0, L.top - 2, W, 5);
  for (let x = 0, i = 0; x < W; x += pw, i++) {
    if (i % 7 === 3) continue;
    const h = fh * (0.85 + rnd() * 0.2);
    rr(b, x + 3, L.top - h, pw - 6, h + 3, 2, "#EADDC3", 1);
    b.fillStyle = "rgba(0,0,0,.08)";
    b.fillRect(x + pw - 8, L.top - h + 3, 2, h);
  }
  b.fillStyle = "#CDBB9A";
  b.fillRect(0, L.top - fh * 0.55, W, 4);
  // крыльцо
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
  for (let c = 0; c < COLS; c++) {
    E(
      b,
      colX(c),
      dy + L.ch * 0.45 + 2,
      L.s * 0.34,
      L.s * 0.15,
      "rgba(60,30,10,.22)",
    );
  }
  if (th.tint) {
    b.fillStyle = th.tint;
    b.fillRect(0, 0, W, H);
  }
  if (th.stars) {
    for (let i = 0; i < 30; i++) {
      b.fillStyle = "rgba(255,255,230," + (0.4 + rnd() * 0.5) + ")";
      b.fillRect(rnd() * W, rnd() * L.top * 0.6, 1.6, 1.6);
    }
    E(
      b,
      W * 0.86,
      L.top * 0.3,
      L.top * 0.18,
      L.top * 0.18,
      G && G.lv.theme === "boss" ? "#FF8A7A" : "#FFF4C8",
    );
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

