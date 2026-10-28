/* ================== Экраны ================== */
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
    S.setMusicVol(el.value / 100);
    try {
      localStorage.setItem("dvz-music", String(S.mvol));
    } catch (e) {}
    syncMusicVol();
  }),
);
syncMusicVol();
$("bSound").addEventListener("click", toggleSound);
$("bPauseSound").addEventListener("click", toggleSound);
$("bPlay").addEventListener("click", () => {
  S.init();
  S.startMusic("menu");
  if (PROG.unlocked > 1) openLevels();
  else openIntro(0);
});
$("bLevels").addEventListener("click", () => {
  S.init();
  S.startMusic("menu");
  openLevels();
});
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
      " собак.";
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
  S.startMusic("menu");
  openLevels();
});
$("bNext").addEventListener("click", () =>
  openIntro(Math.min(LEVELS.length - 1, G.li + 1)),
);
$("bWinLv").addEventListener("click", () => {
  S.startMusic("menu");
  openLevels();
});
$("bRetry").addEventListener("click", () => startLevel(G.li));
$("bLoseLv").addEventListener("click", () => {
  S.startMusic("menu");
  openLevels();
});
$("bFinalLv").addEventListener("click", openLevels);

function openLevels() {
  state = "menu";
  const g = $("levelGrid");
  g.innerHTML = "";
  LEVELS.forEach((lv, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "lv";
    b.style.background = lv.color;
    const locked = i + 1 > PROG.unlocked,
      done = i + 1 < PROG.unlocked || (PROG.beat && i === LEVELS.length - 1);
    b.innerHTML =
      "<small>" +
      (lv.boss ? "Босс" : "Уровень") +
      (done ? " · пройден" : "") +
      "</small><b>" +
      (i + 1) +
      "</b><span>" +
      (locked ? "Закрыто" : lv.name) +
      "</span>";
    if (locked) b.disabled = true;
    else b.addEventListener("click", () => openIntro(i));
    g.appendChild(b);
  });
  const e = document.createElement("button");
  e.type = "button";
  e.className = "lv endless";
  e.innerHTML =
    "<small>Без конца" +
    (PROG.best ? " · рекорд: волна " + PROG.best.wave : "") +
    "</small><b>∞</b><span>Бесконечный режим, все собаки доступны</span>";
  e.addEventListener("click", () => openIntro("endless"));
  g.appendChild(e);
  show("sLevels");
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
      "косточек на старте: " +
      lv.bones;
  $("introTitle").textContent = lv.name;
  const f = $("introFriends");
  f.innerHTML = "";
  // выбор команды
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
  const pk = $("picker"),
    pg = $("pickGrid");
  pk.hidden = av.length <= SLOTS;
  pg.innerHTML = "";
  $("pickInfo").textContent =
    "Нажми на собаку, чтобы взять её в команду или убрать.";
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
          DOGS[k].name + ", " + DOGS[k].cost + " косточек. " + DOGS[k].desc;
        syncPick();
      });
      pg.appendChild(t);
    });
    syncPick();
  }
  (lv.newDogs || []).forEach((k) => {
    const d = document.createElement("div");
    d.className = "friend";
    d.innerHTML =
      "<canvas></canvas><div><small>Новый друг · " +
      DOGS[k].cost +
      " косточек</small><b>" +
      DOGS[k].name +
      "</b><span>" +
      DOGS[k].desc +
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
    e._note = 1;
    f.appendChild(e);
  }
  show("sIntro");
  requestAnimationFrame(() => {
    $("pickGrid")
      .querySelectorAll(".tile")
      .forEach((t) => paintIcon(t.querySelector("canvas"), t._k, true));
    f.querySelectorAll(".friend").forEach((el) => {
      const c = el.querySelector("canvas");
      if (!c) return;
      if (el._k) paintIcon(c, el._k, true);
      else {
        const r = c.getBoundingClientRect(),
          dd = window.devicePixelRatio || 1;
        c.width = r.width * dd;
        c.height = r.height * dd;
        const x = c.getContext("2d");
        x.scale(dd, dd);
        const zz = {
          type: lv.newZ,
          hp: ZOMB[lv.newZ].hp,
          maxHp: ZOMB[lv.newZ].hp,
          base: ZOMB[lv.newZ].base,
          ph: 0,
          flash: 0,
          slowT: 0,
        };
        drawZombie(
          x,
          zz,
          r.width / 2,
          r.height * (lv.boss ? 0.62 : 0.5),
          r.height * (lv.boss ? 0.42 : 0.95),
          0,
        );
      }
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
      $("finalSig").textContent = SIGNATURE + " ❤";
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
    $("loseTitle").textContent = "Ты продержалась до волны " + G.wave;
    $("loseMsg").textContent =
      "Собаки прогнали зомби: " +
      G.kills +
      ". Рекорд: волна " +
      PROG.best.wave +
      ", зомби: " +
      PROG.best.kills +
      ".";
  } else {
    $("loseEyebrow").textContent = "Ой-ой";
    $("loseTitle").textContent = "Зомби пробрались в дом";
    $("loseMsg").textContent =
      "Собаки не обиделись и верят в тебя. Попробуй ещё раз: побольше корги в начале и бульдоги впереди.";
  }
  setTimeout(() => show("sLose"), 1100);
}

