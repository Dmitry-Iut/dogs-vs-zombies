/* ================== HUD ================== */
let cardEls = {},
  lastBones = -1;
function buildCards() {
  const box = $("cards");
  box.innerHTML = "";
  cardEls = {};
  for (let i = 0; i < SLOTS; i++) {
    const k = G.loadout[i];
    const b = document.createElement("button");
    b.type = "button";
    b.className = "card";
    if (k) {
      b.innerHTML =
        '<canvas></canvas><span class="cost">' +
        DOGS[k].cost +
        '</span><span class="cd"></span>';
      b.setAttribute(
        "aria-label",
        DOGS[k].name + ", " + DOGS[k].cost + " косточек",
      );
      b.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        S.init();
        pickCard(k);
      });
      cardEls[k] = b;
    } else {
      b.classList.add("empty");
      b.disabled = true;
      b.textContent = "?";
    }
    box.appendChild(b);
  }
  requestAnimationFrame(() => {
    for (const k in cardEls) paintIcon(cardEls[k].querySelector("canvas"), k);
  });
}
function paintIcon(cvs, k, big) {
  const r = cvs.getBoundingClientRect();
  const d = window.devicePixelRatio || 1;
  cvs.width = Math.max(10, Math.round(r.width * d));
  cvs.height = Math.max(10, Math.round(r.height * d));
  const c = cvs.getContext("2d");
  c.scale(d, d);
  const s = Math.min(r.width, r.height * 1.02) * (big ? 0.95 : 1.02);
  drawDog(c, k, r.width / 2, r.height * 0.56, s, {
    t: 0,
    armed: false,
    icon: true,
  });
}
function pickCard(k) {
  if (state !== "play" || paused) return;
  if (G.sel === k) {
    G.sel = null;
    return;
  }
  if (G.cds[k] > 0) {
    S.err();
    nope(cardEls[k]);
    return;
  }
  if (G.bones < DOGS[k].cost) {
    S.err();
    nope("bonesBox");
    nope(cardEls[k]);
    return;
  }
  G.sel = k;
  G.shovel = false;
  updShovel();
  S.tone(880, 0.06, "triangle", 0.08);
}
function nope(el) {
  if (typeof el === "string") el = $(el);
  if (!el) return;
  el.classList.remove("nope");
  void el.offsetWidth;
  el.classList.add("nope");
}
function pulse() {
  const el = $("bonesBox");
  el.classList.remove("pulse");
  void el.offsetWidth;
  el.classList.add("pulse");
}
function hud(force) {
  if (G.bones !== lastBones || force) {
    $("boneCount").textContent = G.bones;
    lastBones = G.bones;
  }
  for (const k in cardEls) {
    const el = cardEls[k],
      D = DOGS[k];
    el.classList.toggle("sel", G.sel === k);
    el.classList.toggle("poor", G.bones < D.cost);
    el.querySelector(".cd").style.transform = "scaleY(" + G.cds[k] / D.cd + ")";
  }
  if (G.endless) {
    $("progFill").style.width = (G.waveT / 75) * 100 + "%";
    const nm = "Бесконечный · волна " + G.wave + " · зомби: " + G.kills;
    if (nm !== G._nm) {
      G._nm = nm;
      $("lvlName").textContent = nm;
    }
  } else
    $("progFill").style.width =
      (G.total ? (G.spawned / G.total) * 100 : 0) + "%";
}
function updShovel() {
  $("shovelBtn").classList.toggle("on", !!(G && G.shovel));
}
let bannerT = null;
function banner(text) {
  const el = $("banner");
  el.textContent = text;
  el.classList.remove("go");
  void el.offsetWidth;
  el.classList.add("go");
}
let tipT = null;
function tip(text, dur) {
  const el = $("tip");
  el.textContent = text;
  el.classList.add("on");
  clearTimeout(tipT);
  tipT = setTimeout(() => el.classList.remove("on"), (dur || 5.5) * 1000);
}
function hints() {
  if (G.li === 0) {
    if (G.hint === 0 && G.t > 0.6) {
      tip(
        "Выбери корги на панели сверху и нажми на газон. Корги приносят косточки.",
        7,
      );
      G.hint = 1;
    } else if (G.hint === 1 && G.dogs.some((d) => d.type === "corgi")) {
      tip(
        "Отлично! Поставь ещё пару корги. Нажимай на косточки, чтобы собрать их.",
        6,
      );
      G.hint = 2;
    } else if (G.hint === 2 && G.spawned > 0) {
      tip(
        "Зомби! Поставь хаски на его дорожку, ниже зомби. Она бросает мячики вверх.",
        7,
      );
      G.hint = 3;
    }
  } else if (G.hint === 0 && G.t > 0.8 && G.lv.tip) {
    tip(G.lv.tip, 7);
    G.hint = 1;
  }
}

