// Protocole 5 — cinématique des exercices.
// Repère : sol y = 0, le mannequin regarde vers +Z, +X = son côté gauche.
// Chaque exercice : pose A (départ) et pose B (autre extrémité), tempo, matériel.
// tempo.go = durée A→B, tempo.back = durée B→A ; conc = phase concentrique ('go' ou 'back').

const D = Math.PI / 180;
const ST = 0.985; // hauteur du bassin debout

// ───────── aides matériel ─────────
function tower(x, z, h = 2.1, yaw = 0) {
  const c = Math.cos(yaw * D), s = Math.sin(yaw * D);
  const P = (dx, dz) => [x + dx * c + dz * s, z - dx * s + dz * c];
  const [ax, az] = P(0.15, 0), [bx, bz] = P(-0.15, 0), [px, pz] = P(0, -0.1);
  return [
    { t: 'box', s: [0.46, 0.05, 0.36], p: [x, 0.025, z], r: [0, yaw, 0], m: 'dark' },
    { t: 'box', s: [0.42, 0.07, 0.22], p: [x, h, z], r: [0, yaw, 0], m: 'dark' },
    { t: 'box', s: [0.42, h, 0.03], p: [px, h / 2, pz], r: [0, yaw, 0], m: 'dark' },
    { t: 'cyl', r: 0.012, a: [ax, 0.05, az], b: [ax, h, az], m: 'metal' },
    { t: 'cyl', r: 0.012, a: [bx, 0.05, bz], b: [bx, h, bz], m: 'metal' },
  ];
}
// bras de poulie : du haut/côté de la tour jusqu'à la poulie
const pulleyArm = (from, to) => ({ t: 'cyl', r: 0.02, a: from, b: to, m: 'dark' });
const stack = (x, z, yaw = 0, ratio = 1) => ({ p: [x, 0.07, z], yaw, ratio });

function seatBox(z = 0, top = 0.5, w = 0.4, depth = 0.4) {
  return [
    { t: 'box', s: [w, 0.08, depth], p: [0, top - 0.04, z], m: 'pad' },
    { t: 'cyl', r: 0.035, a: [0, 0.03, z], b: [0, top - 0.08, z], m: 'dark' },
    { t: 'box', s: [0.5, 0.04, 0.5], p: [0, 0.02, z], m: 'dark' },
  ];
}
const platform = (w = 1.5, d = 1.1, z = 0) => ({ t: 'box', s: [w, 0.025, d], p: [0, 0.0125, z], m: 'floor' });

const standLegs = (w = 0.12, z = 0, yaw = 8) => ({
  legL: { ik: [w, 0.075, z], pole: [0.15, 0, 1] },
  legR: { ik: [-w, 0.075, z], pole: [-0.15, 0, 1] },
  footL: { yaw }, footR: { yaw },
});
const relaxL = { fk: { dir: [0.14, -1, 0.02], bend: 14, flex: [0, 0, 1] } };
const relaxR = { fk: { dir: [-0.14, -1, 0.02], bend: 14, flex: [0, 0, 1] } };

// ───────── exercices ─────────
export const EXERCISES = {

  squat: {
    muscles: { p: ['quads', 'glutes'], s: ['hams', 'lowerback', 'abs'] },
    tempo: { go: 2, hold1: 0.25, back: 1.1, hold0: 0.7, conc: 'back' },
    view: { target: [0, 0.85, 0], dist: 3.7, views: { '34': [52, 10] } },
    scene: [
      platform(1.6, 1.2, -0.05),
      { t: 'box', s: [0.08, 2.1, 0.08], p: [0.5, 1.05, -0.48], m: 'dark' },
      { t: 'box', s: [0.08, 2.1, 0.08], p: [-0.5, 1.05, -0.48], m: 'dark' },
      { t: 'box', s: [1.08, 0.08, 0.08], p: [0, 2.1, -0.48], m: 'dark' },
      { t: 'box', s: [0.06, 0.06, 0.14], p: [0.5, 1.32, -0.39], m: 'accent' },
      { t: 'box', s: [0.06, 0.06, 0.14], p: [-0.5, 1.32, -0.39], m: 'accent' },
      { t: 'cyl', r: 0.02, a: [0.5, 0.5, -0.48], b: [0.5, 0.5, 0.42], m: 'metal' },
      { t: 'cyl', r: 0.02, a: [-0.5, 0.5, -0.48], b: [-0.5, 0.5, 0.42], m: 'metal' },
    ],
    dyn: [{ t: 'barbell' }],
    A: {
      pelvis: [0, ST, 0.0], prot: [3, 0, 0], spine: [4, 0, 0], head: [-6],
      armL: { space: 'chest', ik: [0.43, 0.39, -0.07], pole: [0.7, -1, -0.5] },
      armR: { space: 'chest', ik: [-0.43, 0.39, -0.07], pole: [-0.7, -1, -0.5] },
      legL: { ik: [0.16, 0.075, 0.02], pole: [0.35, 0, 1] }, legR: { ik: [-0.16, 0.075, 0.02], pole: [-0.35, 0, 1] },
      footL: { yaw: 12 }, footR: { yaw: 12 },
    },
    B: {
      pelvis: [0, 0.6, -0.2], prot: [34, 0, 0], spine: [10, 0, 0], head: [-24],
      armL: { space: 'chest', ik: [0.43, 0.39, -0.07], pole: [0.7, -1, -0.5] },
      armR: { space: 'chest', ik: [-0.43, 0.39, -0.07], pole: [-0.7, -1, -0.5] },
      legL: { ik: [0.16, 0.075, 0.02], pole: [0.35, 0, 1] }, legR: { ik: [-0.16, 0.075, 0.02], pole: [-0.35, 0, 1] },
      footL: { yaw: 12 }, footR: { yaw: 12 },
    },
  },

  sdt: {
    muscles: { p: ['hams', 'glutes'], s: ['lowerback', 'forearms', 'traps'] },
    tempo: { go: 2, hold1: 0.3, back: 1.1, hold0: 0.6, conc: 'back' },
    view: { target: [0, 0.75, 0], dist: 3.5, views: { '34': [68, 10] } },
    scene: [platform(1.4, 1.1, -0.05)],
    dyn: [{ t: 'dumbbell', hand: 'L', axis: [1, 0, 0] }, { t: 'dumbbell', hand: 'R', axis: [1, 0, 0] }],
    A: {
      pelvis: [0, ST, 0], prot: [0, 0, 0], spine: [0, 0, 0], head: [0],
      armL: { ik: [0.15, 0.875, 0.08], pole: [0.2, 0, -1] }, armR: { ik: [-0.15, 0.875, 0.08], pole: [-0.2, 0, -1] },
      ...standLegs(0.11, 0, 6),
    },
    B: {
      pelvis: [0, 0.9, -0.26], prot: [72, 0, 0], spine: [6, 0, 0], head: [-14],
      armL: { ik: [0.15, 0.45, 0.11], pole: [0.2, 0, -1] }, armR: { ik: [-0.15, 0.45, 0.11], pole: [-0.2, 0, -1] },
      ...standLegs(0.11, 0, 6),
    },
  },

  dc_barre: {
    muscles: { p: ['pecs', 'triceps', 'delts_ant'], s: ['lats'] },
    tempo: { go: 2, hold1: 0.3, back: 1, hold0: 0.6, conc: 'back' },
    view: { target: [0, 0.78, -0.05], dist: 3.5, views: { '34': [62, 22], profil: [90, 10] } },
    scene: [
      { t: 'box', s: [0.3, 0.1, 1.15], p: [0, 0.42, -0.1], m: 'pad' },
      { t: 'box', s: [0.12, 0.37, 0.12], p: [0, 0.185, 0.3], m: 'dark' },
      { t: 'box', s: [0.12, 0.37, 0.12], p: [0, 0.185, -0.5], m: 'dark' },
      { t: 'box', s: [0.5, 0.04, 0.12], p: [0, 0.02, 0.3], m: 'dark' },
      { t: 'box', s: [1.2, 0.04, 0.2], p: [0, 0.02, -0.5], m: 'dark' },
      { t: 'box', s: [0.06, 1.2, 0.06], p: [0.52, 0.6, -0.45], m: 'dark' },
      { t: 'box', s: [0.06, 1.2, 0.06], p: [-0.52, 0.6, -0.45], m: 'dark' },
      { t: 'box', s: [0.05, 0.05, 0.12], p: [0.52, 1.12, -0.38], m: 'accent' },
      { t: 'box', s: [0.05, 0.05, 0.12], p: [-0.52, 1.12, -0.38], m: 'accent' },
    ],
    dyn: [{ t: 'barbell' }],
    A: {
      pelvis: [0, 0.575, 0.25], prot: [-90, 0, 0], spine: [0, 0, 0], head: [0],
      armL: { ik: [0.4, 1.08, -0.17], pole: [1, -1.2, 0.2] }, armR: { ik: [-0.4, 1.08, -0.17], pole: [-1, -1.2, 0.2] },
      legL: { ik: [0.28, 0.075, 0.62], pole: [0.3, 1, 0.3] }, legR: { ik: [-0.28, 0.075, 0.62], pole: [-0.3, 1, 0.3] },
      footL: { yaw: 10 }, footR: { yaw: 10 },
    },
    B: {
      pelvis: [0, 0.575, 0.25], prot: [-90, 0, 0], spine: [0, 0, 0], head: [0],
      armL: { ik: [0.4, 0.745, -0.11], pole: [1, -1.2, 0.2] }, armR: { ik: [-0.4, 0.745, -0.11], pole: [-1, -1.2, 0.2] },
      legL: { ik: [0.28, 0.075, 0.62], pole: [0.3, 1, 0.3] }, legR: { ik: [-0.28, 0.075, 0.62], pole: [-0.3, 1, 0.3] },
      footL: { yaw: 10 }, footR: { yaw: 10 },
    },
  },

  di_barre: {
    muscles: { p: ['pecs', 'delts_ant', 'triceps'], s: [] },
    tempo: { go: 2, hold1: 0.3, back: 1, hold0: 0.6, conc: 'back' },
    view: { target: [0, 0.95, -0.12], dist: 3.6, views: { '34': [60, 16] } },
    scene: [
      { t: 'box', s: [0.32, 0.07, 0.34], p: [0, 0.465, 0.1], m: 'pad' },
      { t: 'box', s: [0.3, 0.95, 0.06], p: [0, 0.664, -0.362], r: [-60, 0, 0], m: 'pad' },
      { t: 'cyl', r: 0.03, a: [0, 0.02, 0.1], b: [0, 0.43, 0.1], m: 'dark' },
      { t: 'cyl', r: 0.03, a: [0, 0.02, -0.55], b: [0, 0.52, -0.5], m: 'dark' },
      { t: 'box', s: [0.5, 0.04, 0.9], p: [0, 0.02, -0.2], m: 'dark' },
      { t: 'box', s: [0.06, 1.38, 0.06], p: [0.52, 0.69, -0.62], m: 'dark' },
      { t: 'box', s: [0.06, 1.38, 0.06], p: [-0.52, 0.69, -0.62], m: 'dark' },
      { t: 'box', s: [1.1, 0.04, 0.2], p: [0, 0.02, -0.62], m: 'dark' },
      { t: 'box', s: [0.05, 0.05, 0.12], p: [0.52, 1.36, -0.55], m: 'accent' },
      { t: 'box', s: [0.05, 0.05, 0.12], p: [-0.52, 1.36, -0.55], m: 'accent' },
    ],
    dyn: [{ t: 'barbell' }],
    A: {
      pelvis: [0, 0.6, 0.04], prot: [-60, 0, 0], spine: [0, 0, 0], head: [0],
      armL: { ik: [0.4, 1.36, -0.32], pole: [1, -1, 0.3] }, armR: { ik: [-0.4, 1.36, -0.32], pole: [-1, -1, 0.3] },
      legL: { ik: [0.26, 0.075, 0.62], pole: [0.25, 1, 0.5] }, legR: { ik: [-0.26, 0.075, 0.62], pole: [-0.25, 1, 0.5] },
      footL: { yaw: 10 }, footR: { yaw: 10 },
    },
    B: {
      pelvis: [0, 0.6, 0.04], prot: [-60, 0, 0], spine: [0, 0, 0], head: [0],
      armL: { ik: [0.4, 0.95, -0.22], pole: [1, -1, 0.3] }, armR: { ik: [-0.4, 0.95, -0.22], pole: [-1, -1, 0.3] },
      legL: { ik: [0.26, 0.075, 0.62], pole: [0.25, 1, 0.5] }, legR: { ik: [-0.26, 0.075, 0.62], pole: [-0.25, 1, 0.5] },
      footL: { yaw: 10 }, footR: { yaw: 10 },
    },
  },

  dips: {
    muscles: { p: ['pecs', 'triceps'], s: ['delts_ant'] },
    tempo: { go: 2, hold1: 0.2, back: 1, hold0: 0.5, conc: 'back' },
    view: { target: [0, 1.2, 0], dist: 4.1, views: { '34': [56, 8] } },
    scene: [
      { t: 'cyl', r: 0.022, a: [0.25, 1.2, -0.45], b: [0.25, 1.2, 0.45], m: 'metal' },
      { t: 'cyl', r: 0.022, a: [-0.25, 1.2, -0.45], b: [-0.25, 1.2, 0.45], m: 'metal' },
      { t: 'cyl', r: 0.03, a: [0.25, 0, -0.45], b: [0.25, 1.2, -0.45], m: 'dark' },
      { t: 'cyl', r: 0.03, a: [-0.25, 0, -0.45], b: [-0.25, 1.2, -0.45], m: 'dark' },
      { t: 'cyl', r: 0.03, a: [0.25, 0, 0.45], b: [0.25, 1.2, 0.45], m: 'dark' },
      { t: 'cyl', r: 0.03, a: [-0.25, 0, 0.45], b: [-0.25, 1.2, 0.45], m: 'dark' },
      { t: 'box', s: [0.62, 0.04, 1.0], p: [0, 0.02, 0], m: 'dark' },
    ],
    A: {
      pelvis: [0, 1.336, -0.041], prot: [5, 0, 0], spine: [5, 0, 0], head: [0],
      armL: { ik: [0.25, 1.225, 0.0], pole: [0.15, 0, -1] }, armR: { ik: [-0.25, 1.225, 0.0], pole: [-0.15, 0, -1] },
      legL: { fk: { dir: [0.02, -1, 0.25], bend: 75, flex: [0, 0, -1] } }, legR: { fk: { dir: [-0.02, -1, 0.25], bend: 80, flex: [0, 0, -1] } },
      footL: { pitch: 25 }, footR: { pitch: 25 },
    },
    B: {
      pelvis: [0, 1.174, -0.058], prot: [25, 0, 0], spine: [10, 0, 0], head: [-15],
      armL: { ik: [0.25, 1.225, 0.0], pole: [0.15, 0, -1] }, armR: { ik: [-0.25, 1.225, 0.0], pole: [-0.15, 0, -1] },
      legL: { fk: { dir: [0.02, -1, 0.3], bend: 80, flex: [0, 0, -1] } }, legR: { fk: { dir: [-0.02, -1, 0.3], bend: 85, flex: [0, 0, -1] } },
      footL: { pitch: 25 }, footR: { pitch: 25 },
    },
  },

  dm_machine: {
    muscles: { p: ['delts_ant', 'delts_lat', 'triceps'], s: ['traps', 'pecs'] },
    tempo: { go: 1, hold1: 0.3, back: 2, hold0: 0.3, conc: 'go' },
    view: { target: [0, 1.05, -0.05], dist: 3.8, views: { '34': [36, 10] } },
    scene: [
      ...seatBox(0.02, 0.5),
      { t: 'box', s: [0.36, 0.72, 0.07], p: [0, 0.95, -0.17], r: [-6, 0, 0], m: 'pad' },
      { t: 'box', s: [0.1, 1.7, 0.1], p: [0, 0.85, -0.56], m: 'dark' },
      { t: 'box', s: [0.84, 0.08, 0.1], p: [0, 1.05, -0.56], m: 'dark' },
      { t: 'box', s: [0.6, 0.04, 0.6], p: [0, 0.02, -0.4], m: 'dark' },
    ],
    dyn: [
      { t: 'lever', hand: 'L', pivot: [0.4, 1.05, -0.56], handle: 'h' },
      { t: 'lever', hand: 'R', pivot: [-0.4, 1.05, -0.56], handle: 'h' },
    ],
    A: {
      pelvis: [0, 0.6, -0.02], prot: [-6, 0, 0], spine: [0, 0, 0], head: [0],
      armL: { ik: [0.42, 1.22, 0.02], pole: [1, -0.6, 0.1] }, armR: { ik: [-0.42, 1.22, 0.02], pole: [-1, -0.6, 0.1] },
      legL: { ik: [0.2, 0.075, 0.45], pole: [0.3, 1, 1] }, legR: { ik: [-0.2, 0.075, 0.45], pole: [-0.3, 1, 1] },
      footL: { yaw: 8 }, footR: { yaw: 8 },
    },
    B: {
      pelvis: [0, 0.6, -0.02], prot: [-6, 0, 0], spine: [0, 0, 0], head: [0],
      armL: { ik: [0.3, 1.62, 0.0], pole: [1, -0.6, 0.1] }, armR: { ik: [-0.3, 1.62, 0.0], pole: [-1, -0.6, 0.1] },
      legL: { ik: [0.2, 0.075, 0.45], pole: [0.3, 1, 1] }, legR: { ik: [-0.2, 0.075, 0.45], pole: [-0.3, 1, 1] },
      footL: { yaw: 8 }, footR: { yaw: 8 },
    },
  },

  tv_large: {
    muscles: { p: ['lats', 'upperback'], s: ['biceps', 'delts_post', 'forearms'] },
    tempo: { go: 1, hold1: 0.4, back: 2, hold0: 0.4, conc: 'go' },
    view: { target: [0, 1.25, 0.2], dist: 4.6, views: { '34': [145, 12], face: [30, 10] } },
    scene: [
      ...seatBox(0, 0.5),
      { t: 'cyl', r: 0.05, a: [0.25, 0.7, 0.33], b: [-0.25, 0.7, 0.33], m: 'pad' },
      { t: 'cyl', r: 0.025, a: [0, 0.7, 0.33], b: [0, 0.3, 0.33], m: 'dark' },
      ...tower(0, 0.7, 2.4, 180),
      pulleyArm([0, 2.36, 0.62], [0, 2.32, 0.1]),
    ],
    dyn: [{ t: 'cable', from: [0, 2.3, 0.1], hand: 'both', handle: 'bar', barLen: 1.15, stack: stack(0, 0.66, 180) }],
    A: {
      pelvis: [0, 0.59, 0], prot: [-5, 0, 0], spine: [-3, 0, 0], head: [-8],
      armL: { ik: [0.42, 1.56, 0.1], pole: [0.6, -1, -0.6] }, armR: { ik: [-0.42, 1.56, 0.1], pole: [-0.6, -1, -0.6] },
      legL: { ik: [0.2, 0.075, 0.48], pole: [0.2, 1, 1] }, legR: { ik: [-0.2, 0.075, 0.48], pole: [-0.2, 1, 1] },
    },
    B: {
      pelvis: [0, 0.59, 0], prot: [-12, 0, 0], spine: [-8, 0, 0], head: [-4],
      armL: { ik: [0.42, 1.12, 0.03], pole: [0.6, -1, -0.6] }, armR: { ik: [-0.42, 1.12, 0.03], pole: [-0.6, -1, -0.6] },
      legL: { ik: [0.2, 0.075, 0.48], pole: [0.2, 1, 1] }, legR: { ik: [-0.2, 0.075, 0.48], pole: [-0.2, 1, 1] },
    },
  },

  tv_neutre_uni: {
    muscles: { p: ['lats'], s: ['biceps', 'upperback', 'forearms'] },
    tempo: { go: 1, hold1: 0.4, back: 2, hold0: 0.4, conc: 'go' },
    view: { target: [0, 1.25, 0.2], dist: 4.6, views: { '34': [-145, 12], face: [-30, 10] } },
    scene: [
      ...seatBox(0, 0.5),
      { t: 'cyl', r: 0.05, a: [0.25, 0.7, 0.33], b: [-0.25, 0.7, 0.33], m: 'pad' },
      { t: 'cyl', r: 0.025, a: [0, 0.7, 0.33], b: [0, 0.3, 0.33], m: 'dark' },
      ...tower(0, 0.7, 2.4, 180),
      pulleyArm([0, 2.36, 0.62], [-0.2, 2.32, 0.1]),
    ],
    dyn: [{ t: 'cable', from: [-0.2, 2.3, 0.1], hand: 'R', handle: 'd', stack: stack(0, 0.66, 180) }],
    A: {
      pelvis: [0, 0.59, 0], prot: [-5, 0, 0], spine: [-3, 0, 4], head: [-8],
      armL: { ik: [0.17, 0.66, 0.3], pole: [0.6, -0.4, -1] },
      armR: { ik: [-0.24, 1.57, 0.08], pole: [-0.3, -1, -0.5] },
      legL: { ik: [0.2, 0.075, 0.48], pole: [0.2, 1, 1] }, legR: { ik: [-0.2, 0.075, 0.48], pole: [-0.2, 1, 1] },
    },
    B: {
      pelvis: [0, 0.59, 0], prot: [-10, 0, 0], spine: [-6, 0, 0], head: [-4],
      armL: { ik: [0.17, 0.66, 0.3], pole: [0.6, -0.4, -1] },
      armR: { ik: [-0.27, 1.1, 0.1], pole: [-0.3, -1, -0.5] },
      legL: { ik: [0.2, 0.075, 0.48], pole: [0.2, 1, 1] }, legR: { ik: [-0.2, 0.075, 0.48], pole: [-0.2, 1, 1] },
    },
  },

  th_large: {
    muscles: { p: ['upperback', 'lats', 'delts_post'], s: ['biceps', 'traps', 'lowerback'] },
    tempo: { go: 1, hold1: 0.5, back: 2, hold0: 0.3, conc: 'go' },
    view: { target: [0, 0.78, 0.35], dist: 4.0, views: { '34': [105, 14] } },
    scene: [
      { t: 'box', s: [0.38, 0.08, 0.5], p: [0, 0.4, 0.0], m: 'pad' },
      { t: 'box', s: [0.12, 0.36, 0.12], p: [0, 0.18, 0], m: 'dark' },
      { t: 'box', s: [0.5, 0.04, 1.5], p: [0, 0.02, 0.5], m: 'dark' },
      { t: 'box', s: [0.5, 0.3, 0.05], p: [0, 0.24, 0.8], r: [-18, 0, 0], m: 'pad' },
      ...tower(0, 1.18, 2.0, 180),
      pulleyArm([0, 0.55, 1.08], [0, 0.55, 1.02]),
    ],
    dyn: [{ t: 'cable', from: [0, 0.55, 1.02], hand: 'both', handle: 'bar', barLen: 0.9, stack: stack(0, 1.14, 180) }],
    A: {
      pelvis: [0, 0.54, 0], prot: [12, 0, 0], spine: [10, 0, 0], head: [-10],
      armL: { ik: [0.34, 0.86, 0.7], pole: [0.8, -0.3, -1] }, armR: { ik: [-0.34, 0.86, 0.7], pole: [-0.8, -0.3, -1] },
      legL: { ik: [0.15, 0.3, 0.68], pole: [0.2, 1, 0.2] }, legR: { ik: [-0.15, 0.3, 0.68], pole: [-0.2, 1, 0.2] },
      footL: { pitch: -18 }, footR: { pitch: -18 },
    },
    B: {
      pelvis: [0, 0.54, 0], prot: [-4, 0, 0], spine: [-6, 0, 0], head: [0],
      armL: { ik: [0.34, 0.86, 0.16], pole: [0.8, -0.3, -1] }, armR: { ik: [-0.34, 0.86, 0.16], pole: [-0.8, -0.3, -1] },
      legL: { ik: [0.15, 0.3, 0.68], pole: [0.2, 1, 0.2] }, legR: { ik: [-0.15, 0.3, 0.68], pole: [-0.2, 1, 0.2] },
      footL: { pitch: -18 }, footR: { pitch: -18 },
    },
  },

  th_neutre_uni: {
    muscles: { p: ['lats', 'upperback'], s: ['biceps', 'delts_post', 'obliques'] },
    tempo: { go: 1, hold1: 0.5, back: 2, hold0: 0.3, conc: 'go' },
    view: { target: [0, 0.78, 0.35], dist: 4.0, views: { '34': [-105, 14] } },
    scene: [
      { t: 'box', s: [0.38, 0.08, 0.5], p: [0, 0.4, 0.0], m: 'pad' },
      { t: 'box', s: [0.12, 0.36, 0.12], p: [0, 0.18, 0], m: 'dark' },
      { t: 'box', s: [0.5, 0.04, 1.5], p: [0, 0.02, 0.5], m: 'dark' },
      { t: 'box', s: [0.5, 0.3, 0.05], p: [0, 0.24, 0.8], r: [-18, 0, 0], m: 'pad' },
      ...tower(0, 1.18, 2.0, 180),
      pulleyArm([0, 0.55, 1.08], [-0.05, 0.55, 1.02]),
    ],
    dyn: [{ t: 'cable', from: [-0.05, 0.55, 1.02], hand: 'R', handle: 'd', stack: stack(0, 1.14, 180) }],
    A: {
      pelvis: [0, 0.54, 0], prot: [12, 0, 0], spine: [10, 18, 0], head: [-10],
      armL: { ik: [0.16, 0.64, 0.36], pole: [0.5, -0.3, -1] },
      armR: { ik: [-0.12, 0.86, 0.68], pole: [-0.2, -0.4, -1] },
      legL: { ik: [0.15, 0.3, 0.68], pole: [0.2, 1, 0.2] }, legR: { ik: [-0.15, 0.3, 0.68], pole: [-0.2, 1, 0.2] },
      footL: { pitch: -18 }, footR: { pitch: -18 },
    },
    B: {
      pelvis: [0, 0.54, 0], prot: [-4, 0, 0], spine: [-6, -10, 0], head: [0],
      armL: { ik: [0.16, 0.64, 0.36], pole: [0.5, -0.3, -1] },
      armR: { ik: [-0.2, 0.88, 0.12], pole: [-0.2, -0.4, -1] },
      legL: { ik: [0.15, 0.3, 0.68], pole: [0.2, 1, 0.2] }, legR: { ik: [-0.15, 0.3, 0.68], pole: [-0.2, 1, 0.2] },
      footL: { pitch: -18 }, footR: { pitch: -18 },
    },
  },

  face_pull: {
    muscles: { p: ['delts_post', 'upperback'], s: ['traps', 'biceps'] },
    tempo: { go: 1, hold1: 0.6, back: 2, hold0: 0.3, conc: 'go' },
    view: { target: [0, 1.3, 0.35], dist: 4.0, views: { '34': [-48, 12], dos: [-160, 14] } },
    scene: [
      platform(1.3, 1.0, 0),
      ...tower(0, 1.12, 2.1, 180),
      pulleyArm([0, 1.72, 1.08], [0, 1.72, 1.0]),
    ],
    dyn: [{ t: 'cable', from: [0, 1.72, 1.0], hand: 'both', handle: 'rope', stack: stack(0, 1.08, 180) }],
    A: {
      pelvis: [0, ST, 0.02], prot: [2, 0, 0], spine: [0, 0, 0], head: [0],
      armL: { ik: [0.07, 1.55, 0.58], pole: [1, 0.3, -0.3] }, armR: { ik: [-0.07, 1.55, 0.58], pole: [-1, 0.3, -0.3] },
      ...standLegs(0.13, 0, 8),
    },
    B: {
      pelvis: [0, ST, -0.02], prot: [-3, 0, 0], spine: [-5, 0, 0], head: [2],
      armL: { ik: [0.21, 1.62, 0.13], pole: [1, 0.4, -0.4] }, armR: { ik: [-0.21, 1.62, 0.13], pole: [-1, 0.4, -0.4] },
      ...standLegs(0.13, 0, 8),
    },
  },

  upright_row: {
    muscles: { p: ['delts_lat', 'traps'], s: ['delts_ant', 'biceps', 'forearms'] },
    tempo: { go: 1, hold1: 0.3, back: 2, hold0: 0.4, conc: 'go' },
    view: { target: [0, 1.15, 0], dist: 3.5, views: { '34': [32, 8] } },
    scene: [platform(1.3, 1.0, 0)],
    dyn: [{ t: 'barbell', len: 1.4, plateR: 0.15, plates: 1 }],
    A: {
      pelvis: [0, ST, 0], prot: [2, 0, 0], spine: [2, 0, 0], head: [0],
      armL: { ik: [0.15, 0.89, 0.1], pole: [1, 0.8, -0.2] }, armR: { ik: [-0.15, 0.89, 0.1], pole: [-1, 0.8, -0.2] },
      ...standLegs(0.12, 0, 8),
    },
    B: {
      pelvis: [0, ST, 0], prot: [2, 0, 0], spine: [0, 0, 0], head: [0],
      armL: { ik: [0.14, 1.27, 0.18], pole: [1, 0.8, -0.2] }, armR: { ik: [-0.14, 1.27, 0.18], pole: [-1, 0.8, -0.2] },
      ...standLegs(0.12, 0, 8),
    },
  },

  elev_halteres: {
    muscles: { p: ['delts_lat'], s: ['delts_ant', 'traps'] },
    tempo: { go: 1, hold1: 0.3, back: 2, hold0: 0.4, conc: 'go' },
    view: { target: [0, 1.15, 0], dist: 3.7, views: { '34': [22, 8] } },
    scene: [platform(1.4, 1.0, 0)],
    dyn: [{ t: 'dumbbell', hand: 'L', axis: [0, 0, 1], r: 0.05 }, { t: 'dumbbell', hand: 'R', axis: [0, 0, 1], r: 0.05 }],
    A: {
      pelvis: [0, ST, 0], prot: [4, 0, 0], spine: [2, 0, 0], head: [0],
      armL: { fk: { dir: [0.2, -1, 0.14], bend: 12, flex: [0, 0, 1] } }, armR: { fk: { dir: [-0.2, -1, 0.14], bend: 12, flex: [0, 0, 1] } },
      ...standLegs(0.12, 0, 8),
    },
    B: {
      pelvis: [0, ST, 0], prot: [4, 0, 0], spine: [2, 0, 0], head: [0],
      armL: { fk: { dir: [1, -0.02, 0.22], bend: 15, flex: [0, 0, 1] } }, armR: { fk: { dir: [-1, -0.02, 0.22], bend: 15, flex: [0, 0, 1] } },
      ...standLegs(0.12, 0, 8),
    },
  },

  elev_poulie: {
    muscles: { p: ['delts_lat'], s: ['delts_post', 'traps'] },
    tempo: { go: 1, hold1: 0.3, back: 2, hold0: 0.4, conc: 'go' },
    view: { target: [0.1, 1.05, 0], dist: 4.0, views: { '34': [12, 10] } },
    scene: [
      platform(1.6, 1.0, 0),
      ...tower(0.72, 0, 2.1, -90),
      pulleyArm([0.62, 0.14, 0.05], [0.54, 0.14, 0.05]),
    ],
    dyn: [{ t: 'cable', from: [0.54, 0.14, 0.05], hand: 'R', handle: 'd', pulleyYaw: 0, stack: stack(0.68, 0, -90) }],
    A: {
      pelvis: [0, ST, 0], prot: [2, 0, 0], spine: [0, 0, 0], head: [0],
      armL: { ik: [0.56, 1.1, 0.0], pole: [0.2, -1, -0.6] },
      armR: { fk: { dir: [0.32, -1, 0.22], bend: 10, flex: [0, 0, 1] } },
      ...standLegs(0.12, 0, 8),
    },
    B: {
      pelvis: [0, ST, 0], prot: [2, 0, 0], spine: [0, 0, -3], head: [0],
      armL: { ik: [0.56, 1.1, 0.0], pole: [0.2, -1, -0.6] },
      armR: { fk: { dir: [-1, -0.02, 0.18], bend: 14, flex: [0, 0, 1] } },
      ...standLegs(0.12, 0, 8),
    },
  },

  curl_poulie_uni: {
    muscles: { p: ['biceps'], s: ['forearms', 'delts_ant'] },
    tempo: { go: 1, hold1: 0.4, back: 2, hold0: 0.3, conc: 'go' },
    view: { target: [0, 1.05, -0.15], dist: 3.8, views: { '34': [-72, 10] } },
    scene: [
      platform(1.3, 1.4, -0.2),
      ...tower(0, -0.85, 2.1, 0),
      pulleyArm([0, 0.42, -0.75], [-0.22, 0.42, -0.65]),
    ],
    dyn: [{ t: 'cable', from: [-0.22, 0.42, -0.65], hand: 'R', handle: 'd', stack: stack(0, -0.82, 0) }],
    A: {
      pelvis: [0, 0.97, 0.03], prot: [6, 0, 0], spine: [4, 0, 0], head: [0],
      armL: relaxL,
      armR: { fk: { dir: [-0.06, -0.86, -0.5], bend: 6, flex: [0, 0.3, 1] } },
      legL: { ik: [0.13, 0.075, 0.24], pole: [0.15, 0, 1] }, legR: { ik: [-0.13, 0.075, -0.2], pole: [-0.15, 0, 1] },
      footL: { yaw: 6 }, footR: { yaw: 10 },
    },
    B: {
      pelvis: [0, 0.97, 0.03], prot: [6, 0, 0], spine: [4, 0, 0], head: [0],
      armL: relaxL,
      armR: { fk: { dir: [-0.06, -0.86, -0.5], bend: 132, flex: [0, 0.3, 1] } },
      legL: { ik: [0.13, 0.075, 0.24], pole: [0.15, 0, 1] }, legR: { ik: [-0.13, 0.075, -0.2], pole: [-0.15, 0, 1] },
      footL: { yaw: 6 }, footR: { yaw: 10 },
    },
  },

  curl_marteau: {
    muscles: { p: ['biceps', 'forearms'], s: [] },
    tempo: { go: 1, hold1: 0.3, back: 2, hold0: 0.3, conc: 'go' },
    view: { target: [0, 1.1, 0], dist: 3.4, views: { '34': [34, 8] } },
    scene: [platform(1.3, 1.0, 0)],
    dyn: [{ t: 'dumbbell', hand: 'L', axis: [0, 0, 1], r: 0.055 }, { t: 'dumbbell', hand: 'R', axis: [0, 0, 1], r: 0.055 }],
    A: {
      pelvis: [0, ST, 0], prot: [0, 0, 0], spine: [0, 0, 0], head: [0],
      armL: { fk: { dir: [0.07, -1, 0.03], bend: 6, flex: [0, 0, 1] } }, armR: { fk: { dir: [-0.07, -1, 0.03], bend: 6, flex: [0, 0, 1] } },
      ...standLegs(0.12, 0, 8),
    },
    B: {
      pelvis: [0, ST, 0], prot: [0, 0, 0], spine: [-2, 0, 0], head: [0],
      armL: { fk: { dir: [0.07, -1, 0.06], bend: 132, flex: [0, 0, 1] } }, armR: { fk: { dir: [-0.07, -1, 0.06], bend: 132, flex: [0, 0, 1] } },
      ...standLegs(0.12, 0, 8),
    },
  },

  curl_pupitre: {
    muscles: { p: ['biceps'], s: ['forearms'] },
    tempo: { go: 1, hold1: 0.3, back: 2, hold0: 0.3, conc: 'go' },
    view: { target: [0, 0.95, 0.15], dist: 3.4, views: { '34': [64, 14] } },
    scene: [
      { t: 'box', s: [0.36, 0.07, 0.32], p: [0, 0.555, -0.06], m: 'pad' },
      { t: 'cyl', r: 0.035, a: [0, 0.02, -0.06], b: [0, 0.52, -0.06], m: 'dark' },
      { t: 'box', s: [0.54, 0.05, 0.36], p: [0, 0.952, 0.187], r: [38.5, 0, 0], m: 'pad' },
      { t: 'cyl', r: 0.035, a: [0, 0.02, 0.3], b: [0, 0.9, 0.2], m: 'dark' },
      { t: 'box', s: [0.5, 0.04, 0.8], p: [0, 0.02, 0.1], m: 'dark' },
    ],
    dyn: [{ t: 'barbell', len: 1.25, plateR: 0.13, plates: 1 }],
    A: {
      pelvis: [0, 0.67, -0.05], prot: [12, 0, 0], spine: [12, 0, 0], head: [-6],
      armL: { fk: { dir: [0.03, -0.62, 0.78], bend: 12, flex: [0, 1, 0] } }, armR: { fk: { dir: [-0.03, -0.62, 0.78], bend: 12, flex: [0, 1, 0] } },
      legL: { ik: [0.18, 0.075, 0.42], pole: [0.2, 1, 1] }, legR: { ik: [-0.18, 0.075, 0.42], pole: [-0.2, 1, 1] },
    },
    B: {
      pelvis: [0, 0.67, -0.05], prot: [12, 0, 0], spine: [12, 0, 0], head: [-6],
      armL: { fk: { dir: [0.03, -0.62, 0.78], bend: 118, flex: [0, 1, 0] } }, armR: { fk: { dir: [-0.03, -0.62, 0.78], bend: 118, flex: [0, 1, 0] } },
      legL: { ik: [0.18, 0.075, 0.42], pole: [0.2, 1, 1] }, legR: { ik: [-0.18, 0.075, 0.42], pole: [-0.2, 1, 1] },
    },
  },

  ext_nuque: {
    muscles: { p: ['triceps'], s: ['abs'] },
    tempo: { go: 2, hold1: 0.3, back: 1, hold0: 0.4, conc: 'back' },
    view: { target: [0, 1.25, 0.1], dist: 3.9, views: { '34': [-72, 10] } },
    scene: [
      platform(1.3, 1.6, -0.15),
      ...tower(0, -0.86, 2.1, 0),
      pulleyArm([0, 1.45, -0.76], [0, 1.45, -0.7]),
    ],
    dyn: [{ t: 'cable', from: [0, 1.45, -0.7], hand: 'both', handle: 'rope', stack: stack(0, -0.82, 0) }],
    A: {
      pelvis: [0, 0.96, 0.08], prot: [18, 0, 0], spine: [12, 0, 0], head: [-8],
      armL: { fk: { dir: [0.08, 0.6, 0.8], bend: 8, flex: [0, 0.8, -0.6] } }, armR: { fk: { dir: [-0.08, 0.6, 0.8], bend: 8, flex: [0, 0.8, -0.6] } },
      legL: { ik: [0.12, 0.075, 0.3], pole: [0.15, 0, 1] }, legR: { ik: [-0.12, 0.075, -0.16], pole: [-0.15, 0, 1] },
      footL: { yaw: 6 }, footR: { yaw: 10 },
    },
    B: {
      pelvis: [0, 0.96, 0.08], prot: [18, 0, 0], spine: [12, 0, 0], head: [-8],
      armL: { fk: { dir: [0.08, 0.62, 0.78], bend: 138, flex: [0, 0.8, -0.6] } }, armR: { fk: { dir: [-0.08, 0.62, 0.78], bend: 138, flex: [0, 0.8, -0.6] } },
      legL: { ik: [0.12, 0.075, 0.3], pole: [0.15, 0, 1] }, legR: { ik: [-0.12, 0.075, -0.16], pole: [-0.15, 0, 1] },
      footL: { yaw: 6 }, footR: { yaw: 10 },
    },
  },

  ext_nuque_uni: {
    muscles: { p: ['triceps'], s: ['abs', 'obliques'] },
    tempo: { go: 2, hold1: 0.3, back: 1, hold0: 0.4, conc: 'back' },
    view: { target: [0, 1.25, 0.1], dist: 3.9, views: { '34': [-72, 10] } },
    scene: [
      platform(1.3, 1.6, -0.15),
      ...tower(0, -0.86, 2.1, 0),
      pulleyArm([0, 1.45, -0.76], [-0.1, 1.45, -0.7]),
    ],
    dyn: [{ t: 'cable', from: [-0.1, 1.45, -0.7], hand: 'R', handle: 'd', stack: stack(0, -0.82, 0) }],
    A: {
      pelvis: [0, 0.96, 0.08], prot: [16, 0, 0], spine: [10, 0, 0], head: [-6],
      armL: { fk: { dir: [0.2, -1, 0.15], bend: 60, flex: [-0.6, 0, 1] } },
      armR: { fk: { dir: [-0.08, 0.6, 0.8], bend: 8, flex: [0, 0.8, -0.6] } },
      legL: { ik: [0.12, 0.075, 0.3], pole: [0.15, 0, 1] }, legR: { ik: [-0.12, 0.075, -0.16], pole: [-0.15, 0, 1] },
      footL: { yaw: 6 }, footR: { yaw: 10 },
    },
    B: {
      pelvis: [0, 0.96, 0.08], prot: [16, 0, 0], spine: [10, 0, 0], head: [-6],
      armL: { fk: { dir: [0.2, -1, 0.15], bend: 60, flex: [-0.6, 0, 1] } },
      armR: { fk: { dir: [-0.06, 0.62, 0.78], bend: 138, flex: [0, 0.8, -0.6] } },
      legL: { ik: [0.12, 0.075, 0.3], pole: [0.15, 0, 1] }, legR: { ik: [-0.12, 0.075, -0.16], pole: [-0.15, 0, 1] },
      footL: { yaw: 6 }, footR: { yaw: 10 },
    },
  },

  hyperextension: {
    muscles: { p: ['lowerback', 'glutes', 'hams'], s: [] },
    tempo: { go: 1, hold1: 0.5, back: 2, hold0: 0.3, conc: 'go' },
    view: { target: [0, 0.8, 0.2], dist: 3.6, views: { '34': [78, 10] } },
    scene: [
      { t: 'box', s: [0.5, 0.05, 1.2], p: [0, 0.025, 0], m: 'dark' },
      { t: 'box', s: [0.42, 0.2, 0.09], p: [0, 0.79, 0.34], r: [45, 0, 0], m: 'pad' },
      { t: 'cyl', r: 0.03, a: [0, 0.05, 0.12], b: [0, 0.7, 0.28], m: 'dark' },
      { t: 'cyl', r: 0.045, a: [0.2, 0.38, -0.33], b: [-0.2, 0.38, -0.33], m: 'pad' },
      { t: 'cyl', r: 0.03, a: [0, 0.05, -0.36], b: [0, 0.36, -0.34], m: 'dark' },
      { t: 'box', s: [0.42, 0.03, 0.26], p: [0, 0.17, -0.27], r: [45, 0, 0], m: 'dark' },
    ],
    A: {
      pelvis: [0, 0.855, 0.324], prot: [100, 0, 0], spine: [8, 0, 0], head: [10],
      armL: { space: 'chest', ik: [-0.1, 0.3, 0.15], pole: [1, -0.8, 0.3] }, armR: { space: 'chest', ik: [0.1, 0.27, 0.17], pole: [-1, -0.8, 0.3] },
      legL: { ik: [0.11, 0.27, -0.33], pole: [0, -0.7, 0.7] }, legR: { ik: [-0.11, 0.27, -0.33], pole: [0, -0.7, 0.7] },
      footL: { mode: 'shin', pitch: 0 }, footR: { mode: 'shin', pitch: 0 },
    },
    B: {
      pelvis: [0, 0.907, 0.307], prot: [45, 0, 0], spine: [0, 0, 0], head: [0],
      armL: { space: 'chest', ik: [-0.1, 0.3, 0.15], pole: [1, -0.8, 0.3] }, armR: { space: 'chest', ik: [0.1, 0.27, 0.17], pole: [-1, -0.8, 0.3] },
      legL: { ik: [0.11, 0.27, -0.33], pole: [0, -0.7, 0.7] }, legR: { ik: [-0.11, 0.27, -0.33], pole: [0, -0.7, 0.7] },
      footL: { mode: 'shin', pitch: 0 }, footR: { mode: 'shin', pitch: 0 },
    },
  },

  leg_curl: {
    muscles: { p: ['hams'], s: ['calves'] },
    tempo: { go: 1, hold1: 0.4, back: 2, hold0: 0.3, conc: 'go' },
    view: { target: [0, 0.6, 0.2], dist: 3.6, views: { '34': [60, 12] } },
    scene: [
      ...seatBox(-0.02, 0.54, 0.42, 0.44),
      { t: 'box', s: [0.4, 0.66, 0.07], p: [0, 0.9, -0.3], r: [-15, 0, 0], m: 'pad' },
      { t: 'box', s: [0.46, 0.06, 0.16], p: [0, 0.675, 0.3], m: 'pad' },
      { t: 'box', s: [0.06, 0.66, 0.7], p: [-0.33, 0.45, 0.1], m: 'dark' },
      { t: 'cyl', r: 0.02, a: [-0.3, 0.675, 0.3], b: [-0.33, 0.675, 0.3], m: 'metal' },
      { t: 'cyl', r: 0.016, a: [0.28, 0.56, 0.12], b: [0.33, 0.56, 0.12], m: 'metal' },
      { t: 'cyl', r: 0.016, a: [-0.28, 0.56, 0.12], b: [-0.33, 0.56, 0.12], m: 'metal' },
    ],
    dyn: [{ t: 'roller', side: 'back', at: 0.86, pivot: [-0.33, 0.553, 0.394] }],
    A: {
      pelvis: [0, 0.62, -0.06], prot: [-14, 0, 0], spine: [-4, 0, 0], head: [6],
      armL: { ik: [0.28, 0.56, 0.12], pole: [0.4, -1, -0.6] }, armR: { ik: [-0.28, 0.56, 0.12], pole: [-0.4, -1, -0.6] },
      legL: { fk: { dir: [0, -0.02, 1], bend: 8, flex: [0, -1, -0.2] } }, legR: { fk: { dir: [0, -0.02, 1], bend: 8, flex: [0, -1, -0.2] } },
      footL: { pitch: -5 }, footR: { pitch: -5 },
    },
    B: {
      pelvis: [0, 0.62, -0.06], prot: [-14, 0, 0], spine: [-4, 0, 0], head: [6],
      armL: { ik: [0.28, 0.56, 0.12], pole: [0.4, -1, -0.6] }, armR: { ik: [-0.28, 0.56, 0.12], pole: [-0.4, -1, -0.6] },
      legL: { fk: { dir: [0, -0.02, 1], bend: 105, flex: [0, -1, -0.2] } }, legR: { fk: { dir: [0, -0.02, 1], bend: 105, flex: [0, -1, -0.2] } },
      footL: { pitch: -5 }, footR: { pitch: -5 },
    },
  },

  leg_ext: {
    muscles: { p: ['quads'], s: [] },
    tempo: { go: 1, hold1: 0.4, back: 2, hold0: 0.3, conc: 'go' },
    view: { target: [0, 0.6, 0.2], dist: 3.6, views: { '34': [58, 10] } },
    scene: [
      ...seatBox(-0.02, 0.54, 0.42, 0.44),
      { t: 'box', s: [0.4, 0.68, 0.07], p: [0, 0.92, -0.27], r: [-6, 0, 0], m: 'pad' },
      { t: 'box', s: [0.06, 0.66, 0.7], p: [-0.33, 0.45, 0.1], m: 'dark' },
      { t: 'cyl', r: 0.016, a: [0.28, 0.56, 0.12], b: [0.33, 0.56, 0.12], m: 'metal' },
      { t: 'cyl', r: 0.016, a: [-0.28, 0.56, 0.12], b: [-0.33, 0.56, 0.12], m: 'metal' },
    ],
    dyn: [{ t: 'roller', side: 'front', at: 0.86, pivot: [-0.33, 0.56, 0.42] }],
    A: {
      pelvis: [0, 0.62, -0.04], prot: [-6, 0, 0], spine: [-2, 0, 0], head: [0],
      armL: { ik: [0.28, 0.56, 0.12], pole: [0.4, -1, -0.6] }, armR: { ik: [-0.28, 0.56, 0.12], pole: [-0.4, -1, -0.6] },
      legL: { fk: { dir: [0, 0, 1], bend: 94, flex: [0, -1, -0.25] } }, legR: { fk: { dir: [0, 0, 1], bend: 94, flex: [0, -1, -0.25] } },
      footL: { pitch: -8 }, footR: { pitch: -8 },
    },
    B: {
      pelvis: [0, 0.62, -0.04], prot: [-6, 0, 0], spine: [-2, 0, 0], head: [0],
      armL: { ik: [0.28, 0.56, 0.12], pole: [0.4, -1, -0.6] }, armR: { ik: [-0.28, 0.56, 0.12], pole: [-0.4, -1, -0.6] },
      legL: { fk: { dir: [0, 0, 1], bend: 4, flex: [0, -1, -0.25] } }, legR: { fk: { dir: [0, 0, 1], bend: 4, flex: [0, -1, -0.25] } },
      footL: { pitch: -8 }, footR: { pitch: -8 },
    },
  },

  mollets: {
    muscles: { p: ['calves'], s: [] },
    tempo: { go: 1, hold1: 0.6, back: 2, hold0: 0.8, conc: 'go' },
    view: { target: [0, 0.95, -0.1], dist: 4.3, views: { '34': [62, 8] } },
    scene: [
      { t: 'box', s: [0.6, 0.14, 0.3], p: [0, 0.07, 0.12], m: 'pad' },
      { t: 'box', s: [0.8, 0.04, 0.9], p: [0, 0.02, -0.25], m: 'dark' },
      { t: 'box', s: [0.12, 2.0, 0.12], p: [0, 1.0, -0.62], m: 'dark' },
      { t: 'cyl', r: 0.012, a: [0.09, 0.05, -0.62], b: [0.09, 1.95, -0.62], m: 'metal' },
      { t: 'cyl', r: 0.012, a: [-0.09, 0.05, -0.62], b: [-0.09, 1.95, -0.62], m: 'metal' },
    ],
    dyn: [{
      t: 'chestItem', items: [
        { t: 'box', s: [0.14, 0.06, 0.18], p: [0.13, 0.43, -0.01], m: 'pad' },
        { t: 'box', s: [0.14, 0.06, 0.18], p: [-0.13, 0.43, -0.01], m: 'pad' },
        { t: 'box', s: [0.5, 0.04, 0.05], p: [0, 0.47, -0.08], m: 'dark' },
        { t: 'box', s: [0.06, 0.05, 0.5], p: [0, 0.47, -0.32], m: 'dark' },
        { t: 'cyl', r: 0.016, a: [0.26, 0.47, -0.08], b: [0.3, 0.47, 0.12], m: 'metal' },
        { t: 'cyl', r: 0.016, a: [-0.26, 0.47, -0.08], b: [-0.3, 0.47, 0.12], m: 'metal' },
      ],
    }],
    A: {
      pelvis: [0, 1.1, -0.084], prot: [0, 0, 0], spine: [0, 0, 0], head: [0],
      armL: { space: 'chest', ik: [0.3, 0.47, 0.12], pole: [0.5, -1, 0.2] }, armR: { space: 'chest', ik: [-0.3, 0.47, 0.12], pole: [-0.5, -1, 0.2] },
      legL: { ik: [0.11, 0.174, -0.084], pole: [0.1, 0, 1] }, legR: { ik: [-0.11, 0.174, -0.084], pole: [-0.1, 0, 1] },
      footL: { pitch: -15 }, footR: { pitch: -15 },
    },
    B: {
      pelvis: [0, 1.197, -0.006], prot: [0, 0, 0], spine: [0, 0, 0], head: [0],
      armL: { space: 'chest', ik: [0.3, 0.47, 0.12], pole: [0.5, -1, 0.2] }, armR: { space: 'chest', ik: [-0.3, 0.47, 0.12], pole: [-0.5, -1, 0.2] },
      legL: { ik: [0.11, 0.272, -0.006], pole: [0.1, 0, 1] }, legR: { ik: [-0.11, 0.272, -0.006], pole: [-0.1, 0, 1] },
      footL: { pitch: 35 }, footR: { pitch: 35 },
    },
  },

  leves_genoux: {
    muscles: { p: ['abs'], s: ['obliques'] },
    tempo: { go: 1, hold1: 0.5, back: 2, hold0: 0.3, conc: 'go' },
    view: { target: [0, 1.05, 0.1], dist: 4.0, views: { '34': [56, 8] } },
    scene: [
      { t: 'box', s: [0.36, 0.6, 0.06], p: [0, 1.42, -0.16], m: 'pad' },
      { t: 'box', s: [0.09, 0.05, 0.4], p: [0.26, 1.27, 0.06], m: 'pad' },
      { t: 'box', s: [0.09, 0.05, 0.4], p: [-0.26, 1.27, 0.06], m: 'pad' },
      { t: 'cyl', r: 0.022, a: [0.24, 1.25, 0.32], b: [0.24, 1.42, 0.32], m: 'metal' },
      { t: 'cyl', r: 0.022, a: [-0.24, 1.25, 0.32], b: [-0.24, 1.42, 0.32], m: 'metal' },
      { t: 'box', s: [0.06, 2.0, 0.06], p: [0.32, 1.0, -0.2], m: 'dark' },
      { t: 'box', s: [0.06, 2.0, 0.06], p: [-0.32, 1.0, -0.2], m: 'dark' },
      { t: 'cyl', r: 0.025, a: [0.32, 1.24, -0.2], b: [0.32, 1.24, 0.28], m: 'dark' },
      { t: 'cyl', r: 0.025, a: [-0.32, 1.24, -0.2], b: [-0.32, 1.24, 0.28], m: 'dark' },
      { t: 'box', s: [0.72, 0.04, 0.8], p: [0, 0.02, 0], m: 'dark' },
    ],
    A: {
      pelvis: [0, 1.15, -0.04], prot: [0, 0, 0], spine: [0, 0, 0], head: [0],
      armL: { ik: [0.24, 1.33, 0.3], pole: [0, -1, -0.3] }, armR: { ik: [-0.24, 1.33, 0.3], pole: [0, -1, -0.3] },
      legL: { fk: { dir: [0.02, -1, 0.06], bend: 6, flex: [0, -0.5, -1] } }, legR: { fk: { dir: [-0.02, -1, 0.06], bend: 6, flex: [0, -0.5, -1] } },
      footL: { pitch: 20 }, footR: { pitch: 20 },
    },
    B: {
      pelvis: [0, 1.17, 0.0], prot: [-14, 0, 0], spine: [6, 0, 0], head: [4],
      armL: { ik: [0.24, 1.33, 0.3], pole: [0, -1, -0.3] }, armR: { ik: [-0.24, 1.33, 0.3], pole: [0, -1, -0.3] },
      legL: { fk: { dir: [0.03, 0.14, 1], bend: 95, flex: [0, -1, -0.3] } }, legR: { fk: { dir: [-0.03, 0.14, 1], bend: 95, flex: [0, -1, -0.3] } },
      footL: { pitch: 20 }, footR: { pitch: 20 },
    },
  },

  pec_deck: {
    muscles: { p: ['pecs'], s: ['delts_ant', 'biceps'] },
    tempo: { go: 1, hold1: 0.5, back: 2, hold0: 0.3, conc: 'go' },
    view: { target: [0, 1.0, 0.1], dist: 3.8, views: { '34': [26, 24] } },
    scene: [
      ...seatBox(0, 0.5),
      { t: 'box', s: [0.38, 0.78, 0.07], p: [0, 0.98, -0.16], r: [-3, 0, 0], m: 'pad' },
      { t: 'box', s: [0.12, 1.9, 0.12], p: [0, 0.95, -0.42], m: 'dark' },
      { t: 'box', s: [0.6, 0.08, 0.1], p: [0, 1.82, -0.36], m: 'dark' },
      { t: 'cyl', r: 0.02, a: [0.17, 1.8, -0.32], b: [0.17, 1.14, -0.32], m: 'metal' },
      { t: 'cyl', r: 0.02, a: [-0.17, 1.8, -0.32], b: [-0.17, 1.14, -0.32], m: 'metal' },
    ],
    dyn: [
      { t: 'lever', hand: 'L', pivot: [0.17, 1.14, -0.32], handle: 'v' },
      { t: 'lever', hand: 'R', pivot: [-0.17, 1.14, -0.32], handle: 'v' },
    ],
    A: {
      pelvis: [0, 0.6, -0.02], prot: [-3, 0, 0], spine: [0, 0, 0], head: [0],
      armL: { fk: { dir: [1, 0.02, -0.15], bend: 18, flex: [0, 0, 1] } }, armR: { fk: { dir: [-1, 0.02, -0.15], bend: 18, flex: [0, 0, 1] } },
      legL: { ik: [0.2, 0.075, 0.45], pole: [0.3, 1, 1] }, legR: { ik: [-0.2, 0.075, 0.45], pole: [-0.3, 1, 1] },
      footL: { yaw: 8 }, footR: { yaw: 8 },
    },
    B: {
      pelvis: [0, 0.6, -0.02], prot: [-3, 0, 0], spine: [0, 0, 0], head: [0],
      armL: { fk: { dir: [-0.22, 0.0, 1], bend: 18, flex: [-1, 0, 0.1] } }, armR: { fk: { dir: [0.22, 0.0, 1], bend: 18, flex: [1, 0, 0.1] } },
      legL: { ik: [0.2, 0.075, 0.45], pole: [0.3, 1, 1] }, legR: { ik: [-0.2, 0.075, 0.45], pole: [-0.3, 1, 1] },
      footL: { yaw: 8 }, footR: { yaw: 8 },
    },
  },

  pec_deck_inv: {
    muscles: { p: ['delts_post', 'upperback'], s: ['traps'] },
    tempo: { go: 1, hold1: 0.5, back: 2, hold0: 0.3, conc: 'go' },
    view: { target: [0, 1.05, 0.1], dist: 3.9, views: { '34': [148, 18], face: [30, 16] } },
    scene: [
      ...seatBox(0, 0.5),
      { t: 'box', s: [0.32, 0.55, 0.07], p: [0, 0.98, 0.17], r: [4, 0, 0], m: 'pad' },
      { t: 'cyl', r: 0.03, a: [0, 0.7, 0.22], b: [0, 0.7, 0.42], m: 'dark' },
      { t: 'box', s: [0.12, 1.9, 0.12], p: [0, 0.95, 0.46], m: 'dark' },
      { t: 'box', s: [0.6, 0.08, 0.1], p: [0, 1.82, 0.4], m: 'dark' },
      { t: 'cyl', r: 0.02, a: [0.17, 1.8, 0.36], b: [0.17, 1.17, 0.36], m: 'metal' },
      { t: 'cyl', r: 0.02, a: [-0.17, 1.8, 0.36], b: [-0.17, 1.17, 0.36], m: 'metal' },
    ],
    dyn: [
      { t: 'lever', hand: 'L', pivot: [0.17, 1.17, 0.36], handle: 'v' },
      { t: 'lever', hand: 'R', pivot: [-0.17, 1.17, 0.36], handle: 'v' },
    ],
    A: {
      pelvis: [0, 0.6, -0.04], prot: [4, 0, 0], spine: [4, 0, 0], head: [0],
      armL: { fk: { dir: [0.16, 0.06, 1], bend: 12, flex: [-1, 0, 0] } }, armR: { fk: { dir: [-0.16, 0.06, 1], bend: 12, flex: [1, 0, 0] } },
      legL: { ik: [0.2, 0.075, 0.42], pole: [0.3, 1, 1] }, legR: { ik: [-0.2, 0.075, 0.42], pole: [-0.3, 1, 1] },
      footL: { yaw: 8 }, footR: { yaw: 8 },
    },
    B: {
      pelvis: [0, 0.6, -0.04], prot: [4, 0, 0], spine: [4, 0, 0], head: [0],
      armL: { fk: { dir: [1, 0.06, -0.06], bend: 12, flex: [0, 0, 1] } }, armR: { fk: { dir: [-1, 0.06, -0.06], bend: 12, flex: [0, 0, 1] } },
      legL: { ik: [0.2, 0.075, 0.42], pole: [0.3, 1, 1] }, legR: { ik: [-0.2, 0.075, 0.42], pole: [-0.3, 1, 1] },
      footL: { yaw: 8 }, footR: { yaw: 8 },
    },
  },

  // ───────── échauffement ─────────
  balancier_avant: {
    muscles: { p: ['hams', 'glutes'], s: ['quads'] },
    tempo: { go: 0.8, hold1: 0.05, back: 0.8, hold0: 0.05, conc: 'go' },
    view: { target: [0, 0.95, 0], dist: 3.6, views: { '34': [82, 8] } },
    scene: [platform(1.4, 1.2, 0), { t: 'cyl', r: 0.03, a: [0.45, 0, 0.05], b: [0.45, 1.3, 0.05], m: 'dark' }],
    A: {
      pelvis: [0, ST, 0], prot: [0, 0, 0], spine: [0, 0, 0], head: [0],
      armL: { ik: [0.43, 1.05, 0.05], pole: [0.2, -1, -0.5] }, armR: relaxR,
      legL: { ik: [0.1, 0.075, 0], pole: [0.15, 0, 1] },
      legR: { fk: { dir: [-0.04, -0.72, 0.68], bend: 10, flex: [0, 0, -1] } },
      footL: { yaw: 6 }, footR: { pitch: 10 },
    },
    B: {
      pelvis: [0, ST, 0], prot: [0, 0, 0], spine: [-2, 0, 0], head: [0],
      armL: { ik: [0.43, 1.05, 0.05], pole: [0.2, -1, -0.5] }, armR: relaxR,
      legL: { ik: [0.1, 0.075, 0], pole: [0.15, 0, 1] },
      legR: { fk: { dir: [-0.04, -0.86, -0.5], bend: 10, flex: [0, 0, -1] } },
      footL: { yaw: 6 }, footR: { pitch: 10 },
    },
  },

  balancier_lateral: {
    muscles: { p: ['glutes'], s: ['quads', 'hams'] },
    tempo: { go: 0.8, hold1: 0.05, back: 0.8, hold0: 0.05, conc: 'go' },
    view: { target: [0, 0.95, 0], dist: 3.6, views: { '34': [12, 8] } },
    scene: [platform(1.4, 1.2, 0), { t: 'cyl', r: 0.03, a: [0, 0, 0.5], b: [0, 1.2, 0.5], m: 'dark' }, { t: 'cyl', r: 0.02, a: [-0.2, 1.08, 0.48], b: [0.2, 1.08, 0.48], m: 'metal' }],
    A: {
      pelvis: [0, ST, 0], prot: [2, 0, 0], spine: [0, 0, 0], head: [0],
      armL: { ik: [0.12, 1.08, 0.45], pole: [0.6, -1, -0.3] }, armR: { ik: [-0.12, 1.08, 0.45], pole: [-0.6, -1, -0.3] },
      legL: { ik: [0.1, 0.075, 0], pole: [0.15, 0, 1] },
      legR: { fk: { dir: [0.42, -0.9, 0.12], bend: 8, flex: [0, 0, -1] } },
      footL: { yaw: 6 }, footR: { pitch: 10 },
    },
    B: {
      pelvis: [0, ST, 0], prot: [2, 0, 4], spine: [0, 0, 0], head: [0],
      armL: { ik: [0.12, 1.08, 0.45], pole: [0.6, -1, -0.3] }, armR: { ik: [-0.12, 1.08, 0.45], pole: [-0.6, -1, -0.3] },
      legL: { ik: [0.1, 0.075, 0], pole: [0.15, 0, 1] },
      legR: { fk: { dir: [-0.62, -0.78, 0.05], bend: 8, flex: [0, 0, -1] } },
      footL: { yaw: 6 }, footR: { pitch: 10 },
    },
  },

  rot_externe: {
    muscles: { p: ['delts_post'], s: ['upperback'] },
    tempo: { go: 1, hold1: 0.3, back: 1.6, hold0: 0.3, conc: 'go' },
    view: { target: [0.1, 1.1, 0.1], dist: 3.6, views: { '34': [18, 26] } },
    scene: [
      platform(1.6, 1.0, 0),
      ...tower(0.72, 0.1, 2.1, -90),
      pulleyArm([0.62, 1.08, 0.18], [0.55, 1.08, 0.18]),
    ],
    dyn: [{ t: 'cable', from: [0.55, 1.08, 0.18], hand: 'R', handle: 'd', pulleyYaw: 0, stack: stack(0.68, 0.1, -90) }],
    A: {
      pelvis: [0, ST, 0], prot: [0, 0, 0], spine: [0, 0, 0], head: [0],
      armL: relaxL,
      armR: { fk: { dir: [-0.12, -1, 0.02], bend: 90, flex: [0.8, 0, 0.6] } },
      ...standLegs(0.12, 0, 8),
    },
    B: {
      pelvis: [0, ST, 0], prot: [0, 0, 0], spine: [0, 0, 0], head: [0],
      armL: relaxL,
      armR: { fk: { dir: [-0.12, -1, 0.02], bend: 90, flex: [-0.85, 0, 0.5] } },
      ...standLegs(0.12, 0, 8),
    },
  },

  rot_interne: {
    muscles: { p: ['pecs', 'delts_ant'], s: [] },
    tempo: { go: 1, hold1: 0.3, back: 1.6, hold0: 0.3, conc: 'go' },
    view: { target: [-0.1, 1.1, 0.1], dist: 3.6, views: { '34': [-18, 26] } },
    scene: [
      platform(1.6, 1.0, 0),
      ...tower(-0.72, 0.1, 2.1, 90),
      pulleyArm([-0.62, 1.08, 0.18], [-0.55, 1.08, 0.18]),
    ],
    dyn: [{ t: 'cable', from: [-0.55, 1.08, 0.18], hand: 'R', handle: 'd', pulleyYaw: 0, stack: stack(-0.68, 0.1, 90) }],
    A: {
      pelvis: [0, ST, 0], prot: [0, 0, 0], spine: [0, 0, 0], head: [0],
      armL: relaxL,
      armR: { fk: { dir: [-0.12, -1, 0.02], bend: 90, flex: [-0.85, 0, 0.5] } },
      ...standLegs(0.12, 0, 8),
    },
    B: {
      pelvis: [0, ST, 0], prot: [0, 0, 0], spine: [0, 0, 0], head: [0],
      armL: relaxL,
      armR: { fk: { dir: [-0.12, -1, 0.02], bend: 90, flex: [0.8, 0, 0.6] } },
      ...standLegs(0.12, 0, 8),
    },
  },
};
