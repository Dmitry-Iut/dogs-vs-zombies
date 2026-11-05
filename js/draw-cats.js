const CAT = {
  kitten: {
    fur: "#B9BEC8",
    light: "#F1F3F7",
    inner: "#F6B3BC",
    eye: "#8FD16A",
  },
  barsik: {
    fur: "#F2A24E",
    light: "#FFEBD2",
    inner: "#F6A8A2",
    eye: "#7BC74A",
    stripe: "#C8732A",
  },
  murka: {
    fur: "#FFFFFF",
    light: "#FFFFFF",
    inner: "#F6B3BC",
    eye: "#F0B945",
    p1: "#E58C3A",
    p2: "#3A3230",
  },
  luna: {
    fur: "#F4E8D2",
    light: "#FFF8EA",
    inner: "#E9A7A7",
    eye: "#6EC6FF",
    point: "#5A4334",
  },
  ugolek: {
    fur: "#2E2C38",
    light: "#45424F",
    inner: "#8A6070",
    eye: "#F5D33A",
  },
};
function catTail(c, P, type, k, t, ph, sl) {
  const col =
    type === "luna" ? P.point : type === "murka" ? P.p2 : P.fur;
  const wag = Math.sin(t * 2.2 + ph) * 0.25;
  c.save();
  c.translate(k * 0.16, k * 0.3);
  c.lineCap = "round";
  c.beginPath();
  c.moveTo(0, 0);
  if (sl) c.quadraticCurveTo(k * 0.18, k * 0.12, -k * 0.2, k * 0.1);
  else
    c.bezierCurveTo(
      k * 0.25,
      0,
      k * (0.3 + wag * 0.3),
      -k * 0.25,
      k * (0.18 + wag * 0.4),
      -k * 0.42,
    );
  c.strokeStyle = INK;
  c.lineWidth = k * 0.1 + Math.max(2, k * 0.06);
  c.stroke();
  c.strokeStyle = col;
  c.lineWidth = k * 0.1;
  c.stroke();
  c.restore();
}
function drawCat(c, type, x, y, s, o) {
  o = o || {};
  const t = o.t || 0,
    P = CAT[type],
    ph = o.ph || 0,
    sl = !!o.sleep;
  const k = type === "kitten" ? s * 0.82 : s;
  const lw = Math.max(1, s * 0.032);
  c.save();
  const sx = o.hurt > 0 ? Math.sin(t * 90) * s * 0.02 : 0;
  c.translate(x + sx, y + (type === "kitten" ? s * 0.07 : 0));
  if (o.alpha != null) c.globalAlpha = o.alpha;
  if (o.glow > 0) {
    const g = c.createRadialGradient(0, 0, 0, 0, 0, k * 0.55);
    g.addColorStop(0, "rgba(255,230,140," + 0.55 * o.glow + ")");
    g.addColorStop(1, "rgba(255,230,140,0)");
    c.fillStyle = g;
    c.fillRect(-k * 0.6, -k * 0.6, k * 1.2, k * 1.2);
  }
  const armed = type === "ugolek" && o.armed && !sl && !o.icon;
  if (armed) {
    const a = 0.35 + 0.25 * Math.sin(t * 20);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, k * 0.7);
    g.addColorStop(0, "rgba(245,211,58," + a + ")");
    g.addColorStop(1, "rgba(245,211,58,0)");
    c.fillStyle = g;
    c.fillRect(-k * 0.7, -k * 0.7, k * 1.4, k * 1.4);
  }
  E(c, 0, k * 0.37, k * 0.3, k * 0.075, "rgba(0,0,0,.22)");
  if (!sl) catTail(c, P, type, k, t, ph, sl);
  const by = sl ? k * 0.25 : k * 0.2;
  E(c, 0, by, k * 0.22, sl ? k * 0.14 : k * 0.18, P.fur, lw);
  E(c, 0, by + k * 0.04, k * 0.11, sl ? k * 0.08 : k * 0.12, P.light);
  if (type === "barsik") {
    c.strokeStyle = P.stripe;
    c.lineWidth = k * 0.035;
    c.lineCap = "round";
    c.beginPath();
    for (const sd of [-1, 1])
      for (let i = 0; i < 2; i++) {
        c.moveTo(sd * k * 0.2, by - k * 0.06 + i * k * 0.08);
        c.lineTo(sd * k * 0.12, by - k * 0.04 + i * k * 0.08);
      }
    c.stroke();
  }
  if (type === "murka") {
    E(c, -k * 0.12, by - k * 0.04, k * 0.08, k * 0.06, P.p1);
    E(c, k * 0.13, by + k * 0.03, k * 0.07, k * 0.06, P.p2);
  }
  if (!sl) {
    const pc =
      type === "luna" ? P.point : type === "ugolek" ? P.fur : P.light;
    E(c, -k * 0.09, k * 0.36, k * 0.06, k * 0.04, pc, lw);
    E(c, k * 0.09, k * 0.36, k * 0.06, k * 0.04, pc, lw);
  }
  const bob = sl
    ? 0
    : Math.sin(t * 3 + ph) * k * 0.01 - (o.fire > 0 ? o.fire * k * 0.03 : 0);
  c.translate(0, bob);
  const hy = sl ? k * 0.1 : -k * 0.1,
    hr = k * 0.25;
  for (const sd of [-1, 1]) {
    const ec =
      type === "luna"
        ? P.point
        : type === "murka"
          ? sd < 0
            ? P.p1
            : P.p2
          : P.fur;
    T(
      c,
      [sd * hr * 0.9, hy - hr * 0.15],
      [sd * hr * 0.78, hy - hr * 1.25],
      [sd * hr * 0.15, hy - hr * 0.75],
      ec,
      lw,
    );
    T(
      c,
      [sd * hr * 0.72, hy - hr * 0.32],
      [sd * hr * 0.7, hy - hr * 1.0],
      [sd * hr * 0.32, hy - hr * 0.72],
      P.inner,
    );
  }
  E(c, 0, hy, hr, hr * 0.86, P.fur, lw);
  if (type === "kitten") {
    E(c, -hr * 0.15, hy - hr * 0.85, hr * 0.12, hr * 0.16, P.fur);
    E(c, hr * 0.08, hy - hr * 0.88, hr * 0.1, hr * 0.15, P.fur);
  }
  if (type === "barsik") {
    c.strokeStyle = P.stripe;
    c.lineWidth = hr * 0.09;
    c.lineCap = "round";
    c.beginPath();
    for (const dx of [-0.25, 0, 0.25]) {
      c.moveTo(hr * dx, hy - hr * 0.8);
      c.lineTo(hr * dx * 0.8, hy - hr * 0.5);
    }
    c.stroke();
  }
  if (type === "murka") {
    E(c, -hr * 0.42, hy - hr * 0.35, hr * 0.4, hr * 0.34, P.p1);
    E(c, hr * 0.5, hy - hr * 0.45, hr * 0.3, hr * 0.26, P.p2);
  }
  if (type === "luna") E(c, 0, hy + hr * 0.18, hr * 0.62, hr * 0.5, P.point);
  else if (type !== "ugolek")
    E(c, 0, hy + hr * 0.34, hr * 0.38, hr * 0.24, P.light);
  const ex = hr * 0.4,
    ey = hy - hr * 0.02,
    er = hr * (type === "kitten" ? 0.21 : 0.17);
  for (const sd of [-1, 1]) {
    if (sl) {
      c.lineWidth = hr * 0.08;
      c.strokeStyle = type === "ugolek" ? P.eye : INK;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(sd * ex - er, ey + er * 0.2);
      c.quadraticCurveTo(sd * ex, ey + er * 0.9, sd * ex + er, ey + er * 0.2);
      c.stroke();
    } else {
      E(c, sd * ex, ey, er, er * 1.08, P.eye, lw * 0.6);
      E(
        c,
        sd * ex,
        ey,
        er * (armed ? 0.16 : 0.34),
        er * 0.88,
        INK,
      );
      E(c, sd * ex - er * 0.3, ey - er * 0.4, er * 0.26, er * 0.26, "#fff");
    }
  }
  T(
    c,
    [-hr * 0.09, hy + hr * 0.2],
    [hr * 0.09, hy + hr * 0.2],
    [0, hy + hr * 0.31],
    "#F07A8A",
  );
  const mouthC = type === "ugolek" ? "#F3E9E0" : INK;
  if (o.fire > 0 || armed) {
    E(c, 0, hy + hr * 0.46, hr * 0.13, hr * 0.11, "#7A2B2B");
    if (type === "murka" || armed) {
      T(
        c,
        [-hr * 0.1, hy + hr * 0.37],
        [-hr * 0.06, hy + hr * 0.46],
        [-hr * 0.02, hy + hr * 0.37],
        "#fff",
      );
      T(
        c,
        [hr * 0.1, hy + hr * 0.37],
        [hr * 0.06, hy + hr * 0.46],
        [hr * 0.02, hy + hr * 0.37],
        "#fff",
      );
    }
  } else {
    c.lineWidth = hr * 0.06;
    c.strokeStyle = mouthC;
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(-hr * 0.16, hy + hr * 0.36);
    c.quadraticCurveTo(-hr * 0.08, hy + hr * 0.46, 0, hy + hr * 0.32);
    c.quadraticCurveTo(hr * 0.08, hy + hr * 0.46, hr * 0.16, hy + hr * 0.36);
    c.stroke();
  }
  c.strokeStyle =
    type === "ugolek" || type === "luna"
      ? "rgba(255,255,255,.7)"
      : "rgba(51,36,28,.55)";
  c.lineWidth = Math.max(0.8, hr * 0.035);
  c.beginPath();
  for (const sd of [-1, 1])
    for (const i of [-1, 1]) {
      c.moveTo(sd * hr * 0.3, hy + hr * 0.3 + i * hr * 0.06);
      c.lineTo(sd * hr * 1.05, hy + hr * 0.22 + i * hr * 0.16);
    }
  c.stroke();
  if (type !== "ugolek") {
    E(c, -hr * 0.6, hy + hr * 0.3, hr * 0.13, hr * 0.07, "rgba(255,110,130,.4)");
    E(c, hr * 0.6, hy + hr * 0.3, hr * 0.13, hr * 0.07, "rgba(255,110,130,.4)");
  }
  c.translate(0, -bob);
  if (sl) catTail(c, P, type, k, t, ph, sl);
  if (sl && !o.icon) {
    c.fillStyle = "rgba(255,255,255,.9)";
    c.font = "900 " + Math.round(hr * 0.7) + "px Nunito, sans-serif";
    c.textAlign = "center";
    const zz = (t * 0.7 + ph) % 1;
    c.globalAlpha *= 1 - zz;
    c.fillText("z", hr * 0.9 + zz * hr * 0.4, hy - hr * 0.9 - zz * hr * 0.8);
  }
  c.restore();
}
function drawNip(c, x, y, s, o) {
  o = o || {};
  c.save();
  c.translate(x, y);
  if (o.alpha != null) c.globalAlpha = o.alpha;
  const lw = Math.max(1, s * 0.03);
  E(c, 0, s * 0.3, s * 0.22, s * 0.06, "rgba(0,0,0,.2)");
  c.strokeStyle = "#3E7A2A";
  c.lineWidth = s * 0.045;
  c.lineCap = "round";
  c.beginPath();
  c.moveTo(0, s * 0.3);
  c.lineTo(0, -s * 0.25);
  c.stroke();
  [
    [-1, 0.16],
    [1, 0.06],
    [-1, -0.07],
    [1, -0.17],
  ].forEach(([sd, yy], i) =>
    E(
      c,
      sd * s * 0.13,
      s * yy,
      s * 0.14,
      s * 0.07,
      i % 2 ? "#7BC74A" : "#6AB83E",
      lw,
      sd * -0.5,
    ),
  );
  for (let i = 0; i < 3; i++)
    E(
      c,
      (i - 1) * s * 0.06,
      -s * 0.3 - (i === 1 ? s * 0.05 : 0),
      s * 0.045,
      s * 0.045,
      "#C59BEA",
      lw * 0.6,
    );
  c.restore();
}
function drawUnit(c, type, x, y, s, o) {
  if (DOGS[type].item) drawNip(c, x, y, s, o);
  else if (DOGS[type].cat) drawCat(c, type, x, y, s, o);
  else drawDog(c, type, x, y, s, o);
}
