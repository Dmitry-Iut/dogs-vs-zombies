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
const PITCH = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function midi(n) {
  const m = /^([A-G])(#|b)?(-?\d)$/.exec(n);
  if (!m) return 0;
  return (
    12 * (+m[3] + 1) +
    PITCH[m[1]] +
    (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0)
  );
}
const seq = (s) =>
  s
    .trim()
    .split(/\s+/)
    .map((t) => (t === "." ? 0 : midi(t)));
const chordSeq = (s) => (s ? s.split("|").map(seq) : null);
const mf = (m) => 440 * Math.pow(2, (m - 69) / 12);
const TRACK_SRC = {
  menu: {
    bpm: 104,
    lead: "triangle",
    lv: 0.13,
    arp: 0.02,
    k: "x.......",
    s: "....x...",
    h: ".x.x.x.x",
    mel: "C5 . E5 G5 C6 . G5 E5  A5 . G5 E5 C5 . D5 E5  F5 . A5 . G5 F5 E5 D5  D5 . G5 . . . B4 D5  E5 . G5 C6 . B5 A5 G5  A5 . E5 . C5 D5 E5 .  F5 E5 D5 C5 D5 . B4 .  C5 . . . G4 . C5 .",
    bass: "C3 . G3 . C3 . G3 E3  A2 . E3 . A2 . E3 C3  F2 . C3 . F2 . C3 A2  G2 . D3 . G2 . B2 D3  C3 . G3 . C3 . G3 E3  A2 . E3 . A2 . E3 C3  F2 . C3 . G2 . D3 .  C3 . G3 . C3 . . .",
    chords:
      "C4 E4 G4|A3 C4 E4|F3 A3 C4|G3 B3 D4|C4 E4 G4|A3 C4 E4|F3 A3 C4|G3 C4 E4",
  },
  day: {
    bpm: 116,
    lead: "triangle",
    lv: 0.15,
    arp: 0.022,
    k: "x...x...",
    s: "....x...",
    h: ".x.x.x.x",
    mel: "C5 . E5 G5 E5 . C5 D5  E5 . D5 C5 A4 . . .  C5 . E5 G5 A5 . G5 E5  D5 . E5 D5 C5 . . .  A5 . G5 E5 F5 . E5 C5  D5 . E5 F5 G5 . . .  A5 . C6 A5 G5 . E5 C5  D5 . E5 D5 C5 . . .",
    bass: "C3 . G3 . C3 . G3 .  A2 . E3 . A2 . E3 .  F2 . C3 . G2 . D3 .  G2 . D3 . C3 . G3 .  F2 . C3 . F2 . C3 .  G2 . D3 . G2 . D3 .  A2 . E3 . A2 . E3 .  G2 . D3 . C3 . G3 .",
    chords:
      "C4 E4 G4|A3 C4 E4|F3 A3 C4|G3 B3 D4|F3 A3 C4|G3 B3 D4|A3 C4 E4|C4 E4 G4",
  },
  evening: {
    bpm: 92,
    lead: "sine",
    lv: 0.16,
    arp: 0.03,
    k: "x.......",
    h: "..x...x.",
    mel: "A5 . . G5 F5 . C5 .  D5 . F5 . E5 . . .  C5 . D5 . F5 . A5 .  G5 . . . . . . .  Bb5 . A5 . G5 . F5 .  G5 . A5 . C6 . . .  A5 . G5 . F5 . D5 .  E5 . . . F5 . . .",
    bass: "F2 . C3 . F3 . C3 .  D2 . A2 . D3 . A2 .  Bb1 . F2 . Bb2 . F2 .  C2 . G2 . C3 . G2 .  Bb1 . F2 . Bb2 . F2 .  C2 . G2 . C3 . E3 .  D2 . A2 . D3 . A2 .  C2 . G2 . C3 . G2 .",
    chords:
      "F3 A3 C4|D3 F3 A3|Bb2 D3 F3|C3 E3 G3|Bb2 D3 F3|C3 E3 G3|D3 F3 A3|C3 E3 G3",
  },
  night: {
    bpm: 98,
    lead: "sine",
    lv: 0.16,
    arp: 0.02,
    k: "x.......",
    h: "..x...x.",
    mel: "A4 . C5 . E5 . D5 C5  B4 . . . G4 . B4 .  A4 . C5 . F5 . E5 D5  C5 . B4 . A4 . . .  E5 . . D5 C5 . B4 .  C5 . A4 . . . . .  F5 . E5 . D5 . C5 .  B4 . G#4 . A4 . . .",
    bass: "A2 . E3 . A2 . E3 .  G2 . D3 . G2 . D3 .  F2 . C3 . F2 . C3 .  E2 . B2 . A2 . E3 .  F2 . C3 . F2 . C3 .  G2 . D3 . G2 . D3 .  D2 . A2 . D2 . A2 .  E2 . B2 . E2 . G#2 .",
    chords:
      "A3 C4 E4|G3 B3 D4|F3 A3 C4|E3 G#3 B3|F3 A3 C4|G3 B3 D4|D3 F3 A3|E3 G#3 B3",
  },
  autumn: {
    bpm: 112,
    lead: "square",
    lv: 0.05,
    arp: 0.018,
    k: "x...x...",
    s: "..x...x.",
    h: ".x.x.x.x",
    mel: "D5 . F5 . A5 . G5 F5  E5 . C5 . D5 . . .  D5 . F5 . A5 . C6 B5  A5 . G5 . A5 . . .  F5 . G5 . A5 . D5 .  C5 . D5 . E5 . C5 .  D5 . F5 E5 D5 . C5 A4  D5 . . . . . . .",
    bass: "D2 . A2 . D3 . A2 .  C2 . G2 . C3 . G2 .  D2 . A2 . D3 . A2 .  G2 . D3 . G2 . B2 .  F2 . C3 . F2 . C3 .  C2 . G2 . C3 . G2 .  Bb1 . F2 . C2 . G2 .  D2 . A2 . D2 . . .",
    chords:
      "D3 F3 A3|C3 E3 G3|D3 F3 A3|G3 B3 D4|F3 A3 C4|C3 E3 G3|Bb2 D3 F3|D3 F3 A3",
  },
  winter: {
    bpm: 108,
    lead: "triangle",
    lv: 0.14,
    arp: 0.03,
    k: "x...x...",
    h: "x.x.x.x.",
    mel: "B5 . D6 . B5 . G5 .  A5 . B5 . A5 . F#5 .  G5 . E5 . G5 . B5 .  A5 . . . . . . .  B5 . D6 . E6 . D6 .  C6 . B5 . A5 . G5 .  F#5 . G5 . A5 . F#5 .  G5 . . . . . . .",
    bass: "G2 . D3 . G2 . D3 .  D2 . A2 . D2 . A2 .  E2 . B2 . E2 . B2 .  D2 . A2 . D2 . F#2 .  G2 . D3 . C3 . G2 .  C2 . G2 . A2 . E2 .  D2 . A2 . D2 . A2 .  G2 . D3 . G2 . . .",
    chords:
      "G3 B3 D4|D3 F#3 A3|E3 G3 B3|D3 F#3 A3|G3 B3 D4|C3 E3 G3|D3 F#3 A3|G3 B3 D4",
  },
  storm: {
    bpm: 128,
    lead: "sawtooth",
    lv: 0.045,
    k: "x..x.x..",
    s: "....x...",
    h: "xxxxxxxx",
    mel: "E5 . E5 G5 . F#5 E5 .  D5 . B4 . . . . .  E5 . E5 G5 . A5 B5 .  A5 . G5 . F#5 . . .  C6 . B5 A5 . G5 A5 .  B5 . G5 . E5 . . .  C5 . D5 . E5 . F#5 .  E5 . . . D#5 . . .",
    bass: "E2 E2 . E2 B2 . E2 .  D2 D2 . D2 A2 . D2 .  C2 C2 . C2 G2 . C2 .  D2 D2 . D2 A2 . D2 .  A1 A1 . A1 E2 . A1 .  E2 E2 . E2 B2 . E2 .  C2 C2 . C2 G2 . C2 .  B1 B1 . B1 F#2 . B1 .",
    chords:
      "E3 G3 B3|D3 F#3 A3|C3 E3 G3|D3 F#3 A3|A2 C3 E3|E3 G3 B3|C3 E3 G3|B2 D#3 F#3",
  },
  boss: {
    bpm: 140,
    lead: "square",
    lv: 0.06,
    k: "x...x...",
    s: "....x...",
    h: ".x.x.x.x",
    mel: "A4 . C5 A4 E5 . D#5 .  D5 . C5 B4 A4 . . .  A4 . C5 A4 F5 . E5 .  D5 . C5 . B4 . G#4 .",
    bass: "A1 A1 . A1 E2 . A1 .  G1 G1 . G1 D2 . G1 .  F1 F1 . F1 C2 . F1 .  E1 E1 . E1 B1 . G#1 .",
  },
};
const MUSIC = {};
for (const k in TRACK_SRC) {
  const s = TRACK_SRC[k];
  MUSIC[k] = Object.assign({}, s, {
    mel: seq(s.mel),
    bass: seq(s.bass),
    chords: chordSeq(s.chords),
  });
}
const beat = (p, st) => !!p && p[st % p.length] === "x";
const S = {
  ctx: null,
  on: true,
  mvol: 1,
  timer: null,
  track: "menu",
  step: 0,
  next: 0,
  last: {},
  wantMusic: false,
  init() {
    if (this.ctx) {
      if (this.ctx.state === "suspended" && !document.hidden)
        this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
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
    this.mus = c.createBiquadFilter();
    this.mus.type = "lowpass";
    this.mus.frequency.value = 4200;
    this.mus.connect(this.mg);
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
  },
  setMusicVol(v) {
    this.mvol = v;
    if (this.mg)
      this.mg.gain.setTargetAtTime(0.5 * v, this.ctx.currentTime, 0.03);
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
  meow(p) {
    const c = this.ctx;
    if (!c || !this.thr("meow", 160)) return;
    p = p || 1;
    const now = c.currentTime,
      f = (560 + Math.random() * 80) * p;
    const o = c.createOscillator(),
      g = c.createGain(),
      bp = c.createBiquadFilter();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(f * 0.75, now);
    o.frequency.linearRampToValueAtTime(f * 1.3, now + 0.12);
    o.frequency.exponentialRampToValueAtTime(f * 0.7, now + 0.36);
    bp.type = "bandpass";
    bp.Q.value = 2.2;
    bp.frequency.setValueAtTime(900 * p, now);
    bp.frequency.linearRampToValueAtTime(1700 * p, now + 0.14);
    bp.frequency.linearRampToValueAtTime(800 * p, now + 0.36);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.22, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
    o.connect(bp);
    bp.connect(g);
    g.connect(this.sfx);
    o.start(now);
    o.stop(now + 0.42);
  },
  hiss() {
    if (this.thr("hiss", 200)) this.noise(0.35, 0.18, 3800, "highpass");
  },
  spit() {
    if (this.thr("spit", 90)) this.tone(900, 0.07, "triangle", 0.07, 500);
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
    if (!this.thr("groan", 2500) || !this.ctx) return;
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
    const sq = win ? [72, 76, 79, 84, 79, 84] : [67, 63, 60, 55];
    sq.forEach((m, i) =>
      this.tone(mf(m), 0.28, "triangle", 0.22, null, n + i * 0.14),
    );
  },
  startMusic(track) {
    this.track = MUSIC[track] ? track : "menu";
    this.wantMusic = true;
    if (!this.ctx) return;
    clearInterval(this.timer);
    this.step = 0;
    this.next = this.ctx.currentTime + 0.1;
    this.timer = setInterval(() => this.sched(), 40);
  },
  stopMusic(keep) {
    clearInterval(this.timer);
    this.timer = null;
    if (!keep) this.wantMusic = false;
  },
  sched() {
    const c = this.ctx,
      Tk = MUSIC[this.track];
    const spb = 60 / Tk.bpm / 2;
    if (this.next < c.currentTime) this.next = c.currentTime + 0.05;
    while (this.next < c.currentTime + 0.2) {
      const st = this.step,
        at = this.next;
      const m = Tk.mel[st % Tk.mel.length],
        b = Tk.bass[st % Tk.bass.length];
      if (m) this.tone(mf(m), spb * 1.7, Tk.lead, Tk.lv, null, at, this.mus);
      if (b) this.tone(mf(b), spb * 1.9, "triangle", 0.2, null, at, this.mus);
      if (Tk.chords) {
        const ch = Tk.chords[Math.floor(st / 8) % Tk.chords.length];
        if (st % 8 === 0)
          ch.forEach((n) =>
            this.tone(mf(n), spb * 7.5, "sine", 0.035, null, at, this.mus),
          );
        if (Tk.arp)
          this.tone(
            mf(ch[st % ch.length] + 12),
            spb * 0.9,
            "sine",
            Tk.arp,
            null,
            at,
            this.mus,
          );
      }
      if (beat(Tk.k, st)) this.tone(130, 0.14, "sine", 0.3, 45, at, this.mg);
      if (beat(Tk.s, st))
        this.noise(0.12, 0.1, 2000, "bandpass", at, this.mg, 0.8);
      if (beat(Tk.h, st))
        this.noise(0.03, 0.035, 7000, "highpass", at, this.mg);
      this.next += spb;
      this.step++;
    }
  },
};
