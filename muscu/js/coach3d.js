// Protocole 5 — moteur 3D des exercices
// Mannequin articulé (cinématique inverse à 2 segments), muscles ciblés en surbrillance,
// matériel de salle généré en code. Aucune ressource externe hormis three.js.
import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';
import { EXERCISES } from './exercises3d.js';

export { EXERCISES };

const D = Math.PI / 180;
const v3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const UP = new THREE.Vector3(0, 1, 0);
const YAXIS = new THREE.Vector3(0, 1, 0);

export const BODY = {
  hipX: 0.095, hipY: -0.06, lumbarY: 0.10, shX: 0.19, shY: 0.36, neckY: 0.395,
  thigh: 0.44, shin: 0.43, upper: 0.29, fore: 0.30, foreMesh: 0.245,
};

export const MUSCLES = {
  pecs: 'Pectoraux', delts_ant: 'Deltoïde antérieur', delts_lat: 'Deltoïde latéral',
  delts_post: 'Deltoïde postérieur', traps: 'Trapèzes', upperback: 'Haut du dos',
  lats: 'Grand dorsal', biceps: 'Biceps', triceps: 'Triceps', forearms: 'Avant-bras',
  abs: 'Abdominaux', obliques: 'Obliques', lowerback: 'Lombaires', glutes: 'Fessiers',
  quads: 'Quadriceps', hams: 'Ischio-jambiers', calves: 'Mollets',
};

// ───────────────────────── maths du squelette ─────────────────────────

function eulerQ(a) {
  return new THREE.Quaternion().setFromEuler(new THREE.Euler((a[0] || 0) * D, (a[1] || 0) * D, (a[2] || 0) * D, 'YXZ'));
}
function anyPerp(d) {
  const p = Math.abs(d.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, 0, 1);
  return p.addScaledVector(d, -p.dot(d)).normalize();
}
function perpTo(v, d, fallback) {
  const p = v.clone().addScaledVector(d, -v.dot(d));
  if (p.lengthSq() < 1e-6) return fallback ? perpTo(fallback, d) : anyPerp(d);
  return p.normalize();
}
function solveIK(root, target, l1, l2, pole) {
  const d = target.clone().sub(root);
  let dist = d.length();
  const dir = dist > 1e-6 ? d.divideScalar(dist) : new THREE.Vector3(0, -1, 0);
  dist = clamp(dist, Math.abs(l1 - l2) + 1e-3, l1 + l2 - 1e-3);
  const cosA = (l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist);
  const A = Math.acos(clamp(cosA, -1, 1));
  const p = perpTo(pole, dir);
  const mid = root.clone().addScaledVector(dir, l1 * Math.cos(A)).addScaledVector(p, l1 * Math.sin(A));
  const end = root.clone().addScaledVector(dir, dist);
  return { mid, end, flexHint: p.clone().negate() };
}
function solveFK(root, dir, bend, flex, l1, l2) {
  const u = dir.clone().normalize();
  const f = perpTo(flex, u);
  const mid = root.clone().addScaledVector(u, l1);
  const d2 = u.clone().multiplyScalar(Math.cos(bend * D)).addScaledVector(f, Math.sin(bend * D));
  const end = mid.clone().addScaledVector(d2, l2);
  return { mid, end, flexHint: f };
}

// Interpolation récursive entre deux poses-clés (nombres, tableaux, objets)
function mix(a, b, t) {
  if (typeof a === 'number') return a + (b - a) * t;
  if (Array.isArray(a)) return a.map((x, i) => mix(x, b[i], t));
  if (a && typeof a === 'object') {
    const o = {};
    for (const k in a) o[k] = (b && k in b) ? mix(a[k], b[k], t) : a[k];
    return o;
  }
  return t < 0.5 ? a : b;
}

// Résout une pose → positions des articulations + repères
export function solveRig(pose) {
  const R = {};
  R.pelvisQ = eulerQ(pose.prot || [0, 0, 0]);
  R.pelvis = v3(pose.pelvis);
  R.chestQ = R.pelvisQ.clone().multiply(eulerQ(pose.spine || [0, 0, 0]));
  R.lumbar = R.pelvis.clone().add(new THREE.Vector3(0, BODY.lumbarY, 0).applyQuaternion(R.pelvisQ));
  const inChest = (p) => R.lumbar.clone().add(v3(p).applyQuaternion(R.chestQ));
  const inPelvis = (p) => R.pelvis.clone().add(v3(p).applyQuaternion(R.pelvisQ));
  const dirIn = (space, p) => space === 'chest' ? v3(p).applyQuaternion(R.chestQ) : space === 'pelvis' ? v3(p).applyQuaternion(R.pelvisQ) : v3(p);
  const ptIn = (space, p) => space === 'chest' ? inChest(p) : space === 'pelvis' ? inPelvis(p) : v3(p);
  R.inChest = inChest; R.inPelvis = inPelvis;
  R.neck = inChest([0, BODY.neckY, 0]);
  const h = pose.head || [0, 0];
  R.headQ = R.chestQ.clone().multiply(eulerQ([h[0], h[1] || 0, 0]));
  R.head = R.neck.clone().add(new THREE.Vector3(0, 0.125, 0.012).applyQuaternion(R.headQ));
  R.shoulder = { L: inChest([BODY.shX, BODY.shY, 0]), R: inChest([-BODY.shX, BODY.shY, 0]) };
  R.hip = { L: inPelvis([BODY.hipX, BODY.hipY, 0]), R: inPelvis([-BODY.hipX, BODY.hipY, 0]) };
  R.arm = {}; R.leg = {}; R.foot = {};
  const fwdBody = new THREE.Vector3(0, 0, 1).applyQuaternion(R.pelvisQ);
  for (const s of ['L', 'R']) {
    const sg = s === 'L' ? 1 : -1;
    // Bras
    const a = pose['arm' + s];
    let res;
    if (a && a.ik) {
      res = solveIK(R.shoulder[s], ptIn(a.space, a.ik), BODY.upper, BODY.fore, dirIn(a.space, a.pole || [sg * 0.3, -1, -0.4]));
    } else {
      const fk = (a && a.fk) || { dir: [sg * 0.12, -1, 0], bend: 12, flex: [0, 0, 1] };
      res = solveFK(R.shoulder[s], dirIn(a && a.space, fk.dir), fk.bend, dirIn(a && a.space, fk.flex || [0, 0, 1]), BODY.upper, BODY.fore);
    }
    R.arm[s] = limbFrames(R.shoulder[s], res);
    // Jambes
    const l = pose['leg' + s];
    if (l && l.ik) {
      res = solveIK(R.hip[s], ptIn(l.space, l.ik), BODY.thigh, BODY.shin, dirIn(l.space, l.pole || [sg * 0.15, 0, 1]));
    } else {
      const fk = (l && l.fk) || { dir: [0, -1, 0], bend: 4, flex: [0, 0, -1] };
      res = solveFK(R.hip[s], dirIn(l && l.space, fk.dir), fk.bend, dirIn(l && l.space, fk.flex || [0, 0, -1]), BODY.thigh, BODY.shin);
    }
    R.leg[s] = limbFrames(R.hip[s], res);
    // Pied
    const f = (pose['foot' + s]) || {};
    const pitch = (f.pitch || 0) * D;
    const lg = R.leg[s];
    let fwd, up;
    if (f.mode === 'shin' || (!(l && l.ik) && f.mode !== 'flat')) {
      const base = lg.calf.clone().negate();
      fwd = base.clone().multiplyScalar(Math.cos(pitch)).addScaledVector(lg.d2, Math.sin(pitch));
      up = lg.d2.clone().negate().multiplyScalar(Math.cos(pitch)).addScaledVector(base, Math.sin(pitch));
    } else {
      let base = new THREE.Vector3(0, 0, 1);
      const src = f.dir ? v3(f.dir) : fwdBody.clone();
      src.y = 0; if (src.lengthSq() > 1e-4) base = src.normalize();
      if (f.yaw) base.applyAxisAngle(UP, sg * f.yaw * D);
      fwd = base.clone().multiplyScalar(Math.cos(pitch)).addScaledVector(UP, -Math.sin(pitch));
      up = UP.clone().multiplyScalar(Math.cos(pitch)).addScaledVector(base, Math.sin(pitch));
    }
    const x = new THREE.Vector3().crossVectors(up, fwd).normalize();
    const m = new THREE.Matrix4().makeBasis(x, up, fwd);
    R.foot[s] = { pos: lg.end.clone(), q: new THREE.Quaternion().setFromRotationMatrix(m) };
  }
  return R;
}

function limbFrames(root, res) {
  const u = res.mid.clone().sub(root).normalize();
  const d2 = res.end.clone().sub(res.mid).normalize();
  const f = perpTo(res.flexHint, u);
  const bend = Math.acos(clamp(u.dot(d2), -1, 1));
  // côté « intérieur du pli » du segment distal
  const calf = f.clone().multiplyScalar(Math.cos(bend)).addScaledVector(u, -Math.sin(bend)).normalize();
  return { root: root.clone(), mid: res.mid, end: res.end, u, d2, flex: f, calf };
}

// ───────────────────────── matériaux ─────────────────────────

const COL = {
  body: 0xb3bac5, muscle: 0xc3c9d2, accent: 0xff5a2e, second: 0xffa07a,
};

function makeMaterials() {
  return {
    body: new THREE.MeshStandardMaterial({ color: COL.body, roughness: 0.52, metalness: 0.02 }),
    joint: new THREE.MeshStandardMaterial({ color: 0x9aa2ae, roughness: 0.5, metalness: 0.05 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xaab1bc, roughness: 0.28, metalness: 0.9 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x2a2e35, roughness: 0.45, metalness: 0.65 }),
    pad: new THREE.MeshStandardMaterial({ color: 0x1b1d22, roughness: 0.85, metalness: 0.0 }),
    floor: new THREE.MeshStandardMaterial({ color: 0x24272d, roughness: 0.9, metalness: 0.0 }),
    plate: new THREE.MeshStandardMaterial({ color: 0x17191d, roughness: 0.55, metalness: 0.2 }),
    accent: new THREE.MeshStandardMaterial({ color: COL.accent, roughness: 0.4, metalness: 0.1, emissive: COL.accent, emissiveIntensity: 0.25 }),
    cable: new THREE.MeshStandardMaterial({ color: 0x0f1012, roughness: 0.6 }),
    stack: new THREE.MeshStandardMaterial({ color: 0x3a3f48, roughness: 0.4, metalness: 0.7 }),
  };
}

// ───────────────────────── géométries partagées ─────────────────────────

const GEO = {
  sphere: new THREE.SphereGeometry(1, 32, 20),
  cyl: new THREE.CylinderGeometry(1, 1, 1, 20),
  box: new THREE.BoxGeometry(1, 1, 1),
};

function taper(rTop, rBot, len) {
  return new THREE.CylinderGeometry(rTop, rBot, len, 22, 1, true);
}

// ───────────────────────── mannequin ─────────────────────────

const MUSCLE_DEFS = [
  // tronc (repère poitrine)
  { id: 'pecs', seg: 'chest', pos: [0.083, 0.285, 0.083], r: [0.083, 0.068, 0.036], rot: [-8, 14, -6], mirror: true },
  { id: 'abs', seg: 'chest', pos: [0, 0.085, 0.082], r: [0.07, 0.13, 0.032] },
  { id: 'obliques', seg: 'chest', pos: [0.112, 0.085, 0.035], r: [0.034, 0.11, 0.058], rot: [0, 18, 0], mirror: true },
  { id: 'lats', seg: 'chest', pos: [0.115, 0.205, -0.06], r: [0.058, 0.14, 0.046], rot: [0, -18, 10], mirror: true },
  { id: 'traps', seg: 'chest', pos: [0, 0.37, -0.045], r: [0.125, 0.05, 0.05] },
  { id: 'upperback', seg: 'chest', pos: [0, 0.265, -0.098], r: [0.075, 0.085, 0.028] },
  { id: 'lowerback', seg: 'chest', pos: [0.036, 0.065, -0.086], r: [0.032, 0.115, 0.028], mirror: true },
  { id: 'delts_ant', seg: 'chest', pos: [0.198, 0.348, 0.04], r: [0.045, 0.058, 0.04], mirror: true },
  { id: 'delts_lat', seg: 'chest', pos: [0.232, 0.343, 0.0], r: [0.036, 0.062, 0.05], mirror: true },
  { id: 'delts_post', seg: 'chest', pos: [0.198, 0.348, -0.042], r: [0.045, 0.058, 0.04], mirror: true },
  // bassin
  { id: 'glutes', seg: 'pelvis', pos: [0.072, -0.035, -0.078], r: [0.082, 0.092, 0.058], mirror: true },
  // membres : at = position le long du segment, side = +1 côté pli / -1 côté opposé
  { id: 'biceps', seg: 'upper', at: 0.56, side: 1, off: 0.028, r: [0.03, 0.085, 0.028] },
  { id: 'triceps', seg: 'upper', at: 0.45, side: -1, off: 0.03, r: [0.033, 0.1, 0.03] },
  { id: 'forearms', seg: 'fore', at: 0.3, side: 1, off: 0.022, r: [0.028, 0.08, 0.024] },
  { id: 'quads', seg: 'thigh', at: 0.5, side: -1, off: 0.036, r: [0.054, 0.165, 0.044] },
  { id: 'hams', seg: 'thigh', at: 0.52, side: 1, off: 0.034, r: [0.048, 0.16, 0.04] },
  { id: 'calves', seg: 'shin', at: 0.3, side: 1, off: 0.03, r: [0.04, 0.1, 0.036] },
];

class Mannequin {
  constructor(mats) {
    this.group = new THREE.Group();
    this.mats = mats;
    const M = (geo, mat, cast = true) => { const m = new THREE.Mesh(geo, mat); m.castShadow = cast; m.receiveShadow = false; this.group.add(m); return m; };
    const body = mats.body, joint = mats.joint;
    // tronc
    this.chest = M(GEO.sphere, body); this.chest.userData.loc = { seg: 'chest', pos: [0, 0.245, 0], s: [0.168, 0.195, 0.112] };
    this.girdle = M(new THREE.CapsuleGeometry(0.058, 0.3, 8, 16), body); this.girdle.userData.loc = { seg: 'chest', pos: [0, 0.335, -0.01], rot: [0, 0, 90] };
    this.abdo = M(GEO.sphere, body); this.abdo.userData.loc = { seg: 'chest', pos: [0, 0.06, 0], s: [0.132, 0.15, 0.098] };
    this.pelvisM = M(GEO.sphere, body); this.pelvisM.userData.loc = { seg: 'pelvis', pos: [0, -0.02, -0.005], s: [0.152, 0.108, 0.104] };
    this.neckM = M(taper(0.042, 0.05, 1), body);
    this.headM = M(GEO.sphere, body); this.headM.userData.loc = { seg: 'head', pos: [0, 0.0, 0.0], s: [0.09, 0.112, 0.102] };
    this.jaw = M(GEO.sphere, body); this.jaw.userData.loc = { seg: 'head', pos: [0, -0.06, 0.035], s: [0.068, 0.05, 0.07] };
    this.nose = M(GEO.sphere, body); this.nose.userData.loc = { seg: 'head', pos: [0, -0.012, 0.1], s: [0.014, 0.022, 0.016] };
    // membres
    this.limbs = {};
    for (const s of ['L', 'R']) {
      this.limbs[s] = {
        upper: M(taper(0.04, 0.05, BODY.upper), body),
        fore: M(taper(0.03, 0.04, BODY.foreMesh), body),
        hand: M(GEO.sphere, body),
        thigh: M(taper(0.058, 0.078, BODY.thigh), body),
        shin: M(taper(0.04, 0.055, BODY.shin), body),
        foot: this._foot(body),
        jShoulder: M(GEO.sphere, joint), jElbow: M(GEO.sphere, joint), jWrist: M(GEO.sphere, joint),
        jHip: M(GEO.sphere, joint), jKnee: M(GEO.sphere, joint), jAnkle: M(GEO.sphere, joint),
      };
      const L = this.limbs[s];
      L.jShoulder.scale.setScalar(0.054); L.jElbow.scale.setScalar(0.041); L.jWrist.scale.setScalar(0.031);
      L.jHip.scale.setScalar(0.072); L.jKnee.scale.setScalar(0.056); L.jAnkle.scale.setScalar(0.042);
      L.hand.scale.set(0.038, 0.055, 0.03);
    }
    // muscles
    this.muscles = [];
    for (const def of MUSCLE_DEFS) {
      const sides = def.seg === 'upper' || def.seg === 'fore' || def.seg === 'thigh' || def.seg === 'shin' ? ['L', 'R'] : (def.mirror ? ['L', 'R'] : ['C']);
      for (const s of sides) {
        const mat = new THREE.MeshStandardMaterial({ color: COL.muscle, roughness: 0.42, metalness: 0.02, emissive: 0x000000 });
        const m = M(GEO.sphere, mat);
        m.scale.set(def.r[0], def.r[1], def.r[2]);
        this.muscles.push({ def, side: s, mesh: m, mat });
      }
    }
  }
  _foot(mat) {
    const g = new THREE.Group();
    const sole = new THREE.Mesh(new THREE.CapsuleGeometry(0.043, 0.16, 8, 16), mat);
    sole.rotation.x = Math.PI / 2; sole.scale.set(1, 1, 0.78); sole.position.set(0, -0.04, 0.055);
    sole.castShadow = true;
    const heel = new THREE.Mesh(GEO.sphere, mat); heel.scale.set(0.04, 0.045, 0.045); heel.position.set(0, -0.035, -0.03); heel.castShadow = true;
    g.add(sole, heel);
    this.group.add(g);
    return g;
  }
  setHighlight(primary = [], secondary = []) {
    for (const m of this.muscles) {
      m.level = primary.includes(m.def.id) ? 2 : secondary.includes(m.def.id) ? 1 : 0;
      if (m.level === 0) { m.mat.color.setHex(COL.muscle); m.mat.emissive.setHex(0x000000); m.mat.emissiveIntensity = 0; }
    }
  }
  pulse(k) {
    for (const m of this.muscles) {
      if (m.level === 2) { m.mat.color.setHex(COL.accent); m.mat.emissive.setHex(COL.accent); m.mat.emissiveIntensity = 0.28 + 0.55 * k; }
      else if (m.level === 1) { m.mat.color.setHex(COL.second); m.mat.emissive.setHex(COL.second); m.mat.emissiveIntensity = 0.1 + 0.12 * k; }
    }
  }
  update(R) {
    const place = (mesh, loc) => {
      const q = loc.seg === 'chest' ? R.chestQ : loc.seg === 'pelvis' ? R.pelvisQ : R.headQ;
      const o = loc.seg === 'chest' ? R.lumbar : loc.seg === 'pelvis' ? R.pelvis : R.head;
      mesh.position.copy(o).add(v3(loc.pos).applyQuaternion(q));
      mesh.quaternion.copy(q);
      if (loc.rot) mesh.quaternion.multiply(eulerQ(loc.rot));
      if (loc.s) mesh.scale.set(loc.s[0], loc.s[1], loc.s[2]);
    };
    for (const k of ['chest', 'girdle', 'abdo', 'pelvisM', 'headM', 'jaw', 'nose']) place(this[k], this[k].userData.loc);
    seg(this.neckM, R.inChest([0, 0.34, -0.005]), R.head.clone().add(new THREE.Vector3(0, -0.06, -0.01).applyQuaternion(R.headQ)));
    for (const s of ['L', 'R']) {
      const L = this.limbs[s], a = R.arm[s], l = R.leg[s];
      bone(L.upper, a.root, a.mid);
      const wrist = a.mid.clone().addScaledVector(a.d2, BODY.foreMesh);
      bone(L.fore, a.mid, wrist);
      L.hand.position.copy(a.mid).addScaledVector(a.d2, BODY.fore - 0.012);
      L.hand.quaternion.setFromUnitVectors(YAXIS, a.d2);
      L.jShoulder.position.copy(a.root); L.jElbow.position.copy(a.mid); L.jWrist.position.copy(wrist);
      bone(L.thigh, l.root, l.mid); bone(L.shin, l.mid, l.end);
      L.jHip.position.copy(l.root); L.jKnee.position.copy(l.mid); L.jAnkle.position.copy(l.end);
      L.foot.position.copy(R.foot[s].pos); L.foot.quaternion.copy(R.foot[s].q);
    }
    for (const m of this.muscles) {
      const d = m.def;
      if (d.seg === 'chest' || d.seg === 'pelvis') {
        const sg = m.side === 'R' ? -1 : 1;
        const pos = [d.pos[0] * sg, d.pos[1], d.pos[2]];
        const rot = d.rot ? [d.rot[0], d.rot[1] * sg, d.rot[2] * sg] : null;
        const q = d.seg === 'chest' ? R.chestQ : R.pelvisQ;
        const o = d.seg === 'chest' ? R.lumbar : R.pelvis;
        m.mesh.position.copy(o).add(v3(pos).applyQuaternion(q));
        m.mesh.quaternion.copy(q); if (rot) m.mesh.quaternion.multiply(eulerQ(rot));
      } else {
        const limb = (d.seg === 'upper' || d.seg === 'fore') ? R.arm[m.side] : R.leg[m.side];
        const prox = d.seg === 'upper' || d.seg === 'thigh';
        const a = prox ? limb.root : limb.mid;
        const dir = prox ? limb.u : limb.d2;
        const len = d.seg === 'upper' ? BODY.upper : d.seg === 'fore' ? BODY.foreMesh : d.seg === 'thigh' ? BODY.thigh : BODY.shin;
        const side = (prox ? limb.flex : limb.calf).clone().multiplyScalar(d.side);
        m.mesh.position.copy(a).addScaledVector(dir, len * d.at).addScaledVector(side, d.off);
        const x = new THREE.Vector3().crossVectors(dir, side).normalize();
        m.mesh.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, dir, side));
      }
    }
  }
}

function bone(mesh, a, b) {
  const d = b.clone().sub(a); const len = d.length();
  mesh.position.copy(a).addScaledVector(d, 0.5);
  mesh.quaternion.setFromUnitVectors(YAXIS, d.normalize());
  return len;
}
function seg(mesh, a, b) {
  const len = bone(mesh, a, b); mesh.scale.set(1, len, 1);
}

// ───────────────────────── matériel ─────────────────────────

function cylBetween(mat, r, a, b, cast = true) {
  const m = new THREE.Mesh(GEO.cyl, mat);
  m.castShadow = cast; m.receiveShadow = true;
  setCyl(m, r, v3(a), v3(b));
  return m;
}
function setCyl(m, r, a, b) {
  const d = b.clone().sub(a); const len = Math.max(d.length(), 1e-4);
  m.position.copy(a).addScaledVector(d, 0.5);
  m.quaternion.setFromUnitVectors(YAXIS, d.divideScalar(len));
  m.scale.set(r, len, r);
}

function buildStatic(items, mats) {
  const g = new THREE.Group();
  for (const it of items || []) {
    const mat = mats[it.m || 'dark'];
    let m;
    if (it.t === 'box') {
      m = new THREE.Mesh(GEO.box, mat);
      m.scale.set(it.s[0], it.s[1], it.s[2]);
      m.position.set(it.p[0], it.p[1], it.p[2]);
      if (it.r) m.quaternion.copy(eulerQ(it.r));
      m.castShadow = true; m.receiveShadow = true;
    } else if (it.t === 'cyl') {
      m = cylBetween(mat, it.r, it.a, it.b);
    } else if (it.t === 'ball') {
      m = new THREE.Mesh(GEO.sphere, mat); m.scale.setScalar(it.r); m.position.set(it.p[0], it.p[1], it.p[2]); m.castShadow = true;
    }
    if (m) g.add(m);
  }
  return g;
}

function makeBarbell(mats, opt = {}) {
  const g = new THREE.Group();
  const len = opt.len || 1.9, pr = opt.plateR || 0.21, half = len / 2;
  const bar = new THREE.Mesh(GEO.cyl, mats.metal); bar.scale.set(0.014, len, 0.014); bar.rotation.z = Math.PI / 2; bar.castShadow = true; g.add(bar);
  const plates = opt.plates ?? 2;
  for (const sg of [1, -1]) {
    const sleeve = new THREE.Mesh(GEO.cyl, mats.metal); sleeve.scale.set(0.026, 0.36, 0.026); sleeve.rotation.z = Math.PI / 2; sleeve.position.x = sg * (half - 0.18); g.add(sleeve);
    const collar = new THREE.Mesh(GEO.cyl, mats.dark); collar.scale.set(0.04, 0.03, 0.04); collar.rotation.z = Math.PI / 2; collar.position.x = sg * (half - 0.37); g.add(collar);
    for (let i = 0; i < plates; i++) {
      const r = i === 0 ? pr : pr * 0.78;
      const p = new THREE.Mesh(GEO.cyl, mats.plate); p.scale.set(r, 0.045, r); p.rotation.z = Math.PI / 2;
      p.position.x = sg * (half - 0.33 + i * 0.05); p.castShadow = true; g.add(p);
      if (i === 0) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(r * 0.985, 0.006, 8, 48), mats.accent);
        ring.rotation.y = Math.PI / 2; ring.position.x = sg * (half - 0.33 - 0.024); g.add(ring);
      }
    }
  }
  return g;
}
function makeDumbbell(mats, opt = {}) {
  const g = new THREE.Group();
  const h = new THREE.Mesh(GEO.cyl, mats.metal); h.scale.set(0.017, 0.22, 0.017); h.rotation.z = Math.PI / 2; g.add(h);
  const r = opt.r || 0.06;
  for (const sg of [1, -1]) {
    const head = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.08, 6), mats.plate);
    head.rotation.z = Math.PI / 2; head.position.x = sg * 0.135; head.castShadow = true; g.add(head);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.55, r * 0.55, 0.004, 6), mats.accent);
    cap.rotation.z = Math.PI / 2; cap.position.x = sg * 0.177; g.add(cap);
  }
  return g;
}

// ───────────────────────── scène ─────────────────────────

function groundTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(256, 256, 10, 256, 256, 256);
  grd.addColorStop(0, 'rgba(255,255,255,0.10)');
  grd.addColorStop(0.55, 'rgba(255,255,255,0.04)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 512, 512);
  g.strokeStyle = 'rgba(255,255,255,0.09)'; g.lineWidth = 1.5;
  for (const r of [90, 160, 230]) { g.beginPath(); g.arc(256, 256, r, 0, Math.PI * 2); g.stroke(); }
  g.strokeStyle = 'rgba(255,90,46,0.35)'; g.lineWidth = 2;
  g.beginPath(); g.arc(256, 256, 160, -0.4, 0.4); g.stroke();
  g.beginPath(); g.arc(256, 256, 160, Math.PI - 0.4, Math.PI + 0.4); g.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(x, 0, 1));

export class Stage {
  constructor(container, opt = {}) {
    this.opt = Object.assign({ interactive: true, shadows: true, autoRotate: false, onPhase: null, pixelRatio: Math.min(window.devicePixelRatio || 1, 2), preserve: false }, opt);
    this.container = container;
    const r = this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: this.opt.preserve, powerPreference: 'high-performance' });
    r.setPixelRatio(this.opt.pixelRatio);
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 0.92;
    r.shadowMap.enabled = this.opt.shadows; r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.setClearColor(0x000000, 0);
    r.domElement.style.display = 'block'; r.domElement.style.width = '100%'; r.domElement.style.height = '100%';
    r.domElement.style.touchAction = this.opt.interactive ? 'none' : 'auto';
    container.appendChild(r.domElement);

    const scene = this.scene = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(r);
    scene.environment = pm.fromScene(new RoomEnvironment(r), 0.04).texture;
    scene.environmentIntensity = 0.55;

    this.camera = new THREE.PerspectiveCamera(32, 1, 0.05, 50);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x30343c, 0.75));
    const key = this.key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(2.2, 4.2, 2.6); key.castShadow = this.opt.shadows;
    key.shadow.mapSize.set(1536, 1536); key.shadow.radius = 4; key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
    Object.assign(key.shadow.camera, { left: -2.2, right: 2.2, top: 2.6, bottom: -1.2, near: 0.5, far: 12 });
    scene.add(key); scene.add(key.target);
    const rim = new THREE.DirectionalLight(0xff8a5c, 0.9); rim.position.set(-2.5, 1.6, -3.4); scene.add(rim);
    const fill = new THREE.DirectionalLight(0x9db8ff, 0.45); fill.position.set(-3, 1.5, 2.5); scene.add(fill);

    const ground = new THREE.Mesh(new THREE.CircleGeometry(2.4, 64), new THREE.MeshBasicMaterial({ map: groundTexture(), transparent: true, depthWrite: false }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = 0.001; scene.add(ground);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.ShadowMaterial({ opacity: 0.32 }));
    shadow.rotation.x = -Math.PI / 2; shadow.receiveShadow = true; scene.add(shadow);

    this.mats = makeMaterials();
    this.man = new Mannequin(this.mats);
    scene.add(this.man.group);
    this.equip = new THREE.Group(); scene.add(this.equip);

    if (this.opt.interactive) {
      const c = this.controls = new OrbitControls(this.camera, r.domElement);
      c.enableDamping = true; c.dampingFactor = 0.08; c.enablePan = false;
      c.minDistance = 1.6; c.maxDistance = 7; c.minPolarAngle = 10 * D; c.maxPolarAngle = 92 * D;
      c.rotateSpeed = 0.7; c.zoomSpeed = 0.6;
      c.autoRotate = this.opt.autoRotate; c.autoRotateSpeed = 0.6;
      c.addEventListener('start', () => { this.userTouched = true; if (c.autoRotate) c.autoRotate = false; });
    }

    this.speed = 1; this.playing = true; this.time = 0; this.last = performance.now();
    this._resize = this.resize.bind(this);
    this.ro = new ResizeObserver(this._resize); this.ro.observe(container);
    this.visible = true;
    this.io = new IntersectionObserver((e) => { this.visible = e[0].isIntersecting; if (this.visible) this._kick(); }, { rootMargin: '100px' });
    this.io.observe(container);
    this._loop = this.loop.bind(this);
    this.resize();
  }
  resize() {
    const w = this.container.clientWidth || 300, h = this.container.clientHeight || 300;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.ex) this._fit();
    this.renderOnce();
  }
  setExercise(id, keepView = false) {
    const ex = EXERCISES[id];
    if (!ex) return;
    this.id = id; this.ex = ex;
    // nettoyage du matériel
    for (const c of [...this.equip.children]) this.equip.remove(c);
    this.equip.add(buildStatic(typeof ex.scene === 'function' ? ex.scene() : ex.scene, this.mats));
    this.dyn = [];
    for (const d of ex.dyn || []) this.dyn.push(this._makeDyn(d));
    this.man.setHighlight(ex.muscles.p, ex.muscles.s);
    this.time = 0;
    // longueur de câble au repos (pour la pile de poids)
    const R0 = solveRig(this.poseAt(0));
    for (const d of this.dyn) if (d.cable) d.len0 = d.cableLen(R0);
    if (!keepView) this.setView(ex.view?.def || '34', true);
    this.renderOnce();
  }
  _makeDyn(d) {
    const mats = this.mats, g = new THREE.Group();
    this.equip.add(g);
    const o = { d, g };
    const grip = (R, s) => R.arm[s].end.clone();
    if (d.t === 'barbell') {
      const bb = makeBarbell(mats, d); g.add(bb);
      o.update = (R) => {
        const a = grip(R, 'L'), b = grip(R, 'R');
        g.position.copy(a).add(b).multiplyScalar(0.5);
        if (d.offset) g.position.add(v3(d.offset));
        const ax = a.clone().sub(b).normalize();
        g.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), ax);
      };
    } else if (d.t === 'dumbbell') {
      const db = makeDumbbell(mats, d); g.add(db);
      o.update = (R) => {
        const s = d.hand; const p = grip(R, s);
        g.position.copy(p);
        let hint = d.space === 'chest' ? v3(d.axis).applyQuaternion(R.chestQ) : v3(d.axis || [1, 0, 0]);
        const ax = perpTo(hint, R.arm[s].d2);
        g.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), ax);
      };
    } else if (d.t === 'cable') {
      // câble de la poulie à la poignée ; poignée : 'd' (une main), 'rope' (corde deux mains), 'bar' (barre)
      o.cable = true;
      const wire = new THREE.Mesh(GEO.cyl, mats.cable); g.add(wire);
      const pulley = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.014, 10, 24), mats.metal); pulley.position.copy(v3(d.from)); g.add(pulley);
      const hub = new THREE.Mesh(GEO.sphere, mats.accent); hub.scale.setScalar(0.022); hub.position.copy(v3(d.from)); g.add(hub);
      let ropes = [], bar = null, handle = null;
      if (d.handle === 'rope') { ropes = [new THREE.Mesh(GEO.cyl, mats.cable), new THREE.Mesh(GEO.cyl, mats.cable)]; ropes.forEach((x) => g.add(x)); }
      if (d.handle === 'bar') { bar = new THREE.Mesh(GEO.cyl, mats.metal); bar.castShadow = true; g.add(bar); }
      if (d.handle === 'd') { handle = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.008, 8, 20), mats.dark); g.add(handle); }
      let stack = null;
      if (d.stack) {
        stack = new THREE.Group();
        for (let i = 0; i < 6; i++) { const p = new THREE.Mesh(GEO.box, i === 5 ? mats.accent : mats.stack); p.scale.set(0.24, 0.035, 0.12); p.position.y = i * 0.04; stack.add(p); }
        g.add(stack);
      }
      const end = (R) => {
        if (d.hand === 'both') {
          const a = grip(R, 'L'), b = grip(R, 'R');
          const m = a.clone().add(b).multiplyScalar(0.5);
          if (d.handle === 'rope') m.add(v3(d.from).sub(m).normalize().multiplyScalar(0.13));
          return m;
        }
        return grip(R, d.hand);
      };
      o.cableLen = (R) => end(R).distanceTo(v3(d.from));
      o.update = (R) => {
        const e = end(R); const f = v3(d.from);
        setCyl(wire, 0.0045, f, e);
        if (d.facePulley) pulley.lookAt(e); else pulley.rotation.set(0, (d.pulleyYaw || 0) * D, 0);
        if (ropes.length) {
          setCyl(ropes[0], 0.011, e, grip(R, 'L')); setCyl(ropes[1], 0.011, e, grip(R, 'R'));
        }
        if (bar) {
          const a = grip(R, 'L'), b = grip(R, 'R'); const c = a.clone().add(b).multiplyScalar(0.5);
          const ax = a.clone().sub(b).normalize(); const L = d.barLen || 1.0;
          setCyl(bar, 0.013, c.clone().addScaledVector(ax, -L / 2), c.clone().addScaledVector(ax, L / 2));
        }
        if (handle) {
          const s = d.hand; handle.position.copy(grip(R, s));
          handle.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), perpTo(new THREE.Vector3(1, 0, 0), R.arm[s].d2));
        }
        if (stack) {
          const dl = clamp((o.cableLen(R) - (o.len0 || 0)) * (d.stack.ratio || 1), 0, 0.9);
          stack.position.copy(v3(d.stack.p)).add(new THREE.Vector3(0, dl, 0));
          if (d.stack.yaw) stack.rotation.y = d.stack.yaw * D;
        }
      };
    } else if (d.t === 'lever') {
      // bras de machine : pivot fixe → poignée (main) ou rouleau (cheville)
      const arm = new THREE.Mesh(GEO.cyl, mats.dark); arm.castShadow = true; g.add(arm);
      let grip2 = null;
      if (d.handle) { grip2 = new THREE.Mesh(GEO.cyl, mats.pad); grip2.castShadow = true; g.add(grip2); }
      o.update = (R) => {
        const p = d.hand ? grip(R, d.hand) : null;
        const tgt = p.clone(); if (d.offset) tgt.add(v3(d.offset));
        setCyl(arm, d.r || 0.022, v3(d.pivot), tgt);
        if (grip2) {
          const ax = d.handle === 'v' ? new THREE.Vector3(0, 1, 0) : perpTo(new THREE.Vector3(0, 0, 1), R.arm[d.hand].d2);
          setCyl(grip2, 0.022, p.clone().addScaledVector(ax, -0.07), p.clone().addScaledVector(ax, 0.07));
        }
      };
    } else if (d.t === 'roller') {
      // rouleau de machine à jambes : contre le tibia (front) ou derrière la cheville (back)
      const roll = new THREE.Mesh(GEO.cyl, mats.pad); roll.castShadow = true; g.add(roll);
      const arm = new THREE.Mesh(GEO.cyl, mats.dark); arm.castShadow = true; g.add(arm);
      const axle = new THREE.Mesh(GEO.cyl, mats.metal); g.add(axle);
      const hub = new THREE.Mesh(GEO.cyl, mats.accent); g.add(hub);
      o.update = (R) => {
        const pt = (l) => l.mid.clone().addScaledVector(l.d2, BODY.shin * (d.at || 0.86)).addScaledVector(l.calf, (d.side === 'back' ? 1 : -1) * 0.085);
        const c = pt(R.leg.L).add(pt(R.leg.R)).multiplyScalar(0.5);
        const px = d.pivot[0];
        setCyl(roll, 0.055, new THREE.Vector3(c.x + 0.19, c.y, c.z), new THREE.Vector3(c.x - 0.19, c.y, c.z));
        setCyl(axle, 0.014, new THREE.Vector3(c.x, c.y, c.z), new THREE.Vector3(px, c.y, c.z));
        setCyl(arm, 0.022, new THREE.Vector3(px, d.pivot[1], d.pivot[2]), new THREE.Vector3(px, c.y, c.z));
        setCyl(hub, 0.06, new THREE.Vector3(px - 0.02, d.pivot[1], d.pivot[2]), new THREE.Vector3(px + 0.02, d.pivot[1], d.pivot[2]));
      };
    } else if (d.t === 'chestItem') {
      // objet solidaire du buste (ex. épaulières)
      const st = buildStatic(d.items, mats); g.add(st);
      o.update = (R) => { g.position.copy(R.lumbar); g.quaternion.copy(R.chestQ); };
    }
    return o;
  }
  poseAt(t) {
    const ex = this.ex;
    let p = mix(ex.A, ex.B, t);
    if (ex.mod) p = ex.mod(p, t);
    return p;
  }
  phaseAt(time) {
    const tp = this.ex.tempo;
    const seq = [['go', tp.go], ['hold1', tp.hold1 || 0], ['back', tp.back], ['hold0', tp.hold0 || 0]];
    const total = seq.reduce((a, s) => a + s[1], 0);
    let x = ((time % total) + total) % total;
    for (const [name, dur] of seq) {
      if (x < dur || name === 'hold0') {
        const f = dur > 0 ? x / dur : 1;
        let t = name === 'go' ? ease(f) : name === 'hold1' ? 1 : name === 'back' ? 1 - ease(f) : 0;
        return { name, f, t, rep: Math.floor(time / total) };
      }
      x -= dur;
    }
    return { name: 'hold0', f: 0, t: 0, rep: 0 };
  }
  apply(t, phase) {
    const R = solveRig(this.poseAt(t));
    this.man.update(R);
    for (const d of this.dyn) d.update && d.update(R);
    const conc = this.ex.tempo.conc || 'go';
    let k = 0.15;
    if (phase) {
      if (phase.name === conc) k = 0.35 + 0.65 * Math.sin(Math.PI * clamp(phase.f, 0, 1));
      else if (phase.name === (conc === 'go' ? 'hold1' : 'hold0')) k = 0.6;
      else k = 0.25;
    }
    this.man.pulse(k);
    return R;
  }
  setView(name, instant = false) {
    const ex = this.ex; if (!ex) return;
    const v = ex.view || {};
    const V = Object.assign({ face: [0, 8], profil: [90, 6], '34': [38, 14], dos: [180, 10] }, v.views || {});
    const [az, el] = V[name] || V['34'];
    this.viewName = name;
    this._target = v3(v.target || [0, 0.9, 0]);
    this._dist = v.dist || 3.6;
    this._az = az; this._el = el;
    this._fit(instant);
  }
  _fit(instant = true) {
    const aspect = this.camera.aspect || 1;
    const dist = this._dist * 1.06 * (aspect < 1 ? 1 + (1 - aspect) * 1.3 : 1);
    const az = this._az * D, el = this._el * D;
    const pos = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(dist).add(this._target);
    if (instant || !this.controls) {
      this.camera.position.copy(pos); this.camera.lookAt(this._target);
      if (this.controls) { this.controls.target.copy(this._target); this.controls.update(); }
    } else {
      this._tween = { from: this.camera.position.clone(), to: pos, tf: this.controls.target.clone(), tt: this._target.clone(), t: 0 };
    }
  }
  play() { this.playing = true; this._kick(); }
  pause() { this.playing = false; }
  setSpeed(s) { this.speed = s; }
  renderOnce() {
    if (!this.ex) { this.renderer.render(this.scene, this.camera); return; }
    const ph = this.phaseAt(this.time);
    this.apply(ph.t, ph);
    this.renderer.render(this.scene, this.camera);
  }
  start() { this.running = true; this.last = performance.now(); this._kick(); }
  stop() { this.running = false; }
  _kick() { if (this.running && !this._raf) this._raf = requestAnimationFrame(this._loop); }
  loop(now) {
    this._raf = null;
    if (!this.running || !this.visible || document.hidden) { this.last = now; return; }
    const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
    if (this.playing && this.ex) this.time += dt * this.speed;
    if (this._tween) {
      const tw = this._tween; tw.t = Math.min(1, tw.t + dt * 2.2); const e = ease(tw.t);
      this.camera.position.lerpVectors(tw.from, tw.to, e); this.controls.target.lerpVectors(tw.tf, tw.tt, e);
      if (tw.t >= 1) this._tween = null;
    }
    if (this.controls) this.controls.update();
    if (this.ex) {
      const ph = this.phaseAt(this.time);
      this.apply(ph.t, ph);
      if (this.opt.onPhase && (ph.name !== this._lastPhase || ph.rep !== this._lastRep)) {
        this._lastPhase = ph.name; this._lastRep = ph.rep; this.opt.onPhase(ph, this.ex);
      }
    }
    this.renderer.render(this.scene, this.camera);
    this._raf = requestAnimationFrame(this._loop);
  }
  snapshot(id, t = 0.55, view, type = 'image/webp', q = 0.86) {
    this.setExercise(id);
    if (view) this.setView(view, true);
    this.apply(t, null);
    this.man.pulse(0.7);
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL(type, q);
  }
  dispose() {
    this.stop(); this.ro.disconnect(); this.io.disconnect();
    if (this.controls) this.controls.dispose();
    this.renderer.dispose(); this.renderer.forceContextLoss?.();
    this.renderer.domElement.remove();
  }
}

export function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

