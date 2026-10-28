/* ================== Титульный и финальный фон ================== */
function drawScene(cvs, t, mode) {
  if (!cvs._w) return;
  const c = cvs.getContext("2d");
  const w = cvs._w,
    h = cvs._h;
  c.setTransform(DPR, 0, 0, DPR, 0, 0);
  const sky = c.createLinearGradient(0, 0, 0, h);
  if (mode === "final") {
    sky.addColorStop(0, "#2A1B3D");
    sky.addColorStop(0.6, "#6B3A5E");
    sky.addColorStop(1, "#D9798A");
  } else {
    sky.addColorStop(0, "#5FB4E8");
    sky.addColorStop(0.55, "#BFE6F5");
    sky.addColorStop(1, "#E8F6D8");
  }
  c.fillStyle = sky;
  c.fillRect(0, 0, w, h);
  const gy = h * 0.66,
    cw = w / 5,
    ch = cw * 0.85;
  for (let r = 0; r * ch + gy < h; r++)
    for (let i = 0; i < 5; i++) {
      c.fillStyle = (r + i) % 2 ? "#8AD058" : "#7AC34A";
      c.fillRect(i * cw, gy + r * ch, cw + 1, ch + 1);
    }
  if (mode !== "final") {
    for (let i = 0; i < 3; i++) {
      const cx = ((t * 12 + i * 170) % (w + 160)) - 80,
        cy = h * (0.12 + i * 0.07);
      E(c, cx, cy, 40, 14, "rgba(255,255,255,.85)");
      E(c, cx + 22, cy - 8, 24, 14, "rgba(255,255,255,.85)");
    }
  }
  const s = Math.min(cw * 1.05, 90);
  const dogs =
    mode === "final"
      ? ["corgi", "husky", "pug", "samoyed", "dachshund", "dalmatian"]
      : ["corgi", "pug", "samoyed", "dalmatian", "bulldog"];
  const n = dogs.length,
    step = w / (n + 0.2);
  if (mode !== "final") {
    const zx = w * 0.84,
      zy = gy - s * 0.05 + Math.sin(t * 2) * 4;
    drawZombie(
      c,
      {
        type: "basic",
        hp: 200,
        maxHp: 200,
        base: 200,
        ph: 0,
        flash: 0,
        slowT: 0,
        eating: false,
      },
      zx,
      zy - s * 0.15,
      s * 0.8,
      t,
    );
    c.fillStyle = "#E9DCC2";
    for (let x = 0; x < w; x += cw / 3)
      rr(c, x + 3, gy - s * 0.32, cw / 3 - 6, s * 0.34, 2, "#EADDC3", 1);
  }
  dogs.forEach((k, i) => {
    const x = step * (i + 0.6),
      y =
        gy +
        ch * (mode === "final" ? 0.9 : 1.05) -
        Math.abs(Math.sin(t * 3 + i)) * s * 0.12;
    drawDog(c, k, x, y, s * (mode === "final" ? 0.95 : 1), {
      t,
      ph: i,
      armed: true,
      fire: mode === "final" ? 0 : Math.sin(t * 2 + i) > 0.9 ? 1 : 0,
    });
  });
  if (mode === "final") {
    if (!cvs._h2)
      cvs._h2 = Array.from({ length: 26 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        s: rand(8, 18),
        v: rand(20, 50),
        p: Math.random() * 6,
      }));
    cvs._h2.forEach((p) => {
      p.y -= p.v * (1 / 60);
      if (p.y < -20) {
        p.y = h + 20;
        p.x = Math.random() * w;
      }
      heart(c, p.x + Math.sin(t + p.p) * 10, p.y, p.s, "rgba(255,120,150,.75)");
    });
  }
}

