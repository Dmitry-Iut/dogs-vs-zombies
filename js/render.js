function drawObst(c, o, x, y, s) {
  const lw = Math.max(1, s * 0.03);
  if (o.type === "grave") {
    E(c, x, y + s * 0.3, s * 0.34, s * 0.1, "#6B4A2E");
    rr(c, x - s * 0.2, y - s * 0.32, s * 0.4, s * 0.62, s * 0.16, "#9AA3AD", lw);
    c.fillStyle = "rgba(51,36,28,.45)";
    c.fillRect(x - s * 0.025, y - s * 0.2, s * 0.05, s * 0.26);
    c.fillRect(x - s * 0.1, y - s * 0.12, s * 0.2, s * 0.05);
    c.fillStyle = "rgba(255,255,255,.25)";
    c.fillRect(x - s * 0.15, y - s * 0.22, s * 0.04, s * 0.36);
    E(c, x - s * 0.14, y + s * 0.27, s * 0.06, s * 0.03, "#7BC74A");
  } else if (o.type === "bed") {
    E(c, x, y + s * 0.12, s * 0.38, s * 0.22, "#7A4E2C", lw);
    E(c, x, y + s * 0.1, s * 0.3, s * 0.15, "#5E3B20");
    const cols = ["#FF6B8B", "#FFE36B", "#fff", "#C59BEA", "#FF9F45"];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + 0.4,
        fx = x + Math.cos(a) * s * 0.2,
        fy = y + s * 0.08 + Math.sin(a) * s * 0.1;
      c.strokeStyle = "#3E7A2A";
      c.lineWidth = lw;
      c.beginPath();
      c.moveTo(fx, fy);
      c.lineTo(fx, fy - s * 0.12);
      c.stroke();
      E(c, fx, fy - s * 0.14, s * 0.06, s * 0.06, cols[i], lw * 0.6);
      E(c, fx, fy - s * 0.14, s * 0.022, s * 0.022, "#F0B945");
    }
  } else if (o.type === "stump") {
    E(c, x, y + s * 0.24, s * 0.32, s * 0.09, "rgba(0,0,0,.2)");
    rr(c, x - s * 0.24, y - s * 0.08, s * 0.48, s * 0.32, s * 0.06, "#8B5A2B", lw);
    E(c, x, y - s * 0.08, s * 0.24, s * 0.09, "#D9A866", lw);
    E(c, x, y - s * 0.08, s * 0.14, s * 0.05, null, lw * 0.6);
    E(c, x, y - s * 0.08, s * 0.05, s * 0.02, "#B8864C");
  } else if (o.type === "pumpkin") {
    E(c, x, y + s * 0.26, s * 0.3, s * 0.07, "rgba(0,0,0,.2)");
    E(c, x - s * 0.13, y + s * 0.06, s * 0.15, s * 0.2, "#D96A22", lw);
    E(c, x + s * 0.13, y + s * 0.06, s * 0.15, s * 0.2, "#D96A22", lw);
    E(c, x, y + s * 0.06, s * 0.17, s * 0.22, "#F08A35", lw);
    rr(c, x - s * 0.03, y - s * 0.24, s * 0.06, s * 0.1, s * 0.02, "#4E7A2A", lw);
    E(c, x - s * 0.05, y - s * 0.02, s * 0.04, s * 0.1, "rgba(255,255,255,.25)");
  } else if (o.type === "drift") {
    E(c, x, y + s * 0.12, s * 0.4, s * 0.2, "#FFFFFF", lw);
    E(c, x - s * 0.12, y + s * 0.02, s * 0.2, s * 0.15, "#FFFFFF");
    E(c, x + s * 0.12, y + s * 0.06, s * 0.16, s * 0.12, "#FFFFFF");
    E(c, x + s * 0.05, y + s * 0.18, s * 0.25, s * 0.06, "#DCEBF5");
  } else if (o.type === "crater") {
    c.save();
    c.globalAlpha = Math.min(1, o.t / 4);
    E(c, x, y + s * 0.1, s * 0.42, s * 0.25, "#4A3628", lw);
    E(c, x, y + s * 0.13, s * 0.3, s * 0.15, "#20160F");
    if (o.t > 34)
      E(c, x, y - s * 0.2 - (40 - o.t) * 4, s * 0.2, s * 0.15, "rgba(80,80,90,.45)");
    c.restore();
  }
}
function render() {
  const c = ctx;
  c.setTransform(DPR, 0, 0, DPR, 0, 0);
  const t = G.t;
  c.save();
  if (G.shake > 0)
    c.translate(
      (Math.random() - 0.5) * G.shake * 12,
      (Math.random() - 0.5) * G.shake * 12,
    );
  c.drawImage(bg, 0, 0, W, H);
  const nip = G.sel === "catnip";
  if (G.sel || G.shovel) {
    const a = 0.07 + 0.05 * Math.sin(performance.now() / 200);
    for (let r = 0; r < ROWS; r++)
      for (let cc = 0; cc < COLS; cc++) {
        const occ = G.grid[r][cc],
          ob = G.obst[r][cc];
        const ok = nip ? occ && occ.sleep : G.sel && !occ && !ob;
        if (ok) {
          c.fillStyle = nip
            ? "rgba(140,230,120," + (a + 0.12) + ")"
            : "rgba(255,255,255," + a + ")";
          c.fillRect(cc * L.cw + 3, rowY(r) + 3, L.cw - 6, L.ch - 6);
        }
        if (G.shovel && occ) {
          c.fillStyle = "rgba(217,71,59," + (a + 0.1) + ")";
          c.fillRect(cc * L.cw + 3, rowY(r) + 3, L.cw - 6, L.ch - 6);
        }
      }
  }
  const list = [];
  for (let r = 0; r < ROWS; r++)
    for (let cc = 0; cc < COLS; cc++) {
      const o = G.obst[r][cc];
      if (o)
        list.push({
          y: rowY(r + 0.45),
          f: () => drawObst(c, o, colX(cc), rowY(r + 0.5), L.s),
        });
    }
  for (const d of G.dogs)
    list.push({
      y: rowY(d.r + 0.5),
      f: () =>
        drawUnit(c, d.type, colX(d.c), rowY(d.r + 0.5), L.s * 0.9, {
          t,
          ph: d.ph,
          hurt: d.hurt,
          fire: d.fire,
          armed:
            (d.type === "chihuahua" && d.arm <= 0) || d.type === "ugolek",
          hpR: d.hp / d.maxHp,
          glow: d.glow,
          chew: d.chew,
          sleep: d.sleep,
        }),
    });
  for (const z of G.zombies) {
    const boss = z.type === "boss";
    const zy = rowY(z.y) - (boss ? 0 : L.s * 0.05);
    list.push({
      y: zy + (boss ? L.ch * 0.6 : 0),
      f: () => drawZombie(c, z, colX(z.col), zy, L.s * 0.95, t),
    });
  }
  for (const m of G.mowers) {
    if (m.state === "done") continue;
    list.push({
      y: rowY(m.y),
      f: () => drawMower(c, colX(m.c), rowY(m.y), L.s, t, m.state === "go"),
    });
  }
  list.sort((a, b) => a.y - b.y).forEach((o) => o.f());
  if (
    G.sel &&
    hover &&
    hover.r >= 0 &&
    hover.r < ROWS &&
    hover.c >= 0 &&
    hover.c < COLS &&
    (nip
      ? G.grid[hover.r][hover.c]
      : !G.grid[hover.r][hover.c] && !G.obst[hover.r][hover.c])
  )
    drawUnit(c, G.sel, colX(hover.c), rowY(hover.r + 0.5), L.s * 0.9, {
      t,
      alpha: nip ? 0.8 : 0.45,
    });
  for (const p of G.projs) {
    const x = colX(p.col),
      y = rowY(p.y),
      r = L.s * 0.085;
    if (p.kind === "snow") {
      E(c, x, y, r * 1.1, r * 1.1, "#F4FBFF", 1);
      E(c, x + r * 0.3, y + r * 0.3, r * 0.5, r * 0.4, "#C6E6FA");
    } else if (p.kind === "fur") {
      E(c, x, y, r * 0.95, r * 0.95, "#D3D7DE", 1);
      E(c, x - r * 0.4, y - r * 0.3, r * 0.35, r * 0.3, "#EEF0F4");
      E(c, x + r * 0.35, y + r * 0.25, r * 0.3, r * 0.25, "#B9BEC8");
    } else if (p.kind === "frisbee") {
      const wob = Math.sin(p.rot) * 0.25;
      E(c, x, y, r * 1.9, r * 0.8, "#E6533C", 1.2, wob);
      E(c, x, y, r * 1.1, r * 0.42, "#F07A5A", 0, wob);
    } else {
      E(c, x, y, r, r, "#D8EE3A", 1);
      c.save();
      c.translate(x, y);
      c.rotate(p.rot);
      c.strokeStyle = "#fff";
      c.lineWidth = 1.4;
      c.beginPath();
      c.arc(-r * 0.9, 0, r * 0.8, -0.9, 0.9);
      c.stroke();
      c.beginPath();
      c.arc(r * 0.9, 0, r * 0.8, Math.PI - 0.9, Math.PI + 0.9);
      c.stroke();
      c.restore();
    }
  }
  for (const b of G.lobs) {
    const d = b.d,
      a = b.t / b.dur;
    const x1 = colX(d.c),
      y1 = rowY(d.r + 0.5);
    const x = b.x0 + (x1 - b.x0) * a,
      y = b.y0 + (y1 - b.y0) * a - Math.sin(a * Math.PI) * L.ch * 2;
    drawBone(c, x, y, L.s * 0.3, a * 12, false);
    E(c, x, y, L.s * 0.07, L.s * 0.07, "rgba(120,150,70,.7)");
  }
  const th = THEMES[G.lv.theme];
  if (th.fog) {
    const fb = rowY(3.6);
    const g = c.createLinearGradient(0, 0, 0, fb);
    g.addColorStop(0, "rgba(214,220,230,.97)");
    g.addColorStop(0.75, "rgba(214,220,230,.9)");
    g.addColorStop(1, "rgba(214,220,230,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, W, fb);
    for (let i = 0; i < 7; i++) {
      const fx = ((t * (8 + i * 2) + i * 97) % (W + 200)) - 100,
        fy = rowY(0.4 + i * 0.45);
      E(c, fx, fy, L.cw * 1.1, L.ch * 0.45, "rgba(230,234,240,.55)");
    }
  }
  if (th.snow) {
    c.fillStyle = "rgba(255,255,255,.85)";
    for (let i = 0; i < 60; i++) {
      const sx = (((i * 73.13) % 1) * W + Math.sin(t + i) * 14 + W) % W,
        sy = (((i * 0.618) % 1) * H + t * (30 + (i % 5) * 8)) % H;
      c.beginPath();
      c.arc(sx, sy, 1.4 + (i % 3) * 0.7, 0, Math.PI * 2);
      c.fill();
    }
  }
  if (th.decor === "leaves") {
    for (let i = 0; i < 10; i++) {
      const lx = (((i * 0.31) % 1) * W + t * 18 + Math.sin(t + i) * 20) % W,
        ly = (((i * 0.57) % 1) * H + t * (24 + (i % 4) * 6)) % H;
      E(c, lx, ly, 5, 2.4, ["#E07A2E", "#D9473B", "#F0B945"][i % 3], 0, t * 2 + i);
    }
  }
  if (th.rain) {
    c.strokeStyle = "rgba(180,200,255,.4)";
    c.lineWidth = 1.2;
    c.beginPath();
    for (let i = 0; i < 70; i++) {
      const rx = (((i * 0.377) % 1) * W + t * 60) % W,
        ry = (((i * 0.713) % 1) * H + t * 620) % H;
      c.moveTo(rx, ry);
      c.lineTo(rx - 4, ry + 14);
    }
    c.stroke();
  }
  for (const it of G.items) {
    const pulse = 1 + 0.06 * Math.sin(performance.now() / 180),
      sz = L.s * 0.42 * (it.val < 50 ? 0.72 : 1);
    drawBone(c, it.x, it.y, sz * pulse, it.rot, true);
    if (
      !it.col &&
      it.phase === "rest" &&
      it.life < 2.5 &&
      Math.sin(performance.now() / 90) > 0
    ) {
      c.globalAlpha = 0.4;
      drawBone(c, it.x, it.y, sz, it.rot, false);
      c.globalAlpha = 1;
    }
  }
  for (const p of G.parts) {
    const a = Math.max(0, p.life / p.max);
    c.globalAlpha = a;
    if (p.ring) {
      c.strokeStyle = p.color;
      c.lineWidth = 4 * a;
      c.beginPath();
      c.arc(p.x, p.y, p.r * (1 - a * 0.8), 0, Math.PI * 2);
      c.stroke();
    } else if (p.heart) heart(c, p.x, p.y, p.size * 1.6, p.color);
    else E(c, p.x, p.y, p.size, p.size, p.color);
  }
  c.globalAlpha = 1;
  c.textAlign = "center";
  c.textBaseline = "middle";
  for (const f of G.floats) {
    c.globalAlpha = Math.min(1, (f.life / f.max) * 2);
    c.font = "900 " + f.size + "px Nunito, sans-serif";
    c.lineWidth = 4;
    c.strokeStyle = "rgba(51,36,28,.85)";
    c.strokeText(f.text, f.x, f.y);
    c.fillStyle = f.color;
    c.fillText(f.text, f.x, f.y);
  }
  c.globalAlpha = 1;
  if (G.lightning > 0) {
    c.fillStyle = "rgba(235,240,255," + G.lightning * 2.4 + ")";
    c.fillRect(0, 0, W, H);
  }
  if (G.boss) {
    const z = G.boss,
      bw = W * 0.7,
      bx = (W - bw) / 2,
      by = L.top * 0.18,
      bh = Math.max(10, L.top * 0.28);
    rr(c, bx - 2, by - 2, bw + 4, bh + 4, bh / 2 + 2, "rgba(20,10,20,.8)");
    rr(
      c,
      bx,
      by,
      bw * Math.max(0, z.hp / z.maxHp),
      bh,
      bh / 2,
      z.enraged ? "#FF4A3A" : "#C2304A",
    );
    c.font = "900 " + Math.round(bh * 0.85) + "px Nunito, sans-serif";
    c.fillStyle = "#fff";
    c.fillText("ЗОМБИ-КОРОЛЬ", W / 2, by + bh / 2 + 1);
  }
  c.restore();
}
