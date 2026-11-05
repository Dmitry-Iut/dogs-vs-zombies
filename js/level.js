function buildEvents(lv) {
  const ev = [];
  let t = lv.first;
  const n = lv.count;
  for (let i = 0; i < n; i++) {
    const f = i / Math.max(1, n - 1);
    ev.push({ t, type: i < 2 ? "basic" : wpick(lv.mix) });
    t += lv.gap0 + (lv.gap1 - lv.gap0) * f + rand(-1.5, 1.5);
  }
  lv.waves.forEach((wf, wi) => {
    const base = ev[Math.min(n - 1, Math.floor(wf * (n - 1)))].t + 3;
    ev.push({
      t: base,
      banner:
        wi === lv.waves.length - 1
          ? "Последняя волна!"
          : "Огромная волна зомби!",
    });
    ev.push({ t: base + 1.5, graves: true });
    for (let j = 0; j < lv.waveSize; j++)
      ev.push({ t: base + 2.5 + j * 0.8, type: wpick(lv.mix) });
  });
  if (lv.boss) {
    ev.push({ t: lv.bossT - 3, banner: "Идёт Зомби-Король!" });
    ev.push({ t: lv.bossT, type: "boss" });
  }
  ev.sort((a, b) => a.t - b.t);
  return ev;
}
function makeObst(lv, seed) {
  const g = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const rnd = mulberry(seed * 7919 + 3);
  (lv.obst || []).forEach(([type, n]) => {
    for (let k = 0, tries = 0; k < n && tries < 300; tries++) {
      const r = Math.floor(rnd() * (ROWS - 2)),
        c = Math.floor(rnd() * COLS);
      if (g[r][c] || (r > 0 && g[r - 1][c]) || g[r + 1][c]) continue;
      g[r][c] = { type };
      k++;
    }
  });
  return g;
}
let curLoadout = null;
try {
  curLoadout = JSON.parse(localStorage.getItem("dvz-loadout") || "null");
} catch (e) {}
function loadoutFor(i) {
  const av = availFor(i);
  if (av.length <= SLOTS) return av;
  let lo = (curLoadout || []).filter((k) => av.includes(k)).slice(0, SLOTS);
  if (!lo.length) lo = av.slice(0, SLOTS);
  return lo;
}
function startLevel(i) {
  const endless = i === "endless";
  const lv = endless ? makeEndlessLv() : LEVELS[i];
  G = {
    li: i,
    lv,
    endless,
    t: 0,
    bones: lv.bones,
    dogs: [],
    grid: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
    obst: makeObst(lv, endless ? 99 : i),
    night: isNight(lv.theme),
    zombies: [],
    projs: [],
    lobs: [],
    items: [],
    parts: [],
    floats: [],
    mowers: Array.from({ length: COLS }, (_, c) => ({
      c,
      state: "idle",
      y: ROWS + 0.45,
    })),
    cds: {},
    sel: null,
    shovel: false,
    events: endless ? [] : buildEvents(lv),
    ev: 0,
    spawned: 0,
    skyT: 6,
    boss: null,
    shake: 0,
    speed: 1,
    winT: 0,
    hint: 0,
    sleepTip: false,
    lastCol: -1,
    kills: 0,
    wave: 1,
    waveT: 0,
    nextSpawn: 20,
    burstQ: [],
    lightT: rand(5, 9),
    lightning: 0,
    loadout: loadoutFor(i),
  };
  G.total = G.events.filter((e) => e.type).length;
  G.loadout.forEach((k) => (G.cds[k] = 0));
  $("lvlName").textContent = endless
    ? "Бесконечный · волна 1"
    : "Уровень " + (i + 1) + " · " + lv.name;
  $("speedBtn").textContent = "x1";
  $("speedBtn").classList.remove("on");
  aim = null;
  hover = null;
  buildBg();
  buildCards();
  updShovel();
  hud(true);
  hideAll();
  state = "play";
  paused = false;
  S.startMusic(themeTrack(lv.theme));
}
const foe = (z) => !z.dead && !z.hypno;
const frontY = (z) => (z.type === "boss" ? z.y + 0.8 : z.y);
const inSpan = (col, z) =>
  z.type === "boss" ? col >= z.col - 1 && col <= z.col + 1 : z.col === col;
function spawnZ(type, col, y) {
  const D = ZOMB[type];
  if (col == null) {
    col = Math.floor(Math.random() * COLS);
    if (col === G.lastCol)
      col = (col + 1 + Math.floor(Math.random() * (COLS - 1))) % COLS;
    G.lastCol = col;
  }
  const z = {
    type,
    col,
    y: y == null ? -0.75 : y,
    hp: D.hp,
    maxHp: D.hp,
    base: D.base,
    speed: D.speed * rand(0.9, 1.1),
    dps: D.dps,
    ph: Math.random() * 6,
    flash: 0,
    slowT: 0,
    eating: false,
    hypno: false,
  };
  if (type === "boss") {
    z.col = 2;
    z.y = -1.3;
    z.summonT = 10;
    z.throwT = 7;
    z.enraged = false;
    z.speed = D.speed;
    G.boss = z;
    S.roar();
    G.shake = 0.8;
  }
  G.zombies.push(z);
  if (Math.random() < 0.35) S.groan();
  return z;
}
function dmgZ(z, a) {
  if (z.dead) return;
  const had = z.hp > z.base;
  z.hp -= a;
  z.flash = 0.08;
  if (had && z.hp <= z.base) {
    const col = { helmet: "#F2C230", bucket: "#A3ACB5", door: "#8B5A2B" }[
      z.type
    ];
    if (col) burst(colX(z.col), rowY(z.y) - L.s * 0.25, 8, col, 160, 4);
  }
  if (z.hp <= 0) killZ(z);
}
function killZ(z) {
  z.dead = true;
  if (!z.hypno) G.kills++;
  const boss = z.type === "boss",
    x = colX(z.col),
    y = rowY(z.y);
  burst(x, y, boss ? 60 : 14, "#86AD5E", boss ? 360 : 180, boss ? 7 : 4);
  S.splat();
  if (boss) {
    G.boss = null;
    G.shake = 1.2;
    S.boom();
    banner("Король повержен!");
    for (let i = 0; i < 40; i++)
      G.parts.push({
        x: x + rand(-60, 60),
        y: y + rand(-60, 40),
        vx: rand(-80, 80),
        vy: rand(-260, -80),
        life: rand(1, 2),
        max: 2,
        color: ["#FF6B8B", "#F0B945", "#fff"][i % 3],
        size: rand(5, 9),
        heart: i % 2 === 0,
        g: 200,
      });
  }
}
function burst(x, y, n, color, spd, size) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2,
      v = spd * rand(0.3, 1);
    const l = rand(0.35, 0.75);
    G.parts.push({
      x,
      y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - spd * 0.3,
      life: l,
      max: l,
      color,
      size: size * rand(0.6, 1.2),
      g: 600,
    });
  }
}
function ring(x, y, r, color) {
  G.parts.push({ ring: true, x, y, r, life: 0.45, max: 0.45, color });
}
function float(x, y, text, color, size) {
  G.floats.push({
    x,
    y,
    text,
    color: color || "#fff",
    size: size || 16,
    life: 1.1,
    max: 1.1,
  });
}
function place(type, r, c) {
  const D = DOGS[type];
  if (G.bones < D.cost) {
    S.err();
    nope("bonesBox");
    return;
  }
  if (G.cds[type] > 0) {
    S.err();
    nope(cardEls[type]);
    return;
  }
  const d = {
    type,
    r,
    c,
    hp: D.hp,
    maxHp: D.hp,
    ph: Math.random() * 6,
    hurt: 0,
    fire: 0,
    fireT: 0.6,
    prod: 6 + Math.random() * 2,
    age: 0,
    arm: type === "ugolek" ? 1.2 : 6,
    burst: 0,
    glow: 0,
    chew: 0,
    sleep: !!D.cat && !G.night,
    nip: false,
  };
  G.grid[r][c] = d;
  G.dogs.push(d);
  G.bones -= D.cost;
  G.cds[type] = D.cd;
  G.sel = null;
  burst(colX(c), rowY(r + 0.85), 8, "rgba(120,80,40,.6)", 90, 3);
  S.place();
  if (D.cat) S.meow(type === "kitten" ? 1.3 : type === "ugolek" ? 0.8 : 1);
  else S.bark(type === "chihuahua" ? 1.6 : type === "bulldog" ? 0.7 : 1);
}
function useNip(r, c) {
  const d = G.grid[r][c],
    D = DOGS.catnip;
  if (!d || !d.sleep) {
    S.err();
    float(colX(c), rowY(r + 0.5), "Только на спящую кошку", "#FFE0E6", 13);
    return;
  }
  if (G.bones < D.cost) {
    S.err();
    nope("bonesBox");
    return;
  }
  if (G.cds.catnip > 0) {
    S.err();
    nope(cardEls.catnip);
    return;
  }
  G.bones -= D.cost;
  G.cds.catnip = D.cd;
  G.sel = null;
  d.sleep = false;
  d.nip = true;
  d.glow = 1;
  burst(colX(c), rowY(r + 0.5), 14, "#7BC74A", 150, 4);
  float(colX(c), rowY(r + 0.1), "Проснулась!", "#D8F5C0", 15);
  S.meow(1);
}
function applyNight() {
  G.night = isNight(G.lv.theme);
  for (const d of G.dogs)
    if (DOGS[d.type].cat) d.sleep = !G.night && !d.nip;
}
function removeDog(d, quiet) {
  if (G.grid[d.r][d.c] === d) G.grid[d.r][d.c] = null;
  const i = G.dogs.indexOf(d);
  if (i >= 0) G.dogs.splice(i, 1);
  if (!quiet) {
    float(colX(d.c), rowY(d.r + 0.2), "Ай!", "#FFE0E6", 16);
    const B = DOGS[d.type].cat ? CAT[d.type] : BREED[d.type];
    burst(colX(d.c), rowY(d.r + 0.5), 10, B.fur, 150, 4);
    S.yelp();
  }
}
function hasTarget(d, range) {
  for (const z of G.zombies) {
    if (!foe(z) || !inSpan(d.c, z)) continue;
    const fy = frontY(z);
    if (fy < d.r + 0.5 && z.y > -0.85 && (!range || fy > d.r + 0.5 - range))
      return true;
  }
  return false;
}
function inFront(d, range) {
  return G.zombies.filter((z) => {
    if (!foe(z) || !inSpan(d.c, z) || z.y <= -0.85) return false;
    const fy = frontY(z);
    return fy < d.r + 0.5 && fy > d.r + 0.5 - range;
  });
}
function shoot(d, kind) {
  G.projs.push({ col: d.c, y: d.r + 0.12, kind, dmg: 20, rot: 0 });
  d.fire = 1;
  S.bark(d.type === "samoyed" ? 1.15 : d.type === "dalmatian" ? 0.9 : 1);
  if (Math.random() < 0.07)
    float(colX(d.c) + L.cw * 0.25, rowY(d.r + 0.1), "Гав!", "#FFF5E1", 14);
}
function explode(d) {
  const x = colX(d.c),
    y = rowY(d.r + 0.5);
  for (const z of G.zombies) {
    if (!foe(z) || !inSpan(d.c, z)) continue;
    const zy = z.type === "boss" ? z.y + 0.8 : z.y;
    if (Math.abs(zy - (d.r + 0.5)) < 1.05) dmgZ(z, 1800);
  }
  burst(x, y, 26, "#FFD166", 260, 6);
  burst(x, y, 14, "#fff", 200, 4);
  ring(x, y, L.s * 1.2, "#FFF5E1");
  G.shake = 0.5;
  S.boom();
  S.bark(1.7);
  float(x, y - L.ch * 0.5, "ТЯВ!", "#FFD166", 26);
  removeDog(d, true);
  float(x, y - L.ch * 0.05, "Убежала домой", "#FFF5E1", 12);
}
function doom(d) {
  const x = colX(d.c),
    y = rowY(d.r + 0.5);
  for (const z of G.zombies) {
    if (!foe(z)) continue;
    let near = false;
    for (let c = d.c - 1; c <= d.c + 1; c++) if (inSpan(c, z)) near = true;
    if (near && Math.abs(frontY(z) - (d.r + 0.5)) <= 2.6) dmgZ(z, 1800);
  }
  burst(x, y, 40, "#2B2A33", 320, 7);
  burst(x, y, 20, "#F5D33A", 260, 5);
  ring(x, y, L.s * 2.4, "#F5D33A");
  G.shake = 0.9;
  S.boom();
  S.meow(0.7);
  float(x, y - L.ch * 0.5, "МЯУ!", "#F5D33A", 26);
  removeDog(d, true);
  G.obst[d.r][d.c] = { type: "crater", t: 40 };
}
function dropBone(x, y, val) {
  G.items.push({
    x,
    y: y - 10,
    x0: x,
    y0: y - 10,
    x1: x + (Math.random() - 0.5) * L.cw * 0.6,
    y1: y + L.ch * 0.22,
    phase: "arc",
    at: 0,
    val,
    life: 9,
    rot: rand(-0.4, 0.4),
  });
}
function collect(it) {
  if (it.col) return;
  it.col = true;
  S.pop();
  const br = $("bonesBox").getBoundingClientRect(),
    cr = cv.getBoundingClientRect();
  it.tx = br.left + 18 - cr.left;
  it.ty = br.top + br.height / 2 - cr.top;
}
function shooter(d, dt, interval, fn, range) {
  d.fireT -= dt;
  if (d.fireT <= 0 && hasTarget(d, range)) {
    d.fireT = interval;
    fn();
  }
  if (d.fireT < 0) d.fireT = 0;
}
function updateDog(d, dt) {
  d.hurt = Math.max(0, d.hurt - dt);
  d.fire = Math.max(0, d.fire - dt * 4);
  d.glow = Math.max(0, d.glow - dt);
  if (d.hp <= 0) {
    removeDog(d);
    return;
  }
  if (d.sleep) return;
  const x = colX(d.c),
    y = rowY(d.r + 0.5);
  if (d.type === "corgi" || d.type === "barsik") {
    d.age += dt;
    d.prod -= dt;
    if (d.prod < 1.2) d.glow = Math.max(d.glow, 1 - d.prod / 1.2);
    if (d.prod <= 0) {
      d.prod = 13 + Math.random() * 3;
      const big = d.type === "corgi" || d.age > 60;
      dropBone(x, y, big ? 50 : 25);
      if (d.type === "barsik" && big && !d.grown) {
        d.grown = true;
        float(x, y - L.ch * 0.45, "Подрос!", "#FFD166", 13);
      }
    }
  } else if (
    d.type === "husky" ||
    d.type === "samoyed" ||
    d.type === "dalmatian"
  ) {
    if (d.burst > 0) {
      d.burst -= dt;
      if (d.burst <= 0) shoot(d, "ball");
    }
    shooter(d, dt, 1.45, () => {
      shoot(d, d.type === "samoyed" ? "snow" : "ball");
      if (d.type === "dalmatian") d.burst = 0.18;
    });
  } else if (d.type === "kitten") {
    shooter(
      d,
      dt,
      1.45,
      () => {
        G.projs.push({
          col: d.c,
          y: d.r + 0.12,
          kind: "fur",
          dmg: 20,
          rot: 0,
          lim: d.r + 0.5 - 3.3,
        });
        d.fire = 1;
        S.spit();
      },
      3.2,
    );
  } else if (d.type === "chihuahua") {
    if (d.arm > 0) {
      d.arm -= dt;
      if (d.arm <= 0) {
        float(x, y - L.ch * 0.45, "Готова!", "#FFD166", 14);
        S.bark(1.7);
      }
    } else
      for (const z of G.zombies) {
        if (!foe(z) || !inSpan(d.c, z)) continue;
        const zy = z.type === "boss" ? z.y + 0.5 : z.y;
        if (zy >= d.r - 0.15 && zy <= d.r + 0.8) {
          explode(d);
          break;
        }
      }
  } else if (d.type === "ugolek") {
    d.arm -= dt;
    if (d.arm <= 0) doom(d);
  } else if (d.type === "pug" || d.type === "murka") {
    d.fireT -= dt;
    if (d.fireT <= 0) {
      const murka = d.type === "murka";
      const hits = inFront(d, murka ? 4.3 : 3.4);
      if (hits.length) {
        d.fireT = 1.6;
        d.fire = 1;
        hits.forEach((z) =>
          dmgZ(z, murka ? (z.type === "door" && z.hp > z.base ? 60 : 20) : 25),
        );
        if (murka) hissFx(d);
        else sneeze(d);
      } else d.fireT = 0;
    }
  } else if (d.type === "dachshund") {
    if (d.chew > 0) {
      d.chew -= dt;
      if (d.chew <= 0) float(x, y - L.ch * 0.4, "Готова!", "#FFD166", 13);
    } else {
      let tg = null;
      for (const z of G.zombies) {
        if (!foe(z) || !inSpan(d.c, z)) continue;
        const zy = frontY(z);
        if (zy >= d.r - 1.25 && zy <= d.r + 0.6) {
          tg = z;
          break;
        }
      }
      if (tg) {
        d.chew = 18;
        d.fire = 1;
        S.chomp();
        S.bark(0.85);
        if (tg.type === "boss" || tg.type === "giant") {
          dmgZ(tg, 700);
          float(x, y - L.ch * 0.5, "Кусь!", "#FFD166", 18);
        } else {
          float(colX(tg.col), rowY(tg.y), "Ам!", "#FFD166", 20);
          dmgZ(tg, 99999);
        }
      }
    }
  } else if (d.type === "retriever") {
    shooter(d, dt, 1.6, () => {
      d.fire = 1;
      G.projs.push({
        col: d.c,
        y: d.r + 0.1,
        kind: "frisbee",
        dmg: 25,
        rot: 0,
        hit: new Set(),
      });
      S.bark(0.95);
    });
  } else if (d.type === "bernard") {
    for (let r2 = d.r - 1; r2 <= d.r + 1; r2++)
      for (let c2 = d.c - 1; c2 <= d.c + 1; c2++) {
        if (r2 < 0 || r2 >= ROWS || c2 < 0 || c2 >= COLS) continue;
        const n = G.grid[r2][c2];
        if (n && n.hp < n.maxHp) {
          n.hp = Math.min(n.maxHp, n.hp + 30 * dt);
          if (Math.random() < dt * 1.5)
            G.parts.push({
              x: colX(c2) + rand(-12, 12),
              y: rowY(r2 + 0.3),
              vx: 0,
              vy: -40,
              life: 0.9,
              max: 0.9,
              color: "#FF6B8B",
              size: 5,
              heart: true,
              g: -20,
            });
        }
      }
  }
}
function cloud(d, color, n, reach) {
  const x = colX(d.c),
    y = rowY(d.r + 0.2);
  for (let i = 0; i < n; i++) {
    const l = rand(0.6, 0.85);
    G.parts.push({
      x: x + rand(-14, 14),
      y,
      vx: rand(-18, 18),
      vy: -rand(L.ch * reach, L.ch * (reach + 0.8)),
      life: l,
      max: l,
      color,
      size: rand(7, 13),
      g: 0,
    });
  }
}
function sneeze(d) {
  cloud(d, "rgba(210,238,190,.75)", 8, 3.6);
  S.noise(0.18, 0.22, 2600, "highpass");
  if (Math.random() < 0.15)
    float(colX(d.c) + L.cw * 0.25, rowY(d.r + 0.1), "Апчхи!", "#E2F5D0", 14);
}
function hissFx(d) {
  cloud(d, "rgba(205,180,240,.7)", 10, 4.6);
  S.hiss();
  if (Math.random() < 0.15)
    float(colX(d.c) + L.cw * 0.25, rowY(d.r + 0.1), "Ш-ш-ш!", "#E2CCFF", 14);
}
function hypnotize(z, d) {
  z.hypno = true;
  z.eating = false;
  z.slowT = 0;
  removeDog(d, true);
  const x = colX(d.c),
    y = rowY(d.r + 0.4);
  burst(x, y, 16, "#B98CF0", 180, 4);
  ring(x, y, L.s, "#E2CCFF");
  float(x, y - L.ch * 0.3, "Гипноз!", "#E2CCFF", 18);
  S.meow(1.1);
}
function hypnoAhead(z) {
  const fy = frontY(z);
  for (const h of G.zombies) {
    if (!h.hypno || h.dead || !inSpan(h.col, z)) continue;
    const dy = h.y - fy;
    if (dy >= -0.2 && dy <= 0.6) return h;
  }
  return null;
}
function updateHypno(z, dt) {
  let tg = null;
  for (const o of G.zombies) {
    if (!foe(o) || !inSpan(z.col, o)) continue;
    const dy = z.y - frontY(o);
    if (dy >= -0.2 && dy <= 0.6) {
      tg = o;
      break;
    }
  }
  z.eating = !!tg;
  if (tg) {
    dmgZ(tg, z.dps * dt);
    S.chomp();
  } else z.y -= z.speed * dt;
  if (z.y < -1.2) z.dead = true;
}
function endlessTick(dt) {
  G.waveT += dt;
  G.nextSpawn -= dt;
  if (G.nextSpawn <= 0) {
    spawnZ(wpick(endlessMix(G.wave)));
    G.nextSpawn = Math.max(1.4, 8 - G.wave * 0.65) * rand(0.75, 1.25);
  }
  while (G.burstQ.length && G.burstQ[0] <= G.t) {
    G.burstQ.shift();
    spawnZ(wpick(endlessMix(G.wave)));
  }
  if (G.waveT >= 75) {
    G.waveT = 0;
    G.wave++;
    const th =
      G.wave % 8 === 0 ? "boss" : E_THEMES[(G.wave - 1) % E_THEMES.length];
    G.lv.theme = th;
    applyNight();
    buildBg();
    S.startMusic(themeTrack(th));
    G.lightT = rand(5, 9);
    let txt = "Волна " + G.wave;
    if (G.wave % 3 === 0) {
      G.mowers.forEach((m) => {
        if (m.state === "done") {
          m.state = "idle";
          m.y = ROWS + 0.45;
        }
      });
      txt += " · пылесосы заряжены";
    }
    if (G.wave % 8 === 0 && !G.boss) {
      txt = "Волна " + G.wave + ": Зомби-Король!";
      spawnZ("boss");
      const m = 1 + (G.wave / 8 - 1) * 0.5;
      G.boss.hp = G.boss.maxHp = Math.round(13000 * m);
    }
    banner(txt);
    S.horn();
    for (let j = 0; j < 3 + G.wave; j++) G.burstQ.push(G.t + 2 + j * 0.8);
  }
}
function bossTick(z, dt) {
  z.summonT -= dt;
  if (z.summonT <= 0) {
    z.summonT = z.enraged ? 7 : 10;
    const n = z.enraged ? 3 : 2;
    for (let i = 0; i < n; i++)
      spawnZ(
        ["basic", "helmet", "runner"][Math.floor(Math.random() * 3)],
        null,
        -0.7,
      );
    S.roar();
    G.shake = 0.4;
    float(colX(z.col), rowY(z.y - 0.9), "Слуги, ко мне!", "#FFB3B3", 15);
  }
  z.throwT -= dt;
  if (z.throwT <= 0) {
    z.throwT = z.enraged ? 6 : 9;
    if (G.dogs.length) {
      const d = G.dogs[Math.floor(Math.random() * G.dogs.length)];
      G.lobs.push({
        x0: colX(z.col) + L.cw * 0.4,
        y0: rowY(z.y - 0.6),
        d,
        t: 0,
        dur: 1.1,
      });
    }
  }
  if (!z.enraged && z.hp < z.maxHp / 2) {
    z.enraged = true;
    z.speed *= 1.5;
    banner("Король в ярости!");
    S.roar();
    G.shake = 0.7;
  }
}
function reachHouse(z) {
  const boss = z.type === "boss",
    front = frontY(z);
  if (front <= ROWS + 0.05) return;
  const cols = boss ? [z.col, z.col - 1, z.col + 1] : [z.col];
  for (const c of cols) {
    const m = G.mowers[c];
    if (m.state === "go" && m.y >= z.y - (boss ? 1 : 0.55)) return;
    if (m.state === "idle") {
      m.state = "go";
      S.mower();
      return;
    }
  }
  if (front > ROWS + 0.3) lose();
}
function updateZ(z, dt) {
  z.flash -= dt;
  z.slowT -= dt;
  if (z.hypno) {
    updateHypno(z, dt);
    return;
  }
  const slow = z.slowT > 0 ? 0.5 : 1,
    boss = z.type === "boss",
    bite = z.dps * slow * dt;
  let eating = false;
  const h = hypnoAhead(z);
  if (h) {
    eating = true;
    dmgZ(h, bite);
  } else if (boss) {
    for (let c = z.col - 1; c <= z.col + 1; c++)
      for (let r = 0; r < ROWS; r++) {
        const d = G.grid[r][c];
        if (d && z.y >= r - 0.6 && z.y <= r + 0.7) {
          eating = true;
          d.hp -= bite;
          d.hurt = 0.15;
        }
      }
  } else
    for (let r = 0; r < ROWS; r++) {
      const d = G.grid[r][z.col];
      if (d && z.y >= r - 0.1 && z.y <= r + 0.7) {
        if (d.type === "luna" && !d.sleep) {
          hypnotize(z, d);
          return;
        }
        eating = true;
        d.hp -= bite;
        d.hurt = 0.15;
        break;
      }
    }
  if (boss) bossTick(z, dt);
  z.eating = eating;
  if (eating) S.chomp();
  else z.y += z.speed * slow * dt;
  reachHouse(z);
}
function projHit(p) {
  let hit = null;
  for (const z of G.zombies) {
    if (!foe(z) || !inSpan(p.col, z) || z.y < -0.9) continue;
    const top = z.type === "boss" ? z.y - 1 : z.y - 0.42,
      bot = z.type === "boss" ? z.y + 0.8 : z.y + 0.3;
    if (p.y <= bot && p.y >= top && (!hit || z.y > hit.y)) hit = z;
  }
  return hit;
}
function update(dt) {
  G.t += dt;
  const lv = G.lv;
  while (G.ev < G.events.length && G.events[G.ev].t <= G.t) {
    const e = G.events[G.ev++];
    if (e.banner) {
      banner(e.banner);
      S.horn();
    } else if (e.graves) {
      G.obst.forEach((row, r) =>
        row.forEach((o, c) => {
          if (!o || o.type !== "grave") return;
          spawnZ(wpick(lv.mix), c, r + 0.2);
          burst(colX(c), rowY(r + 0.6), 12, "#6B4A2E", 140, 4);
        }),
      );
    } else {
      spawnZ(e.type);
      G.spawned++;
    }
  }
  if (G.endless) endlessTick(dt);
  hints();
  G.skyT -= dt;
  if (G.skyT <= 0) {
    G.skyT = lv.sky + Math.random() * 3;
    G.items.push({
      x:
        colX(Math.floor(Math.random() * COLS)) +
        (Math.random() - 0.5) * L.cw * 0.4,
      y: -20,
      ty: rowY(1 + Math.random() * (ROWS - 2)),
      phase: "fall",
      val: 50,
      life: 9,
      rot: Math.random() * 6,
    });
  }
  for (const k in G.cds) G.cds[k] = Math.max(0, G.cds[k] - dt);
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const o = G.obst[r][c];
      if (o && o.type === "crater" && (o.t -= dt) <= 0) G.obst[r][c] = null;
    }
  for (const d of G.dogs.slice()) updateDog(d, dt);
  for (const z of G.zombies) if (!z.dead) updateZ(z, dt);
  if (state !== "play") return;
  for (const m of G.mowers) {
    if (m.state !== "go") continue;
    m.y -= 6 * dt;
    for (const z of G.zombies) {
      if (!foe(z) || !inSpan(m.c, z)) continue;
      if (z.type === "boss") {
        if (m.y <= z.y + 0.8 && m.y >= z.y - 1) {
          dmgZ(z, 1500);
          z.y = Math.max(-1, z.y - 2.5);
          m.state = "done";
          burst(colX(m.c), rowY(m.y), 24, "#C9CED6", 260, 5);
          S.boom();
          G.shake = 0.6;
          break;
        }
      } else if (Math.abs(z.y - m.y) < 0.6) dmgZ(z, 99999);
    }
    if (m.y < -1.5) m.state = "done";
  }
  for (const p of G.projs) {
    p.y -= 7.5 * dt;
    p.rot += dt * 12;
    if (p.kind === "frisbee") {
      for (const z of G.zombies) {
        if (!foe(z) || !inSpan(p.col, z) || z.y < -0.9 || p.hit.has(z))
          continue;
        const top = z.type === "boss" ? z.y - 1 : z.y - 0.42,
          bot = z.type === "boss" ? z.y + 0.8 : z.y + 0.3;
        if (p.y <= bot && p.y >= top) {
          p.hit.add(z);
          dmgZ(z, p.dmg);
          burst(colX(p.col), rowY(p.y), 5, "#E6533C", 120, 3);
          S.hit();
        }
      }
      if (p.y < -1) p.dead = true;
      continue;
    }
    const hit = projHit(p);
    if (hit) {
      dmgZ(hit, p.dmg);
      if (p.kind === "snow") hit.slowT = 4;
      burst(
        colX(p.col),
        rowY(p.y),
        5,
        { snow: "#DDF1FF", fur: "#C9CED6" }[p.kind] || "#D8EE3A",
        120,
        3,
      );
      p.dead = true;
      S.hit();
    } else if (p.lim != null && p.y < p.lim) {
      p.dead = true;
      burst(colX(p.col), rowY(p.y), 4, "#C9CED6", 60, 2.5);
    }
    if (p.y < -1) p.dead = true;
  }
  G.projs = G.projs.filter((p) => !p.dead);
  for (const b of G.lobs) {
    b.t += dt;
    if (b.t >= b.dur) {
      b.dead = true;
      const d = b.d;
      if (G.dogs.includes(d)) {
        d.hp -= 350;
        d.hurt = 0.3;
        burst(colX(d.c), rowY(d.r + 0.5), 12, "#8A9A5B", 180, 4);
        S.splat();
      }
    }
  }
  G.lobs = G.lobs.filter((b) => !b.dead);
  for (const it of G.items) {
    if (it.col) {
      const a = Math.min(1, dt * 9);
      it.x += (it.tx - it.x) * a;
      it.y += (it.ty - it.y) * a;
      if (Math.hypot(it.tx - it.x, it.ty - it.y) < 14) {
        it.dead = true;
        G.bones += it.val;
        pulse();
      }
    } else if (it.phase === "fall") {
      it.y += 70 * dt;
      it.rot += dt;
      if (it.y >= it.ty) {
        it.y = it.ty;
        it.phase = "rest";
      }
    } else if (it.phase === "arc") {
      it.at += dt / 0.6;
      const a = Math.min(1, it.at);
      it.x = it.x0 + (it.x1 - it.x0) * a;
      it.y = it.y0 + (it.y1 - it.y0) * a - Math.sin(a * Math.PI) * L.ch * 0.5;
      if (a >= 1) it.phase = "rest";
    } else {
      it.life -= dt;
      if (it.life <= 0) collect(it);
    }
  }
  G.items = G.items.filter((i) => !i.dead);
  G.zombies = G.zombies.filter((z) => !z.dead);
  updFx(dt);
  G.shake = Math.max(0, G.shake - dt * 2);
  if (THEMES[lv.theme].rain) {
    G.lightning = Math.max(0, G.lightning - dt);
    G.lightT -= dt;
    if (G.lightT <= 0) {
      G.lightT = rand(7, 13);
      G.lightning = 0.3;
      S.noise(1.4, 0.4, 300);
    }
  }
  if (!G.endless && G.ev >= G.events.length && !G.zombies.some(foe)) {
    G.winT += dt;
    if (G.winT > 1.3) win();
  }
}
function updFx(dt) {
  for (const p of G.parts) {
    p.life -= dt;
    if (!p.ring) {
      p.vy += (p.g != null ? p.g : 600) * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  }
  G.parts = G.parts.filter((p) => p.life > 0);
  for (const f of G.floats) {
    f.life -= dt;
    f.y -= 28 * dt;
  }
  G.floats = G.floats.filter((f) => f.life > 0);
}
