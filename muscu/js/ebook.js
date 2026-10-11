// Protocole 5 — interactions de l’ebook
import { EX, PROGRAMME, SEMAINE, ECHAUFFEMENT, GLOSSAIRE, REFS, MUSC, volume, nomCourt } from './data.js';
import { EXERCISES } from './exercises3d.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* stockage indisponible */ } },
};
const img = (id) => `img/ex/${id}.webp`;
const fmt = (n, d = 0) => n.toLocaleString('fr-FR', { maximumFractionDigits: d, minimumFractionDigits: 0 });
const icon = (id) => `<svg><use href="#i-${id}"/></svg>`;
const PDF = 'protocole-5-7k2m9x.pdf';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ───────── thème ─────────
$('#themeBtn').addEventListener('click', () => {
  const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const next = cur === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('p5.theme', next); } catch { /* */ }
});

// ───────── sommaire, progression ─────────
const sections = $$('main > section[data-title]');
function tocHTML() {
  return `<nav>${sections.map((s) => {
    const n = $('.num', s)?.textContent || '—';
    return `<a href="#${s.id}" data-s="${s.id}"><span>${n}</span>${s.dataset.title}</a>`;
  }).join('')}</nav>
  <a class="btn btn-ghost btn-sm pdf" href="${PDF}" download>${icon('down')}Version PDF</a>`;
}
$('#toc').innerHTML = tocHTML();
$('#tocM').innerHTML = tocHTML();
const drawer = $('#drawer');
const openDrawer = (o) => { drawer.classList.toggle('open', o); drawer.setAttribute('aria-hidden', !o); };
$('#menuBtn').addEventListener('click', () => openDrawer(true));
drawer.addEventListener('click', (e) => { if (e.target.closest('[data-close], a')) openDrawer(false); });

const cur = $('#cur');
const secIO = new IntersectionObserver((ents) => {
  for (const en of ents) if (en.isIntersecting) {
    const s = en.target;
    $$('.toc a[data-s]').forEach((a) => a.classList.toggle('on', a.dataset.s === s.id));
    const n = $('.num', s)?.textContent;
    cur.innerHTML = n ? `<b>${n}</b> · ${s.dataset.title}` : '';
  }
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach((s) => secIO.observe(s));
const bar = $('#bar');
let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    ticking = false;
  });
}, { passive: true });

if (/bienvenue|session_id/.test(location.search)) $('#welcome').classList.add('show');

// ───────── révélations + compteurs ─────────
const rvIO = new IntersectionObserver((ents) => {
  for (const en of ents) if (en.isIntersecting) { en.target.classList.add('in'); rvIO.unobserve(en.target); }
}, { rootMargin: '0px 0px -8% 0px' });
function observeRv(root = document) { $$('.rv:not(.in), .vol', root).forEach((el) => rvIO.observe(el)); }

function countUp() {
  $$('[data-count]').forEach((el) => {
    const to = +el.dataset.count; if (reduced) { el.textContent = to; return; }
    const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / 1100); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
}

// ───────── héros 3D ─────────
async function hero() {
  const el = $('#hero');
  const { webglOK } = await import('./coach3d.js');
  if (!webglOK()) return;
  const { mountViewer } = await import('./ui3d.js');
  const still = $('img.still', el);
  mountViewer(el, { ids: ['squat', 'dc_barre', 'tv_large', 'curl_poulie_uni', 'elev_halteres', 'sdt', 'face_pull', 'dips'], cycle: true, cycleReps: 2, views: false, controls: false });
  setTimeout(() => still && still.remove(), 400);
}

// ───────── fiche exercice (modale) ─────────
const modal = $('#modal');
let viewer = null, ctx = [], ctxI = 0, lastFocus = null, prescMap = {};
function musclesHTML(id) {
  const m = EXERCISES[id]?.muscles || { p: [], s: [] };
  return `<ul class="chips">${m.p.map((k) => `<li class="chip p dot">${MUSC[k]}</li>`).join('')}${m.s.map((k) => `<li class="chip">${MUSC[k]}</li>`).join('')}</ul>`;
}
function bodyHTML(id) {
  const e = EX[id], p = prescMap[id];
  const prev = ctx.length > 1 ? ctx[(ctxI - 1 + ctx.length) % ctx.length] : null;
  const next = ctx.length > 1 ? ctx[(ctxI + 1) % ctx.length] : null;
  return `<span class="eyebrow">${e.cat} · ${e.mat}</span>
    <h2 id="mTitle">${e.nom}</h2>
    ${p ? `<div class="presc"><span><b>${p.s} × ${p.reps}</b> répétitions</span><span>RIR <b>${p.rir.join(' · ')}</b></span><span>Repos <b>${p.repos}</b></span></div>` : ''}
    <p>${e.pourquoi}</p>
    <h4>Muscles ciblés</h4>${musclesHTML(id)}
    <h4>Exécution</h4><ol class="steps">${e.etapes.map((s) => `<li>${s}</li>`).join('')}</ol>
    <h4>Erreurs à éviter</h4><ul class="list x">${e.erreurs.map((s) => `<li>${s}</li>`).join('')}</ul>
    <div class="callout tip"><svg><use href="#i-bolt"/></svg><div><b>Conseil</b><p>${e.conseil}</p></div></div>
    ${e.variantes.length ? `<h4>Variantes si la machine est prise</h4><ul class="chips">${e.variantes.map((v) => `<li class="chip">${v}</li>`).join('')}</ul>` : ''}
    ${ctx.length > 1 ? `<div class="nav"><button class="btn btn-ghost btn-sm" data-go="${prev}">${icon('left')}${nomCourt(prev)}</button><button class="btn btn-ghost btn-sm" data-go="${next}">${nomCourt(next)}${icon('right')}</button></div>` : ''}`;
}
async function openEx(id, list, presc) {
  if (!EX[id]) return;
  if (list) { ctx = list; prescMap = presc || {}; }
  ctxI = Math.max(0, ctx.indexOf(id)); if (!ctx.includes(id)) { ctx = [id]; ctxI = 0; prescMap = presc || {}; }
  $('#mBody').innerHTML = bodyHTML(id);
  $('#mBody').scrollTop = 0;
  if (!modal.classList.contains('open')) {
    lastFocus = document.activeElement;
    modal.classList.add('open'); document.body.style.overflow = 'hidden';
    $('.close', modal).focus({ preventScroll: true });
  }
  if (!viewer) {
    const { mountViewer } = await import('./ui3d.js');
    viewer = mountViewer($('#mStage'), { id }) || { set() {}, stage: { start() {}, stop() {} } };
  } else viewer.set(id);
  viewer.stage.start();
}
function closeEx() {
  modal.classList.remove('open'); document.body.style.overflow = '';
  viewer && viewer.stage.stop();
  lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
}
modal.addEventListener('click', (e) => {
  if (e.target.closest('[data-close]')) return closeEx();
  const g = e.target.closest('[data-go]'); if (g) openEx(g.dataset.go);
});
addEventListener('keydown', (e) => {
  if (!modal.classList.contains('open')) { if (e.key === 'Escape') openDrawer(false); return; }
  if (e.key === 'Escape') closeEx();
  if (e.key === 'ArrowRight' && ctx.length > 1 && !e.target.closest('input')) openEx(ctx[(ctxI + 1) % ctx.length]);
  if (e.key === 'ArrowLeft' && ctx.length > 1 && !e.target.closest('input')) openEx(ctx[(ctxI - 1 + ctx.length) % ctx.length]);
});
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-open], .exl');
  if (!b || b.closest('#modal')) return;
  const id = b.dataset.open || b.dataset.ex;
  const day = b.closest('.day-panel');
  if (day) {
    const d = PROGRAMME.find((x) => x.id === day.dataset.day);
    const ids = [...new Set(d.ex.map((x) => x.id))];
    openEx(id, ids, Object.fromEntries(d.ex.map((x) => [x.id, x])));
  } else if (b.closest('#lib')) {
    openEx(id, $$('#lib .lc').map((c) => c.dataset.open));
  } else openEx(id, [id]);
});

// ───────── programme + carnet ─────────
const journal = store.get('p5.journal', []);
const draft = store.get('p5.draft', {});
function lastPerf(id) {
  for (let i = journal.length - 1; i >= 0; i--) {
    const x = journal[i].ex.find((e) => e.id === id && e.sets.some((s) => s.kg || s.reps));
    if (x) return { date: journal[i].date, sets: x.sets };
  }
  return null;
}
const restSec = (r) => { const m = /(\d+)\s*min(?:\s*(\d+))?/.exec(r.replace(/.*→\s*/, '')); const s = /^(\d+)\s*s$/.exec(r.trim()); return m ? (+m[1] * 60 + (+m[2] || 0)) : s ? +s[1] : 90; };
function lastLabel(id) {
  const l = lastPerf(id);
  if (!l) return 'Pas encore de séance notée';
  const d = new Date(l.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  const kg = l.sets.find((s) => s.kg)?.kg;
  return `Dernière fois (${d}) : ${kg ? kg + ' kg × ' : ''}${l.sets.filter((s) => s.reps).map((s) => s.reps).join(' · ')}`;
}
function rowHTML(day, x, k, n) {
  const e = EX[x.id], l = lastPerf(x.id), dr = draft[k] || [];
  const rows = Array.from({ length: x.s }, (_, i) => {
    const ph = l?.sets[i] || l?.sets[l.sets.length - 1] || {};
    const v = dr[i] || {};
    return `<tr data-i="${i}" class="${v.done ? 'on' : ''}"><td class="n">${i + 1}</td><td class="tg">${x.reps} · RIR ${x.rir[i] ?? x.rir[x.rir.length - 1]}</td>
      <td><input class="inp" data-f="kg" inputmode="decimal" placeholder="${ph.kg || 'kg'}" value="${v.kg || ''}" aria-label="Charge série ${i + 1} (kg)"></td>
      <td><input class="inp" data-f="reps" inputmode="numeric" placeholder="${ph.reps || 'reps'}" value="${v.reps || ''}" aria-label="Répétitions série ${i + 1}"></td>
      <td><button class="ok" aria-label="Série ${i + 1} terminée, lancer le repos">${icon('check')}</button></td></tr>`;
  }).join('');
  return `<div class="xr" data-k="${k}" data-id="${x.id}" data-rest="${restSec(x.repos)}">
    <div class="main">
      <span class="ix ${x.ss ? 'ss' : ''}">${x.ss || n}</span>
      <button class="th" data-open="${x.id}" aria-label="Voir ${e.nom} en 3D"><img src="${img(x.id)}" alt="" loading="lazy" width="120" height="120"></button>
      <div><button class="nm" data-open="${x.id}">${nomCourt(x.id)}</button>
        <div class="sub"><span>${icon('clock')}${x.repos}</span>${x.ech ? '<span class="tag">Échauffement</span>' : ''}</div></div>
      <div class="pr"><b>${x.s} × ${x.reps}</b><div class="rir" title="RIR visé à chaque série">${x.rir.map((r) => `<i class="${r.startsWith('0') ? 'z' : ''}">${r}</i>`).join('')}</div></div>
    </div>
    <div class="tog"><span class="last">${lastLabel(x.id)}</span><button data-log aria-expanded="false">Noter mes séries</button></div>
    <div class="log"><table><thead><tr><th>#</th><th>Objectif</th><th>kg</th><th>Reps</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
  </div>`;
}
function dayHTML(d) {
  let html = '', n = 0, i = 0;
  while (i < d.ex.length) {
    const x = d.ex[i];
    if (x.ss) {
      const L = x.ss[0], grp = [];
      while (i < d.ex.length && d.ex[i].ss && d.ex[i].ss[0] === L) { grp.push([d.ex[i], i]); i++; }
      n++;
      html += `<div class="ssg"><div class="lbl">${icon('fire').replace('<svg>', '<svg style="width:14px;height:14px">')}Superset ${L} · alterne les ${grp.length} exercices</div>${grp.map(([g, gi]) => rowHTML(d, g, `${d.id}-${gi}`, n)).join('')}</div>`;
    } else { n++; html += rowHTML(d, x, `${d.id}-${i}`, n); i++; }
  }
  const wu = d.echauf === 'jambes' ? 'jambes' : 'haut du corps';
  return `<div class="day-panel" data-day="${d.id}" role="tabpanel" id="panel-${d.id}">
    <div class="day-head"><div><span class="eyebrow">${d.jour} · ≈ ${d.duree}</span><h3>${d.titre}</h3><p class="muted" style="margin:.3rem 0 0">${d.focus}</p></div>
      <div class="meta"><a class="chip" href="#echauffement">${icon('fire').replace('<svg>', '<svg style="width:13px;height:13px">')}Échauffement ${wu}</a><span class="chip">Tempo 2-0-X</span></div></div>
    <div class="xl">${html}</div>
    <div class="day-foot noprint"><span class="muted" style="font-size:.85rem">Tes données restent sur cet appareil.</span>
      <div class="row" style="gap:.5rem"><button class="btn btn-ghost btn-sm" data-hist>Historique</button><button class="btn btn-sm" data-save="${d.id}">${icon('check')}Enregistrer la séance</button></div></div>
  </div>`;
}
function renderProgram(active) {
  $('#week').innerHTML = SEMAINE.map((w) => {
    if (!w.s) return `<button class="rest" disabled aria-disabled="true"><b>${w.j}</b><span>Repos</span></button>`;
    const d = PROGRAMME.find((p) => p.id === w.s);
    return `<button role="tab" data-day="${d.id}" aria-controls="panel-${d.id}" aria-selected="${d.id === active}"><b>${w.j}</b><span>${d.jour.replace('Jour ', 'J')} · ${d.titre.split(' · ')[0].replace('Haut du corps', 'Haut').replace('Bas du corps', 'Bas')}</span></button>`;
  }).join('');
  $('#days').innerHTML = PROGRAMME.map(dayHTML).join('');
  selectDay(active);
}
function selectDay(id) {
  $$('#week [data-day]').forEach((b) => b.setAttribute('aria-selected', b.dataset.day === id));
  $$('.day-panel').forEach((p) => { p.hidden = p.dataset.day !== id; });
  store.set('p5.day', id);
}
$('#week').addEventListener('click', (e) => { const b = e.target.closest('[data-day]'); if (b) selectDay(b.dataset.day); });
$('#days').addEventListener('click', (e) => {
  const t = e.target;
  const lg = t.closest('[data-log]');
  if (lg) { const r = lg.closest('.xr'); const o = r.classList.toggle('open'); lg.setAttribute('aria-expanded', o); lg.textContent = o ? 'Masquer' : 'Noter mes séries'; return; }
  const ok = t.closest('.ok');
  if (ok) {
    const tr = ok.closest('tr'), r = ok.closest('.xr');
    const on = !tr.classList.contains('on');
    tr.classList.toggle('on', on);
    if (on) {
      $$('input', tr).forEach((inp) => { if (!inp.value && /\d/.test(inp.placeholder)) inp.value = inp.placeholder; });
      const last = +tr.dataset.i === $$('tbody tr', r).length - 1;
      timer.start(+r.dataset.rest, last ? 'Exercice suivant' : `Série ${+tr.dataset.i + 2}`);
    }
    r.classList.toggle('done', $$('tbody tr', r).every((x) => x.classList.contains('on')));
    saveDraft(r);
    return;
  }
  if (t.closest('[data-save]')) return saveSession(t.closest('[data-save]').dataset.save);
  if (t.closest('[data-hist]')) return openHistory();
});
$('#days').addEventListener('input', (e) => { const r = e.target.closest('.xr'); if (r) saveDraft(r); });
function saveDraft(r) {
  draft[r.dataset.k] = $$('tbody tr', r).map((tr) => ({ kg: $('[data-f=kg]', tr).value.trim(), reps: $('[data-f=reps]', tr).value.trim(), done: tr.classList.contains('on') }));
  store.set('p5.draft', draft);
}
function saveSession(dayId) {
  const d = PROGRAMME.find((x) => x.id === dayId);
  const ex = [];
  d.ex.forEach((x, i) => {
    const k = `${d.id}-${i}`, sets = (draft[k] || []).filter((s) => s.kg || s.reps).map((s) => ({ kg: s.kg.replace(',', '.'), reps: s.reps }));
    if (sets.length) ex.push({ id: x.id, sets });
  });
  if (!ex.length) return toast('Note au moins une série avant d’enregistrer.');
  journal.push({ date: new Date().toISOString(), day: d.id, ex });
  store.set('p5.journal', journal);
  d.ex.forEach((x, i) => delete draft[`${d.id}-${i}`]);
  store.set('p5.draft', draft);
  renderProgram(d.id);
  toast('Séance enregistrée. Bravo, à la prochaine !');
}

// historique
const hist = document.createElement('div');
hist.className = 'modal'; hist.id = 'hist';
hist.innerHTML = `<div class="scrim" data-hclose></div><div class="sheet" style="grid-template-columns:1fr;max-width:640px"><div class="body" id="hBody"></div><button class="icon-btn close" data-hclose aria-label="Fermer">${icon('x')}</button></div>`;
document.body.appendChild(hist);
function openHistory() {
  const items = [...journal].reverse();
  $('#hBody').innerHTML = `<span class="eyebrow">Carnet d’entraînement</span><h2 style="margin:.4rem 0 1rem">Historique</h2>
    ${items.length ? items.map((s) => {
      const d = PROGRAMME.find((p) => p.id === s.day);
      return `<div class="card" style="margin-bottom:.7rem;padding:1rem 1.1rem"><b>${new Date(s.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</b> <span class="muted">· ${d ? d.jour + ' — ' + d.titre : ''}</span>
      <ul class="list" style="margin:.6rem 0 0">${s.ex.map((x) => `<li>${nomCourt(x.id)} : ${x.sets.map((z) => (z.kg ? z.kg + ' kg × ' : '') + (z.reps || '?')).join(' · ')}</li>`).join('')}</ul></div>`;
    }).join('') : '<p>Aucune séance enregistrée pour l’instant. Note tes séries dans le programme puis touche « Enregistrer la séance ».</p>'}
    <div class="row" style="margin-top:1.2rem">${items.length ? `<button class="btn btn-sm" id="csv">${icon('down')}Exporter (CSV)</button><button class="btn btn-ghost btn-sm" id="wipe">Tout effacer</button>` : ''}</div>`;
  hist.classList.add('open'); document.body.style.overflow = 'hidden';
}
hist.addEventListener('click', (e) => {
  if (e.target.closest('[data-hclose]')) { hist.classList.remove('open'); document.body.style.overflow = ''; }
  if (e.target.closest('#csv')) {
    const lines = [['date', 'seance', 'exercice', 'serie', 'kg', 'reps']];
    journal.forEach((s) => s.ex.forEach((x) => x.sets.forEach((z, i) => lines.push([s.date.slice(0, 10), s.day, EX[x.id].nom, i + 1, z.kg, z.reps]))));
    const blob = new Blob(['﻿' + lines.map((l) => l.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(';')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'protocole5-carnet.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  if (e.target.closest('#wipe') && confirm('Effacer définitivement tout ton historique ?')) {
    journal.length = 0; store.set('p5.journal', journal); renderProgram(store.get('p5.day', 'j1')); openHistory();
  }
});

// toast
const toastEl = document.createElement('div');
toastEl.style.cssText = 'position:fixed;left:50%;top:76px;transform:translate(-50%,-20px);opacity:0;z-index:90;background:var(--tx);color:var(--bg);padding:.7rem 1.1rem;border-radius:12px;font-weight:600;font-size:.9rem;transition:.3s;pointer-events:none;max-width:90vw;text-align:center';
document.body.appendChild(toastEl);
let toastT;
function toast(msg) { toastEl.textContent = msg; toastEl.style.opacity = 1; toastEl.style.transform = 'translate(-50%,0)'; clearTimeout(toastT); toastT = setTimeout(() => { toastEl.style.opacity = 0; toastEl.style.transform = 'translate(-50%,-20px)'; }, 2600); }

// ───────── minuteur de repos ─────────
const timer = (() => {
  const el = $('#timer'), val = $('#tVal'), lbl = $('#tLbl'), ring = $('#tRing');
  let end = 0, total = 0, raf = 0, ac = null, hideT = 0;
  const C = 100.5;
  function beep() {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.22, 0.44].forEach((t, i) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.frequency.value = i === 2 ? 1175 : 880; o.type = 'sine';
        g.gain.setValueAtTime(0.0001, ac.currentTime + t); g.gain.exponentialRampToValueAtTime(0.25, ac.currentTime + t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + t + 0.18);
        o.connect(g).connect(ac.destination); o.start(ac.currentTime + t); o.stop(ac.currentTime + t + 0.2);
      });
    } catch { /* audio indisponible */ }
    navigator.vibrate && navigator.vibrate([180, 90, 180]);
  }
  function tick() {
    const rem = Math.max(0, end - Date.now());
    const s = Math.ceil(rem / 1000);
    val.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    ring.style.strokeDashoffset = C * (1 - rem / (total * 1000));
    if (rem <= 0) { el.classList.add('end'); val.textContent = 'Go !'; beep(); hideT = setTimeout(stop, 5000); return; }
    raf = requestAnimationFrame(tick);
  }
  function start(sec, next) {
    try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); } catch { /* */ }
    cancelAnimationFrame(raf); clearTimeout(hideT);
    total = sec; end = Date.now() + sec * 1000;
    lbl.textContent = `Repos · ensuite : ${next}`;
    el.classList.remove('end'); el.classList.add('on'); tick();
  }
  function stop() { cancelAnimationFrame(raf); clearTimeout(hideT); el.classList.remove('on', 'end'); }
  $('#tAdd').addEventListener('click', () => { if (el.classList.contains('end')) { el.classList.remove('end'); clearTimeout(hideT); end = Date.now(); total = 0; } end += 30000; total += 30; cancelAnimationFrame(raf); tick(); });
  $('#tStop').addEventListener('click', stop);
  return { start, stop };
})();

// ───────── échauffement ─────────
function wuTable(rows) {
  return `<thead><tr><th>Exercice</th><th>Séries</th><th>Reps / temps</th><th>Notes</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r.id ? `<button class="exl" data-ex="${r.id}">${r.ex}</button>` : r.ex}</td><td>${r.series}</td><td>${r.reps}</td><td>${r.note}</td></tr>`).join('')}</tbody>`;
}
$('#wuLegs').innerHTML = wuTable(ECHAUFFEMENT.jambes);
$('#wuUp').innerHTML = wuTable(ECHAUFFEMENT.haut);
const r25 = (x) => Math.round(x / 2.5) * 2.5;
function wu() {
  const w = parseFloat(String($('#wuIn').value).replace(',', '.'));
  const out = $('#wuOut');
  if (!(w > 0)) { out.innerHTML = ''; return; }
  const sets = w >= 60 ? [[r25(w * 0.5), 6], [r25(w * 0.75), 3]] : [[Math.max(1, Math.round(w * 0.5)), 8]];
  out.innerHTML = sets.map(([kg, r], i) => `<div class="big"><div class="k">ÉCHAUFFEMENT ${i + 1}</div><div class="v">${fmt(kg, 1)} kg × ${r}</div><div class="s">puis 1 min de repos</div></div>`).join('')
    + `<div class="big acc"><div class="k">SÉRIES DE TRAVAIL</div><div class="v">${fmt(w, 1)} kg</div><div class="s">comme indiqué dans le programme</div></div>`;
}
$('#wuIn').addEventListener('input', wu); wu();

// ───────── notation ─────────
function notation() {
  const toks = $('#notIn').value.split(/[\s,;-]+/).filter(Boolean).slice(0, 8);
  $('#notOut').innerHTML = toks.map((t, i) => {
    const m = /^(\d+)\s*@\s*(\d+)(\+p)?$/i.exec(t);
    if (!m) return `<div class="set"><small>Série ${i + 1}</small><b>?</b><em>format : reps@RIR</em></div>`;
    const r = +m[2];
    return `<div class="set"><small>Série ${i + 1}</small><b>${m[1]} reps</b><em>${r === 0 ? 'jusqu’à l’échec' : `RIR ${r} · ${r} de plus possible${r > 1 ? 's' : ''}`}${m[3] ? ' + partielles' : ''}</em></div>`;
  }).join('');
}
$('#notIn').addEventListener('input', notation); notation();

// ───────── RIR ─────────
const RIRTXT = [
  '<strong>0 RIR, l’échec :</strong> tu fais les 12 répétitions et la 13ᵉ est impossible. Très efficace, mais très fatigant : réservé à la dernière série.',
  '<strong>1 RIR :</strong> tu t’arrêtes à 11, il ne restait qu’une répétition. Très dur, très efficace.',
  '<strong>2 RIR :</strong> tu t’arrêtes à 10. La zone idéale pour la plupart de tes séries : presque autant de gains que l’échec, beaucoup moins de fatigue.',
  '<strong>3 RIR :</strong> tu t’arrêtes à 9. Un peu trop loin de l’échec pour que la série soit pleinement efficace.',
  '<strong>4 RIR :</strong> tu t’arrêtes à 8. Trop facile pour faire grossir le muscle : c’est l’intensité d’une semaine de deload.',
  '<strong>5 RIR :</strong> tu t’arrêtes à 7. C’est une série d’échauffement, pas une série de travail.',
];
function rir() {
  const r = +$('#rirIn').value;
  $('#rirReps').innerHTML = Array.from({ length: 12 }, (_, i) => `<i class="${i >= 12 - r ? 'res' : ''}">${i + 1}</i>`).join('');
  $('#rirOut').innerHTML = RIRTXT[r];
}
$('#rirIn').addEventListener('input', rir); rir();

// ───────── volume ─────────
(function () {
  const v = volume(), max = Math.max(24, ...Object.values(v).map((x) => x.d + x.i));
  $('#vol').innerHTML = Object.entries(v).map(([g, x]) => `<div class="vrow"><span class="n">${g}</span>
    <div class="t" role="img" aria-label="${g} : ${x.d} séries directes, ${x.i} indirectes">
      <span class="band" style="left:${10 / max * 100}%;width:${10 / max * 100}%"></span>
      <span class="d" style="width:${x.d / max * 100}%"></span>
      <span class="i" style="left:${x.d / max * 100}%;width:${x.i / max * 100}%"></span></div>
    <span class="v"><b>${x.d}</b>${x.i ? ` + ${x.i}` : ''}</span></div>`).join('');
})();

// ───────── bibliothèque ─────────
const CATS = ['Tous', 'Pectoraux', 'Dos', 'Épaules', 'Bras', 'Jambes', 'Abdos', 'Échauffement'];
function lib(cat) {
  const ids = Object.keys(EX).filter((id) => cat === 'Tous' || EX[id].cat === cat);
  $('#lib').innerHTML = ids.map((id) => `<button class="lc" data-open="${id}"><div class="im"><img src="${img(id)}" alt="" loading="lazy" width="400" height="400"></div><div class="tx"><b>${nomCourt(id)}</b><small>${EX[id].cat} · ${EX[id].mat}</small></div></button>`).join('');
  $$('#filters button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.c === cat));
}
$('#filters').innerHTML = CATS.map((c) => `<button data-c="${c}" aria-pressed="false">${c}</button>`).join('');
$('#filters').addEventListener('click', (e) => { const b = e.target.closest('[data-c]'); if (b) lib(b.dataset.c); });
lib('Tous');

// ───────── nutrition ─────────
let obj = 'recompo';
function nutri() {
  const w = parseFloat(String($('#nPoids').value).replace(',', '.'));
  if (!(w >= 30 && w <= 250)) { $('#nOut').innerHTML = '<p class="muted">Entre un poids entre 30 et 250 kg.</p>'; $('#nNote').textContent = ''; return; }
  const m = Math.round(w * 33 / 10) * 10;
  const rng = { recompo: [m - 200, m - 200], seche: [m - 500, m - 300], pdm: [m + 200, m + 500] }[obj];
  const mid = (rng[0] + rng[1]) / 2;
  const pLo = Math.round(w * (obj === 'seche' ? 1.8 : 1.6)), pHi = Math.round(w * 2.2), pMid = (pLo + pHi) / 2;
  const lip = Math.round(w * 0.9), lipMin = Math.round(w * 0.5);
  const carbs = Math.max(0, Math.round((mid - pMid * 4 - lip * 9) / 4));
  const kc = rng[0] === rng[1] ? `${fmt(rng[0])}` : `${fmt(rng[0])}–${fmt(rng[1])}`;
  $('#nOut').innerHTML = `
    <div class="big"><div class="k">MAINTENANCE ESTIMÉE</div><div class="v">${fmt(m)} kcal</div><div class="s">${fmt(w, 1)} kg × 33</div></div>
    <div class="big acc"><div class="k">TES CALORIES / JOUR</div><div class="v">${kc} kcal</div><div class="s">${{ recompo: '−200 kcal', seche: '−300 à −500 kcal', pdm: '+200 à +500 kcal' }[obj]}</div></div>
    <div class="big"><div class="k">PROTÉINES</div><div class="v">${pLo}–${pHi} g</div><div class="s">${obj === 'seche' ? '1,8' : '1,6'} à 2,2 g/kg</div></div>
    <div class="big"><div class="k">LIPIDES</div><div class="v">≈ ${lip} g</div><div class="s">minimum ${lipMin} g (0,5 g/kg)</div></div>
    <div class="big"><div class="k">GLUCIDES</div><div class="v">≈ ${carbs} g</div><div class="s">le reste des calories</div></div>
    <div class="big"><div class="k">AVANT / APRÈS SÉANCE</div><div class="v">${Math.round(w * 0.5)} g + ${Math.round(w)} g</div><div class="s">protéines + glucides</div></div>`;
  $('#nNote').innerHTML = {
    recompo: 'Ton poids doit rester à peu près stable : ce sont ton tour de taille et tes charges qui doivent évoluer.',
    seche: `Objectif : perdre environ <strong>${fmt(w * 0.005, 1)} à ${fmt(w * 0.01, 1)} kg par semaine</strong> (0,5 à 1 % de ton poids). Ajuste de 100 kcal selon ta balance.`,
    pdm: 'Prends du poids lentement. Si ta balance ne bouge pas après 2 semaines, ajoute 100 kcal ; si tu prends trop vite, retire-les.',
  }[obj];
}
$('#nPoids').addEventListener('input', nutri);
$('#nObj').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (!b) return; obj = b.dataset.v; $$('#nObj button').forEach((x) => x.setAttribute('aria-pressed', x === b)); nutri(); });
nutri();

// caféine
function caf() {
  const w = parseFloat(String($('#cafIn').value).replace(',', '.'));
  if (!(w >= 30 && w <= 250)) { $('#cafOut').textContent = '—'; $('#cafTh').textContent = ''; return; }
  const lo = Math.round(w * 1), hi = Math.min(400, Math.round(w * 3));
  $('#cafOut').textContent = `${lo}–${hi} mg`;
  $('#cafTh').textContent = `Avec de la théanine : ${Math.min(400, lo * 2)}–${Math.min(400, hi * 2)} mg. Commence par le bas de la fourchette.`;
}
$('#cafIn').addEventListener('input', caf); caf();

// ───────── glossaire + références ─────────
$('#glo').innerHTML = GLOSSAIRE.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('');
$('#refs').innerHTML = Object.entries(REFS).map(([cat, list], i) => `<details class="refs"${i === 0 ? ' open' : ''}><summary>${cat} · ${list.length} références</summary><ol>${list.map(([t, doi]) => `<li>${t} <a href="https://doi.org/${doi}" target="_blank" rel="noopener">doi:${doi}</a></li>`).join('')}</ol></details>`).join('');

// ───────── démarrage ─────────
renderProgram(store.get('p5.day', 'j1'));
observeRv();
countUp();
const startHero = () => hero().catch(() => { /* la 3D reste optionnelle */ });
if (!/[?&]print/.test(location.search)) {
  if (document.readyState === 'complete') setTimeout(startHero, 50); else addEventListener('load', () => setTimeout(startHero, 50));
}
// impression : tout déplier
addEventListener('beforeprint', () => { $$('.day-panel').forEach((p) => { p.hidden = false; }); $$('details.refs').forEach((d) => { d.open = true; }); $$('.rv').forEach((r) => r.classList.add('in')); });
addEventListener('afterprint', () => selectDay(store.get('p5.day', 'j1')));
