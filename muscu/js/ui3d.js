// Protocole 5 — interface des visionneuses 3D (phase, vues, lecture, vitesse, cycle)
import { Stage, webglOK } from './coach3d.js';
import { EX, nomCourt } from './data.js';

const I = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l10.5-6.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6.5" y="5" width="4" height="14" rx="1"/><rect x="13.5" y="5" width="4" height="14" rx="1"/></svg>',
  drag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M7 9l-3 3 3 3M17 9l3 3-3 3"/></svg>',
};

function phaseLabel(ph, ex) {
  const tp = ex.tempo, conc = tp.conc || 'go';
  if (ph.name === 'go' || ph.name === 'back') {
    const dur = tp[ph.name];
    if (ph.name === conc) return { cls: 'conc', txt: dur <= 1.1 ? 'Concentrique · explosif' : `Concentrique · ${dur} s` };
    return { cls: 'ecc', txt: `Excentrique · ${dur} s` };
  }
  const dur = ph.name === 'hold1' ? tp.hold1 : tp.hold0;
  if (!dur || dur < 0.35) return null;
  const afterConc = (ph.name === 'hold1' && conc === 'go') || (ph.name === 'hold0' && conc === 'back');
  if (afterConc) return conc === 'go' ? { cls: 'conc', txt: 'Contraction' } : { cls: '', txt: 'Position de départ' };
  return { cls: '', txt: 'Étirement' };
}

export function mountViewer(el, opt = {}) {
  el.classList.add('stage');
  if (!webglOK()) {
    el.innerHTML = '<div class="noweb">La 3D n’est pas disponible sur cet appareil.<br>Les consignes écrites restent valables.</div>';
    return null;
  }
  const ui = document.createElement('div');
  ui.innerHTML = `
    <div class="ui tl"><span class="phase"><i></i><span class="pt">Prêt</span></span></div>
    ${opt.views === false ? '' : `<div class="ui tr" role="group" aria-label="Angle de vue">
      <button class="vbtn" data-v="34" aria-pressed="true">3/4</button>
      <button class="vbtn" data-v="face" aria-pressed="false">Face</button>
      <button class="vbtn" data-v="profil" aria-pressed="false">Profil</button></div>`}
    <div class="ui bl">${opt.cycle ? '<span class="cyc-name"></span>' : `<span class="hint">${I.drag}Glisse pour tourner</span>`}</div>
    ${opt.controls === false ? '' : `<div class="ui br">
      <button class="vbtn spd" title="Vitesse" aria-label="Vitesse de l’animation">1×</button>
      <button class="vbtn pp" title="Lecture / pause" aria-label="Pause">${I.pause}</button></div>`}`;
  while (ui.firstChild) el.appendChild(ui.firstChild);
  const phase = el.querySelector('.phase'), pt = el.querySelector('.pt');
  const ids = opt.ids || [opt.id];
  let idx = 0, reps = 0;
  const stage = new Stage(el, {
    interactive: opt.interactive !== false,
    autoRotate: !!opt.autoRotate,
    onPhase: (ph, ex) => {
      const l = phaseLabel(ph, ex);
      if (l) { phase.className = 'phase ' + l.cls; pt.textContent = l.txt; }
      if (opt.cycle && ph.name === 'go' && ph.rep > 0 && ph.rep !== reps) {
        reps = ph.rep;
        if (reps % (opt.cycleReps || 2) === 0) next();
      }
    },
  });
  // le canvas doit rester sous les contrôles
  el.insertBefore(stage.renderer.domElement, el.firstChild);
  const nameEl = el.querySelector('.cyc-name');
  function show(id) {
    stage.setExercise(id);
    el.querySelectorAll('.vbtn[data-v]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === '34'));
    if (nameEl) { nameEl.classList.remove('in'); void nameEl.offsetWidth; nameEl.textContent = nomCourt(id); nameEl.classList.add('in'); }
    opt.onChange && opt.onChange(id);
  }
  function next() { idx = (idx + 1) % ids.length; reps = 0; show(ids[idx]); }
  el.addEventListener('click', (e) => {
    const v = e.target.closest('.vbtn[data-v]');
    if (v) { stage.setView(v.dataset.v); el.querySelectorAll('.vbtn[data-v]').forEach((b) => b.setAttribute('aria-pressed', b === v)); return; }
    if (e.target.closest('.pp')) {
      const b = el.querySelector('.pp');
      if (stage.playing) { stage.pause(); b.innerHTML = I.play; b.setAttribute('aria-label', 'Lecture'); }
      else { stage.play(); b.innerHTML = I.pause; b.setAttribute('aria-label', 'Pause'); }
      return;
    }
    if (e.target.closest('.spd')) {
      const b = el.querySelector('.spd');
      const s = stage.speed === 1 ? 0.5 : stage.speed === 0.5 ? 0.25 : 1;
      stage.setSpeed(s); b.textContent = (s === 1 ? '1' : s === 0.5 ? '½' : '¼') + '×';
    }
  });
  show(ids[0]);
  stage.start();
  return {
    stage,
    set(id) { idx = Math.max(0, ids.indexOf(id)); show(id); stage.play(); const b = el.querySelector('.pp'); if (b) b.innerHTML = I.pause; },
    dispose() { stage.dispose(); },
  };
}

export { EX };
