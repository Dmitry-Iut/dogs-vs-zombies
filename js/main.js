/* ================== Цикл ================== */
let last = 0;
function loop(ts) {
  const dt = Math.min(0.05, (ts - last) / 1000) || 0;
  last = ts;
  if (G && state === "play" && !paused) {
    for (let i = 0; i < G.speed; i++) update(dt);
    hud();
  } else if (G && state === "end") updFx(dt);
  if (G && (state === "play" || state === "end")) render();
  if (!$("sTitle").hidden) drawScene($("titleCv"), ts / 1000, "title");
  if (!$("sFinal").hidden) drawScene($("finalCv"), ts / 1000, "final");
  requestAnimationFrame(loop);
}
(function boneIcon() {
  const c = $("boneIcon").getContext("2d");
  drawBone(c, 32, 32, 40, -0.5, false);
})();
$("titleSub").textContent = HER + ", двор в опасности!";
function onResize() {
  resize();
  if (G && state === "play")
    for (const k in cardEls) paintIcon(cardEls[k].querySelector("canvas"), k);
}
window.addEventListener("resize", onResize);
if (window.ResizeObserver)
  new ResizeObserver(() => {
    const r = cv.parentElement.getBoundingClientRect();
    if (Math.abs(r.width - W) > 0.5 || Math.abs(r.height - H) > 0.5) onResize();
  }).observe(cv.parentElement);
syncSoundLabels();
resize();
show("sTitle");
if (document.fonts && document.fonts.ready)
  document.fonts.ready.then(() => {
    if (G) buildCards();
  });
requestAnimationFrame(loop);
