/* ================== Настройки подарка ================== */
const HER = 'Лена';
const SIGNATURE = 'Твой Дима';
const FINAL_TEXT = HER + ', ты самая смелая защитница на свете! Ты спасла всех собак двора, и теперь они хотят только одного: чтобы ты их погладила. А я просто очень тебя люблю.';
const WIN_TEXT = [
  'Коржик принёс тебе самую красивую косточку и говорит, что ты лучшая хозяйка на свете.',
  'Батон впечатлён. Он столько не держался, сколько ты держишь оборону!',
  'Снежок дарит тебе снежок. Не бойся, он тёплый, как ты.',
  'Чика всё ещё трясётся, но теперь уже от восторга.',
  'Пятнышко пересчитал свои пятна. Их 42, и каждое тебя обожает.',
  'Листья кружатся, а собаки кружатся вокруг тебя. Осень с тобой тёплая.',
  'Снежок счастлив: наконец-то зима! А Батон просит плед и тебя рядом.',
  'Туман рассеялся. А ты, как всегда, видишь всё насквозь.',
  'Гроза прошла. Собаки больше не боятся грома, ведь с ними ты.'
];

/* ================== Данные ================== */
const COLS = 5, ROWS = 8;
const DOGS = {
  corgi:     {name:'Корги Коржик',     cost:50,  cd:7.5, hp:300,  desc:'Приносит косточки. Ставь побольше в начале уровня!'},
  husky:     {name:'Хаски Буран',      cost:100, cd:7.5, hp:300,  desc:'Бросает теннисные мячики в зомби на своей дорожке.'},
  bulldog:   {name:'Бульдог Батон',    cost:50,  cd:20,  hp:4000, desc:'Крепкий, как стена. Зомби долго ломают об него зубы.'},
  samoyed:   {name:'Самоед Снежок',    cost:175, cd:7.5, hp:300,  desc:'Кидает снежки: зомби мёрзнут и идут вдвое медленнее.'},
  chihuahua: {name:'Чихуахуа Чика',    cost:25,  cd:20,  hp:300,  desc:'Заряжается 12 секунд, потом тявкает так, что зомби рядом разлетаются. Сама убегает домой.'},
  dalmatian: {name:'Далматин Пятнышко',cost:200, cd:7.5, hp:300,  desc:'Бросает по два мячика за раз.'},
  pug:       {name:'Мопс Соня',        cost:125, cd:7.5, hp:300,  desc:'Чихает облаком на три клетки вперёд и задевает всех зомби на пути.'},
  dachshund: {name:'Такса Колбаска',   cost:150, cd:7.5, hp:300,  desc:'Хватает зомби прямо перед собой и утаскивает в нору. Потом долго жуёт.'},
  retriever: {name:'Ретривер Санни',   cost:175, cd:7.5, hp:300,  desc:'Бросает фрисби, которая пролетает сквозь всех зомби на дорожке.'},
  bernard:   {name:'Сенбернар Бруно',  cost:125, cd:20,  hp:1500, desc:'Лечит соседних собак тёплым какао из своего бочонка.'}
};
const SHORT = {corgi:'Корги',husky:'Хаски',bulldog:'Бульдог',samoyed:'Самоед',chihuahua:'Чихуахуа',dalmatian:'Далматин',pug:'Мопс',dachshund:'Такса',retriever:'Ретривер',bernard:'Сенбернар'};
const DOG_ORDER = ['corgi','husky','bulldog','samoyed','chihuahua','dalmatian','pug','dachshund','retriever','bernard'];
const UNLOCK = {corgi:1,husky:1,bulldog:2,samoyed:3,chihuahua:4,dalmatian:5,pug:6,dachshund:7,retriever:8,bernard:9};
const SLOTS = 6;
const availFor = i => i==='endless' ? DOG_ORDER.slice() : DOG_ORDER.filter(k=>UNLOCK[k]<=i+1);
const themeTrack = th => th==='boss'?'boss':['night','evening','fog','storm'].includes(th)?'night':'day';
const E_THEMES = ['day','afternoon','sunset','evening','night','autumn','winter','fog','storm'];
const ENDLESS_INFO = {name:'Бесконечный режим', bones:300, note:{t:'Без конца', d:'Волны идут одна за другой и становятся всё сильнее. Каждые 3 волны пылесосы заряжаются снова, а каждая 8-я волна — Зомби-Король. В команду можно взять любых собак.'}};
function makeEndlessLv(){ return {name:'Бесконечный режим', theme:'day', bones:300, sky:10, waves:[], mix:{basic:1}, endless:true, tip:'Продержись как можно дольше! Каждые 75 секунд начинается новая волна.'}; }
function endlessMix(w){ const m={basic:3}; if(w>=2)m.helmet=2; if(w>=3)m.runner=1.5; if(w>=4)m.bucket=1.2; if(w>=5){m.skater=1.3;m.fatty=.8;} if(w>=6)m.door=1.2; if(w>=7)m.giant=.25+w*.03; return m; }
const ZOMB = {
  basic:  {name:'Обычный зомби', hp:200,  base:200, speed:.22, dps:100, desc:'Медленный и очень голодный.'},
  helmet: {name:'Зомби в каске', hp:560,  base:200, speed:.22, dps:100, desc:'Каска выдерживает несколько мячиков.'},
  runner: {name:'Зомби-бегун',   hp:240,  base:240, speed:.48, dps:100, desc:'Бегает в два раза быстрее. Не зевай!'},
  bucket: {name:'Зомби с ведром',hp:1300, base:200, speed:.22, dps:100, desc:'Ведро на голове — очень крепкая защита.'},
  fatty:  {name:'Зомби-толстяк', hp:1800, base:1800,speed:.13, dps:200, desc:'Очень живучий и кусается вдвое сильнее.'},
  skater: {name:'Зомби на скейте',hp:340, base:340, speed:.38, dps:100, desc:'Катится быстро и держит удар лучше бегуна.'},
  door:   {name:'Зомби с дверью', hp:1400, base:200, speed:.2,  dps:100, desc:'Прячется за старой дверью, пока её не разобьют.'},
  giant:  {name:'Зомби-великан',  hp:3000, base:3000,speed:.12, dps:900, desc:'Огромный, со столбом в руке. Расплющивает собаку за пару секунд — встречай его чихуахуа!'},
  boss:   {name:'Зомби-Король',  hp:13000,base:11000,speed:.05,dps:500, desc:'Огромный, занимает три дорожки. Призывает свиту, кидается гнилыми костями и топчет собак.'}
};
const LEVELS = [
  {name:'Солнечный дворик', theme:'day',       dogs:2, bones:150, first:22, count:9,  gap0:16, gap1:9,   mix:{basic:1}, waves:[1], waveSize:4, sky:9,  newDogs:['corgi','husky'], newZ:'basic', color:'#5FA83A'},
  {name:'После обеда',      theme:'afternoon', dogs:3, bones:150, first:18, count:13, gap0:14, gap1:7,   mix:{basic:3,helmet:1}, waves:[.55,1], waveSize:5, sky:9.5, newDogs:['bulldog'], newZ:'helmet', color:'#C9A23A', tip:'Бульдог Батон — живая стена. Ставь его впереди собак, которые бросают мячики.'},
  {name:'Розовый закат',    theme:'sunset',    dogs:4, bones:175, first:16, count:17, gap0:12, gap1:6,   mix:{basic:3,helmet:2,runner:2}, waves:[.5,1], waveSize:6, sky:10, newDogs:['samoyed'], newZ:'runner', color:'#D86A6A', tip:'Самоед замедляет зомби. Особенно пригодится против бегунов!'},
  {name:'Сиреневый вечер',  theme:'evening',   dogs:5, bones:200, first:15, count:20, gap0:11, gap1:5.5, mix:{basic:3,helmet:2,runner:2,bucket:1.5}, waves:[.5,1], waveSize:7, sky:11, newDogs:['chihuahua'], newZ:'bucket', color:'#7B5BB8', tip:'Чихуахуа стоит всего 25 косточек. Поставь её заранее на пути зомби с ведром.'},
  {name:'Лунная ночь',      theme:'night',     dogs:6, bones:250, first:15, count:24, gap0:10, gap1:5,   mix:{basic:3,helmet:2,runner:2,bucket:1.5,fatty:1}, waves:[.35,.7,1], waveSize:7, sky:15, newDogs:['dalmatian'], newZ:'fatty', color:'#33508A', tip:'Ночью косточки с неба падают реже. Корги нужны как никогда.'},
  {name:'Осенний листопад',  theme:'autumn',  dogs:6, bones:250, first:15, count:26, gap0:9.5, gap1:4.8, mix:{basic:3,helmet:2,runner:2,bucket:1.5,fatty:1,skater:1.5}, waves:[.35,.7,1], waveSize:8, sky:10, newDogs:['pug'], newZ:'skater', color:'#C7772E', tip:'Скейтеры быстрые. Самоед с его снежками тут очень кстати.'},
  {name:'Снежный двор',      theme:'winter',  dogs:6, bones:250, first:15, count:28, gap0:9,   gap1:4.6, mix:{basic:3,helmet:2,runner:1.5,bucket:1.5,fatty:1,skater:1.5,door:1.5}, waves:[.35,.7,1], waveSize:8, sky:11, newDogs:['dachshund'], newZ:'door', color:'#5E95BF', tip:'Дверь держит много мячиков. Далматины пробивают её быстрее всех.'},
  {name:'Туманное утро',     theme:'fog',     dogs:6, bones:275, first:15, count:30, gap0:9,   gap1:4.5, mix:{basic:3,helmet:2,runner:2,bucket:1.5,fatty:1,skater:1.5,door:1.5}, waves:[.3,.65,1], waveSize:9, sky:12, newDogs:['retriever'], newZ:null, note:{t:'Туман',d:'Верхние ряды скрыты туманом. Зомби появятся неожиданно, так что строй оборону заранее на всех дорожках.'}, color:'#7E8C99', tip:'В тумане зомби не видно. Не жди их — ставь собак на все дорожки.'},
  {name:'Гроза',             theme:'storm',   dogs:6, bones:300, first:14, count:34, gap0:8.5, gap1:4.2, mix:{basic:3,helmet:2,runner:2,bucket:1.5,fatty:1,skater:1.5,door:1.5,giant:.8}, waves:[.3,.6,1], waveSize:9, sky:14, newDogs:['bernard'], newZ:'giant', color:'#3D4A73', tip:'Великан топчет собак мгновенно. Поставь перед ним чихуахуа!'},
  {name:'Логово Зомби-Короля', theme:'boss',   dogs:6, bones:500, first:14, count:14, gap0:8,  gap1:5.5, mix:{basic:3,helmet:2,runner:2,bucket:1,skater:1.5,door:1}, waves:[], waveSize:0, sky:10, boss:true, bossT:58, newDogs:[], newZ:'boss', color:'#8A2645', tip:'Король идёт по трём средним дорожкам. Строй оборону в центре!'}
];
const THEMES = {
  day:      {g1:'#8AD058',g2:'#7AC34A',street:'#A38F72',deck:'#C48D5A',tint:null},
  afternoon:{g1:'#8DCB54',g2:'#7DBD46',street:'#A88E68',deck:'#C48D5A',tint:'rgba(255,190,70,.13)'},
  sunset:   {g1:'#8CC556',g2:'#7CB748',street:'#A5876C',deck:'#C48D5A',tint:'rgba(255,95,120,.20)'},
  evening:  {g1:'#86C158',g2:'#76B34A',street:'#8E7E74',deck:'#B98656',tint:'rgba(80,50,160,.30)'},
  night:    {g1:'#7DBA55',g2:'#6EAC48',street:'#6E6A70',deck:'#A97B50',tint:'rgba(8,18,60,.50)',stars:true},
  autumn:   {g1:'#A9BA50',g2:'#9AAC45',street:'#9C8064',deck:'#C48D5A',tint:'rgba(255,140,40,.12)',leaves:true},
  winter:   {g1:'#E3EEF4',g2:'#D2E2EC',street:'#AEB9C4',deck:'#B98656',tint:'rgba(140,180,255,.10)',snow:true},
  fog:      {g1:'#80B35B',g2:'#72A54F',street:'#8A8A86',deck:'#B48252',tint:'rgba(70,80,100,.28)',fog:true},
  storm:    {g1:'#70A651',g2:'#629845',street:'#5E5E66',deck:'#A07048',tint:'rgba(10,20,55,.50)',rain:true},
  boss:     {g1:'#7DB555',g2:'#6EA748',street:'#5E4E58',deck:'#A07048',tint:'rgba(85,0,40,.46)',stars:true}
};
const TRACKS = {
  menu: {bpm:104, lead:'triangle', lv:.13, kick:8, snare:true,
    mel:[72,0,76,79,84,0,79,76, 81,0,79,76,72,0,74,76, 77,0,81,0,79,77,76,74, 74,0,79,0,0,0,71,74,
         76,0,79,84,0,83,81,79, 81,0,76,0,72,74,76,0, 77,76,74,72,74,0,71,0, 72,0,0,0,67,0,72,0],
    bass:[48,0,55,0,48,0,55,52, 45,0,52,0,45,0,52,48, 41,0,48,0,41,0,48,45, 43,0,50,0,43,0,47,50,
          48,0,55,0,48,0,55,52, 45,0,52,0,45,0,52,48, 41,0,48,0,43,0,50,0, 48,0,55,0,48,0,0,0],
    chords:[[60,64,67],[57,60,64],[53,57,60],[55,59,62],[60,64,67],[57,60,64],[53,57,60],[55,60,64]]},
  day:  {bpm:116, lead:'triangle', lv:.15, mel:[72,0,76,79,76,0,72,74,76,0,74,72,69,0,0,0,72,0,76,79,81,0,79,76,74,0,76,74,72,0,0,0], bass:[48,0,55,0,48,0,55,0,45,0,52,0,45,0,52,0,41,0,48,0,43,0,50,0,43,0,50,0,48,0,55,0]},
  night:{bpm:98,  lead:'sine',     lv:.16, mel:[69,0,72,0,76,0,74,72,71,0,0,0,67,0,71,0,69,0,72,0,77,0,76,74,72,0,71,0,69,0,0,0], bass:[45,0,52,0,45,0,52,0,43,0,50,0,43,0,50,0,41,0,48,0,41,0,48,0,40,0,47,0,45,0,52,0]},
  boss: {bpm:140, lead:'square',   lv:.06, mel:[69,0,72,69,76,0,75,0,74,0,72,71,69,0,0,0,69,0,72,69,77,0,76,0,74,0,72,0,71,0,68,0], bass:[33,33,0,33,40,0,33,0,31,31,0,31,38,0,31,0,29,29,0,29,36,0,29,0,28,28,0,28,35,0,32,0], kick:true}
};

/* ================== Утилиты ================== */
const $ = id => document.getElementById(id);
const rand = (a,b) => a + Math.random()*(b-a);
const INK = '#33241C';
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function wpick(mix){let s=0;for(const k in mix)s+=mix[k];let r=Math.random()*s;for(const k in mix){r-=mix[k];if(r<=0)return k}return Object.keys(mix)[0]}
function E(c,x,y,rx,ry,fill,lw,rot){c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),rot||0,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill()}if(lw){c.lineWidth=lw;c.strokeStyle=INK;c.stroke()}}
function T(c,a,b,d,fill,lw){c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(lw){c.lineWidth=lw;c.lineJoin='round';c.strokeStyle=INK;c.stroke()}}
function rr(c,x,y,w,h,r,fill,lw){r=Math.max(0,Math.min(r,w/2,h/2));c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(lw){c.lineWidth=lw;c.strokeStyle=INK;c.stroke()}}
function heart(c,x,y,s,fill){c.beginPath();c.moveTo(x,y+s*.35);c.bezierCurveTo(x-s*.9,y-s*.25,x-s*.35,y-s*.85,x,y-s*.35);c.bezierCurveTo(x+s*.35,y-s*.85,x+s*.9,y-s*.25,x,y+s*.35);c.closePath();c.fillStyle=fill;c.fill()}

/* ================== Звук ================== */
const MUSIC_VOL=.6, MUSIC_EXT=['mp3','ogg','m4a','wav'], ENDLESS_TRACK_SEC=60;
const S = {
  ctx:null,on:true,mvol:1,timer:null,track:'day',step:0,next:0,last:{},
  init(){
    if(this.ctx){ if(this.ctx.state==='suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext||window.webkitAudioContext; if(!AC) return;
    try{ if(navigator.audioSession) navigator.audioSession.type='ambient'; }catch(e){}
    try{ this.ctx = new AC(); }catch(e){ return; }
    const c=this.ctx;
    this.master=c.createGain(); this.master.gain.value=this.on?1:0; this.master.connect(c.destination);
    this.sfx=c.createGain(); this.sfx.gain.value=.6; this.sfx.connect(this.master);
    this.mg=c.createGain(); this.mg.gain.value=.5*this.mvol; this.mg.connect(this.master);
    const len=c.sampleRate; this.nb=c.createBuffer(1,len,c.sampleRate); const d=this.nb.getChannelData(0); for(let i=0;i<len;i++) d[i]=Math.random()*2-1;
    if(this.wantMusic) this.startMusic(this.track);
  },
  setOn(v){ this.on=v; if(this.master) this.master.gain.setTargetAtTime(v?1:0,this.ctx.currentTime,.03); this.applyMusicVol(); },
  setMusicVol(v){ this.mvol=v; if(this.mg) this.mg.gain.setTargetAtTime(.5*v,this.ctx.currentTime,.03); this.applyMusicVol(); },
  applyMusicVol(){ const a=this.audio; if(!a) return; const v=this.on?MUSIC_VOL*this.mvol:0; a.volume=v; a.muted=v===0; },
  thr(name,gap){ const n=performance.now(); if(this.last[name] && n-this.last[name]<gap) return false; this.last[name]=n; return true; },
  tone(f,dur,type,vol,f2,when,dest){ const c=this.ctx; if(!c) return; const t=when||c.currentTime; const o=c.createOscillator(),g=c.createGain(); o.type=type||'sine'; o.frequency.setValueAtTime(f,t); if(f2) o.frequency.exponentialRampToValueAtTime(f2,t+dur); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(vol||.2,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+dur); o.connect(g); g.connect(dest||this.sfx); o.start(t); o.stop(t+dur+.03); },
  noise(dur,vol,freq,ft,when,dest,q){ const c=this.ctx; if(!c) return; const t=when||c.currentTime; const s=c.createBufferSource(); s.buffer=this.nb; const f=c.createBiquadFilter(); f.type=ft||'lowpass'; f.frequency.value=freq||1000; if(q) f.Q.value=q; const g=c.createGain(); g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.0001,t+dur); s.connect(f); f.connect(g); g.connect(dest||this.sfx); s.start(t,Math.random()*.5); s.stop(t+dur+.03); },
  bark(p){ const c=this.ctx; if(!c||!this.thr('bark',130)) return; p=p||1; const now=c.currentTime, f=(470+Math.random()*110)*p;
    const o=c.createOscillator(),g=c.createGain(),bp=c.createBiquadFilter(); o.type='sawtooth';
    o.frequency.setValueAtTime(f*.8,now); o.frequency.linearRampToValueAtTime(f*1.25,now+.03); o.frequency.exponentialRampToValueAtTime(f*.55,now+.13);
    bp.type='bandpass'; bp.frequency.value=1100*p; bp.Q.value=1.3; g.gain.setValueAtTime(.0001,now); g.gain.exponentialRampToValueAtTime(.28,now+.012); g.gain.exponentialRampToValueAtTime(.0001,now+.15);
    o.connect(bp); bp.connect(g); g.connect(this.sfx); o.start(now); o.stop(now+.18); this.noise(.06,.08,1800*p,'bandpass',now,null,1); },
  pop(){ this.tone(660,.14,'sine',.25,1320); this.tone(990,.12,'triangle',.08,1600); },
  place(){ this.tone(200,.14,'triangle',.3,90); this.noise(.08,.15,700); },
  hit(){ if(this.thr('hit',60)) this.noise(.05,.12,2600,'highpass'); },
  splat(){ if(!this.thr('splat',80)) return; this.noise(.25,.25,600); this.tone(170,.25,'sawtooth',.08,60); },
  groan(){ if(!this.thr('groan',2500)) return; const c=this.ctx; if(!c) return; this.tone(rand(95,125),.9,'sawtooth',.05,rand(70,85)); },
  chomp(){ if(this.thr('chomp',330)) this.noise(.06,.12,900,'bandpass',null,null,2); },
  boom(){ this.noise(.7,.55,600); this.tone(110,.6,'sine',.5,35); },
  err(){ this.tone(220,.12,'square',.06,160); },
  dig(){ this.noise(.15,.2,1200,'bandpass'); },
  yelp(){ this.tone(900,.18,'triangle',.15,1500); },
  mower(){ this.tone(180,1,'sawtooth',.06,300); this.noise(1,.08,900); },
  horn(){ this.tone(196,.5,'sawtooth',.08,180); this.tone(147,.6,'sawtooth',.07,140,this.ctx?this.ctx.currentTime+.45:0); },
  roar(){ this.noise(1,.35,400); this.tone(80,1,'sawtooth',.18,45); },
  jingle(win){ const c=this.ctx; if(!c) return; const n=c.currentTime; const seq=win?[72,76,79,84,79,84]:[67,63,60,55]; seq.forEach((m,i)=>this.tone(440*Math.pow(2,(m-69)/12),.28,'triangle',.22,null,n+i*.14)); },
  /* Музыка из файлов music/1.mp3, 2.mp3, 3.mp3… (номера подряд). Меню — своя синтезаторная мелодия. На каждую игру — случайный трек,
     в бесконечном режиме трек меняется каждую минуту. Нет файлов — играет синтезатор */
  list:null,listCbs:null,audio:null,elapsed:0,lastT:0,gen:0,
  startMusic(track,fresh){ this.track=track; this.wantMusic=true; if(!this.ctx) return; this.stopMusic(true); const g=this.gen;
    this.loadList(l=>{ if(g!==this.gen) return;
      if(l.length&&track!=='menu'){ if(fresh||!this.audio) this.pickTrack(); else { this.applyMusicVol(); this.audio.play().catch(()=>{}); } }
      else { this.step=0; this.next=this.ctx.currentTime+.1; this.timer=setInterval(()=>this.sched(),40); } }); },
  stopMusic(keep){ this.gen++; clearInterval(this.timer); this.timer=null; if(this.audio) this.audio.pause(); if(!keep) this.wantMusic=false; },
  pickTrack(){ const l=this.list; let a; do a=l[Math.floor(Math.random()*l.length)]; while(l.length>1&&a===this.audio);
    if(this.audio) this.audio.pause(); this.audio=a; a.currentTime=0; this.lastT=0; this.elapsed=0; this.applyMusicVol(); a.play().catch(()=>{}); },
  loadList(cb){ if(this.list) return cb(this.list); if(this.listCbs) return this.listCbs.push(cb); this.listCbs=[cb]; const list=[];
    const probe=(n,e)=>{ if(e>=MUSIC_EXT.length){ this.list=list; const cbs=this.listCbs; this.listCbs=null; cbs.forEach(f=>f(list)); return; }
      const a=new Audio(); let done=false; a.preload='auto'; a.loop=true;
      const ok=()=>{ if(done) return; done=true; a.addEventListener('timeupdate',()=>this.tick(a)); list.push(a); probe(n+1,0); },
            bad=()=>{ if(done) return; done=true; probe(n,e+1); };
      a.addEventListener('canplay',ok); a.addEventListener('loadeddata',ok); a.addEventListener('error',bad); a.src='music/'+n+'.'+MUSIC_EXT[e]; a.load(); };
    probe(1,0); },
  tick(a){ if(a!==this.audio) return; let d=a.currentTime-this.lastT; if(d<0) d+=a.duration||0; this.lastT=a.currentTime;
    if(d>0&&d<2) this.elapsed+=d;
    if(this.elapsed>=ENDLESS_TRACK_SEC && G&&G.endless&&state==='play'&&!paused) this.pickTrack(); },
  sched(){ const c=this.ctx, Tk=TRACKS[this.track]; const spb=60/Tk.bpm/2; const mf=m=>440*Math.pow(2,(m-69)/12);
    while(this.next<c.currentTime+.18){ const i=this.step%Tk.mel.length, m=Tk.mel[i], b=Tk.bass[i];
      if(m) this.tone(mf(m),spb*1.7,Tk.lead,Tk.lv,null,this.next,this.mg);
      if(b) this.tone(mf(b),spb*1.9,'triangle',.2,null,this.next,this.mg);
      if(i%2===1) this.noise(.03,.035,7000,'highpass',this.next,this.mg);
      if(Tk.kick && i%(Tk.kick===true?4:Tk.kick)===0) this.tone(130,.14,'sine',.3,45,this.next,this.mg);
      if(Tk.snare && i%8===4) this.noise(.12,.1,2000,'bandpass',this.next,this.mg,.8);
      if(Tk.chords && i%8===0) Tk.chords[(i/8)%Tk.chords.length].forEach(n=>this.tone(mf(n),spb*7.5,'sine',.04,null,this.next,this.mg));
      this.next+=spb; this.step++; } }
};

/* ================== Рисование собак ================== */
const BREED = {
  corgi:{fur:'#E98B35',light:'#FFF3E2',inner:'#F7A9A0'},
  husky:{fur:'#646C7A',light:'#F3F5F8',inner:'#F3F5F8',iris:'#4DB2FF'},
  bulldog:{fur:'#D9A064',light:'#FCEFE0',dark:'#9A6135'},
  samoyed:{fur:'#FFFFFF',light:'#FFFFFF',inner:'#F7B2B8',fluff:'#E7ECF3'},
  chihuahua:{fur:'#E4B077',light:'#FFF0DD',inner:'#F6A8A2'},
  dalmatian:{fur:'#FFFFFF',light:'#FFFFFF',spot:'#2B2B2E'},
  pug:{fur:'#E9D2A6',light:'#F4E3C3',mask:'#3A3230'},
  dachshund:{fur:'#A4552A',light:'#D08850',dark:'#6E3417'},
  retriever:{fur:'#E8B45E',light:'#F6D9A0',dark:'#C98E3A'},
  bernard:{fur:'#FFFFFF',light:'#FFFFFF',patch:'#A65A2A'}
};
function face(c,hy,hr,f){
  f=f||{}; const ex=hr*(f.ex||.4), ey=hy-hr*.02, er=hr*(f.er||.13);
  c.lineCap='round';
  for(const s of [-1,1]){
    if(f.closed){ c.lineWidth=hr*.08; c.strokeStyle=INK; c.beginPath(); c.moveTo(s*ex-er,ey+er*.2); c.quadraticCurveTo(s*ex,ey+er*.9,s*ex+er,ey+er*.2); c.stroke(); }
    else if(f.happy){ c.lineWidth=hr*.08; c.strokeStyle=INK; c.beginPath(); c.arc(s*ex,ey+er*.5,er,Math.PI*1.15,Math.PI*1.85); c.stroke(); }
    else {
      if(f.iris){ E(c,s*ex,ey,er,er,'#fff'); E(c,s*ex,ey,er*.82,er*.82,f.iris); E(c,s*ex,ey,er*.42,er*.42,INK); }
      else E(c,s*ex,ey,er,er,INK);
      E(c,s*ex-er*.33,ey-er*.38,er*.36,er*.36,'#fff');
      if(f.big) E(c,s*ex+er*.35,ey+er*.35,er*.16,er*.16,'#fff');
    }
  }
  const ny=hy+hr*(f.ny||.27);
  E(c,0,ny,hr*(f.nose||.14),hr*(f.nose||.14)*.72,INK); E(c,-hr*.04,ny-hr*.03,hr*.045,hr*.025,'rgba(255,255,255,.7)');
  c.lineWidth=hr*.065; c.strokeStyle=INK;
  if(f.open){ E(c,0,ny+hr*.24,hr*.15,hr*.13,'#7A2B2B'); E(c,0,ny+hr*.3,hr*.09,hr*.06,'#F07A8A'); }
  else if(f.grump){ c.beginPath(); c.moveTo(-hr*.32,ny+hr*.26); c.quadraticCurveTo(0,ny+hr*.1,hr*.32,ny+hr*.26); c.stroke();
    T(c,[-hr*.24,ny+hr*.22],[-hr*.18,ny+hr*.05],[-hr*.12,ny+hr*.2],'#fff',hr*.03); T(c,[hr*.24,ny+hr*.22],[hr*.18,ny+hr*.05],[hr*.12,ny+hr*.2],'#fff',hr*.03); }
  else { c.beginPath(); c.moveTo(-hr*.18,ny+hr*.15); c.quadraticCurveTo(-hr*.08,ny+hr*.27,0,ny+hr*.13); c.quadraticCurveTo(hr*.08,ny+hr*.27,hr*.18,ny+hr*.15); c.stroke();
    if(f.tongue){ E(c,hr*.02,ny+hr*.3,hr*.08,hr*.1,'#F07A8A',hr*.03); } }
  if(!f.noblush){ E(c,-hr*.62,hy+hr*.28,hr*.14,hr*.08,'rgba(255,110,130,.42)'); E(c,hr*.62,hy+hr*.28,hr*.14,hr*.08,'rgba(255,110,130,.42)'); }
}
function fluff(c,x,y,R,r,n,fill,lw){
  const pts=[]; for(let i=0;i<n;i++){ const a=i/n*Math.PI*2; pts.push([x+Math.cos(a)*R,y+Math.sin(a)*R*.92]); }
  pts.forEach(p=>E(c,p[0],p[1],r,r,null,lw)); pts.forEach(p=>E(c,p[0],p[1],r,r,fill)); E(c,x,y,R,R*.92,fill);
}
function drawDog(c,type,x,y,s,o){
  o=o||{}; const t=o.t||0, B=BREED[type], ph=o.ph||0; const lw=Math.max(1,s*.032);
  const k = type==='chihuahua'? s*.84 : s;
  c.save();
  let sx=0; if(o.hurt>0) sx=Math.sin(t*90)*s*.02; if(type==='chihuahua'&&o.armed) sx+=Math.sin(t*70)*s*.015;
  c.translate(x+sx, y+(type==='chihuahua'?s*.06:0));
  if(o.alpha!=null) c.globalAlpha=o.alpha;
  if(o.glow>0){ const g=c.createRadialGradient(0,0,0,0,0,k*.55); g.addColorStop(0,'rgba(255,230,140,'+(.55*o.glow)+')'); g.addColorStop(1,'rgba(255,230,140,0)'); c.fillStyle=g; c.fillRect(-k*.6,-k*.6,k*1.2,k*1.2); }
  E(c,0,k*.37,k*.3,k*.075,'rgba(0,0,0,.22)');
  // хвост
  const wag=Math.sin(t*9+ph)*.5;
  c.save(); c.translate(k*.18,k*.15); c.rotate(-.9+wag);
  if(type==='samoyed') E(c,0,-k*.1,k*.09,k*.14,B.fur,lw);
  else if(type==='bulldog') E(c,0,-k*.03,k*.04,k*.05,B.fur,lw);
  else if(type==='corgi') E(c,0,-k*.06,k*.06,k*.08,B.fur,lw);
  else if(type==='husky'){ E(c,0,-k*.1,k*.06,k*.13,B.fur,lw); E(c,0,-k*.2,k*.035,k*.04,B.light); }
  else if(type==='pug'){ c.lineCap='round'; c.lineWidth=k*.06; c.strokeStyle=INK; c.beginPath(); c.arc(0,-k*.06,k*.05,0,Math.PI*1.7); c.stroke(); c.lineWidth=k*.035; c.strokeStyle=B.fur; c.stroke(); }
  else E(c,0,-k*.1,k*.035,k*.12,B.fur,lw);
  c.restore();
  // тело
  const bw = type==='bulldog'?k*.3 : type==='dachshund'?k*.34 : type==='bernard'?k*.29 : k*.24;
  if(type==='samoyed') fluff(c,0,k*.2,k*.2,k*.08,9,B.fur,lw);
  else E(c,0,k*.2,bw,k*.18,B.fur,lw);
  E(c,0,k*.23,bw*.52,k*.12,type==='samoyed'?'#F6F8FB':B.light);
  if(type==='dalmatian'){ E(c,-k*.13,k*.15,k*.035,k*.03,B.spot); E(c,k*.15,k*.24,k*.03,k*.025,B.spot); E(c,k*.06,k*.1,k*.022,k*.02,B.spot); }
  if(type==='husky'){ E(c,0,k*.25,bw*.5,k*.11,B.light); }
  if(type==='bernard'){ E(c,-k*.17,k*.13,k*.08,k*.06,B.patch); E(c,k*.19,k*.18,k*.07,k*.06,B.patch); }
  E(c,-k*.11,k*.35,k*.075,k*.05,B.light==='#FFFFFF'?'#F2F4F8':B.light,lw); E(c,k*.11,k*.35,k*.075,k*.05,B.light==='#FFFFFF'?'#F2F4F8':B.light,lw);
  // голова
  const bob=Math.sin(t*3.2+ph)*k*.012 - (o.fire>0? o.fire*k*.03 : 0);
  c.translate(0,bob);
  const hy=-k*.1, hr=k*.27;
  const open = o.fire>0;
  if(type==='corgi'){
    T(c,[-hr*.82,hy-hr*.25],[-hr*.92,hy-hr*1.5],[-hr*.12,hy-hr*.8],B.fur,lw); T(c,[hr*.82,hy-hr*.25],[hr*.92,hy-hr*1.5],[hr*.12,hy-hr*.8],B.fur,lw);
    T(c,[-hr*.68,hy-hr*.42],[-hr*.82,hy-hr*1.25],[-hr*.32,hy-hr*.8],B.inner); T(c,[hr*.68,hy-hr*.42],[hr*.82,hy-hr*1.25],[hr*.32,hy-hr*.8],B.inner);
    E(c,0,hy,hr,hr*.9,B.fur,lw); E(c,0,hy+hr*.4,hr*.62,hr*.44,B.light); E(c,0,hy-hr*.25,hr*.11,hr*.42,B.light);
    face(c,hy,hr,{open,tongue:!open});
  } else if(type==='husky'){
    T(c,[-hr*.85,hy-hr*.2],[-hr*.75,hy-hr*1.55],[-hr*.1,hy-hr*.8],B.fur,lw); T(c,[hr*.85,hy-hr*.2],[hr*.75,hy-hr*1.55],[hr*.1,hy-hr*.8],B.fur,lw);
    T(c,[-hr*.68,hy-hr*.4],[-hr*.66,hy-hr*1.25],[-hr*.3,hy-hr*.8],B.inner); T(c,[hr*.68,hy-hr*.4],[hr*.66,hy-hr*1.25],[hr*.3,hy-hr*.8],B.inner);
    E(c,0,hy,hr,hr*.92,B.fur,lw); E(c,0,hy+hr*.33,hr*.8,hr*.56,B.light); E(c,0,hy-hr*.05,hr*.16,hr*.4,B.light);
    E(c,-hr*.4,hy-hr*.3,hr*.11,hr*.07,B.light); E(c,hr*.4,hy-hr*.3,hr*.11,hr*.07,B.light);
    face(c,hy,hr,{iris:B.iris,er:.15,open});
  } else if(type==='bulldog'){
    E(c,-hr*.95,hy-hr*.55,hr*.3,hr*.2,B.dark,lw,-.4); E(c,hr*.95,hy-hr*.55,hr*.3,hr*.2,B.dark,lw,.4);
    E(c,0,hy+hr*.08,hr*1.12,hr*.88,B.fur,lw); E(c,0,hy+hr*.42,hr*.74,hr*.42,B.light,lw*.6);
    c.lineWidth=hr*.05; c.strokeStyle='rgba(51,36,28,.5)'; c.beginPath(); c.moveTo(-hr*.3,hy-hr*.42); c.quadraticCurveTo(0,hy-hr*.55,hr*.3,hy-hr*.42); c.moveTo(-hr*.2,hy-hr*.3); c.quadraticCurveTo(0,hy-hr*.4,hr*.2,hy-hr*.3); c.stroke();
    face(c,hy,hr,{ex:.46,nose:.19,ny:.22,grump:!open,open});
    rr(c,-hr*.85,hy+hr*.86,hr*1.7,hr*.24,hr*.1,'#D2483C',lw);
    for(let i=-2;i<=2;i++) T(c,[i*hr*.32-hr*.07,hy+hr*.88],[i*hr*.32,hy+hr*.72],[i*hr*.32+hr*.07,hy+hr*.88],'#C9CED6',lw*.6);
    if(o.hpR!=null && o.hpR<.66){ c.save(); c.translate(hr*.5,hy-hr*.55); c.rotate(.6); rr(c,-hr*.3,-hr*.09,hr*.6,hr*.18,hr*.06,'#F4C9A0',lw*.6); rr(c,-hr*.08,-hr*.09,hr*.16,hr*.18,0,'#E8B387'); c.restore(); }
    if(o.hpR!=null && o.hpR<.33){ c.save(); c.translate(-hr*.55,hy-hr*.1); c.rotate(-.5); rr(c,-hr*.28,-hr*.08,hr*.56,hr*.16,hr*.06,'#F4C9A0',lw*.6); c.restore(); E(c,hr*1.05,hy-hr*.1,hr*.07,hr*.11,'#7FC8FF'); }
  } else if(type==='samoyed'){
    T(c,[-hr*.85,hy-hr*.3],[-hr*.7,hy-hr*1.45],[-hr*.15,hy-hr*.85],B.fur,lw); T(c,[hr*.85,hy-hr*.3],[hr*.7,hy-hr*1.45],[hr*.15,hy-hr*.85],B.fur,lw);
    T(c,[-hr*.66,hy-hr*.5],[-hr*.62,hy-hr*1.2],[-hr*.33,hy-hr*.88],B.inner); T(c,[hr*.66,hy-hr*.5],[hr*.62,hy-hr*1.2],[hr*.33,hy-hr*.88],B.inner);
    fluff(c,0,hy+hr*.05,hr*.9,hr*.27,12,B.fur,lw);
    E(c,-hr*.55,hy+hr*.35,hr*.2,hr*.15,B.fluff); E(c,hr*.55,hy+hr*.35,hr*.2,hr*.15,B.fluff);
    face(c,hy,hr,{happy:!open,open:true});
  } else if(type==='chihuahua'){
    T(c,[-hr*.45,hy-hr*.55],[-hr*1.85,hy-hr*1.05],[-hr*.85,hy+hr*.2],B.fur,lw); T(c,[hr*.45,hy-hr*.55],[hr*1.85,hy-hr*1.05],[hr*.85,hy+hr*.2],B.fur,lw);
    T(c,[-hr*.6,hy-hr*.45],[-hr*1.55,hy-hr*.9],[-hr*.85,hy+hr*.02],B.inner); T(c,[hr*.6,hy-hr*.45],[hr*1.55,hy-hr*.9],[hr*.85,hy+hr*.02],B.inner);
    E(c,0,hy,hr*.95,hr*.86,B.fur,lw); E(c,0,hy+hr*.42,hr*.45,hr*.32,B.light);
    face(c,hy,hr,{er:.22,big:true,closed:!o.armed&&!o.icon,ny:.3,open});
    if(o.armed){ const on=Math.sin(t*12)>0; E(c,0,hy+hr*.95,hr*.13,hr*.13,on?'#FF4B4B':'#8C2525',lw*.6); }
    else if(!o.icon){ c.fillStyle='rgba(255,255,255,.9)'; c.font='900 '+Math.round(hr*.7)+'px Nunito, sans-serif'; c.textAlign='center'; const zz=(t*.8)%1; c.globalAlpha*=1-zz; c.fillText('z',hr*.9+zz*hr*.4,hy-hr*.9-zz*hr*.8); }
  } else if(type==='dalmatian'){
    E(c,0,hy,hr,hr*.9,B.fur,lw);
    [[-.45,-.45,.15],[.38,-.55,.1],[.58,.08,.09],[-.15,-.75,.07],[-.62,.12,.07]].forEach(p=>E(c,hr*p[0],hy+hr*p[1],hr*p[2],hr*p[2]*.85,B.spot));
    E(c,-hr*.98,hy+hr*.1,hr*.24,hr*.46,B.spot,lw,.25); E(c,hr*.98,hy+hr*.1,hr*.24,hr*.46,B.spot,lw,-.25);
    face(c,hy,hr,{open,tongue:!open});
    rr(c,-hr*.6,hy+hr*.86,hr*1.2,hr*.18,hr*.08,'#D2483C',lw*.8); E(c,0,hy+hr*1.08,hr*.1,hr*.1,'#F0B945',lw*.6);
  } else if(type==='pug'){
    E(c,-hr*.88,hy-hr*.55,hr*.26,hr*.2,B.mask,lw,-.6); E(c,hr*.88,hy-hr*.55,hr*.26,hr*.2,B.mask,lw,.6);
    E(c,0,hy+hr*.05,hr*1.05,hr*.9,B.fur,lw);
    c.lineWidth=hr*.05; c.strokeStyle='rgba(51,36,28,.45)'; c.beginPath(); c.moveTo(-hr*.25,hy-hr*.5); c.quadraticCurveTo(0,hy-hr*.62,hr*.25,hy-hr*.5); c.moveTo(-hr*.15,hy-hr*.38); c.quadraticCurveTo(0,hy-hr*.46,hr*.15,hy-hr*.38); c.stroke();
    E(c,0,hy+hr*.4,hr*.56,hr*.42,B.mask);
    face(c,hy,hr,{er:.21,big:true,ex:.46});
    E(c,0,hy+hr*.66,hr*.1,hr*.09,'#F07A8A');
    if(open){ E(c,0,hy-hr*1.25,hr*.3,hr*.2,'rgba(215,240,195,.85)'); E(c,hr*.3,hy-hr*1.4,hr*.18,hr*.13,'rgba(215,240,195,.75)'); }
  } else if(type==='dachshund'){
    E(c,0,hy,hr*.9,hr*.85,B.fur,lw);
    E(c,0,hy+hr*.45,hr*.42,hr*.38,B.light,lw*.7);
    E(c,-hr*.88,hy+hr*.2,hr*.26,hr*.55,B.dark,lw,.15); E(c,hr*.88,hy+hr*.2,hr*.26,hr*.55,B.dark,lw,-.15);
    const chew=o.chew>0;
    face(c,hy-hr*.05,hr,{closed:chew,ny:.45,open:open&&!chew});
    if(chew){ E(c,-hr*.42,hy+hr*.5,hr*.2,hr*.15,'rgba(255,110,130,.55)'); E(c,hr*.42,hy+hr*.5,hr*.2,hr*.15,'rgba(255,110,130,.55)'); }
  } else if(type==='retriever'){
    E(c,0,hy,hr,hr*.9,B.fur,lw);
    E(c,0,hy+hr*.38,hr*.56,hr*.4,B.light);
    E(c,-hr*.95,hy+hr*.12,hr*.27,hr*.5,B.dark,lw,.3); E(c,hr*.95,hy+hr*.12,hr*.27,hr*.5,B.dark,lw,-.3);
    face(c,hy,hr,{open,tongue:!open});
    if(!open){ E(c,k*.27,k*.27,k*.13,k*.05,'#E6533C',lw*.8); E(c,k*.27,k*.26,k*.07,k*.025,'#F07A5A'); }
  } else if(type==='bernard'){
    E(c,-hr*.98,hy+hr*.05,hr*.27,hr*.45,B.patch,lw,.25); E(c,hr*.98,hy+hr*.05,hr*.27,hr*.45,B.patch,lw,-.25);
    E(c,0,hy+hr*.05,hr*1.08,hr*.92,B.fur,lw);
    E(c,-hr*.45,hy-hr*.2,hr*.38,hr*.36,B.patch); E(c,hr*.45,hy-hr*.2,hr*.38,hr*.36,B.patch);
    E(c,0,hy-hr*.3,hr*.12,hr*.38,'#fff');
    face(c,hy+hr*.02,hr,{er:.12,open});
    rr(c,-hr*.32,hy+hr*.92,hr*.64,hr*.36,hr*.12,'#8B5A2B',lw*.8); c.fillStyle='#F0B945'; c.fillRect(-hr*.2,hy+hr*.92,hr*.06,hr*.36); c.fillRect(hr*.14,hy+hr*.92,hr*.06,hr*.36);
  }
  c.restore();
}

/* ================== Рисование зомби ================== */
const ZC = {
  basic:{shirt:'#7B5B3F',pants:'#45506B'}, helmet:{shirt:'#E07A2E',pants:'#3F4A5E'}, runner:{shirt:'#C93A3A',pants:'#C93A3A'},
  bucket:{shirt:'#6F7D5A',pants:'#4A4A58'}, fatty:{shirt:'#8DB0C8',pants:'#5A4A3A'}, boss:{shirt:'#5E2B74',pants:'#2E2440'},
  skater:{shirt:'#3E8ED0',pants:'#2E3B55'}, door:{shirt:'#7B5B3F',pants:'#45506B'}, giant:{shirt:'#6B4E3A',pants:'#3A3530'}
};
function drawZombie(c,z,x,y,s,t){
  const boss=z.type==='boss', giant=z.type==='giant', fat=z.type==='fatty'||giant;
  const k=s*(boss?2.2:giant?1.45:fat?1.1:1); const C=ZC[z.type]; const lw=Math.max(1,k*.03);
  const sk = z.flash>0?'#EAF7DA': z.slowT>0?'#A3CDE8':'#9DBE70';
  const ph=z.ph, walk=z.eating?0:Math.sin(t*5.5*(z.type==='runner'?1.8:1)+ph);
  const chomp=z.eating?Math.sin(t*14+ph):0;
  c.save(); c.translate(x,y);
  E(c,0,k*.4,k*(fat?.3:.24),k*.07,'rgba(0,0,0,.25)');
  if(boss){ c.beginPath(); c.moveTo(-k*.2,-k*.1); c.lineTo(k*.2,-k*.1); c.lineTo(k*.34,k*.38); c.lineTo(-k*.34,k*.38); c.closePath(); c.fillStyle='#3E1650'; c.fill(); c.lineWidth=lw; c.strokeStyle=INK; c.stroke();
    c.fillStyle='#F0B945'; c.fillRect(-k*.33,k*.33,k*.66,k*.04); }
  const tw = fat? k*.27 : k*.19;
  if(z.type==='skater'){ const sw=Math.sin(t*3+ph)*k*.02; rr(c,-k*.27+sw,k*.38,k*.54,k*.05,k*.025,'#E6533C',lw); E(c,-k*.17+sw,k*.44,k*.03,k*.03,'#F0F0F0',lw*.6); E(c,k*.17+sw,k*.44,k*.03,k*.03,'#F0F0F0',lw*.6); }
  rr(c,-tw*.8,k*.17+walk*k*.03,tw*.65,k*.2,k*.04,C.pants,lw); rr(c,tw*.15,k*.17-walk*k*.03,tw*.65,k*.2,k*.04,C.pants,lw);
  E(c,-tw*.48,k*.37+walk*k*.03,tw*.42,k*.045,'#2E2A2A'); E(c,tw*.48,k*.37-walk*k*.03,tw*.42,k*.045,'#2E2A2A');
  rr(c,-tw,-k*.06,tw*2,k*.3,k*.07,C.shirt,lw);
  if(z.type==='basic'){ T(c,[-k*.03,-k*.05],[k*.03,-k*.05],[0,k*.14],'#C0392B',lw*.6); c.fillStyle='rgba(0,0,0,.18)'; c.fillRect(tw*.3,k*.12,tw*.4,k*.06); }
  if(z.type==='helmet'){ c.fillStyle='#F6E45A'; c.fillRect(-tw,k*.04,tw*2,k*.035); c.fillRect(-tw,k*.13,tw*2,k*.035); }
  if(z.type==='runner'){ c.fillStyle='#fff'; c.fillRect(-tw*.72,-k*.05,k*.025,k*.28); c.fillRect(tw*.6,-k*.05,k*.025,k*.28); }
  if(z.type==='bucket'){ E(c,tw*.4,k*.1,k*.04,k*.05,'rgba(0,0,0,.25)'); }
  if(fat){ E(c,0,k*.11,tw*.62,k*.12,sk,lw*.7); E(c,0,k*.14,k*.015,k*.02,INK); }
  if(boss){ c.fillStyle='#F0B945'; c.fillRect(-k*.025,-k*.06,k*.05,k*.3); E(c,0,k*.06,k*.05,k*.05,'#F0B945',lw*.6); E(c,0,k*.06,k*.025,k*.025,'#D2483C'); }
  const ay=chomp*k*.04;
  for(const sd of [-1,1]){ c.save(); c.translate(sd*tw*.95,-k*.02); c.rotate(sd*-.28+sd*walk*.08); rr(c,-k*.05,0,k*.1,k*.2+ay*sd,k*.04,C.shirt,lw); E(c,0,k*.22+ay*sd,k*.06,k*.055,sk,lw); c.restore(); }
  if(giant){ c.save(); c.translate(tw*.95,k*.05); c.rotate(-.35+(z.eating?chomp*.5:Math.sin(t*2+ph)*.1)); rr(c,-k*.035,-k*.55,k*.07,k*.62,k*.03,'#8A8F96',lw); rr(c,-k*.06,-k*.58,k*.12,k*.06,k*.02,'#6B7078',lw*.7); c.restore(); }
  if(z.type==='door'&&z.hp>z.base){ rr(c,-k*.25,-k*.12,k*.5,k*.5,k*.03,'#8B5A2B',lw); rr(c,-k*.18,-k*.06,k*.36,k*.14,k*.02,'#A8D8F0',lw*.6); c.strokeStyle='rgba(51,36,28,.45)'; c.lineWidth=lw*.6; c.strokeRect(-k*.18,k*.13,k*.36,k*.18); E(c,k*.17,k*.17,k*.025,k*.025,'#F0B945',lw*.5);
    if(z.hp<z.base+(z.maxHp-z.base)*.45){ c.strokeStyle=INK; c.lineWidth=lw*.8; c.beginPath(); c.moveTo(-k*.2,k*.0); c.lineTo(-k*.08,k*.12); c.lineTo(-k*.14,k*.24); c.stroke(); } }
  const hx=Math.sin(t*2+ph)*k*.015, hy=-k*.2+chomp*k*.01;
  E(c,hx,hy,k*.2,k*.19,sk,lw);
  c.strokeStyle='rgba(51,36,28,.6)'; c.lineWidth=lw*.6; c.beginPath(); c.moveTo(hx+k*.1,hy+k*.06); c.lineTo(hx+k*.15,hy+k*.1); for(let i=0;i<3;i++){ c.moveTo(hx+k*.105+i*k*.018,hy+k*.06+i*k*.015); c.lineTo(hx+k*.13+i*k*.018,hy+k*.045+i*k*.015); } c.stroke();
  const eyeC = boss? '#FF4A3A' : '#FFF8E0';
  E(c,hx-k*.075,hy-k*.02,k*.06,k*.065,eyeC,lw*.7); E(c,hx-k*.07,hy-k*.01,k*.018,k*.018,INK);
  E(c,hx+k*.08,hy-k*.01,k*.042,k*.042,eyeC,lw*.7); E(c,hx+k*.085,hy,k*.014,k*.014,INK);
  const mo = z.eating? .5+.5*chomp : .25;
  rr(c,hx-k*.08,hy+k*.07,k*.16,k*.03+k*.05*mo,k*.015,'#3A1E1E');
  c.fillStyle='#FFF8E0'; c.fillRect(hx-k*.05,hy+k*.07,k*.03,k*.025); c.fillRect(hx+k*.02,hy+k*.07,k*.03,k*.025);
  const armor = z.hp>z.base;
  if(z.type==='skater'){ c.beginPath(); c.arc(hx,hy-k*.06,k*.2,Math.PI,0); c.closePath(); c.fillStyle='#E6533C'; c.fill(); c.lineWidth=lw; c.strokeStyle=INK; c.stroke(); rr(c,hx+k*.08,hy-k*.09,k*.2,k*.04,k*.02,'#C23E2A',lw*.7); }
  if(z.type==='basic'||fat||z.type==='door'||(z.type==='helmet'&&!armor)||(z.type==='bucket'&&!armor)){ c.strokeStyle='#4A3B2E'; c.lineWidth=lw; c.beginPath(); c.moveTo(hx-k*.04,hy-k*.18); c.lineTo(hx-k*.07,hy-k*.26); c.moveTo(hx,hy-k*.19); c.lineTo(hx+k*.01,hy-k*.28); c.moveTo(hx+k*.05,hy-k*.18); c.lineTo(hx+k*.09,hy-k*.25); c.stroke(); }
  if(z.type==='helmet'&&armor){ c.beginPath(); c.arc(hx,hy-k*.04,k*.22,Math.PI,0); c.closePath(); c.fillStyle='#F2C230'; c.fill(); c.lineWidth=lw; c.strokeStyle=INK; c.stroke(); rr(c,hx-k*.27,hy-k*.06,k*.54,k*.05,k*.02,'#E0AE1E',lw); c.fillStyle='rgba(255,255,255,.45)'; c.fillRect(hx-k*.1,hy-k*.22,k*.05,k*.1);
    if(z.hp<z.base+(z.maxHp-z.base)*.45){ c.strokeStyle=INK; c.lineWidth=lw*.7; c.beginPath(); c.moveTo(hx+k*.05,hy-k*.25); c.lineTo(hx+k*.09,hy-k*.16); c.lineTo(hx+k*.05,hy-k*.1); c.stroke(); } }
  if(z.type==='bucket'&&armor){ c.beginPath(); c.moveTo(hx-k*.22,hy+k*.02); c.lineTo(hx+k*.22,hy+k*.02); c.lineTo(hx+k*.17,hy-k*.29); c.lineTo(hx-k*.17,hy-k*.29); c.closePath(); c.fillStyle='#A3ACB5'; c.fill(); c.lineWidth=lw; c.strokeStyle=INK; c.stroke();
    c.fillStyle='rgba(255,255,255,.4)'; c.fillRect(hx-k*.12,hy-k*.26,k*.04,k*.25); c.fillStyle='rgba(0,0,0,.15)'; c.fillRect(hx-k*.2,hy-k*.09,k*.4,k*.03);
    if(z.hp<z.base+(z.maxHp-z.base)*.45) E(c,hx+k*.08,hy-k*.15,k*.05,k*.035,'#7E878F'); }
  if(z.type==='runner'){ rr(c,hx-k*.2,hy-k*.13,k*.4,k*.06,k*.02,'#fff',lw*.7); c.fillStyle='#C93A3A'; c.fillRect(hx-k*.19,hy-k*.115,k*.38,k*.02); }
  if(boss){ c.beginPath(); const cy=hy-k*.16; c.moveTo(hx-k*.17,cy); c.lineTo(hx-k*.19,cy-k*.16); c.lineTo(hx-k*.09,cy-k*.07); c.lineTo(hx,cy-k*.2); c.lineTo(hx+k*.09,cy-k*.07); c.lineTo(hx+k*.19,cy-k*.16); c.lineTo(hx+k*.17,cy); c.closePath(); c.fillStyle='#F5C542'; c.fill(); c.lineWidth=lw; c.strokeStyle=INK; c.stroke();
    E(c,hx,cy-k*.06,k*.025,k*.025,'#D2483C'); E(c,hx-k*.11,cy-k*.04,k*.018,k*.018,'#4DB2FF'); E(c,hx+k*.11,cy-k*.04,k*.018,k*.018,'#7BD15A'); }
  c.restore();
}
function drawBone(c,x,y,s,rot,glow){
  c.save(); c.translate(x,y); c.rotate(rot||0);
  if(glow){ const g=c.createRadialGradient(0,0,0,0,0,s*.9); g.addColorStop(0,'rgba(255,240,170,.75)'); g.addColorStop(1,'rgba(255,240,170,0)'); c.fillStyle=g; c.fillRect(-s,-s,s*2,s*2); }
  const L=s*.9, h=s*.26, lw=Math.max(1,s*.06);
  const parts=[[-L/2,-h*.6],[-L/2,h*.6],[L/2,-h*.6],[L/2,h*.6]];
  parts.forEach(p=>E(c,p[0],p[1],h*.62,h*.62,null,lw)); rr(c,-L/2,-h/2,L,h,h*.3,null,lw);
  parts.forEach(p=>E(c,p[0],p[1],h*.62,h*.62,'#FFF2D2')); rr(c,-L/2,-h/2,L,h,h*.3,'#FFF2D2');
  c.fillStyle='rgba(200,160,100,.35)'; c.fillRect(-L*.35,h*.05,L*.7,h*.3);
  c.restore();
}
function drawMower(c,x,y,s,t,moving){
  c.save(); c.translate(x,y);
  E(c,0,s*.12,s*.3,s*.08,'rgba(0,0,0,.25)');
  E(c,0,s*.04,s*.3,s*.13,'#2E3440',Math.max(1,s*.03)); E(c,0,-s*.01,s*.27,s*.1,'#4C566A'); E(c,0,-s*.03,s*.12,s*.045,'#3B4252');
  E(c,s*.16,-s*.02,s*.03,s*.03,moving?(Math.sin(t*20)>0?'#7BD15A':'#3a6'):'#4DB2FF');
  c.restore();
}

/* ================== Состояние ================== */
const cv=$('game'), ctx=cv.getContext('2d');
let W=0,H=0,DPR=1,L={},bg=null,G=null,state='menu',paused=false,hover=null;
let PROG={unlocked:1};
try{ const sv=JSON.parse(localStorage.getItem('dvz-prog')||'null'); if(sv&&sv.unlocked) PROG=sv; }catch(e){}
try{ if(localStorage.getItem('dvz-sound')==='off') S.on=false; const mv=localStorage.getItem('dvz-music'); if(mv!==null&&isFinite(+mv)) S.mvol=Math.max(0,Math.min(1,+mv)); }catch(e){}
function saveProg(){ try{ localStorage.setItem('dvz-prog',JSON.stringify(PROG)); }catch(e){} }

function resize(){
  const r=cv.parentElement.getBoundingClientRect(); W=r.width; H=r.height; DPR=Math.min(3,window.devicePixelRatio||1);
  cv.width=Math.max(1,Math.round(W*DPR)); cv.height=Math.max(1,Math.round(H*DPR));
  const ch=H/(ROWS+1.6), cw=W/COLS;
  L={cw,ch,top:ch*.7,s:Math.min(cw,ch*1.05)}; L.fieldBottom=L.top+ch*ROWS;
  buildBg();
  sizeBgCanvas($('titleCv')); sizeBgCanvas($('finalCv'));
}
function sizeBgCanvas(c){ const r=c.getBoundingClientRect(); if(!r.width) return; c.width=Math.round(r.width*DPR); c.height=Math.round(r.height*DPR); c._w=r.width; c._h=r.height; }
const colX=c=>(c+.5)*L.cw, rowY=r=>L.top+r*L.ch;

function buildBg(){
  if(!W) return; bg=bg||document.createElement('canvas'); bg.width=cv.width; bg.height=cv.height;
  const b=bg.getContext('2d'); b.setTransform(DPR,0,0,DPR,0,0);
  const th=THEMES[G?G.lv.theme:'day'], rnd=mulberry(11);
  b.fillStyle=th.street; b.fillRect(0,0,W,L.top+2);
  for(let i=0;i<140;i++){ b.fillStyle=rnd()<.5?'rgba(0,0,0,.09)':'rgba(255,255,255,.07)'; b.fillRect(rnd()*W,rnd()*L.top,2,2); }
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){ b.fillStyle=(r+c)%2?th.g1:th.g2; b.fillRect(c*L.cw,L.top+r*L.ch,L.cw+1,L.ch+1); }
  b.strokeStyle='rgba(30,90,20,.28)'; b.lineWidth=1.4; b.lineCap='round';
  for(let i=0;i<260;i++){ const x=rnd()*W, y=L.top+rnd()*L.ch*ROWS; b.beginPath(); b.moveTo(x,y); b.lineTo(x-2,y-5); b.moveTo(x+2,y); b.lineTo(x+3,y-6); b.stroke(); }
  if(th.leaves) for(let i=0;i<70;i++){ const x=rnd()*W, y=L.top+rnd()*L.ch*ROWS; E(b,x,y,5,2.6,['#E07A2E','#D9473B','#F0B945','#B5652A'][i%4],0,rnd()*3); }
  if(th.snow) for(let i=0;i<50;i++){ E(b,rnd()*W,L.top+rnd()*L.ch*ROWS,rnd()*10+6,rnd()*3+2,'rgba(255,255,255,.7)'); }
  for(let i=0;i<(th.snow?0:16);i++){ const x=rnd()*W, y=L.top+rnd()*L.ch*ROWS, col=['#fff','#FFE36B','#FFB3C8'][i%3]; for(let p=0;p<5;p++){ const a=p/5*Math.PI*2; E(b,x+Math.cos(a)*3,y+Math.sin(a)*3,2.4,2.4,col); } E(b,x,y,1.8,1.8,'#F0B945'); }
  // забор
  const fh=L.top*.62, pw=L.cw/3;
  b.fillStyle='rgba(0,0,0,.18)'; b.fillRect(0,L.top-2,W,5);
  for(let x=0,i=0;x<W;x+=pw,i++){ if(i%7===3) continue; const h=fh*(.85+rnd()*.2); rr(b,x+3,L.top-h,pw-6,h+3,2,'#EADDC3',1); b.fillStyle='rgba(0,0,0,.08)'; b.fillRect(x+pw-8,L.top-h+3,2,h); }
  b.fillStyle='#CDBB9A'; b.fillRect(0,L.top-fh*.55,W,4);
  // крыльцо
  const dy=L.fieldBottom; b.fillStyle=th.deck; b.fillRect(0,dy,W,H-dy);
  b.strokeStyle='rgba(60,30,10,.28)'; b.lineWidth=1.5; for(let y=dy+8;y<H;y+=12){ b.beginPath(); b.moveTo(0,y); b.lineTo(W,y); b.stroke(); }
  b.fillStyle='rgba(0,0,0,.22)'; b.fillRect(0,dy,W,4);
  for(let c=0;c<COLS;c++){ E(b,colX(c),dy+L.ch*.45+2,L.s*.34,L.s*.15,'rgba(60,30,10,.22)'); }
  if(th.tint){ b.fillStyle=th.tint; b.fillRect(0,0,W,H); }
  if(th.stars){ for(let i=0;i<30;i++){ b.fillStyle='rgba(255,255,230,'+(.4+rnd()*.5)+')'; b.fillRect(rnd()*W,rnd()*L.top*.6,1.6,1.6); } E(b,W*.86,L.top*.3,L.top*.18,L.top*.18,G&&G.lv.theme==='boss'?'#FF8A7A':'#FFF4C8'); }
  const v=b.createRadialGradient(W/2,H/2,Math.min(W,H)*.3,W/2,H/2,Math.max(W,H)*.75); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,.25)'); b.fillStyle=v; b.fillRect(0,0,W,H);
}

/* ================== Уровень ================== */
function buildEvents(lv){
  const ev=[]; let t=lv.first; const n=lv.count;
  for(let i=0;i<n;i++){ const f=i/Math.max(1,n-1); ev.push({t,type:i<2?'basic':wpick(lv.mix)}); t+=lv.gap0+(lv.gap1-lv.gap0)*f+rand(-1.5,1.5); }
  lv.waves.forEach((wf,wi)=>{ const base=ev[Math.min(n-1,Math.floor(wf*(n-1)))].t+3; ev.push({t:base,banner:wi===lv.waves.length-1?'Последняя волна!':'Огромная волна зомби!'}); for(let j=0;j<lv.waveSize;j++) ev.push({t:base+2.5+j*.8,type:wpick(lv.mix)}); });
  if(lv.boss){ ev.push({t:lv.bossT-3,banner:'Идёт Зомби-Король!'}); ev.push({t:lv.bossT,type:'boss'}); }
  ev.sort((a,b)=>a.t-b.t); return ev;
}
let curLoadout=null;
try{ curLoadout=JSON.parse(localStorage.getItem('dvz-loadout')||'null'); }catch(e){}
function loadoutFor(i){ const av=availFor(i); if(av.length<=SLOTS) return av; let lo=(curLoadout||[]).filter(k=>av.includes(k)).slice(0,SLOTS); if(!lo.length) lo=av.slice(0,SLOTS); return lo; }
function startLevel(i){
  const endless=i==='endless'; const lv=endless?makeEndlessLv():LEVELS[i];
  G={li:i,lv,endless,t:0,bones:lv.bones,dogs:[],grid:Array.from({length:ROWS},()=>Array(COLS).fill(null)),zombies:[],projs:[],lobs:[],items:[],parts:[],floats:[],
     mowers:Array.from({length:COLS},(_,c)=>({c,state:'idle',y:ROWS+.45})),cds:{},sel:null,shovel:false,events:endless?[]:buildEvents(lv),ev:0,spawned:0,skyT:6,boss:null,shake:0,speed:1,winT:0,hint:0,lastCol:-1,
     kills:0,wave:1,waveT:0,nextSpawn:20,burstQ:[],loadout:loadoutFor(i)};
  G.total=G.events.filter(e=>e.type).length;
  G.loadout.forEach(k=>G.cds[k]=0);
  $('lvlName').textContent=endless?'Бесконечный · волна 1':'Уровень '+(i+1)+' · '+lv.name;
  $('speedBtn').textContent='x1'; $('speedBtn').classList.remove('on');
  buildBg(); buildCards(); updShovel(); hud(true);
  hideAll(); state='play'; paused=false;
  G.lightT=rand(5,9); G.lightning=0;
  S.startMusic(themeTrack(lv.theme),true);
}
function spawnZ(type,col,y){
  const D=ZOMB[type];
  if(col==null){ col=Math.floor(Math.random()*COLS); if(col===G.lastCol) col=(col+1+Math.floor(Math.random()*(COLS-1)))%COLS; G.lastCol=col; }
  const z={type,col,y:y==null?-.75:y,hp:D.hp,maxHp:D.hp,base:D.base,speed:D.speed*rand(.9,1.1),dps:D.dps,ph:Math.random()*6,flash:0,slowT:0,eating:false};
  if(type==='boss'){ z.col=2; z.y=-1.3; z.summonT=10; z.throwT=7; z.enraged=false; z.speed=D.speed; G.boss=z; S.roar(); G.shake=.8; }
  G.zombies.push(z); if(Math.random()<.35) S.groan();
}
const inSpan=(col,z)=> z.type==='boss' ? (col>=z.col-1&&col<=z.col+1) : z.col===col;
function dmgZ(z,a){
  if(z.dead) return; const had=z.hp>z.base; z.hp-=a; z.flash=.08;
  if(had && z.hp<=z.base && (z.type==='helmet'||z.type==='bucket')){ const x=colX(z.col), y=rowY(z.y); burst(x,y-L.s*.25,8,z.type==='helmet'?'#F2C230':'#A3ACB5',160,4); }
  if(z.hp<=0) killZ(z);
}
function killZ(z){
  z.dead=true; G.kills++; const x=z.type==='boss'?colX(z.col):colX(z.col), y=rowY(z.y);
  burst(x,y,z.type==='boss'?60:14,'#86AD5E',z.type==='boss'?360:180,z.type==='boss'?7:4); S.splat();
  if(z.type==='boss'){ G.boss=null; G.shake=1.2; S.boom(); banner('Король повержен!'); for(let i=0;i<40;i++) G.parts.push({x:x+rand(-60,60),y:y+rand(-60,40),vx:rand(-80,80),vy:rand(-260,-80),life:rand(1,2),max:2,color:['#FF6B8B','#F0B945','#fff'][i%3],size:rand(5,9),heart:i%2===0,g:200}); }
}
function burst(x,y,n,color,spd,size){ for(let i=0;i<n;i++){ const a=Math.random()*Math.PI*2, v=spd*rand(.3,1); const l=rand(.35,.75); G.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-spd*.3,life:l,max:l,color,size:size*rand(.6,1.2),g:600}); } }
function ring(x,y,r,color){ G.parts.push({ring:true,x,y,r,life:.45,max:.45,color}); }
function float(x,y,text,color,size){ G.floats.push({x,y,text,color:color||'#fff',size:size||16,life:1.1,max:1.1}); }

function place(type,r,c){
  const D=DOGS[type];
  if(G.bones<D.cost){ S.err(); nope('bonesBox'); return; }
  if(G.cds[type]>0){ S.err(); nope(cardEls[type]); return; }
  const d={type,r,c,hp:D.hp,maxHp:D.hp,ph:Math.random()*6,hurt:0,fire:0,fireT:.6,prod:6+Math.random()*2,arm:12,burst:0,glow:0,chew:0};
  G.grid[r][c]=d; G.dogs.push(d); G.bones-=D.cost; G.cds[type]=D.cd; G.sel=null;
  burst(colX(c),rowY(r+.85),8,'rgba(120,80,40,.6)',90,3); S.place(); S.bark(type==='chihuahua'?1.6:type==='bulldog'?.7:1);
}
function removeDog(d,quiet){
  if(G.grid[d.r][d.c]===d) G.grid[d.r][d.c]=null; const i=G.dogs.indexOf(d); if(i>=0) G.dogs.splice(i,1);
  if(!quiet){ float(colX(d.c),rowY(d.r+.2),'Ай!','#FFE0E6',16); burst(colX(d.c),rowY(d.r+.5),10,BREED[d.type].fur,150,4); S.yelp(); }
}
function hasTarget(d){ for(const z of G.zombies){ if(z.dead||!inSpan(d.c,z)) continue; if(z.y<d.r+.5 && z.y>-.85) return true; } return false; }
function shoot(d,kind){ G.projs.push({col:d.c,y:d.r+.12,kind,dmg:20,rot:0}); d.fire=1; S.bark(d.type==='samoyed'?1.15:d.type==='dalmatian'?.9:1); if(Math.random()<.07) float(colX(d.c)+L.cw*.25,rowY(d.r+.1),'Гав!','#FFF5E1',14); }
function explode(d){
  const x=colX(d.c), y=rowY(d.r+.5);
  for(const z of G.zombies){ if(z.dead||!inSpan(d.c,z)) continue; const zy=z.type==='boss'?z.y+.8:z.y; if(Math.abs(zy-(d.r+.5))<1.05) dmgZ(z,1800); }
  burst(x,y,26,'#FFD166',260,6); burst(x,y,14,'#fff',200,4); ring(x,y,L.s*1.2,'#FFF5E1'); G.shake=.5; S.boom(); S.bark(1.7);
  float(x,y-L.ch*.5,'ТЯВ!','#FFD166',26); removeDog(d,true); float(x,y-L.ch*.05,'Убежала домой','#FFF5E1',12);
}
function dropBone(x,y){ G.items.push({x,y:y-10,x0:x,y0:y-10,x1:x+(Math.random()-.5)*L.cw*.6,y1:y+L.ch*.22,phase:'arc',at:0,val:25,life:9,rot:rand(-.4,.4)}); }
function collect(it){ if(it.col) return; it.col=true; S.pop(); const br=$('bonesBox').getBoundingClientRect(), cr=cv.getBoundingClientRect(); it.tx=br.left+18-cr.left; it.ty=br.top+br.height/2-cr.top; }

function updateDog(d,dt){
  d.hurt=Math.max(0,d.hurt-dt); d.fire=Math.max(0,d.fire-dt*4); d.glow=Math.max(0,d.glow-dt);
  if(d.hp<=0){ removeDog(d); return; }
  const x=colX(d.c), y=rowY(d.r+.5);
  if(d.type==='corgi'){ d.prod-=dt; if(d.prod<1.2) d.glow=Math.max(d.glow,1-d.prod/1.2); if(d.prod<=0){ d.prod=13+Math.random()*3; dropBone(x,y); } }
  else if(d.type==='husky'||d.type==='samoyed'||d.type==='dalmatian'){
    d.fireT-=dt; if(d.burst>0){ d.burst-=dt; if(d.burst<=0) shoot(d,'ball'); }
    if(d.fireT<=0 && hasTarget(d)){ d.fireT=1.45; shoot(d,d.type==='samoyed'?'snow':'ball'); if(d.type==='dalmatian') d.burst=.18; }
    if(d.fireT<0) d.fireT=0;
  } else if(d.type==='chihuahua'){
    if(d.arm>0){ d.arm-=dt; if(d.arm<=0){ float(x,y-L.ch*.45,'Готова!','#FFD166',14); S.bark(1.7); } }
    else for(const z of G.zombies){ if(z.dead||!inSpan(d.c,z)) continue; const zy=z.type==='boss'?z.y+.5:z.y; if(zy>=d.r-.15&&zy<=d.r+.8){ explode(d); break; } }
  } else if(d.type==='pug'){
    d.fireT-=dt;
    if(d.fireT<=0){ const hits=G.zombies.filter(z=>!z.dead&&inSpan(d.c,z)&&z.y>-.85&&(z.type==='boss'?z.y+.8:z.y)<d.r+.5&&(z.type==='boss'?z.y+.8:z.y)>d.r+.5-3.4);
      if(hits.length){ d.fireT=1.6; d.fire=1; hits.forEach(z=>dmgZ(z,25)); sneeze(d); } else d.fireT=0; }
  } else if(d.type==='dachshund'){
    if(d.chew>0){ d.chew-=dt; if(d.chew<=0) float(x,y-L.ch*.4,'Готова!','#FFD166',13); }
    else { let tg=null; for(const z of G.zombies){ if(z.dead||!inSpan(d.c,z)) continue; const zy=z.type==='boss'?z.y+.8:z.y; if(zy>=d.r-1.25&&zy<=d.r+.6){ tg=z; break; } }
      if(tg){ d.chew=18; d.fire=1; S.chomp(); S.bark(.85);
        if(tg.type==='boss'||tg.type==='giant'){ dmgZ(tg,700); float(x,y-L.ch*.5,'Кусь!','#FFD166',18); }
        else { float(colX(tg.col),rowY(tg.y),'Ам!','#FFD166',20); dmgZ(tg,99999); } } }
  } else if(d.type==='retriever'){
    d.fireT-=dt; if(d.fireT<=0&&hasTarget(d)){ d.fireT=1.6; d.fire=1; G.projs.push({col:d.c,y:d.r+.1,kind:'frisbee',dmg:25,rot:0,hit:new Set()}); S.bark(.95); } if(d.fireT<0) d.fireT=0;
  } else if(d.type==='bernard'){
    for(let r2=d.r-1;r2<=d.r+1;r2++) for(let c2=d.c-1;c2<=d.c+1;c2++){ if(r2<0||r2>=ROWS||c2<0||c2>=COLS) continue; const n=G.grid[r2][c2];
      if(n&&n.hp<n.maxHp){ n.hp=Math.min(n.maxHp,n.hp+30*dt); if(Math.random()<dt*1.5) G.parts.push({x:colX(c2)+rand(-12,12),y:rowY(r2+.3),vx:0,vy:-40,life:.9,max:.9,color:'#FF6B8B',size:5,heart:true,g:-20}); } }
  }
}
function sneeze(d){
  const x=colX(d.c), y=rowY(d.r+.2);
  for(let i=0;i<8;i++){ const l=rand(.6,.85); G.parts.push({x:x+rand(-14,14),y,vx:rand(-18,18),vy:-rand(L.ch*3.6,L.ch*4.4),life:l,max:l,color:'rgba(210,238,190,.75)',size:rand(7,13),g:0}); }
  S.noise(.18,.22,2600,'highpass'); if(Math.random()<.15) float(x+L.cw*.25,rowY(d.r+.1),'Апчхи!','#E2F5D0',14);
}
function endlessTick(dt){
  G.waveT+=dt; G.nextSpawn-=dt;
  if(G.nextSpawn<=0){ spawnZ(wpick(endlessMix(G.wave))); G.nextSpawn=Math.max(1.4,8-G.wave*.65)*rand(.75,1.25); }
  while(G.burstQ.length&&G.burstQ[0]<=G.t){ G.burstQ.shift(); spawnZ(wpick(endlessMix(G.wave))); }
  if(G.waveT>=75){
    G.waveT=0; G.wave++;
    const th=G.wave%8===0?'boss':E_THEMES[(G.wave-1)%E_THEMES.length]; G.lv.theme=th; buildBg(); S.startMusic(themeTrack(th)); G.lightT=rand(5,9);
    let txt='Волна '+G.wave;
    if(G.wave%3===0){ G.mowers.forEach(m=>{ if(m.state==='done'){ m.state='idle'; m.y=ROWS+.45; } }); txt+=' · пылесосы заряжены'; }
    if(G.wave%8===0&&!G.boss){ txt='Волна '+G.wave+': Зомби-Король!'; spawnZ('boss'); const m=1+(G.wave/8-1)*.5; G.boss.hp=G.boss.maxHp=Math.round(13000*m); }
    banner(txt); S.horn();
    for(let j=0;j<3+G.wave;j++) G.burstQ.push(G.t+2+j*.8);
  }
}
function updateZ(z,dt){
  z.flash-=dt; z.slowT-=dt; const slow=z.slowT>0?.5:1; const boss=z.type==='boss';
  let eating=false;
  if(boss){
    for(let c=z.col-1;c<=z.col+1;c++) for(let r=0;r<ROWS;r++){ const d=G.grid[r][c]; if(d && z.y>=r-.6 && z.y<=r+.7){ eating=true; d.hp-=z.dps*slow*dt; d.hurt=.15; } }
    z.summonT-=dt; if(z.summonT<=0){ z.summonT=z.enraged?7:10; const n=z.enraged?3:2; for(let i=0;i<n;i++) spawnZ(['basic','helmet','runner'][Math.floor(Math.random()*3)],null,-.7); S.roar(); G.shake=.4; float(colX(z.col),rowY(z.y-.9),'Слуги, ко мне!','#FFB3B3',15); }
    z.throwT-=dt; if(z.throwT<=0){ z.throwT=z.enraged?6:9; if(G.dogs.length){ const d=G.dogs[Math.floor(Math.random()*G.dogs.length)]; G.lobs.push({x0:colX(z.col)+L.cw*.4,y0:rowY(z.y-.6),d,t:0,dur:1.1}); } }
    if(!z.enraged && z.hp<z.maxHp/2){ z.enraged=true; z.speed*=1.5; banner('Король в ярости!'); S.roar(); G.shake=.7; }
  } else {
    for(let r=0;r<ROWS;r++){ const d=G.grid[r][z.col]; if(d && z.y>=r-.1 && z.y<=r+.7){ eating=true; d.hp-=z.dps*slow*dt; d.hurt=.15; break; } }
  }
  z.eating=eating;
  if(eating) S.chomp(); else z.y+=z.speed*slow*dt;
  const front = boss? z.y+.8 : z.y;
  if(front>ROWS+.05){
    const cols = boss? [z.col,z.col-1,z.col+1] : [z.col];
    let ok=false;
    for(const c of cols){ const m=G.mowers[c]; if(m.state==='go'){ ok=true; break; } if(m.state==='idle'){ m.state='go'; S.mower(); ok=true; break; } }
    if(!ok && front>ROWS+.3) lose();
  }
}
function update(dt){
  G.t+=dt; const lv=G.lv;
  while(G.ev<G.events.length && G.events[G.ev].t<=G.t){ const e=G.events[G.ev++]; if(e.banner){ banner(e.banner); S.horn(); } else { spawnZ(e.type); G.spawned++; } }
  if(G.endless) endlessTick(dt);
  hints();
  G.skyT-=dt; if(G.skyT<=0){ G.skyT=lv.sky+Math.random()*3; G.items.push({x:colX(Math.floor(Math.random()*COLS))+(Math.random()-.5)*L.cw*.4,y:-20,ty:rowY(1+Math.random()*(ROWS-2)),phase:'fall',val:25,life:9,rot:Math.random()*6}); }
  for(const k in G.cds) G.cds[k]=Math.max(0,G.cds[k]-dt);
  for(const d of G.dogs.slice()) updateDog(d,dt);
  for(const z of G.zombies) if(!z.dead) updateZ(z,dt);
  if(state!=='play') return;
  for(const m of G.mowers){ if(m.state!=='go') continue; m.y-=6*dt;
    for(const z of G.zombies){ if(z.dead||!inSpan(m.c,z)) continue;
      if(z.type==='boss'){ if(m.y<=z.y+.8 && m.y>=z.y-1){ dmgZ(z,1500); z.y=Math.max(-1,z.y-2.5); m.state='done'; burst(colX(m.c),rowY(m.y),24,'#C9CED6',260,5); S.boom(); G.shake=.6; break; } }
      else if(Math.abs(z.y-m.y)<.6){ dmgZ(z,99999); } }
    if(m.y<-1.5) m.state='done'; }
  for(const p of G.projs){ p.y-=7.5*dt; p.rot+=dt*12;
    if(p.kind==='frisbee'){ for(const z of G.zombies){ if(z.dead||!inSpan(p.col,z)||z.y<-.9||p.hit.has(z)) continue; const top=z.type==='boss'?z.y-1:z.y-.42, bot=z.type==='boss'?z.y+.8:z.y+.3;
        if(p.y<=bot&&p.y>=top){ p.hit.add(z); dmgZ(z,p.dmg); burst(colX(p.col),rowY(p.y),5,'#E6533C',120,3); S.hit(); } }
      if(p.y<-1) p.dead=true; continue; }
    let hit=null;
    for(const z of G.zombies){ if(z.dead||!inSpan(p.col,z)||z.y<-.9) continue; const top=z.type==='boss'?z.y-1:z.y-.42, bot=z.type==='boss'?z.y+.8:z.y+.3; if(p.y<=bot&&p.y>=top&&(!hit||z.y>hit.y)) hit=z; }
    if(hit){ dmgZ(hit,p.dmg); if(p.kind==='snow') hit.slowT=4; burst(colX(p.col),rowY(p.y),5,p.kind==='snow'?'#DDF1FF':'#D8EE3A',120,3); p.dead=true; S.hit(); }
    if(p.y<-1) p.dead=true; }
  G.projs=G.projs.filter(p=>!p.dead);
  for(const b of G.lobs){ b.t+=dt; if(b.t>=b.dur){ b.dead=true; const d=b.d; if(G.dogs.includes(d)){ d.hp-=350; d.hurt=.3; burst(colX(d.c),rowY(d.r+.5),12,'#8A9A5B',180,4); S.splat(); } } }
  G.lobs=G.lobs.filter(b=>!b.dead);
  for(const it of G.items){
    if(it.col){ const a=Math.min(1,dt*9); it.x+=(it.tx-it.x)*a; it.y+=(it.ty-it.y)*a; if(Math.hypot(it.tx-it.x,it.ty-it.y)<14){ it.dead=true; G.bones+=it.val; pulse(); } }
    else if(it.phase==='fall'){ it.y+=70*dt; it.rot+=dt; if(it.y>=it.ty){ it.y=it.ty; it.phase='rest'; } }
    else if(it.phase==='arc'){ it.at+=dt/.6; const a=Math.min(1,it.at); it.x=it.x0+(it.x1-it.x0)*a; it.y=it.y0+(it.y1-it.y0)*a-Math.sin(a*Math.PI)*L.ch*.5; if(a>=1) it.phase='rest'; }
    else { it.life-=dt; if(it.life<=0) collect(it); } }
  G.items=G.items.filter(i=>!i.dead);
  G.zombies=G.zombies.filter(z=>!z.dead);
  updFx(dt);
  G.shake=Math.max(0,G.shake-dt*2);
  if(THEMES[lv.theme].rain){ G.lightning=Math.max(0,G.lightning-dt); G.lightT-=dt; if(G.lightT<=0){ G.lightT=rand(7,13); G.lightning=.3; S.noise(1.4,.4,300); } }
  if(!G.endless && G.ev>=G.events.length && G.zombies.length===0){ G.winT+=dt; if(G.winT>1.3) win(); }
}
function updFx(dt){
  for(const p of G.parts){ p.life-=dt; if(!p.ring){ p.vy+=(p.g||600)*dt; p.x+=p.vx*dt; p.y+=p.vy*dt; } }
  G.parts=G.parts.filter(p=>p.life>0);
  for(const f of G.floats){ f.life-=dt; f.y-=28*dt; } G.floats=G.floats.filter(f=>f.life>0);
}

/* ================== Отрисовка ================== */
function render(){
  const c=ctx; c.setTransform(DPR,0,0,DPR,0,0);
  const t=G.t; c.save();
  if(G.shake>0) c.translate((Math.random()-.5)*G.shake*12,(Math.random()-.5)*G.shake*12);
  c.drawImage(bg,0,0,W,H);
  if(G.sel||G.shovel){ const a=.07+.05*Math.sin(performance.now()/200);
    for(let r=0;r<ROWS;r++) for(let cc=0;cc<COLS;cc++){ const occ=G.grid[r][cc];
      if(G.sel&&!occ){ c.fillStyle='rgba(255,255,255,'+a+')'; c.fillRect(cc*L.cw+3,rowY(r)+3,L.cw-6,L.ch-6); }
      if(G.shovel&&occ){ c.fillStyle='rgba(217,71,59,'+(a+.1)+')'; c.fillRect(cc*L.cw+3,rowY(r)+3,L.cw-6,L.ch-6); } } }
  if(G.sel&&hover&&hover.r>=0&&hover.r<ROWS&&hover.c>=0&&hover.c<COLS&&!G.grid[hover.r][hover.c]) drawDog(c,G.sel,colX(hover.c),rowY(hover.r+.5),L.s*.9,{t,alpha:.45});
  const list=[];
  for(const d of G.dogs) list.push({y:rowY(d.r+.5),f:()=>drawDog(c,d.type,colX(d.c),rowY(d.r+.5),L.s*.9,{t,ph:d.ph,hurt:d.hurt,fire:d.fire,armed:d.type==='chihuahua'&&d.arm<=0,hpR:d.hp/d.maxHp,glow:d.glow,chew:d.chew})});
  for(const z of G.zombies){ const boss=z.type==='boss'; const zy=rowY(z.y)-(boss?0:L.s*.05); list.push({y:zy+(boss?L.ch*.6:0),f:()=>drawZombie(c,z,colX(z.col),zy,L.s*.95,t)}); }
  for(const m of G.mowers){ if(m.state==='done') continue; list.push({y:rowY(m.y),f:()=>drawMower(c,colX(m.c),rowY(m.y),L.s,t,m.state==='go')}); }
  list.sort((a,b)=>a.y-b.y).forEach(o=>o.f());
  for(const p of G.projs){ const x=colX(p.col), y=rowY(p.y), r=L.s*.085;
    if(p.kind==='snow'){ E(c,x,y,r*1.1,r*1.1,'#F4FBFF',1); E(c,x+r*.3,y+r*.3,r*.5,r*.4,'#C6E6FA'); }
    else if(p.kind==='frisbee'){ const wob=Math.sin(p.rot)*.25; E(c,x,y,r*1.9,r*.8,'#E6533C',1.2,wob); E(c,x,y,r*1.1,r*.42,'#F07A5A',0,wob); }
    else { E(c,x,y,r,r,'#D8EE3A',1); c.save(); c.translate(x,y); c.rotate(p.rot); c.strokeStyle='#fff'; c.lineWidth=1.4; c.beginPath(); c.arc(-r*.9,0,r*.8,-.9,.9); c.stroke(); c.beginPath(); c.arc(r*.9,0,r*.8,Math.PI-.9,Math.PI+.9); c.stroke(); c.restore(); } }
  for(const b of G.lobs){ const d=b.d, a=b.t/b.dur; const x1=colX(d.c), y1=rowY(d.r+.5); const x=b.x0+(x1-b.x0)*a, y=b.y0+(y1-b.y0)*a-Math.sin(a*Math.PI)*L.ch*2; drawBone(c,x,y,L.s*.3,a*12,false); E(c,x,y,L.s*.07,L.s*.07,'rgba(120,150,70,.7)'); }
  const th=THEMES[G.lv.theme];
  if(th.fog){ const fb=rowY(3.6); const g=c.createLinearGradient(0,0,0,fb); g.addColorStop(0,'rgba(214,220,230,.97)'); g.addColorStop(.75,'rgba(214,220,230,.9)'); g.addColorStop(1,'rgba(214,220,230,0)'); c.fillStyle=g; c.fillRect(0,0,W,fb);
    for(let i=0;i<7;i++){ const fx=((t*(8+i*2)+i*97)%(W+200))-100, fy=rowY(.4+i*.45); E(c,fx,fy,L.cw*1.1,L.ch*.45,'rgba(230,234,240,.55)'); } }
  if(th.snow){ c.fillStyle='rgba(255,255,255,.85)'; for(let i=0;i<60;i++){ const sx=((i*73.13)%1*W+Math.sin(t+i)*14+W)%W, sy=((i*0.618)%1*H+t*(30+i%5*8))%H; c.beginPath(); c.arc(sx,sy,1.4+i%3*.7,0,Math.PI*2); c.fill(); } }
  if(th.rain){ c.strokeStyle='rgba(180,200,255,.4)'; c.lineWidth=1.2; c.beginPath(); for(let i=0;i<70;i++){ const rx=((i*0.377)%1*W+t*60)%W, ry=((i*0.713)%1*H+t*620)%H; c.moveTo(rx,ry); c.lineTo(rx-4,ry+14); } c.stroke(); }
  for(const it of G.items){ const pulse=1+.06*Math.sin(performance.now()/180); drawBone(c,it.x,it.y,L.s*.42*pulse,it.rot,true);
    if(!it.col&&it.phase==='rest'&&it.life<2.5&&Math.sin(performance.now()/90)>0){ c.globalAlpha=.4; drawBone(c,it.x,it.y,L.s*.42,it.rot,false); c.globalAlpha=1; } }
  for(const p of G.parts){ const a=Math.max(0,p.life/p.max); c.globalAlpha=a;
    if(p.ring){ c.strokeStyle=p.color; c.lineWidth=4*a; c.beginPath(); c.arc(p.x,p.y,p.r*(1-a*.8),0,Math.PI*2); c.stroke(); }
    else if(p.heart) heart(c,p.x,p.y,p.size*1.6,p.color); else E(c,p.x,p.y,p.size,p.size,p.color); }
  c.globalAlpha=1;
  c.textAlign='center'; c.textBaseline='middle';
  for(const f of G.floats){ c.globalAlpha=Math.min(1,f.life/f.max*2); c.font='900 '+f.size+'px Nunito, sans-serif'; c.lineWidth=4; c.strokeStyle='rgba(51,36,28,.85)'; c.strokeText(f.text,f.x,f.y); c.fillStyle=f.color; c.fillText(f.text,f.x,f.y); }
  c.globalAlpha=1;
  if(G.lightning>0){ c.fillStyle='rgba(235,240,255,'+(G.lightning*2.4)+')'; c.fillRect(0,0,W,H); }
  if(G.boss){ const z=G.boss, bw=W*.7, bx=(W-bw)/2, by=L.top*.18, bh=Math.max(10,L.top*.28);
    rr(c,bx-2,by-2,bw+4,bh+4,bh/2+2,'rgba(20,10,20,.8)'); rr(c,bx,by,bw*Math.max(0,z.hp/z.maxHp),bh,bh/2,z.enraged?'#FF4A3A':'#C2304A');
    c.font='900 '+Math.round(bh*.85)+'px Nunito, sans-serif'; c.fillStyle='#fff'; c.fillText('ЗОМБИ-КОРОЛЬ',W/2,by+bh/2+1); }
  c.restore();
}

/* ================== HUD ================== */
let cardEls={}, lastBones=-1;
function buildCards(){
  const box=$('cards'); box.innerHTML=''; cardEls={};
  for(let i=0;i<SLOTS;i++){ const k=G.loadout[i]; const b=document.createElement('button'); b.type='button'; b.className='card';
    if(k){ b.innerHTML='<canvas></canvas><span class="cost">'+DOGS[k].cost+'</span><span class="cd"></span>'; b.setAttribute('aria-label',DOGS[k].name+', '+DOGS[k].cost+' косточек');
      b.addEventListener('pointerdown',e=>{ e.preventDefault(); S.init(); pickCard(k); }); cardEls[k]=b; }
    else { b.classList.add('empty'); b.disabled=true; b.textContent='?'; }
    box.appendChild(b); }
  requestAnimationFrame(()=>{ for(const k in cardEls) paintIcon(cardEls[k].querySelector('canvas'),k); });
}
function paintIcon(cvs,k,big){ const r=cvs.getBoundingClientRect(); const d=window.devicePixelRatio||1; cvs.width=Math.max(10,Math.round(r.width*d)); cvs.height=Math.max(10,Math.round(r.height*d)); const c=cvs.getContext('2d'); c.scale(d,d); const s=Math.min(r.width,r.height*1.02)*(big?.95:1.02); drawDog(c,k,r.width/2,r.height*.56,s,{t:0,armed:false,icon:true}); }
function pickCard(k){
  if(state!=='play'||paused) return;
  if(G.sel===k){ G.sel=null; return; }
  if(G.cds[k]>0){ S.err(); nope(cardEls[k]); return; }
  if(G.bones<DOGS[k].cost){ S.err(); nope('bonesBox'); nope(cardEls[k]); return; }
  G.sel=k; G.shovel=false; updShovel(); S.tone(880,.06,'triangle',.08);
}
function nope(el){ if(typeof el==='string') el=$(el); if(!el) return; el.classList.remove('nope'); void el.offsetWidth; el.classList.add('nope'); }
function pulse(){ const el=$('bonesBox'); el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse'); }
function hud(force){
  if(G.bones!==lastBones||force){ $('boneCount').textContent=G.bones; lastBones=G.bones; }
  for(const k in cardEls){ const el=cardEls[k], D=DOGS[k]; el.classList.toggle('sel',G.sel===k); el.classList.toggle('poor',G.bones<D.cost); el.querySelector('.cd').style.transform='scaleY('+(G.cds[k]/D.cd)+')'; }
  if(G.endless){ $('progFill').style.width=(G.waveT/75*100)+'%'; const nm='Бесконечный · волна '+G.wave+' · зомби: '+G.kills; if(nm!==G._nm){ G._nm=nm; $('lvlName').textContent=nm; } }
  else $('progFill').style.width=(G.total?G.spawned/G.total*100:0)+'%';
}
function updShovel(){ $('shovelBtn').classList.toggle('on',!!(G&&G.shovel)); }
let bannerT=null;
function banner(text){ const el=$('banner'); el.textContent=text; el.classList.remove('go'); void el.offsetWidth; el.classList.add('go'); }
let tipT=null;
function tip(text,dur){ const el=$('tip'); el.textContent=text; el.classList.add('on'); clearTimeout(tipT); tipT=setTimeout(()=>el.classList.remove('on'),(dur||5.5)*1000); }
function hints(){
  if(G.li===0){
    if(G.hint===0&&G.t>.6){ tip('Выбери корги на панели сверху и нажми на газон. Корги приносят косточки.',7); G.hint=1; }
    else if(G.hint===1&&G.dogs.some(d=>d.type==='corgi')){ tip('Отлично! Поставь ещё пару корги. Нажимай на косточки, чтобы собрать их.',6); G.hint=2; }
    else if(G.hint===2&&G.spawned>0){ tip('Зомби! Поставь хаски на его дорожку, ниже зомби. Она бросает мячики вверх.',7); G.hint=3; }
  } else if(G.hint===0&&G.t>.8&&G.lv.tip){ tip(G.lv.tip,7); G.hint=1; }
}

/* ================== Управление ================== */
function local(e){ const r=cv.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top}; }
cv.addEventListener('pointerdown',e=>{ S.init(); if(state!=='play'||paused) return; const p=local(e); tap(p.x,p.y); });
cv.addEventListener('pointermove',e=>{ if(!G) return; const p=local(e); hover={c:Math.floor(p.x/L.cw),r:Math.floor((p.y-L.top)/L.ch)}; });
cv.addEventListener('pointerleave',()=>hover=null);
function tap(x,y){
  let best=null,bd=Math.max(32,L.s*.5);
  for(const it of G.items){ if(it.col) continue; const d=Math.hypot(it.x-x,it.y-y); if(d<bd){ bd=d; best=it; } }
  if(best){ collect(best); return; }
  const c=Math.floor(x/L.cw), r=Math.floor((y-L.top)/L.ch); const inF=c>=0&&c<COLS&&r>=0&&r<ROWS;
  if(G.shovel){ if(inF&&G.grid[r][c]){ const d=G.grid[r][c]; burst(colX(c),rowY(r+.7),10,'rgba(120,80,40,.7)',120,3); removeDog(d,true); S.dig(); } G.shovel=false; updShovel(); return; }
  if(G.sel){ if(!inF){ G.sel=null; return; } if(G.grid[r][c]){ S.err(); float(colX(c),rowY(r+.5),'Занято','#FFE0E6',14); return; } place(G.sel,r,c); }
}
$('shovelBtn').addEventListener('click',()=>{ if(state!=='play'||paused) return; G.shovel=!G.shovel; G.sel=null; updShovel(); S.dig(); });
$('speedBtn').addEventListener('click',()=>{ if(state!=='play') return; G.speed=G.speed===1?2:1; $('speedBtn').textContent='x'+G.speed; $('speedBtn').classList.toggle('on',G.speed===2); });
$('pauseBtn').addEventListener('click',()=>{ if(state==='play'&&!paused) pauseGame(); });
function pauseGame(){ paused=true; S.stopMusic(true); syncSoundLabels(); show('sPause'); }
document.addEventListener('visibilitychange',()=>{ if(document.hidden&&state==='play'&&!paused) pauseGame(); });
document.addEventListener('pointerdown',()=>S.init());

/* ================== Экраны ================== */
const SCREENS=['sTitle','sLevels','sHelp','sIntro','sPause','sWin','sLose','sFinal'];
function show(id){ SCREENS.forEach(s=>$(s).hidden=s!==id); if(id==='sTitle') requestAnimationFrame(()=>sizeBgCanvas($('titleCv'))); if(id==='sFinal') requestAnimationFrame(()=>sizeBgCanvas($('finalCv'))); }
function hideAll(){ SCREENS.forEach(s=>$(s).hidden=true); }
function syncSoundLabels(){ const t='Звук: '+(S.on?'вкл':'выкл'); $('bSound').textContent=t; $('bPauseSound').textContent=t; }
function toggleSound(){ S.init(); S.setOn(!S.on); try{ localStorage.setItem('dvz-sound',S.on?'on':'off'); }catch(e){} syncSoundLabels(); }
function syncMusicVol(){ const p=Math.round(S.mvol*100); document.querySelectorAll('.musicVol').forEach(el=>el.value=p); document.querySelectorAll('.musicVolTxt').forEach(el=>el.textContent=p?p+'%':'выкл'); }
document.querySelectorAll('.musicVol').forEach(el=>el.addEventListener('input',()=>{ S.setMusicVol(el.value/100); try{ localStorage.setItem('dvz-music',String(S.mvol)); }catch(e){} syncMusicVol(); }));
syncMusicVol();
$('bSound').addEventListener('click',toggleSound); $('bPauseSound').addEventListener('click',toggleSound);
$('bPlay').addEventListener('click',()=>{ S.init(); S.startMusic('menu'); if(PROG.unlocked>1) openLevels(); else openIntro(0); });
$('bLevels').addEventListener('click',()=>{ S.init(); S.startMusic('menu'); openLevels(); });
$('bHelp').addEventListener('click',()=>show('sHelp'));
$('bHelpBack').addEventListener('click',()=>show('sTitle'));
$('bLvBack').addEventListener('click',()=>show('sTitle'));
$('bGo').addEventListener('click',()=>{ const need=Math.min(SLOTS,availFor(introLevel).length);
  if(pickSel.length<need){ S.init(); S.err(); nope('pickCount'); $('pickInfo').textContent='Выбери ещё '+(need-pickSel.length)+' — в команде должно быть '+need+' собак.'; return; }
  curLoadout=pickSel.slice(); try{ localStorage.setItem('dvz-loadout',JSON.stringify(curLoadout)); }catch(e){}
  startLevel(introLevel); });
$('bEndless').addEventListener('click',()=>{ S.init(); S.startMusic('menu'); openIntro('endless'); });
$('bIntroBack').addEventListener('click',openLevels);
$('bResume').addEventListener('click',()=>{ paused=false; hideAll(); S.startMusic(S.track); });
$('bRestart').addEventListener('click',()=>startLevel(G.li));
$('bQuit').addEventListener('click',()=>{ if(G&&G.endless&&state==='play') saveBest(); state='menu'; paused=false; S.startMusic('menu'); openLevels(); });
$('bNext').addEventListener('click',()=>openIntro(Math.min(LEVELS.length-1,G.li+1)));
$('bWinLv').addEventListener('click',()=>{ S.startMusic('menu'); openLevels(); });
$('bRetry').addEventListener('click',()=>startLevel(G.li));
$('bLoseLv').addEventListener('click',()=>{ S.startMusic('menu'); openLevels(); });
$('bFinalLv').addEventListener('click',openLevels);

function openLevels(){
  state='menu'; const g=$('levelGrid'); g.innerHTML='';
  LEVELS.forEach((lv,i)=>{ const b=document.createElement('button'); b.type='button'; b.className='lv'; b.style.background=lv.color;
    const locked=i+1>PROG.unlocked, done=i+1<PROG.unlocked||(PROG.beat&&i===LEVELS.length-1);
    b.innerHTML='<small>'+(lv.boss?'Босс':'Уровень')+(done?' · пройден':'')+'</small><b>'+(i+1)+'</b><span>'+(locked?'Закрыто':lv.name)+'</span>';
    if(locked) b.disabled=true; else b.addEventListener('click',()=>openIntro(i));
    g.appendChild(b); });
  const e=document.createElement('button'); e.type='button'; e.className='lv endless';
  e.innerHTML='<small>Без конца'+(PROG.best?' · рекорд: волна '+PROG.best.wave:'')+'</small><b>∞</b><span>Бесконечный режим, все собаки доступны</span>';
  e.addEventListener('click',()=>openIntro('endless')); g.appendChild(e);
  show('sLevels');
}
let introLevel=0, pickSel=[];
function openIntro(i){
  introLevel=i; const endless=i==='endless'; const lv=endless?ENDLESS_INFO:LEVELS[i];
  $('introEyebrow').textContent=endless?('Рекорд: '+(PROG.best?'волна '+PROG.best.wave+', зомби: '+PROG.best.kills:'пока нет')):(lv.boss?'Финальная битва · ':'Уровень '+(i+1)+' · ')+'косточек на старте: '+lv.bones;
  $('introTitle').textContent=lv.name;
  const f=$('introFriends'); f.innerHTML='';
  // выбор команды
  const av=availFor(i), need=Math.min(SLOTS,av.length);
  pickSel=(curLoadout||[]).filter(k=>av.includes(k)).slice(0,need);
  (lv.newDogs||[]).forEach(k=>{ if(!pickSel.includes(k)){ if(pickSel.length>=need) pickSel.pop(); pickSel.push(k); } });
  for(const k of av){ if(pickSel.length>=need) break; if(!pickSel.includes(k)) pickSel.push(k); }
  const pk=$('picker'), pg=$('pickGrid'); pk.hidden=av.length<=SLOTS; pg.innerHTML=''; $('pickInfo').textContent='Нажми на собаку, чтобы взять её в команду или убрать.';
  const syncPick=()=>{ pg.querySelectorAll('.tile').forEach(t=>t.classList.toggle('on',pickSel.includes(t._k))); $('pickCount').textContent=pickSel.length+'/'+need; };
  if(!pk.hidden){ av.forEach(k=>{ const t=document.createElement('button'); t.type='button'; t.className='tile'; t._k=k; t.innerHTML='<canvas></canvas><span>'+SHORT[k]+'</span><em>'+DOGS[k].cost+'</em>';
      t.addEventListener('click',()=>{ S.init(); const at=pickSel.indexOf(k);
        if(at>=0) pickSel.splice(at,1); else if(pickSel.length<need) pickSel.push(k); else { S.err(); nope('pickCount'); }
        pickSel.sort((a,b)=>DOG_ORDER.indexOf(a)-DOG_ORDER.indexOf(b));
        $('pickInfo').textContent=DOGS[k].name+', '+DOGS[k].cost+' косточек. '+DOGS[k].desc; syncPick(); });
      pg.appendChild(t); }); syncPick(); }
  (lv.newDogs||[]).forEach(k=>{ const d=document.createElement('div'); d.className='friend'; d.innerHTML='<canvas></canvas><div><small>Новый друг · '+DOGS[k].cost+' косточек</small><b>'+DOGS[k].name+'</b><span>'+DOGS[k].desc+'</span></div>'; f.appendChild(d); d._k=k; });
  if(lv.newZ){ const z=ZOMB[lv.newZ]; const e=document.createElement('div'); e.className='friend enemy'; e.innerHTML='<canvas></canvas><div><small>'+(lv.boss?'Босс':'Новый враг')+'</small><b>'+z.name+'</b><span>'+z.desc+'</span></div>'; f.appendChild(e); }
  if(lv.note){ const e=document.createElement('div'); e.className='friend enemy'; e.innerHTML='<div><small>Особенность уровня</small><b>'+lv.note.t+'</b><span>'+lv.note.d+'</span></div>'; e._note=1; f.appendChild(e); }
  show('sIntro');
  requestAnimationFrame(()=>{
    $('pickGrid').querySelectorAll('.tile').forEach(t=>paintIcon(t.querySelector('canvas'),t._k,true));
    f.querySelectorAll('.friend').forEach(el=>{ const c=el.querySelector('canvas'); if(!c) return;
      if(el._k) paintIcon(c,el._k,true);
      else { const r=c.getBoundingClientRect(), dd=window.devicePixelRatio||1; c.width=r.width*dd; c.height=r.height*dd; const x=c.getContext('2d'); x.scale(dd,dd);
        const zz={type:lv.newZ,hp:ZOMB[lv.newZ].hp,maxHp:ZOMB[lv.newZ].hp,base:ZOMB[lv.newZ].base,ph:0,flash:0,slowT:0};
        drawZombie(x,zz,r.width/2,r.height*(lv.boss?.62:.5),r.height*(lv.boss?.42:.95),0); } });
  });
}
function win(){
  if(state!=='play') return; state='end';
  const last=G.li===LEVELS.length-1;
  PROG.unlocked=Math.max(PROG.unlocked,Math.min(LEVELS.length,G.li+2)); if(last) PROG.beat=true; saveProg();
  S.stopMusic(true); S.jingle(true);
  for(let i=0;i<30;i++) G.parts.push({x:rand(0,W),y:rand(H*.3,H*.9),vx:rand(-40,40),vy:rand(-260,-100),life:rand(1.2,2.2),max:2.2,color:['#FF6B8B','#F0B945','#fff'][i%3],size:rand(5,9),heart:true,g:120});
  setTimeout(()=>{
    if(last){ $('finalMsg').textContent=FINAL_TEXT; $('finalSig').textContent=SIGNATURE+' ❤'; show('sFinal'); S.startMusic('menu'); }
    else { $('winEyebrow').textContent='Уровень '+(G.li+1)+' пройден'; $('winMsg').textContent=WIN_TEXT[G.li]||''; show('sWin'); }
  },1400);
}
function saveBest(){ const b=PROG.best||{wave:0,kills:0}; const rec=G.wave>b.wave||(G.wave===b.wave&&G.kills>b.kills); if(rec){ PROG.best={wave:G.wave,kills:G.kills}; saveProg(); } return rec; }
function lose(){
  if(state!=='play') return; state='end'; S.stopMusic(true); S.jingle(false); G.shake=.8;
  if(G.endless){ const rec=saveBest(); $('loseEyebrow').textContent=rec?'Новый рекорд!':'Бесконечный режим'; $('loseTitle').textContent='Ты продержалась до волны '+G.wave;
    $('loseMsg').textContent='Собаки прогнали зомби: '+G.kills+'. Рекорд: волна '+PROG.best.wave+', зомби: '+PROG.best.kills+'.'; }
  else { $('loseEyebrow').textContent='Ой-ой'; $('loseTitle').textContent='Зомби пробрались в дом'; $('loseMsg').textContent='Собаки не обиделись и верят в тебя. Попробуй ещё раз: побольше корги в начале и бульдоги впереди.'; }
  setTimeout(()=>show('sLose'),1100);
}

/* ================== Титульный и финальный фон ================== */
function drawScene(cvs,t,mode){
  if(!cvs._w) return; const c=cvs.getContext('2d'); const w=cvs._w,h=cvs._h; c.setTransform(DPR,0,0,DPR,0,0);
  const sky=c.createLinearGradient(0,0,0,h); if(mode==='final'){ sky.addColorStop(0,'#2A1B3D'); sky.addColorStop(.6,'#6B3A5E'); sky.addColorStop(1,'#D9798A'); } else { sky.addColorStop(0,'#5FB4E8'); sky.addColorStop(.55,'#BFE6F5'); sky.addColorStop(1,'#E8F6D8'); }
  c.fillStyle=sky; c.fillRect(0,0,w,h);
  const gy=h*.66, cw=w/5, ch=cw*.85;
  for(let r=0;r*ch+gy<h;r++) for(let i=0;i<5;i++){ c.fillStyle=(r+i)%2?'#8AD058':'#7AC34A'; c.fillRect(i*cw,gy+r*ch,cw+1,ch+1); }
  if(mode!=='final'){ for(let i=0;i<3;i++){ const cx=((t*12+i*170)%(w+160))-80, cy=h*(.12+i*.07); E(c,cx,cy,40,14,'rgba(255,255,255,.85)'); E(c,cx+22,cy-8,24,14,'rgba(255,255,255,.85)'); } }
  const s=Math.min(cw*1.05,90);
  const dogs=mode==='final'?['corgi','husky','pug','samoyed','dachshund','dalmatian']:['corgi','pug','samoyed','dalmatian','bulldog'];
  const n=dogs.length, step=w/(n+.2);
  if(mode!=='final'){ const zx=w*.84, zy=gy-s*.05+Math.sin(t*2)*4; drawZombie(c,{type:'basic',hp:200,maxHp:200,base:200,ph:0,flash:0,slowT:0,eating:false},zx,zy-s*.15,s*.8,t); c.fillStyle='#E9DCC2'; for(let x=0;x<w;x+=cw/3) rr(c,x+3,gy-s*.32,cw/3-6,s*.34,2,'#EADDC3',1); }
  dogs.forEach((k,i)=>{ const x=step*(i+.6), y=gy+ch*(mode==='final'?.9:1.05)-Math.abs(Math.sin(t*3+i))*s*.12; drawDog(c,k,x,y,s*(mode==='final'?.95:1),{t,ph:i,armed:true,fire:mode==='final'?0:(Math.sin(t*2+i)>.9?1:0)}); });
  if(mode==='final'){ if(!cvs._h2) cvs._h2=Array.from({length:26},()=>({x:Math.random()*w,y:Math.random()*h,s:rand(8,18),v:rand(20,50),p:Math.random()*6}));
    cvs._h2.forEach(p=>{ p.y-=p.v*(1/60); if(p.y<-20){ p.y=h+20; p.x=Math.random()*w; } heart(c,p.x+Math.sin(t+p.p)*10,p.y,p.s,'rgba(255,120,150,.75)'); }); }
}

/* ================== Цикл ================== */
let last=0;
function loop(ts){
  const dt=Math.min(.05,(ts-last)/1000)||0; last=ts;
  if(G&&state==='play'&&!paused){ for(let i=0;i<G.speed;i++) update(dt); hud(); }
  else if(G&&state==='end') updFx(dt);
  if(G&&(state==='play'||state==='end')) render();
  if(!$('sTitle').hidden) drawScene($('titleCv'),ts/1000,'title');
  if(!$('sFinal').hidden) drawScene($('finalCv'),ts/1000,'final');
  requestAnimationFrame(loop);
}
(function boneIcon(){ const c=$('boneIcon').getContext('2d'); drawBone(c,32,32,40,-.5,false); })();
$('titleSub').textContent=HER+', двор в опасности!';
window.addEventListener('resize',()=>{ resize(); if(G&&state==='play') for(const k in cardEls) paintIcon(cardEls[k].querySelector('canvas'),k); });
syncSoundLabels();
resize();
show('sTitle');
if(document.fonts&&document.fonts.ready) document.fonts.ready.then(()=>{ if(G) buildCards(); });
requestAnimationFrame(loop);
