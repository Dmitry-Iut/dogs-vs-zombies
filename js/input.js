/* ================== Управление ================== */
function local(e) {
  const r = cv.getBoundingClientRect();
  return {
    x: ((e.clientX - r.left) * W) / (r.width || 1),
    y: ((e.clientY - r.top) * H) / (r.height || 1),
  };
}
/* Палец: косточки собираются с запасом и «проведением» по ним; собака встаёт там, где палец отпустили,
   а пока палец на экране — под ним видна полупрозрачная собака */
let aim = null;
const cellOf = (p) => ({
  c: Math.floor(p.x / L.cw),
  r: Math.floor((p.y - L.top) / L.ch),
});
cv.addEventListener("pointerdown", (e) => {
  S.init();
  if (state !== "play" || paused) return;
  const p = local(e),
    touch = e.pointerType !== "mouse";
  if (!touch) {
    tap(p.x, p.y);
    return;
  }
  ring(p.x, p.y, L.s * 0.32, "rgba(255,255,255,.75)");
  if (grabBone(p.x, p.y, true)) return;
  if (G.sel) {
    aim = e.pointerId;
    hover = cellOf(p);
    try {
      cv.setPointerCapture(e.pointerId);
    } catch (_) {}
    return;
  }
  tap(p.x, p.y);
});
cv.addEventListener("pointermove", (e) => {
  if (!G) return;
  const p = local(e);
  hover = cellOf(p);
  if (e.pointerType !== "mouse" && e.buttons && state === "play" && !paused)
    grabBone(p.x, p.y, true);
});
cv.addEventListener("pointerup", (e) => {
  if (aim !== e.pointerId) return;
  aim = null;
  if (state !== "play" || paused || !G.sel) return;
  const p = local(e);
  tap(p.x, p.y);
  hover = null;
});
cv.addEventListener("pointercancel", () => {
  aim = null;
  hover = null;
});
cv.addEventListener("pointerleave", (e) => {
  if (aim === null) hover = null;
});
function grabBone(x, y, touch) {
  let best = null,
    bd = touch ? Math.max(46, L.s * 0.75) : Math.max(32, L.s * 0.5);
  for (const it of G.items) {
    if (it.col) continue;
    const d = Math.hypot(it.x - x, it.y - y);
    if (d < bd) {
      bd = d;
      best = it;
    }
  }
  if (best) collect(best);
  return !!best;
}
function tap(x, y) {
  if (grabBone(x, y, false)) return;
  const c = Math.floor(x / L.cw),
    r = Math.floor((y - L.top) / L.ch);
  const inF = c >= 0 && c < COLS && r >= 0 && r < ROWS;
  if (G.shovel) {
    if (inF && G.grid[r][c]) {
      const d = G.grid[r][c];
      burst(colX(c), rowY(r + 0.7), 10, "rgba(120,80,40,.7)", 120, 3);
      removeDog(d, true);
      S.dig();
    }
    G.shovel = false;
    updShovel();
    return;
  }
  if (G.sel) {
    if (!inF) {
      G.sel = null;
      return;
    }
    if (G.grid[r][c]) {
      S.err();
      float(colX(c), rowY(r + 0.5), "Занято", "#FFE0E6", 14);
      return;
    }
    place(G.sel, r, c);
  }
}
$("shovelBtn").addEventListener("click", () => {
  if (state !== "play" || paused) return;
  G.shovel = !G.shovel;
  G.sel = null;
  updShovel();
  S.dig();
});
$("speedBtn").addEventListener("click", () => {
  if (state !== "play") return;
  G.speed = G.speed === 1 ? 2 : 1;
  $("speedBtn").textContent = "x" + G.speed;
  $("speedBtn").classList.toggle("on", G.speed === 2);
});
$("pauseBtn").addEventListener("click", () => {
  if (state === "play" && !paused) pauseGame();
});
function pauseGame() {
  paused = true;
  S.stopMusic(true);
  syncSoundLabels();
  show("sPause");
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden && state === "play" && !paused) pauseGame();
});
document.addEventListener("pointerdown", () => S.init());

