/* ================== Рисование собак ================== */
const BREED = {
  corgi: { fur: "#E98B35", light: "#FFF3E2", inner: "#F7A9A0" },
  husky: {
    fur: "#646C7A",
    light: "#F3F5F8",
    inner: "#F3F5F8",
    iris: "#4DB2FF",
  },
  bulldog: { fur: "#D9A064", light: "#FCEFE0", dark: "#9A6135" },
  samoyed: {
    fur: "#FFFFFF",
    light: "#FFFFFF",
    inner: "#F7B2B8",
    fluff: "#E7ECF3",
  },
  chihuahua: { fur: "#E4B077", light: "#FFF0DD", inner: "#F6A8A2" },
  dalmatian: { fur: "#FFFFFF", light: "#FFFFFF", spot: "#2B2B2E" },
  pug: { fur: "#E9D2A6", light: "#F4E3C3", mask: "#3A3230" },
  dachshund: { fur: "#A4552A", light: "#D08850", dark: "#6E3417" },
  retriever: { fur: "#E8B45E", light: "#F6D9A0", dark: "#C98E3A" },
  bernard: { fur: "#FFFFFF", light: "#FFFFFF", patch: "#A65A2A" },
};
function face(c, hy, hr, f) {
  f = f || {};
  const ex = hr * (f.ex || 0.4),
    ey = hy - hr * 0.02,
    er = hr * (f.er || 0.13);
  c.lineCap = "round";
  for (const s of [-1, 1]) {
    if (f.closed) {
      c.lineWidth = hr * 0.08;
      c.strokeStyle = INK;
      c.beginPath();
      c.moveTo(s * ex - er, ey + er * 0.2);
      c.quadraticCurveTo(s * ex, ey + er * 0.9, s * ex + er, ey + er * 0.2);
      c.stroke();
    } else if (f.happy) {
      c.lineWidth = hr * 0.08;
      c.strokeStyle = INK;
      c.beginPath();
      c.arc(s * ex, ey + er * 0.5, er, Math.PI * 1.15, Math.PI * 1.85);
      c.stroke();
    } else {
      if (f.iris) {
        E(c, s * ex, ey, er, er, "#fff");
        E(c, s * ex, ey, er * 0.82, er * 0.82, f.iris);
        E(c, s * ex, ey, er * 0.42, er * 0.42, INK);
      } else E(c, s * ex, ey, er, er, INK);
      E(c, s * ex - er * 0.33, ey - er * 0.38, er * 0.36, er * 0.36, "#fff");
      if (f.big)
        E(c, s * ex + er * 0.35, ey + er * 0.35, er * 0.16, er * 0.16, "#fff");
    }
  }
  const ny = hy + hr * (f.ny || 0.27);
  E(c, 0, ny, hr * (f.nose || 0.14), hr * (f.nose || 0.14) * 0.72, INK);
  E(
    c,
    -hr * 0.04,
    ny - hr * 0.03,
    hr * 0.045,
    hr * 0.025,
    "rgba(255,255,255,.7)",
  );
  c.lineWidth = hr * 0.065;
  c.strokeStyle = INK;
  if (f.open) {
    E(c, 0, ny + hr * 0.24, hr * 0.15, hr * 0.13, "#7A2B2B");
    E(c, 0, ny + hr * 0.3, hr * 0.09, hr * 0.06, "#F07A8A");
  } else if (f.grump) {
    c.beginPath();
    c.moveTo(-hr * 0.32, ny + hr * 0.26);
    c.quadraticCurveTo(0, ny + hr * 0.1, hr * 0.32, ny + hr * 0.26);
    c.stroke();
    T(
      c,
      [-hr * 0.24, ny + hr * 0.22],
      [-hr * 0.18, ny + hr * 0.05],
      [-hr * 0.12, ny + hr * 0.2],
      "#fff",
      hr * 0.03,
    );
    T(
      c,
      [hr * 0.24, ny + hr * 0.22],
      [hr * 0.18, ny + hr * 0.05],
      [hr * 0.12, ny + hr * 0.2],
      "#fff",
      hr * 0.03,
    );
  } else {
    c.beginPath();
    c.moveTo(-hr * 0.18, ny + hr * 0.15);
    c.quadraticCurveTo(-hr * 0.08, ny + hr * 0.27, 0, ny + hr * 0.13);
    c.quadraticCurveTo(hr * 0.08, ny + hr * 0.27, hr * 0.18, ny + hr * 0.15);
    c.stroke();
    if (f.tongue) {
      E(c, hr * 0.02, ny + hr * 0.3, hr * 0.08, hr * 0.1, "#F07A8A", hr * 0.03);
    }
  }
  if (!f.noblush) {
    E(
      c,
      -hr * 0.62,
      hy + hr * 0.28,
      hr * 0.14,
      hr * 0.08,
      "rgba(255,110,130,.42)",
    );
    E(
      c,
      hr * 0.62,
      hy + hr * 0.28,
      hr * 0.14,
      hr * 0.08,
      "rgba(255,110,130,.42)",
    );
  }
}
function fluff(c, x, y, R, r, n, fill, lw) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    pts.push([x + Math.cos(a) * R, y + Math.sin(a) * R * 0.92]);
  }
  pts.forEach((p) => E(c, p[0], p[1], r, r, null, lw));
  pts.forEach((p) => E(c, p[0], p[1], r, r, fill));
  E(c, x, y, R, R * 0.92, fill);
}
function drawDog(c, type, x, y, s, o) {
  o = o || {};
  const t = o.t || 0,
    B = BREED[type],
    ph = o.ph || 0;
  const lw = Math.max(1, s * 0.032);
  const k = type === "chihuahua" ? s * 0.84 : s;
  c.save();
  let sx = 0;
  if (o.hurt > 0) sx = Math.sin(t * 90) * s * 0.02;
  if (type === "chihuahua" && o.armed) sx += Math.sin(t * 70) * s * 0.015;
  c.translate(x + sx, y + (type === "chihuahua" ? s * 0.06 : 0));
  if (o.alpha != null) c.globalAlpha = o.alpha;
  if (o.glow > 0) {
    const g = c.createRadialGradient(0, 0, 0, 0, 0, k * 0.55);
    g.addColorStop(0, "rgba(255,230,140," + 0.55 * o.glow + ")");
    g.addColorStop(1, "rgba(255,230,140,0)");
    c.fillStyle = g;
    c.fillRect(-k * 0.6, -k * 0.6, k * 1.2, k * 1.2);
  }
  E(c, 0, k * 0.37, k * 0.3, k * 0.075, "rgba(0,0,0,.22)");
  // хвост
  const wag = Math.sin(t * 9 + ph) * 0.5;
  c.save();
  c.translate(k * 0.18, k * 0.15);
  c.rotate(-0.9 + wag);
  if (type === "samoyed") E(c, 0, -k * 0.1, k * 0.09, k * 0.14, B.fur, lw);
  else if (type === "bulldog")
    E(c, 0, -k * 0.03, k * 0.04, k * 0.05, B.fur, lw);
  else if (type === "corgi") E(c, 0, -k * 0.06, k * 0.06, k * 0.08, B.fur, lw);
  else if (type === "husky") {
    E(c, 0, -k * 0.1, k * 0.06, k * 0.13, B.fur, lw);
    E(c, 0, -k * 0.2, k * 0.035, k * 0.04, B.light);
  } else if (type === "pug") {
    c.lineCap = "round";
    c.lineWidth = k * 0.06;
    c.strokeStyle = INK;
    c.beginPath();
    c.arc(0, -k * 0.06, k * 0.05, 0, Math.PI * 1.7);
    c.stroke();
    c.lineWidth = k * 0.035;
    c.strokeStyle = B.fur;
    c.stroke();
  } else E(c, 0, -k * 0.1, k * 0.035, k * 0.12, B.fur, lw);
  c.restore();
  // тело
  const bw =
    type === "bulldog"
      ? k * 0.3
      : type === "dachshund"
        ? k * 0.34
        : type === "bernard"
          ? k * 0.29
          : k * 0.24;
  if (type === "samoyed") fluff(c, 0, k * 0.2, k * 0.2, k * 0.08, 9, B.fur, lw);
  else E(c, 0, k * 0.2, bw, k * 0.18, B.fur, lw);
  E(
    c,
    0,
    k * 0.23,
    bw * 0.52,
    k * 0.12,
    type === "samoyed" ? "#F6F8FB" : B.light,
  );
  if (type === "dalmatian") {
    E(c, -k * 0.13, k * 0.15, k * 0.035, k * 0.03, B.spot);
    E(c, k * 0.15, k * 0.24, k * 0.03, k * 0.025, B.spot);
    E(c, k * 0.06, k * 0.1, k * 0.022, k * 0.02, B.spot);
  }
  if (type === "husky") {
    E(c, 0, k * 0.25, bw * 0.5, k * 0.11, B.light);
  }
  if (type === "bernard") {
    E(c, -k * 0.17, k * 0.13, k * 0.08, k * 0.06, B.patch);
    E(c, k * 0.19, k * 0.18, k * 0.07, k * 0.06, B.patch);
  }
  E(
    c,
    -k * 0.11,
    k * 0.35,
    k * 0.075,
    k * 0.05,
    B.light === "#FFFFFF" ? "#F2F4F8" : B.light,
    lw,
  );
  E(
    c,
    k * 0.11,
    k * 0.35,
    k * 0.075,
    k * 0.05,
    B.light === "#FFFFFF" ? "#F2F4F8" : B.light,
    lw,
  );
  // голова
  const bob =
    Math.sin(t * 3.2 + ph) * k * 0.012 - (o.fire > 0 ? o.fire * k * 0.03 : 0);
  c.translate(0, bob);
  const hy = -k * 0.1,
    hr = k * 0.27;
  const open = o.fire > 0;
  if (type === "corgi") {
    T(
      c,
      [-hr * 0.82, hy - hr * 0.25],
      [-hr * 0.92, hy - hr * 1.5],
      [-hr * 0.12, hy - hr * 0.8],
      B.fur,
      lw,
    );
    T(
      c,
      [hr * 0.82, hy - hr * 0.25],
      [hr * 0.92, hy - hr * 1.5],
      [hr * 0.12, hy - hr * 0.8],
      B.fur,
      lw,
    );
    T(
      c,
      [-hr * 0.68, hy - hr * 0.42],
      [-hr * 0.82, hy - hr * 1.25],
      [-hr * 0.32, hy - hr * 0.8],
      B.inner,
    );
    T(
      c,
      [hr * 0.68, hy - hr * 0.42],
      [hr * 0.82, hy - hr * 1.25],
      [hr * 0.32, hy - hr * 0.8],
      B.inner,
    );
    E(c, 0, hy, hr, hr * 0.9, B.fur, lw);
    E(c, 0, hy + hr * 0.4, hr * 0.62, hr * 0.44, B.light);
    E(c, 0, hy - hr * 0.25, hr * 0.11, hr * 0.42, B.light);
    face(c, hy, hr, { open, tongue: !open });
  } else if (type === "husky") {
    T(
      c,
      [-hr * 0.85, hy - hr * 0.2],
      [-hr * 0.75, hy - hr * 1.55],
      [-hr * 0.1, hy - hr * 0.8],
      B.fur,
      lw,
    );
    T(
      c,
      [hr * 0.85, hy - hr * 0.2],
      [hr * 0.75, hy - hr * 1.55],
      [hr * 0.1, hy - hr * 0.8],
      B.fur,
      lw,
    );
    T(
      c,
      [-hr * 0.68, hy - hr * 0.4],
      [-hr * 0.66, hy - hr * 1.25],
      [-hr * 0.3, hy - hr * 0.8],
      B.inner,
    );
    T(
      c,
      [hr * 0.68, hy - hr * 0.4],
      [hr * 0.66, hy - hr * 1.25],
      [hr * 0.3, hy - hr * 0.8],
      B.inner,
    );
    E(c, 0, hy, hr, hr * 0.92, B.fur, lw);
    E(c, 0, hy + hr * 0.33, hr * 0.8, hr * 0.56, B.light);
    E(c, 0, hy - hr * 0.05, hr * 0.16, hr * 0.4, B.light);
    E(c, -hr * 0.4, hy - hr * 0.3, hr * 0.11, hr * 0.07, B.light);
    E(c, hr * 0.4, hy - hr * 0.3, hr * 0.11, hr * 0.07, B.light);
    face(c, hy, hr, { iris: B.iris, er: 0.15, open });
  } else if (type === "bulldog") {
    E(c, -hr * 0.95, hy - hr * 0.55, hr * 0.3, hr * 0.2, B.dark, lw, -0.4);
    E(c, hr * 0.95, hy - hr * 0.55, hr * 0.3, hr * 0.2, B.dark, lw, 0.4);
    E(c, 0, hy + hr * 0.08, hr * 1.12, hr * 0.88, B.fur, lw);
    E(c, 0, hy + hr * 0.42, hr * 0.74, hr * 0.42, B.light, lw * 0.6);
    c.lineWidth = hr * 0.05;
    c.strokeStyle = "rgba(51,36,28,.5)";
    c.beginPath();
    c.moveTo(-hr * 0.3, hy - hr * 0.42);
    c.quadraticCurveTo(0, hy - hr * 0.55, hr * 0.3, hy - hr * 0.42);
    c.moveTo(-hr * 0.2, hy - hr * 0.3);
    c.quadraticCurveTo(0, hy - hr * 0.4, hr * 0.2, hy - hr * 0.3);
    c.stroke();
    face(c, hy, hr, { ex: 0.46, nose: 0.19, ny: 0.22, grump: !open, open });
    rr(
      c,
      -hr * 0.85,
      hy + hr * 0.86,
      hr * 1.7,
      hr * 0.24,
      hr * 0.1,
      "#D2483C",
      lw,
    );
    for (let i = -2; i <= 2; i++)
      T(
        c,
        [i * hr * 0.32 - hr * 0.07, hy + hr * 0.88],
        [i * hr * 0.32, hy + hr * 0.72],
        [i * hr * 0.32 + hr * 0.07, hy + hr * 0.88],
        "#C9CED6",
        lw * 0.6,
      );
    if (o.hpR != null && o.hpR < 0.66) {
      c.save();
      c.translate(hr * 0.5, hy - hr * 0.55);
      c.rotate(0.6);
      rr(
        c,
        -hr * 0.3,
        -hr * 0.09,
        hr * 0.6,
        hr * 0.18,
        hr * 0.06,
        "#F4C9A0",
        lw * 0.6,
      );
      rr(c, -hr * 0.08, -hr * 0.09, hr * 0.16, hr * 0.18, 0, "#E8B387");
      c.restore();
    }
    if (o.hpR != null && o.hpR < 0.33) {
      c.save();
      c.translate(-hr * 0.55, hy - hr * 0.1);
      c.rotate(-0.5);
      rr(
        c,
        -hr * 0.28,
        -hr * 0.08,
        hr * 0.56,
        hr * 0.16,
        hr * 0.06,
        "#F4C9A0",
        lw * 0.6,
      );
      c.restore();
      E(c, hr * 1.05, hy - hr * 0.1, hr * 0.07, hr * 0.11, "#7FC8FF");
    }
  } else if (type === "samoyed") {
    T(
      c,
      [-hr * 0.85, hy - hr * 0.3],
      [-hr * 0.7, hy - hr * 1.45],
      [-hr * 0.15, hy - hr * 0.85],
      B.fur,
      lw,
    );
    T(
      c,
      [hr * 0.85, hy - hr * 0.3],
      [hr * 0.7, hy - hr * 1.45],
      [hr * 0.15, hy - hr * 0.85],
      B.fur,
      lw,
    );
    T(
      c,
      [-hr * 0.66, hy - hr * 0.5],
      [-hr * 0.62, hy - hr * 1.2],
      [-hr * 0.33, hy - hr * 0.88],
      B.inner,
    );
    T(
      c,
      [hr * 0.66, hy - hr * 0.5],
      [hr * 0.62, hy - hr * 1.2],
      [hr * 0.33, hy - hr * 0.88],
      B.inner,
    );
    fluff(c, 0, hy + hr * 0.05, hr * 0.9, hr * 0.27, 12, B.fur, lw);
    E(c, -hr * 0.55, hy + hr * 0.35, hr * 0.2, hr * 0.15, B.fluff);
    E(c, hr * 0.55, hy + hr * 0.35, hr * 0.2, hr * 0.15, B.fluff);
    face(c, hy, hr, { happy: !open, open: true });
  } else if (type === "chihuahua") {
    T(
      c,
      [-hr * 0.45, hy - hr * 0.55],
      [-hr * 1.85, hy - hr * 1.05],
      [-hr * 0.85, hy + hr * 0.2],
      B.fur,
      lw,
    );
    T(
      c,
      [hr * 0.45, hy - hr * 0.55],
      [hr * 1.85, hy - hr * 1.05],
      [hr * 0.85, hy + hr * 0.2],
      B.fur,
      lw,
    );
    T(
      c,
      [-hr * 0.6, hy - hr * 0.45],
      [-hr * 1.55, hy - hr * 0.9],
      [-hr * 0.85, hy + hr * 0.02],
      B.inner,
    );
    T(
      c,
      [hr * 0.6, hy - hr * 0.45],
      [hr * 1.55, hy - hr * 0.9],
      [hr * 0.85, hy + hr * 0.02],
      B.inner,
    );
    E(c, 0, hy, hr * 0.95, hr * 0.86, B.fur, lw);
    E(c, 0, hy + hr * 0.42, hr * 0.45, hr * 0.32, B.light);
    face(c, hy, hr, {
      er: 0.22,
      big: true,
      closed: !o.armed && !o.icon,
      ny: 0.3,
      open,
    });
    if (o.armed) {
      const on = Math.sin(t * 12) > 0;
      E(
        c,
        0,
        hy + hr * 0.95,
        hr * 0.13,
        hr * 0.13,
        on ? "#FF4B4B" : "#8C2525",
        lw * 0.6,
      );
    } else if (!o.icon) {
      c.fillStyle = "rgba(255,255,255,.9)";
      c.font = "900 " + Math.round(hr * 0.7) + "px Nunito, sans-serif";
      c.textAlign = "center";
      const zz = (t * 0.8) % 1;
      c.globalAlpha *= 1 - zz;
      c.fillText("z", hr * 0.9 + zz * hr * 0.4, hy - hr * 0.9 - zz * hr * 0.8);
    }
  } else if (type === "dalmatian") {
    E(c, 0, hy, hr, hr * 0.9, B.fur, lw);
    [
      [-0.45, -0.45, 0.15],
      [0.38, -0.55, 0.1],
      [0.58, 0.08, 0.09],
      [-0.15, -0.75, 0.07],
      [-0.62, 0.12, 0.07],
    ].forEach((p) =>
      E(c, hr * p[0], hy + hr * p[1], hr * p[2], hr * p[2] * 0.85, B.spot),
    );
    E(c, -hr * 0.98, hy + hr * 0.1, hr * 0.24, hr * 0.46, B.spot, lw, 0.25);
    E(c, hr * 0.98, hy + hr * 0.1, hr * 0.24, hr * 0.46, B.spot, lw, -0.25);
    face(c, hy, hr, { open, tongue: !open });
    rr(
      c,
      -hr * 0.6,
      hy + hr * 0.86,
      hr * 1.2,
      hr * 0.18,
      hr * 0.08,
      "#D2483C",
      lw * 0.8,
    );
    E(c, 0, hy + hr * 1.08, hr * 0.1, hr * 0.1, "#F0B945", lw * 0.6);
  } else if (type === "pug") {
    E(c, -hr * 0.88, hy - hr * 0.55, hr * 0.26, hr * 0.2, B.mask, lw, -0.6);
    E(c, hr * 0.88, hy - hr * 0.55, hr * 0.26, hr * 0.2, B.mask, lw, 0.6);
    E(c, 0, hy + hr * 0.05, hr * 1.05, hr * 0.9, B.fur, lw);
    c.lineWidth = hr * 0.05;
    c.strokeStyle = "rgba(51,36,28,.45)";
    c.beginPath();
    c.moveTo(-hr * 0.25, hy - hr * 0.5);
    c.quadraticCurveTo(0, hy - hr * 0.62, hr * 0.25, hy - hr * 0.5);
    c.moveTo(-hr * 0.15, hy - hr * 0.38);
    c.quadraticCurveTo(0, hy - hr * 0.46, hr * 0.15, hy - hr * 0.38);
    c.stroke();
    E(c, 0, hy + hr * 0.4, hr * 0.56, hr * 0.42, B.mask);
    face(c, hy, hr, { er: 0.21, big: true, ex: 0.46 });
    E(c, 0, hy + hr * 0.66, hr * 0.1, hr * 0.09, "#F07A8A");
    if (open) {
      E(c, 0, hy - hr * 1.25, hr * 0.3, hr * 0.2, "rgba(215,240,195,.85)");
      E(
        c,
        hr * 0.3,
        hy - hr * 1.4,
        hr * 0.18,
        hr * 0.13,
        "rgba(215,240,195,.75)",
      );
    }
  } else if (type === "dachshund") {
    E(c, 0, hy, hr * 0.9, hr * 0.85, B.fur, lw);
    E(c, 0, hy + hr * 0.45, hr * 0.42, hr * 0.38, B.light, lw * 0.7);
    E(c, -hr * 0.88, hy + hr * 0.2, hr * 0.26, hr * 0.55, B.dark, lw, 0.15);
    E(c, hr * 0.88, hy + hr * 0.2, hr * 0.26, hr * 0.55, B.dark, lw, -0.15);
    const chew = o.chew > 0;
    face(c, hy - hr * 0.05, hr, {
      closed: chew,
      ny: 0.45,
      open: open && !chew,
    });
    if (chew) {
      E(
        c,
        -hr * 0.42,
        hy + hr * 0.5,
        hr * 0.2,
        hr * 0.15,
        "rgba(255,110,130,.55)",
      );
      E(
        c,
        hr * 0.42,
        hy + hr * 0.5,
        hr * 0.2,
        hr * 0.15,
        "rgba(255,110,130,.55)",
      );
    }
  } else if (type === "retriever") {
    E(c, 0, hy, hr, hr * 0.9, B.fur, lw);
    E(c, 0, hy + hr * 0.38, hr * 0.56, hr * 0.4, B.light);
    E(c, -hr * 0.95, hy + hr * 0.12, hr * 0.27, hr * 0.5, B.dark, lw, 0.3);
    E(c, hr * 0.95, hy + hr * 0.12, hr * 0.27, hr * 0.5, B.dark, lw, -0.3);
    face(c, hy, hr, { open, tongue: !open });
    if (!open) {
      E(c, k * 0.27, k * 0.27, k * 0.13, k * 0.05, "#E6533C", lw * 0.8);
      E(c, k * 0.27, k * 0.26, k * 0.07, k * 0.025, "#F07A5A");
    }
  } else if (type === "bernard") {
    E(c, -hr * 0.98, hy + hr * 0.05, hr * 0.27, hr * 0.45, B.patch, lw, 0.25);
    E(c, hr * 0.98, hy + hr * 0.05, hr * 0.27, hr * 0.45, B.patch, lw, -0.25);
    E(c, 0, hy + hr * 0.05, hr * 1.08, hr * 0.92, B.fur, lw);
    E(c, -hr * 0.45, hy - hr * 0.2, hr * 0.38, hr * 0.36, B.patch);
    E(c, hr * 0.45, hy - hr * 0.2, hr * 0.38, hr * 0.36, B.patch);
    E(c, 0, hy - hr * 0.3, hr * 0.12, hr * 0.38, "#fff");
    face(c, hy + hr * 0.02, hr, { er: 0.12, open });
    rr(
      c,
      -hr * 0.32,
      hy + hr * 0.92,
      hr * 0.64,
      hr * 0.36,
      hr * 0.12,
      "#8B5A2B",
      lw * 0.8,
    );
    c.fillStyle = "#F0B945";
    c.fillRect(-hr * 0.2, hy + hr * 0.92, hr * 0.06, hr * 0.36);
    c.fillRect(hr * 0.14, hy + hr * 0.92, hr * 0.06, hr * 0.36);
  }
  c.restore();
}

