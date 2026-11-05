const SCREENS = [
  "sTitle",
  "sLevels",
  "sHelp",
  "sIntro",
  "sPause",
  "sWin",
  "sLose",
  "sFinal",
];
function show(id) {
  SCREENS.forEach((s) => ($(s).hidden = s !== id));
  if (id === "sTitle") requestAnimationFrame(() => sizeBgCanvas($("titleCv")));
  if (id === "sFinal") requestAnimationFrame(() => sizeBgCanvas($("finalCv")));
}
function hideAll() {
  SCREENS.forEach((s) => ($(s).hidden = true));
}
function syncSoundLabels() {
  const t = "Звук: " + (S.on ? "вкл" : "выкл");
  $("bSound").textContent = t;
  $("bPauseSound").textContent = t;
}
function toggleSound() {
  S.init();
  S.setOn(!S.on);
  try {
    localStorage.setItem("dvz-sound", S.on ? "on" : "off");
  } catch (e) {}
  syncSoundLabels();
}
function syncMusicVol() {
  const p = Math.round(S.mvol * 100);
  document.querySelectorAll(".musicVol").forEach((el) => (el.value = p));
  document
    .querySelectorAll(".musicVolTxt")
    .forEach((el) => (el.textContent = p ? p + "%" : "выкл"));
}
document.querySelectorAll(".musicVol").forEach((el) =>
  el.addEventListener("input", () => {
    S.init();
    S.setMusicVol(el.value / 100);
    try {
      localStorage.setItem("dvz-music", String(S.mvol));
    } catch (e) {}
    syncMusicVol();
  }),
);
syncMusicVol();
function toMenu() {
  S.init();
  S.startMusic("menu");
  openLevels();
}
$("bSound").addEventListener("click", toggleSound);
$("bPauseSound").addEventListener("click", toggleSound);
$("bPlay").addEventListener("click", () => {
  S.init();
  S.startMusic("menu");
  if (PROG.unlocked > 1) openLevels();
  else openIntro(0);
});
$("bLevels").addEventListener("click", toMenu);
$("bHelp").addEventListener("click", () => show("sHelp"));
$("bHelpBack").addEventListener("click", () => show("sTitle"));
$("bLvBack").addEventListener("click", () => show("sTitle"));
$("bGo").addEventListener("click", () => {
  const need = Math.min(SLOTS, availFor(introLevel).length);
  if (pickSel.length < need) {
    S.init();
    S.err();
    nope("pickCount");
    $("pickInfo").textContent =
      "Выбери ещё " +
      (need - pickSel.length) +
      " — в команде должно быть " +
      need +
      ".";
    return;
  }
  curLoadout = pickSel.slice();
  try {
    localStorage.setItem("dvz-loadout", JSON.stringify(curLoadout));
  } catch (e) {}
  startLevel(introLevel);
});
$("bEndless").addEventListener("click", () => {
  S.init();
  S.startMusic("menu");
  openIntro("endless");
});
$("bMapEndless").addEventListener("click", () => openIntro("endless"));
$("bIntroBack").addEventListener("click", openLevels);
$("bResume").addEventListener("click", () => {
  paused = false;
  hideAll();
  S.startMusic(S.track);
});
$("bRestart").addEventListener("click", () => startLevel(G.li));
$("bQuit").addEventListener("click", () => {
  if (G && G.endless && state === "play") saveBest();
  state = "menu";
  paused = false;
  toMenu();
});
$("bNext").addEventListener("click", () => {
  S.startMusic("menu");
  openIntro(Math.min(LEVELS.length - 1, G.li + 1));
});
$("bWinLv").addEventListener("click", toMenu);
$("bRetry").addEventListener("click", () => startLevel(G.li));
$("bLoseLv").addEventListener("click", toMenu);
$("bFinalLv").addEventListener("click", toMenu);

const MAP_GAP = 96,
  MAP_PAD = 64;
const MAP_DECOR = {
  day: ["tree", "flower", "bush"],
  afternoon: ["tree", "flower", "bush"],
  sunset: ["tree", "flower", "bush"],
  evening: ["tree", "bush", "lamp"],
  night: ["tree", "lamp", "bush"],
  graveyard: ["grave", "deadtree", "grave"],
  autumn: ["autumn", "bush", "autumn"],
  harvest: ["pumpkin", "autumn", "pumpkin"],
  winter: ["pine", "snowman", "pine"],
  frost: ["pine", "snowman", "lamp"],
  fog: ["tree", "grave", "bush"],
  storm: ["deadtree", "puddle", "bush"],
  moon: ["grave", "deadtree", "lamp"],
  dawn: ["tree", "flower", "bush"],
  boss: ["deadtree", "grave", "grave"],
};
function mapPts(w) {
  return LEVELS.map((_, i) => ({
    x: w / 2 + Math.sin(i * 1.25 + 0.5) * w * 0.27,
    y: MAP_PAD + i * MAP_GAP,
  }));
}
function mapDecor(c, kind, x, y, s) {
  const lw = 1.2;
  if (kind === "tree" || kind === "autumn") {
    rr(c, x - s * 0.06, y - s * 0.1, s * 0.12, s * 0.35, 2, "#7A4E2C", lw);
    E(c, x, y - s * 0.3, s * 0.3, s * 0.27, kind === "tree" ? "#3F8A3A" : "#E0892E", lw);
    E(c, x - s * 0.1, y - s * 0.38, s * 0.1, s * 0.07, "rgba(255,255,255,.2)");
  } else if (kind === "pine") {
    rr(c, x - s * 0.05, y, s * 0.1, s * 0.2, 2, "#7A4E2C", lw);
    for (let i = 0; i < 3; i++) {
      const yy = y - i * s * 0.18,
        ww = s * (0.32 - i * 0.07);
      T(c, [x - ww, yy], [x, yy - s * 0.3], [x + ww, yy], "#3C7D4E", lw);
      T(c, [x - ww * 0.4, yy - s * 0.18], [x, yy - s * 0.3], [x + ww * 0.4, yy - s * 0.18], "#fff");
    }
  } else if (kind === "deadtree") {
    c.strokeStyle = "#4A3426";
    c.lineCap = "round";
    c.lineWidth = s * 0.08;
    c.beginPath();
    c.moveTo(x, y + s * 0.2);
    c.lineTo(x, y - s * 0.35);
    c.moveTo(x, y - s * 0.1);
    c.lineTo(x - s * 0.22, y - s * 0.32);
    c.moveTo(x, y - s * 0.2);
    c.lineTo(x + s * 0.2, y - s * 0.42);
    c.stroke();
  } else if (kind === "bush") {
    E(c, x - s * 0.15, y, s * 0.17, s * 0.14, "#4E9A3A", lw);
    E(c, x + s * 0.15, y, s * 0.17, s * 0.14, "#4E9A3A", lw);
    E(c, x, y - s * 0.08, s * 0.2, s * 0.17, "#5DAA45", lw);
  } else if (kind === "flower") {
    for (let i = 0; i < 3; i++) {
      const fx = x + (i - 1) * s * 0.18,
        fy = y + (i % 2) * s * 0.08;
      E(c, fx, fy, s * 0.07, s * 0.07, ["#FF6B8B", "#FFE36B", "#fff"][i], 1);
      E(c, fx, fy, s * 0.025, s * 0.025, "#F0B945");
    }
  } else if (kind === "grave") {
    rr(c, x - s * 0.13, y - s * 0.25, s * 0.26, s * 0.38, s * 0.1, "#9AA3AD", lw);
    c.fillStyle = "rgba(51,36,28,.45)";
    c.fillRect(x - s * 0.02, y - s * 0.17, s * 0.04, s * 0.17);
    c.fillRect(x - s * 0.07, y - s * 0.12, s * 0.14, s * 0.04);
  } else if (kind === "pumpkin") {
    E(c, x - s * 0.08, y, s * 0.1, s * 0.12, "#D96A22", lw);
    E(c, x + s * 0.08, y, s * 0.1, s * 0.12, "#D96A22", lw);
    E(c, x, y, s * 0.11, s * 0.13, "#F08A35", lw);
    rr(c, x - s * 0.02, y - s * 0.18, s * 0.04, s * 0.07, 1, "#4E7A2A");
  } else if (kind === "snowman") {
    E(c, x, y, s * 0.17, s * 0.16, "#fff", lw);
    E(c, x, y - s * 0.24, s * 0.11, s * 0.11, "#fff", lw);
    T(c, [x, y - s * 0.25], [x + s * 0.12, y - s * 0.23], [x, y - s * 0.21], "#F08A35");
  } else if (kind === "lamp") {
    const g = c.createRadialGradient(x, y - s * 0.45, 0, x, y - s * 0.45, s * 0.6);
    g.addColorStop(0, "rgba(255,220,140,.55)");
    g.addColorStop(1, "rgba(255,220,140,0)");
    c.fillStyle = g;
    c.fillRect(x - s * 0.6, y - s * 1.05, s * 1.2, s * 1.2);
    c.fillStyle = "#2B2830";
    c.fillRect(x - 1.5, y - s * 0.45, 3, s * 0.6);
    E(c, x, y - s * 0.45, s * 0.07, s * 0.07, "#FFE9A8", 1);
  } else if (kind === "puddle") {
    E(c, x, y, s * 0.3, s * 0.1, "rgba(70,90,120,.6)");
    E(c, x - s * 0.08, y - s * 0.02, s * 0.1, s * 0.025, "rgba(220,235,255,.5)");
  }
}
function splinePt(p, i, u) {
  const p0 = p[Math.max(0, i - 1)],
    p1 = p[i],
    p2 = p[Math.min(p.length - 1, i + 1)],
    p3 = p[Math.min(p.length - 1, i + 2)];
  const u2 = u * u,
    u3 = u2 * u;
  const f = (a, b, cc, d) =>
    0.5 *
    (2 * b +
      (-a + cc) * u +
      (2 * a - 5 * b + 4 * cc - d) * u2 +
      (-a + 3 * b - 3 * cc + d) * u3);
  return { x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) };
}
function drawMap() {
  const wrap = $("mapWrap"),
    cvs = $("mapCv");
  const w = wrap.clientWidth;
  if (!w) return;
  const h = MAP_PAD * 2 + (LEVELS.length - 1) * MAP_GAP;
  const d = window.devicePixelRatio || 1;
  cvs.style.height = h + "px";
  cvs.width = Math.round(w * d);
  cvs.height = Math.round(h * d);
  const c = cvs.getContext("2d");
  c.setTransform(d, 0, 0, d, 0, 0);
  const pts = mapPts(w);
  const g = c.createLinearGradient(0, 0, 0, h),
    tg = c.createLinearGradient(0, 0, 0, h);
  LEVELS.forEach((lv, i) => {
    const th = THEMES[lv.theme],
      p = Math.min(1, pts[i].y / h);
    g.addColorStop(p, th.g2);
    tg.addColorStop(p, th.tint || "rgba(0,0,0,0)");
  });
  c.fillStyle = g;
  c.fillRect(0, 0, w, h);
  const rnd = mulberry(5);
  c.strokeStyle = "rgba(20,60,15,.22)";
  c.lineWidth = 1.3;
  c.lineCap = "round";
  c.beginPath();
  for (let i = 0; i < h / 3; i++) {
    const x = rnd() * w,
      y = rnd() * h;
    c.moveTo(x, y);
    c.lineTo(x - 2, y - 5);
    c.moveTo(x + 2, y);
    c.lineTo(x + 3, y - 6);
  }
  c.stroke();
  const deco = [];
  LEVELS.forEach((lv, i) => {
    const kinds = MAP_DECOR[lv.theme] || MAP_DECOR.day;
    for (let j = 0; j < 4; j++) {
      const side = j % 2 ? 1 : -1;
      let x = pts[i].x + side * (58 + rnd() * w * 0.4);
      x = Math.max(18, Math.min(w - 18, x));
      if (Math.abs(x - pts[i].x) < 50) continue;
      deco.push({
        x,
        y: pts[i].y + (rnd() - 0.5) * MAP_GAP * 0.85,
        k: kinds[j % kinds.length],
        s: 34 + rnd() * 14,
      });
    }
  });
  deco.sort((a, b) => a.y - b.y).forEach((o) => mapDecor(c, o.k, o.x, o.y, o.s));
  c.fillStyle = tg;
  c.fillRect(0, 0, w, h);
  LEVELS.forEach((lv, i) => {
    if (!THEMES[lv.theme].stars) return;
    for (let j = 0; j < 8; j++) {
      c.fillStyle = "rgba(255,255,230," + (0.4 + rnd() * 0.5) + ")";
      c.fillRect(rnd() * w, pts[i].y + (rnd() - 0.5) * MAP_GAP, 1.6, 1.6);
    }
  });
  const path = [{ x: pts[0].x, y: 0 }, ...pts, { x: pts[pts.length - 1].x, y: h }];
  c.beginPath();
  c.moveTo(path[0].x, path[0].y);
  for (let i = 0; i < path.length - 1; i++)
    for (let u = 0.1; u <= 1.001; u += 0.1) {
      const q = splinePt(path, i, u);
      c.lineTo(q.x, q.y);
    }
  c.lineJoin = "round";
  c.strokeStyle = "rgba(60,40,20,.45)";
  c.lineWidth = 30;
  c.stroke();
  c.strokeStyle = "#D8BC8A";
  c.lineWidth = 24;
  c.stroke();
  c.setLineDash([8, 10]);
  c.strokeStyle = "rgba(255,255,255,.45)";
  c.lineWidth = 3;
  c.stroke();
  c.setLineDash([]);
  const doneTo = PROG.beat ? LEVELS.length : PROG.unlocked;
  for (let i = 0; i < Math.min(doneTo, LEVELS.length) - 1; i++)
    for (const u of [0.3, 0.5, 0.7]) {
      const q = splinePt(path, i + 1, u),
        q2 = splinePt(path, i + 1, u + 0.02),
        a = Math.atan2(q2.y - q.y, q2.x - q.x),
        side = u === 0.5 ? 5 : -5;
      const px = q.x + Math.cos(a + Math.PI / 2) * side,
        py = q.y + Math.sin(a + Math.PI / 2) * side;
      E(c, px, py, 3.2, 2.6, "rgba(122,78,44,.75)", 0, a);
      for (const k of [-1, 0, 1])
        E(
          c,
          px + Math.cos(a + k * 0.7) * 4.6,
          py + Math.sin(a + k * 0.7) * 4.6,
          1.3,
          1.3,
          "rgba(122,78,44,.75)",
        );
    }
  $("mapNodes")
    .querySelectorAll(".node")
    .forEach((el, i) => {
      el.style.left = pts[i].x + "px";
      el.style.top = pts[i].y + "px";
    });
}
function openLevels() {
  state = "menu";
  const box = $("mapNodes");
  box.innerHTML = "";
  LEVELS.forEach((lv, i) => {
    const b = document.createElement("button");
    b.type = "button";
    const locked = i + 1 > PROG.unlocked,
      done = i + 1 < PROG.unlocked || (PROG.beat && i === LEVELS.length - 1),
      cur = !locked && !done;
    b.className =
      "node" +
      (lv.boss ? " boss" : "") +
      (done ? " done" : "") +
      (cur ? " cur" : "");
    b.innerHTML =
      '<i style="background:' +
      lv.color +
      '">' +
      (i + 1) +
      "</i><span>" +
      (locked ? "Закрыто" : lv.name) +
      "</span>";
    b.setAttribute(
      "aria-label",
      "Уровень " +
        (i + 1) +
        ": " +
        (locked ? "закрыт" : lv.name + (done ? ", пройден" : "")),
    );
    if (locked) b.disabled = true;
    else b.addEventListener("click", () => openIntro(i));
    box.appendChild(b);
  });
  $("bMapEndless").innerHTML =
    "<small>Без конца" +
    (PROG.best ? " · рекорд: волна " + PROG.best.wave : "") +
    "</small><b>∞</b><span>Бесконечный режим, все собаки и кошки</span>";
  show("sLevels");
  requestAnimationFrame(() => {
    drawMap();
    const sc = $("sLevels"),
      node = box.querySelector(".cur") || box.lastElementChild;
    sc.scrollTop = Math.max(
      0,
      $("mapWrap").offsetTop + node.offsetTop - sc.clientHeight / 2,
    );
  });
}
let introLevel = 0,
  pickSel = [];
function openIntro(i) {
  introLevel = i;
  const endless = i === "endless";
  const lv = endless ? ENDLESS_INFO : LEVELS[i];
  $("introEyebrow").textContent = endless
    ? "Рекорд: " +
      (PROG.best
        ? "волна " + PROG.best.wave + ", зомби: " + PROG.best.kills
        : "пока нет")
    : (lv.boss ? "Финальная битва · " : "Уровень " + (i + 1) + " · ") +
      (isNight(lv.theme) ? "ночь · " : "день · ") +
      "косточек на старте: " +
      lv.bones;
  $("introTitle").textContent = lv.name;
  const f = $("introFriends");
  f.innerHTML = "";
  const av = availFor(i),
    need = Math.min(SLOTS, av.length);
  pickSel = (curLoadout || []).filter((k) => av.includes(k)).slice(0, need);
  (lv.newDogs || []).forEach((k) => {
    if (!pickSel.includes(k)) {
      if (pickSel.length >= need) pickSel.pop();
      pickSel.push(k);
    }
  });
  for (const k of av) {
    if (pickSel.length >= need) break;
    if (!pickSel.includes(k)) pickSel.push(k);
  }
  pickSel.sort((a, b) => DOG_ORDER.indexOf(a) - DOG_ORDER.indexOf(b));
  const pk = $("picker"),
    pg = $("pickGrid");
  pk.hidden = av.length <= SLOTS;
  pg.innerHTML = "";
  $("pickInfo").textContent =
    "Нажми на карточку, чтобы взять её в команду или убрать.";
  const syncPick = () => {
    pg.querySelectorAll(".tile").forEach((t) =>
      t.classList.toggle("on", pickSel.includes(t._k)),
    );
    $("pickCount").textContent = pickSel.length + "/" + need;
  };
  if (!pk.hidden) {
    av.forEach((k) => {
      const t = document.createElement("button");
      t.type = "button";
      t.className = "tile";
      t._k = k;
      t.innerHTML =
        "<canvas></canvas><span>" +
        SHORT[k] +
        "</span><em>" +
        DOGS[k].cost +
        "</em>";
      t.addEventListener("click", () => {
        S.init();
        const at = pickSel.indexOf(k);
        if (at >= 0) pickSel.splice(at, 1);
        else if (pickSel.length < need) pickSel.push(k);
        else {
          S.err();
          nope("pickCount");
        }
        pickSel.sort((a, b) => DOG_ORDER.indexOf(a) - DOG_ORDER.indexOf(b));
        $("pickInfo").textContent =
          DOGS[k].name + ", " + costText(DOGS[k].cost) + ". " + DOGS[k].desc;
        syncPick();
      });
      pg.appendChild(t);
    });
    syncPick();
  }
  (lv.newDogs || []).forEach((k) => {
    const D = DOGS[k];
    const d = document.createElement("div");
    d.className = "friend";
    d.innerHTML =
      "<canvas></canvas><div><small>" +
      (D.cat ? "Новая кошка" : D.item ? "Новый предмет" : "Новый друг") +
      " · " +
      costText(D.cost) +
      "</small><b>" +
      D.name +
      "</b><span>" +
      D.desc +
      "</span></div>";
    f.appendChild(d);
    d._k = k;
  });
  if (lv.newZ) {
    const z = ZOMB[lv.newZ];
    const e = document.createElement("div");
    e.className = "friend enemy";
    e.innerHTML =
      "<canvas></canvas><div><small>" +
      (lv.boss ? "Босс" : "Новый враг") +
      "</small><b>" +
      z.name +
      "</b><span>" +
      z.desc +
      "</span></div>";
    f.appendChild(e);
  }
  if (lv.note) {
    const e = document.createElement("div");
    e.className = "friend enemy";
    e.innerHTML =
      "<div><small>Особенность уровня</small><b>" +
      lv.note.t +
      "</b><span>" +
      lv.note.d +
      "</span></div>";
    f.appendChild(e);
  }
  show("sIntro");
  requestAnimationFrame(() => {
    pg.querySelectorAll(".tile").forEach((t) =>
      paintIcon(t.querySelector("canvas"), t._k, true),
    );
    f.querySelectorAll(".friend").forEach((el) => {
      const c = el.querySelector("canvas");
      if (!c) return;
      if (el._k) {
        paintIcon(c, el._k, true);
        return;
      }
      const r = c.getBoundingClientRect(),
        dd = window.devicePixelRatio || 1;
      c.width = r.width * dd;
      c.height = r.height * dd;
      const x = c.getContext("2d");
      x.scale(dd, dd);
      const Z = ZOMB[lv.newZ];
      drawZombie(
        x,
        {
          type: lv.newZ,
          hp: Z.hp,
          maxHp: Z.hp,
          base: Z.base,
          ph: 0,
          flash: 0,
          slowT: 0,
        },
        r.width / 2,
        r.height * (lv.boss ? 0.62 : 0.5),
        r.height * (lv.boss ? 0.42 : 0.95),
        0,
      );
    });
  });
}
function win() {
  if (state !== "play") return;
  state = "end";
  const last = G.li === LEVELS.length - 1;
  PROG.unlocked = Math.max(PROG.unlocked, Math.min(LEVELS.length, G.li + 2));
  if (last) PROG.beat = true;
  saveProg();
  S.stopMusic(true);
  S.jingle(true);
  for (let i = 0; i < 30; i++)
    G.parts.push({
      x: rand(0, W),
      y: rand(H * 0.3, H * 0.9),
      vx: rand(-40, 40),
      vy: rand(-260, -100),
      life: rand(1.2, 2.2),
      max: 2.2,
      color: ["#FF6B8B", "#F0B945", "#fff"][i % 3],
      size: rand(5, 9),
      heart: true,
      g: 120,
    });
  setTimeout(() => {
    if (last) {
      $("finalMsg").textContent = FINAL_TEXT;
      show("sFinal");
      S.startMusic("menu");
    } else {
      $("winEyebrow").textContent = "Уровень " + (G.li + 1) + " пройден";
      $("winMsg").textContent = WIN_TEXT[G.li] || "";
      show("sWin");
    }
  }, 1400);
}
function saveBest() {
  const b = PROG.best || { wave: 0, kills: 0 };
  const rec = G.wave > b.wave || (G.wave === b.wave && G.kills > b.kills);
  if (rec) {
    PROG.best = { wave: G.wave, kills: G.kills };
    saveProg();
  }
  return rec;
}
function lose() {
  if (state !== "play") return;
  state = "end";
  S.stopMusic(true);
  S.jingle(false);
  G.shake = 0.8;
  if (G.endless) {
    const rec = saveBest();
    $("loseEyebrow").textContent = rec ? "Новый рекорд!" : "Бесконечный режим";
    $("loseTitle").textContent = "Двор продержался до волны " + G.wave;
    $("loseMsg").textContent =
      "Прогнано зомби: " +
      G.kills +
      ". Рекорд: волна " +
      PROG.best.wave +
      ", зомби: " +
      PROG.best.kills +
      ".";
  } else {
    $("loseEyebrow").textContent = "Ой-ой";
    $("loseTitle").textContent = "Зомби пробрались в дом";
    $("loseMsg").textContent = LOSE_TEXT;
  }
  setTimeout(() => show("sLose"), 1100);
}
