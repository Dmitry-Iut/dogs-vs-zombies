/* ================== Рисование зомби ================== */
const ZC = {
  basic: { shirt: "#7B5B3F", pants: "#45506B" },
  helmet: { shirt: "#E07A2E", pants: "#3F4A5E" },
  runner: { shirt: "#C93A3A", pants: "#C93A3A" },
  bucket: { shirt: "#6F7D5A", pants: "#4A4A58" },
  fatty: { shirt: "#8DB0C8", pants: "#5A4A3A" },
  boss: { shirt: "#5E2B74", pants: "#2E2440" },
  skater: { shirt: "#3E8ED0", pants: "#2E3B55" },
  door: { shirt: "#7B5B3F", pants: "#45506B" },
  giant: { shirt: "#6B4E3A", pants: "#3A3530" },
};
function drawZombie(c, z, x, y, s, t) {
  const boss = z.type === "boss",
    giant = z.type === "giant",
    fat = z.type === "fatty" || giant;
  const k = s * (boss ? 2.2 : giant ? 1.45 : fat ? 1.1 : 1);
  const C = ZC[z.type];
  const lw = Math.max(1, k * 0.03);
  const sk = z.flash > 0 ? "#EAF7DA" : z.slowT > 0 ? "#A3CDE8" : "#9DBE70";
  const ph = z.ph,
    walk = z.eating
      ? 0
      : Math.sin(t * 5.5 * (z.type === "runner" ? 1.8 : 1) + ph);
  const chomp = z.eating ? Math.sin(t * 14 + ph) : 0;
  c.save();
  c.translate(x, y);
  E(c, 0, k * 0.4, k * (fat ? 0.3 : 0.24), k * 0.07, "rgba(0,0,0,.25)");
  if (boss) {
    c.beginPath();
    c.moveTo(-k * 0.2, -k * 0.1);
    c.lineTo(k * 0.2, -k * 0.1);
    c.lineTo(k * 0.34, k * 0.38);
    c.lineTo(-k * 0.34, k * 0.38);
    c.closePath();
    c.fillStyle = "#3E1650";
    c.fill();
    c.lineWidth = lw;
    c.strokeStyle = INK;
    c.stroke();
    c.fillStyle = "#F0B945";
    c.fillRect(-k * 0.33, k * 0.33, k * 0.66, k * 0.04);
  }
  const tw = fat ? k * 0.27 : k * 0.19;
  if (z.type === "skater") {
    const sw = Math.sin(t * 3 + ph) * k * 0.02;
    rr(
      c,
      -k * 0.27 + sw,
      k * 0.38,
      k * 0.54,
      k * 0.05,
      k * 0.025,
      "#E6533C",
      lw,
    );
    E(c, -k * 0.17 + sw, k * 0.44, k * 0.03, k * 0.03, "#F0F0F0", lw * 0.6);
    E(c, k * 0.17 + sw, k * 0.44, k * 0.03, k * 0.03, "#F0F0F0", lw * 0.6);
  }
  rr(
    c,
    -tw * 0.8,
    k * 0.17 + walk * k * 0.03,
    tw * 0.65,
    k * 0.2,
    k * 0.04,
    C.pants,
    lw,
  );
  rr(
    c,
    tw * 0.15,
    k * 0.17 - walk * k * 0.03,
    tw * 0.65,
    k * 0.2,
    k * 0.04,
    C.pants,
    lw,
  );
  E(c, -tw * 0.48, k * 0.37 + walk * k * 0.03, tw * 0.42, k * 0.045, "#2E2A2A");
  E(c, tw * 0.48, k * 0.37 - walk * k * 0.03, tw * 0.42, k * 0.045, "#2E2A2A");
  rr(c, -tw, -k * 0.06, tw * 2, k * 0.3, k * 0.07, C.shirt, lw);
  if (z.type === "basic") {
    T(
      c,
      [-k * 0.03, -k * 0.05],
      [k * 0.03, -k * 0.05],
      [0, k * 0.14],
      "#C0392B",
      lw * 0.6,
    );
    c.fillStyle = "rgba(0,0,0,.18)";
    c.fillRect(tw * 0.3, k * 0.12, tw * 0.4, k * 0.06);
  }
  if (z.type === "helmet") {
    c.fillStyle = "#F6E45A";
    c.fillRect(-tw, k * 0.04, tw * 2, k * 0.035);
    c.fillRect(-tw, k * 0.13, tw * 2, k * 0.035);
  }
  if (z.type === "runner") {
    c.fillStyle = "#fff";
    c.fillRect(-tw * 0.72, -k * 0.05, k * 0.025, k * 0.28);
    c.fillRect(tw * 0.6, -k * 0.05, k * 0.025, k * 0.28);
  }
  if (z.type === "bucket") {
    E(c, tw * 0.4, k * 0.1, k * 0.04, k * 0.05, "rgba(0,0,0,.25)");
  }
  if (fat) {
    E(c, 0, k * 0.11, tw * 0.62, k * 0.12, sk, lw * 0.7);
    E(c, 0, k * 0.14, k * 0.015, k * 0.02, INK);
  }
  if (boss) {
    c.fillStyle = "#F0B945";
    c.fillRect(-k * 0.025, -k * 0.06, k * 0.05, k * 0.3);
    E(c, 0, k * 0.06, k * 0.05, k * 0.05, "#F0B945", lw * 0.6);
    E(c, 0, k * 0.06, k * 0.025, k * 0.025, "#D2483C");
  }
  const ay = chomp * k * 0.04;
  for (const sd of [-1, 1]) {
    c.save();
    c.translate(sd * tw * 0.95, -k * 0.02);
    c.rotate(sd * -0.28 + sd * walk * 0.08);
    rr(c, -k * 0.05, 0, k * 0.1, k * 0.2 + ay * sd, k * 0.04, C.shirt, lw);
    E(c, 0, k * 0.22 + ay * sd, k * 0.06, k * 0.055, sk, lw);
    c.restore();
  }
  if (giant) {
    c.save();
    c.translate(tw * 0.95, k * 0.05);
    c.rotate(-0.35 + (z.eating ? chomp * 0.5 : Math.sin(t * 2 + ph) * 0.1));
    rr(c, -k * 0.035, -k * 0.55, k * 0.07, k * 0.62, k * 0.03, "#8A8F96", lw);
    rr(
      c,
      -k * 0.06,
      -k * 0.58,
      k * 0.12,
      k * 0.06,
      k * 0.02,
      "#6B7078",
      lw * 0.7,
    );
    c.restore();
  }
  if (z.type === "door" && z.hp > z.base) {
    rr(c, -k * 0.25, -k * 0.12, k * 0.5, k * 0.5, k * 0.03, "#8B5A2B", lw);
    rr(
      c,
      -k * 0.18,
      -k * 0.06,
      k * 0.36,
      k * 0.14,
      k * 0.02,
      "#A8D8F0",
      lw * 0.6,
    );
    c.strokeStyle = "rgba(51,36,28,.45)";
    c.lineWidth = lw * 0.6;
    c.strokeRect(-k * 0.18, k * 0.13, k * 0.36, k * 0.18);
    E(c, k * 0.17, k * 0.17, k * 0.025, k * 0.025, "#F0B945", lw * 0.5);
    if (z.hp < z.base + (z.maxHp - z.base) * 0.45) {
      c.strokeStyle = INK;
      c.lineWidth = lw * 0.8;
      c.beginPath();
      c.moveTo(-k * 0.2, k * 0.0);
      c.lineTo(-k * 0.08, k * 0.12);
      c.lineTo(-k * 0.14, k * 0.24);
      c.stroke();
    }
  }
  const hx = Math.sin(t * 2 + ph) * k * 0.015,
    hy = -k * 0.2 + chomp * k * 0.01;
  E(c, hx, hy, k * 0.2, k * 0.19, sk, lw);
  c.strokeStyle = "rgba(51,36,28,.6)";
  c.lineWidth = lw * 0.6;
  c.beginPath();
  c.moveTo(hx + k * 0.1, hy + k * 0.06);
  c.lineTo(hx + k * 0.15, hy + k * 0.1);
  for (let i = 0; i < 3; i++) {
    c.moveTo(hx + k * 0.105 + i * k * 0.018, hy + k * 0.06 + i * k * 0.015);
    c.lineTo(hx + k * 0.13 + i * k * 0.018, hy + k * 0.045 + i * k * 0.015);
  }
  c.stroke();
  const eyeC = boss ? "#FF4A3A" : "#FFF8E0";
  E(c, hx - k * 0.075, hy - k * 0.02, k * 0.06, k * 0.065, eyeC, lw * 0.7);
  E(c, hx - k * 0.07, hy - k * 0.01, k * 0.018, k * 0.018, INK);
  E(c, hx + k * 0.08, hy - k * 0.01, k * 0.042, k * 0.042, eyeC, lw * 0.7);
  E(c, hx + k * 0.085, hy, k * 0.014, k * 0.014, INK);
  const mo = z.eating ? 0.5 + 0.5 * chomp : 0.25;
  rr(
    c,
    hx - k * 0.08,
    hy + k * 0.07,
    k * 0.16,
    k * 0.03 + k * 0.05 * mo,
    k * 0.015,
    "#3A1E1E",
  );
  c.fillStyle = "#FFF8E0";
  c.fillRect(hx - k * 0.05, hy + k * 0.07, k * 0.03, k * 0.025);
  c.fillRect(hx + k * 0.02, hy + k * 0.07, k * 0.03, k * 0.025);
  const armor = z.hp > z.base;
  if (z.type === "skater") {
    c.beginPath();
    c.arc(hx, hy - k * 0.06, k * 0.2, Math.PI, 0);
    c.closePath();
    c.fillStyle = "#E6533C";
    c.fill();
    c.lineWidth = lw;
    c.strokeStyle = INK;
    c.stroke();
    rr(
      c,
      hx + k * 0.08,
      hy - k * 0.09,
      k * 0.2,
      k * 0.04,
      k * 0.02,
      "#C23E2A",
      lw * 0.7,
    );
  }
  if (
    z.type === "basic" ||
    fat ||
    z.type === "door" ||
    (z.type === "helmet" && !armor) ||
    (z.type === "bucket" && !armor)
  ) {
    c.strokeStyle = "#4A3B2E";
    c.lineWidth = lw;
    c.beginPath();
    c.moveTo(hx - k * 0.04, hy - k * 0.18);
    c.lineTo(hx - k * 0.07, hy - k * 0.26);
    c.moveTo(hx, hy - k * 0.19);
    c.lineTo(hx + k * 0.01, hy - k * 0.28);
    c.moveTo(hx + k * 0.05, hy - k * 0.18);
    c.lineTo(hx + k * 0.09, hy - k * 0.25);
    c.stroke();
  }
  if (z.type === "helmet" && armor) {
    c.beginPath();
    c.arc(hx, hy - k * 0.04, k * 0.22, Math.PI, 0);
    c.closePath();
    c.fillStyle = "#F2C230";
    c.fill();
    c.lineWidth = lw;
    c.strokeStyle = INK;
    c.stroke();
    rr(
      c,
      hx - k * 0.27,
      hy - k * 0.06,
      k * 0.54,
      k * 0.05,
      k * 0.02,
      "#E0AE1E",
      lw,
    );
    c.fillStyle = "rgba(255,255,255,.45)";
    c.fillRect(hx - k * 0.1, hy - k * 0.22, k * 0.05, k * 0.1);
    if (z.hp < z.base + (z.maxHp - z.base) * 0.45) {
      c.strokeStyle = INK;
      c.lineWidth = lw * 0.7;
      c.beginPath();
      c.moveTo(hx + k * 0.05, hy - k * 0.25);
      c.lineTo(hx + k * 0.09, hy - k * 0.16);
      c.lineTo(hx + k * 0.05, hy - k * 0.1);
      c.stroke();
    }
  }
  if (z.type === "bucket" && armor) {
    c.beginPath();
    c.moveTo(hx - k * 0.22, hy + k * 0.02);
    c.lineTo(hx + k * 0.22, hy + k * 0.02);
    c.lineTo(hx + k * 0.17, hy - k * 0.29);
    c.lineTo(hx - k * 0.17, hy - k * 0.29);
    c.closePath();
    c.fillStyle = "#A3ACB5";
    c.fill();
    c.lineWidth = lw;
    c.strokeStyle = INK;
    c.stroke();
    c.fillStyle = "rgba(255,255,255,.4)";
    c.fillRect(hx - k * 0.12, hy - k * 0.26, k * 0.04, k * 0.25);
    c.fillStyle = "rgba(0,0,0,.15)";
    c.fillRect(hx - k * 0.2, hy - k * 0.09, k * 0.4, k * 0.03);
    if (z.hp < z.base + (z.maxHp - z.base) * 0.45)
      E(c, hx + k * 0.08, hy - k * 0.15, k * 0.05, k * 0.035, "#7E878F");
  }
  if (z.type === "runner") {
    rr(
      c,
      hx - k * 0.2,
      hy - k * 0.13,
      k * 0.4,
      k * 0.06,
      k * 0.02,
      "#fff",
      lw * 0.7,
    );
    c.fillStyle = "#C93A3A";
    c.fillRect(hx - k * 0.19, hy - k * 0.115, k * 0.38, k * 0.02);
  }
  if (boss) {
    c.beginPath();
    const cy = hy - k * 0.16;
    c.moveTo(hx - k * 0.17, cy);
    c.lineTo(hx - k * 0.19, cy - k * 0.16);
    c.lineTo(hx - k * 0.09, cy - k * 0.07);
    c.lineTo(hx, cy - k * 0.2);
    c.lineTo(hx + k * 0.09, cy - k * 0.07);
    c.lineTo(hx + k * 0.19, cy - k * 0.16);
    c.lineTo(hx + k * 0.17, cy);
    c.closePath();
    c.fillStyle = "#F5C542";
    c.fill();
    c.lineWidth = lw;
    c.strokeStyle = INK;
    c.stroke();
    E(c, hx, cy - k * 0.06, k * 0.025, k * 0.025, "#D2483C");
    E(c, hx - k * 0.11, cy - k * 0.04, k * 0.018, k * 0.018, "#4DB2FF");
    E(c, hx + k * 0.11, cy - k * 0.04, k * 0.018, k * 0.018, "#7BD15A");
  }
  c.restore();
}
function drawBone(c, x, y, s, rot, glow) {
  c.save();
  c.translate(x, y);
  c.rotate(rot || 0);
  if (glow) {
    const g = c.createRadialGradient(0, 0, 0, 0, 0, s * 0.9);
    g.addColorStop(0, "rgba(255,240,170,.75)");
    g.addColorStop(1, "rgba(255,240,170,0)");
    c.fillStyle = g;
    c.fillRect(-s, -s, s * 2, s * 2);
  }
  const L = s * 0.9,
    h = s * 0.26,
    lw = Math.max(1, s * 0.06);
  const parts = [
    [-L / 2, -h * 0.6],
    [-L / 2, h * 0.6],
    [L / 2, -h * 0.6],
    [L / 2, h * 0.6],
  ];
  parts.forEach((p) => E(c, p[0], p[1], h * 0.62, h * 0.62, null, lw));
  rr(c, -L / 2, -h / 2, L, h, h * 0.3, null, lw);
  parts.forEach((p) => E(c, p[0], p[1], h * 0.62, h * 0.62, "#FFF2D2"));
  rr(c, -L / 2, -h / 2, L, h, h * 0.3, "#FFF2D2");
  c.fillStyle = "rgba(200,160,100,.35)";
  c.fillRect(-L * 0.35, h * 0.05, L * 0.7, h * 0.3);
  c.restore();
}
function drawMower(c, x, y, s, t, moving) {
  c.save();
  c.translate(x, y);
  E(c, 0, s * 0.12, s * 0.3, s * 0.08, "rgba(0,0,0,.25)");
  E(c, 0, s * 0.04, s * 0.3, s * 0.13, "#2E3440", Math.max(1, s * 0.03));
  E(c, 0, -s * 0.01, s * 0.27, s * 0.1, "#4C566A");
  E(c, 0, -s * 0.03, s * 0.12, s * 0.045, "#3B4252");
  E(
    c,
    s * 0.16,
    -s * 0.02,
    s * 0.03,
    s * 0.03,
    moving ? (Math.sin(t * 20) > 0 ? "#7BD15A" : "#3a6") : "#4DB2FF",
  );
  c.restore();
}

