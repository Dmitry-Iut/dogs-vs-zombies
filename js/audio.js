/* ================== Звук ================== */
function silentWav() {
  const n = 800,
    b = new Uint8Array(44 + n),
    v = new DataView(b.buffer),
    str = (o, t) => {
      for (let i = 0; i < t.length; i++) b[o + i] = t.charCodeAt(i);
    };
  str(0, "RIFF");
  v.setUint32(4, 36 + n, true);
  str(8, "WAVEfmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true);
  v.setUint32(28, 8000, true);
  v.setUint16(32, 1, true);
  v.setUint16(34, 8, true);
  str(36, "data");
  v.setUint32(40, n, true);
  b.fill(128, 44);
  let bin = "";
  b.forEach((x) => (bin += String.fromCharCode(x)));
  return "data:audio/wav;base64," + btoa(bin);
}
const MUSIC_VOL = 0.6,
  MUSIC_EXT = ["mp3", "ogg", "m4a", "wav"],
  ENDLESS_TRACK_SEC = 60;
const S = {
  ctx: null,
  on: true,
  mvol: 1,
  timer: null,
  track: "day",
  step: 0,
  next: 0,
  last: {},
  init() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    // iPhone: играть и в беззвучном режиме (iOS 16.4+ — audioSession, старее — тихий <audio> переключает сессию)
    try {
      if (navigator.audioSession) navigator.audioSession.type = "playback";
      else {
        const a = new Audio(silentWav());
        a.loop = true;
        a.setAttribute("playsinline", "");
        a.play().catch(() => {});
        this.unmute = a;
      }
    } catch (e) {}
    try {
      this.ctx = new AC();
    } catch (e) {
      return;
    }
    const c = this.ctx;
    this.master = c.createGain();
    this.master.gain.value = this.on ? 1 : 0;
    this.master.connect(c.destination);
    this.sfx = c.createGain();
    this.sfx.gain.value = 0.6;
    this.sfx.connect(this.master);
    this.mg = c.createGain();
    this.mg.gain.value = 0.5 * this.mvol;
    this.mg.connect(this.master);
    const len = c.sampleRate;
    this.nb = c.createBuffer(1, len, c.sampleRate);
    const d = this.nb.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    if (this.wantMusic) this.startMusic(this.track);
  },
  setOn(v) {
    this.on = v;
    if (this.master)
      this.master.gain.setTargetAtTime(v ? 1 : 0, this.ctx.currentTime, 0.03);
    this.applyMusicVol();
  },
  setMusicVol(v) {
    this.mvol = v;
    if (this.mg)
      this.mg.gain.setTargetAtTime(0.5 * v, this.ctx.currentTime, 0.03);
    this.applyMusicVol();
  },
  applyMusicVol() {
    const a = this.audio;
    if (!a) return;
    const v = this.on ? MUSIC_VOL * this.mvol : 0;
    a.volume = v;
    a.muted = v === 0;
  },
  thr(name, gap) {
    const n = performance.now();
    if (this.last[name] && n - this.last[name] < gap) return false;
    this.last[name] = n;
    return true;
  },
  tone(f, dur, type, vol, f2, when, dest) {
    const c = this.ctx;
    if (!c) return;
    const t = when || c.currentTime;
    const o = c.createOscillator(),
      g = c.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(dest || this.sfx);
    o.start(t);
    o.stop(t + dur + 0.03);
  },
  noise(dur, vol, freq, ft, when, dest, q) {
    const c = this.ctx;
    if (!c) return;
    const t = when || c.currentTime;
    const s = c.createBufferSource();
    s.buffer = this.nb;
    const f = c.createBiquadFilter();
    f.type = ft || "lowpass";
    f.frequency.value = freq || 1000;
    if (q) f.Q.value = q;
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f);
    f.connect(g);
    g.connect(dest || this.sfx);
    s.start(t, Math.random() * 0.5);
    s.stop(t + dur + 0.03);
  },
  bark(p) {
    const c = this.ctx;
    if (!c || !this.thr("bark", 130)) return;
    p = p || 1;
    const now = c.currentTime,
      f = (470 + Math.random() * 110) * p;
    const o = c.createOscillator(),
      g = c.createGain(),
      bp = c.createBiquadFilter();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(f * 0.8, now);
    o.frequency.linearRampToValueAtTime(f * 1.25, now + 0.03);
    o.frequency.exponentialRampToValueAtTime(f * 0.55, now + 0.13);
    bp.type = "bandpass";
    bp.frequency.value = 1100 * p;
    bp.Q.value = 1.3;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.28, now + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    o.connect(bp);
    bp.connect(g);
    g.connect(this.sfx);
    o.start(now);
    o.stop(now + 0.18);
    this.noise(0.06, 0.08, 1800 * p, "bandpass", now, null, 1);
  },
  pop() {
    this.tone(660, 0.14, "sine", 0.25, 1320);
    this.tone(990, 0.12, "triangle", 0.08, 1600);
  },
  place() {
    this.tone(200, 0.14, "triangle", 0.3, 90);
    this.noise(0.08, 0.15, 700);
  },
  hit() {
    if (this.thr("hit", 60)) this.noise(0.05, 0.12, 2600, "highpass");
  },
  splat() {
    if (!this.thr("splat", 80)) return;
    this.noise(0.25, 0.25, 600);
    this.tone(170, 0.25, "sawtooth", 0.08, 60);
  },
  groan() {
    if (!this.thr("groan", 2500)) return;
    const c = this.ctx;
    if (!c) return;
    this.tone(rand(95, 125), 0.9, "sawtooth", 0.05, rand(70, 85));
  },
  chomp() {
    if (this.thr("chomp", 330))
      this.noise(0.06, 0.12, 900, "bandpass", null, null, 2);
  },
  boom() {
    this.noise(0.7, 0.55, 600);
    this.tone(110, 0.6, "sine", 0.5, 35);
  },
  err() {
    this.tone(220, 0.12, "square", 0.06, 160);
  },
  dig() {
    this.noise(0.15, 0.2, 1200, "bandpass");
  },
  yelp() {
    this.tone(900, 0.18, "triangle", 0.15, 1500);
  },
  mower() {
    this.tone(180, 1, "sawtooth", 0.06, 300);
    this.noise(1, 0.08, 900);
  },
  horn() {
    this.tone(196, 0.5, "sawtooth", 0.08, 180);
    this.tone(
      147,
      0.6,
      "sawtooth",
      0.07,
      140,
      this.ctx ? this.ctx.currentTime + 0.45 : 0,
    );
  },
  roar() {
    this.noise(1, 0.35, 400);
    this.tone(80, 1, "sawtooth", 0.18, 45);
  },
  jingle(win) {
    const c = this.ctx;
    if (!c) return;
    const n = c.currentTime;
    const seq = win ? [72, 76, 79, 84, 79, 84] : [67, 63, 60, 55];
    seq.forEach((m, i) =>
      this.tone(
        440 * Math.pow(2, (m - 69) / 12),
        0.28,
        "triangle",
        0.22,
        null,
        n + i * 0.14,
      ),
    );
  },
  /* Музыка из файлов music/1.mp3, 2.mp3, 3.mp3… (номера подряд). Меню — своя синтезаторная мелодия. На каждую игру — случайный трек,
     в бесконечном режиме трек меняется каждую минуту. Нет файлов — играет синтезатор */
  list: null,
  listCbs: null,
  audio: null,
  elapsed: 0,
  lastT: 0,
  gen: 0,
  startMusic(track, fresh) {
    this.track = track;
    this.wantMusic = true;
    if (!this.ctx) return;
    this.stopMusic(true);
    const g = this.gen;
    this.loadList((l) => {
      if (g !== this.gen) return;
      if (l.length && track !== "menu") {
        if (fresh || !this.audio) this.pickTrack();
        else {
          this.applyMusicVol();
          this.audio.play().catch(() => {});
        }
      } else {
        this.step = 0;
        this.next = this.ctx.currentTime + 0.1;
        this.timer = setInterval(() => this.sched(), 40);
      }
    });
  },
  stopMusic(keep) {
    this.gen++;
    clearInterval(this.timer);
    this.timer = null;
    if (this.audio) this.audio.pause();
    if (!keep) this.wantMusic = false;
  },
  pickTrack() {
    const l = this.list;
    let a;
    do a = l[Math.floor(Math.random() * l.length)];
    while (l.length > 1 && a === this.audio);
    if (this.audio) this.audio.pause();
    this.audio = a;
    a.currentTime = 0;
    this.lastT = 0;
    this.elapsed = 0;
    this.applyMusicVol();
    a.play().catch(() => {});
  },
  loadList(cb) {
    if (this.list) return cb(this.list);
    if (this.listCbs) return this.listCbs.push(cb);
    this.listCbs = [cb];
    const list = [];
    const probe = (n, e) => {
      if (e >= MUSIC_EXT.length) {
        this.list = list;
        const cbs = this.listCbs;
        this.listCbs = null;
        cbs.forEach((f) => f(list));
        return;
      }
      const a = new Audio();
      let done = false;
      a.preload = "auto";
      a.loop = true;
      const ok = () => {
          if (done) return;
          done = true;
          a.addEventListener("timeupdate", () => this.tick(a));
          list.push(a);
          probe(n + 1, 0);
        },
        bad = () => {
          if (done) return;
          done = true;
          probe(n, e + 1);
        };
      a.addEventListener("canplay", ok);
      a.addEventListener("loadeddata", ok);
      a.addEventListener("error", bad);
      a.src = "music/" + n + "." + MUSIC_EXT[e];
      a.load();
    };
    probe(1, 0);
  },
  tick(a) {
    if (a !== this.audio) return;
    let d = a.currentTime - this.lastT;
    if (d < 0) d += a.duration || 0;
    this.lastT = a.currentTime;
    if (d > 0 && d < 2) this.elapsed += d;
    if (
      this.elapsed >= ENDLESS_TRACK_SEC &&
      G &&
      G.endless &&
      state === "play" &&
      !paused
    )
      this.pickTrack();
  },
  sched() {
    const c = this.ctx,
      Tk = TRACKS[this.track];
    const spb = 60 / Tk.bpm / 2;
    const mf = (m) => 440 * Math.pow(2, (m - 69) / 12);
    while (this.next < c.currentTime + 0.18) {
      const i = this.step % Tk.mel.length,
        m = Tk.mel[i],
        b = Tk.bass[i];
      if (m)
        this.tone(mf(m), spb * 1.7, Tk.lead, Tk.lv, null, this.next, this.mg);
      if (b)
        this.tone(mf(b), spb * 1.9, "triangle", 0.2, null, this.next, this.mg);
      if (i % 2 === 1)
        this.noise(0.03, 0.035, 7000, "highpass", this.next, this.mg);
      if (Tk.kick && i % (Tk.kick === true ? 4 : Tk.kick) === 0)
        this.tone(130, 0.14, "sine", 0.3, 45, this.next, this.mg);
      if (Tk.snare && i % 8 === 4)
        this.noise(0.12, 0.1, 2000, "bandpass", this.next, this.mg, 0.8);
      if (Tk.chords && i % 8 === 0)
        Tk.chords[(i / 8) % Tk.chords.length].forEach((n) =>
          this.tone(mf(n), spb * 7.5, "sine", 0.04, null, this.next, this.mg),
        );
      this.next += spb;
      this.step++;
    }
  },
};

