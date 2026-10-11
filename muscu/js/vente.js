// Protocole 5 — page de vente
import { EX, nomCourt, MUSC } from './data.js';
import { EXERCISES } from './exercises3d.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const img = (id) => `img/ex/${id}.webp`;

// bandeau défilant
const names = Object.keys(EX).filter((id) => !EX[id].echauf).map(nomCourt);
$('#mq').innerHTML = [...names, ...names].map((n) => `<span>${n}</span>`).join('');

// vignettes
const T1 = ['squat', 'dc_barre', 'tv_large', 'curl_poulie_uni', 'elev_halteres', 'sdt', 'dips', 'face_pull', 'leg_curl', 'ext_nuque'];
$('#thumbs').innerHTML = T1.map((id) => `<img src="${img(id)}" alt="${EX[id].nom}" loading="lazy" width="400" height="400">`).join('');
$('#thumbs2').innerHTML = ['th_large', 'pec_deck', 'leves_genoux', 'curl_marteau', 'mollets'].map((id) => `<img src="${img(id)}" alt="${EX[id].nom}" loading="lazy" width="400" height="400">`).join('');

// révélations
const io = new IntersectionObserver((ents) => { for (const e of ents) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }, { rootMargin: '0px 0px -8% 0px' });
$$('.rv').forEach((el) => io.observe(el));

// démo : infos
const DEMO = ['dc_barre', 'squat', 'tv_large', 'curl_poulie_uni'];
$('#pick').innerHTML = DEMO.map((id, i) => `<button data-id="${id}" aria-pressed="${i === 0}">${nomCourt(id)}</button>`).join('');
function info(id) {
  const e = EX[id], m = EXERCISES[id].muscles;
  $('#dCat').textContent = `${e.cat} · ${e.mat}`;
  $('#dName').textContent = e.nom;
  $('#dMus').innerHTML = m.p.map((k) => `<li class="chip p dot">${MUSC[k]}</li>`).join('') + m.s.map((k) => `<li class="chip">${MUSC[k]}</li>`).join('');
  $('#dSteps').innerHTML = e.etapes.slice(0, 3).map((s) => `<li>${s}</li>`).join('');
  $$('#pick button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.id === id));
}
info(DEMO[0]);

// 3D (chargée après la page)
let demo = null;
async function boot3d() {
  const { webglOK } = await import('./coach3d.js');
  if (!webglOK()) return;
  const { mountViewer } = await import('./ui3d.js');
  const h = $('#hero3d'), hs = $('img.still', h);
  mountViewer(h, { ids: ['squat', 'dc_barre', 'tv_large', 'curl_poulie_uni', 'elev_halteres', 'sdt', 'face_pull', 'dips', 'leg_ext'], cycle: true, cycleReps: 2, views: false, controls: false });
  setTimeout(() => hs && hs.remove(), 400);
  const d = $('#demo3d');
  const mountDemo = () => {
    if (demo) return;
    const ds = $('img.still', d);
    demo = mountViewer(d, { id: DEMO[0] });
    setTimeout(() => ds && ds.remove(), 400);
  };
  const dio = new IntersectionObserver((e) => { if (e[0].isIntersecting) { mountDemo(); dio.disconnect(); } }, { rootMargin: '300px' });
  dio.observe(d);
}
$('#pick').addEventListener('click', (e) => {
  const b = e.target.closest('[data-id]'); if (!b) return;
  info(b.dataset.id);
  demo && demo.set(b.dataset.id);
});
if (document.readyState === 'complete') setTimeout(() => boot3d().catch(() => {}), 50);
else addEventListener('load', () => setTimeout(() => boot3d().catch(() => {}), 50));

// achat : consentement obligatoire (contenu numérique, art. L221-28)
const buy = $('#buy'), consent = $('#consent');
const sync = () => buy.setAttribute('aria-disabled', !consent.checked);
consent.addEventListener('change', sync); sync();
buy.addEventListener('click', (e) => {
  if (!consent.checked) {
    e.preventDefault();
    const l = consent.closest('label');
    l.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 300 });
    l.style.color = 'var(--tx)';
    consent.focus();
    return;
  }
  if (buy.href.includes('REMPLACER')) { e.preventDefault(); alert('Le lien de paiement Stripe n’est pas encore configuré.'); }
});

// barre d’achat mobile
const sticky = $('#stickyBuy');
let heroOut = false, checkoutIn = false;
const upd = () => sticky.classList.toggle('on', heroOut && !checkoutIn);
new IntersectionObserver((e) => { heroOut = !e[0].isIntersecting; upd(); }).observe($('.buy-row'));
new IntersectionObserver((e) => { checkoutIn = e[0].isIntersecting; upd(); }).observe($('#acheter'));
