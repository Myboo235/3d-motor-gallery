import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { loadBike } from './bike.js';
import { PARTS, GROUPS, VARIANTS, OVERVIEW, UI } from './data.js';

const $ = s => document.querySelector(s);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mobile = () => innerWidth <= 900;

/* ───────── Renderer / Scene ───────── */
const canvas = $('#gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
scene.environmentIntensity = 0.85;

const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 60);
const OVERVIEW_VIEW = { pos: new THREE.Vector3(2.75, 1.2, 3.1), target: new THREE.Vector3(-0.02, 0.5, 0) };
let userMoved = false;
const OVERVIEW_BASE = { pos: OVERVIEW_VIEW.pos.clone() };
camera.position.copy(OVERVIEW_VIEW.pos);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.minDistance = 0.55;
controls.maxDistance = 8;
controls.maxPolarAngle = Math.PI / 2 - 0.015;
controls.target.copy(OVERVIEW_VIEW.target);
controls.autoRotateSpeed = 1.4;

// ánh sáng
const key = new THREE.DirectionalLight(0xffffff, 2.4);
key.position.set(2.5, 4.5, 3.2);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2, near: 0.5, far: 12 });
key.shadow.bias = -0.0004;
key.shadow.normalBias = 0.02;
key.shadow.radius = 5;
scene.add(key);
const rim = new THREE.DirectionalLight(0xff3350, 2.6);
rim.position.set(-3.5, 2.2, -3);
scene.add(rim);
const rim2 = new THREE.DirectionalLight(0xbcd4ff, 1.2);
rim2.position.set(3, 1.5, -3.5);
scene.add(rim2);

/* ───────── Sân khấu (bàn xoay) ───────── */
const stage = new THREE.Group();
scene.add(stage);
const base = new THREE.Mesh(
  new THREE.CylinderGeometry(1.85, 1.9, 0.05, 128),
  new THREE.MeshStandardMaterial({ color: 0x0b0c10, metalness: 0.4, roughness: 0.7 }),
);
base.position.y = -0.026;
base.receiveShadow = true;
stage.add(base);
const ringMat = new THREE.MeshBasicMaterial({ color: 0xff3350, toneMapped: false });
const ring = new THREE.Mesh(new THREE.TorusGeometry(1.86, 0.006, 8, 200), ringMat);
ring.rotation.x = Math.PI / 2;
ring.position.y = 0.0;
stage.add(ring);

const dial = document.createElement('canvas');
dial.width = dial.height = 2048;
const dialTex = new THREE.CanvasTexture(dial);
dialTex.colorSpace = THREE.SRGBColorSpace;
dialTex.anisotropy = 8;
function drawDial(accent) {
  const c = dial.getContext('2d');
  const S = 2048, m = S / 2;
  c.clearRect(0, 0, S, S);
  c.translate(m, m);
  const rings = [[0.97, 2, 0.35], [0.9, 1, 0.18], [0.62, 1, 0.1], [0.34, 1, 0.1]];
  for (const [r, w, a] of rings) { c.strokeStyle = `rgba(255,255,255,${a})`; c.lineWidth = w * 2; c.beginPath(); c.arc(0, 0, r * m, 0, 7); c.stroke(); }
  for (let i = 0; i < 360; i += 2) {
    const long = i % 30 === 0, mid = i % 10 === 0;
    const r0 = 0.97 * m, r1 = r0 - (long ? 0.075 : mid ? 0.045 : 0.022) * m;
    c.strokeStyle = long ? accent : `rgba(255,255,255,${mid ? 0.5 : 0.22})`;
    c.lineWidth = long ? 5 : 2;
    const a = (i * Math.PI) / 180;
    c.beginPath(); c.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); c.lineTo(Math.cos(a) * r1, Math.sin(a) * r1); c.stroke();
  }
  c.fillStyle = 'rgba(255,255,255,.55)';
  c.font = '500 30px "JetBrains Mono", monospace';
  c.textAlign = 'center'; c.textBaseline = 'middle';
  for (let i = 0; i < 360; i += 30) {
    const a = (i * Math.PI) / 180, r = 0.84 * m;
    c.save(); c.translate(Math.cos(a) * r, Math.sin(a) * r); c.rotate(a + Math.PI / 2); c.fillText(String(i).padStart(3, '0'), 0, 0); c.restore();
  }
  c.strokeStyle = 'rgba(255,255,255,.07)'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(-0.62 * m, 0); c.lineTo(0.62 * m, 0); c.moveTo(0, -0.62 * m); c.lineTo(0, 0.62 * m); c.stroke();
  c.setTransform(1, 0, 0, 1, 0, 0);
  dialTex.needsUpdate = true;
}
const dialMesh = new THREE.Mesh(
  new THREE.CircleGeometry(1.85, 96),
  new THREE.MeshBasicMaterial({ map: dialTex, transparent: true, depthWrite: false, toneMapped: false }),
);
dialMesh.rotation.x = -Math.PI / 2;
dialMesh.position.y = 0.001;
stage.add(dialMesh);

const shadowCatcher = new THREE.Mesh(new THREE.CircleGeometry(1.85, 64), new THREE.ShadowMaterial({ opacity: 0.55 }));
shadowCatcher.rotation.x = -Math.PI / 2;
shadowCatcher.position.y = 0.002;
shadowCatcher.receiveShadow = true;
scene.add(shadowCatcher);
stage.scale.set(0.82, 1, 0.82);
shadowCatcher.scale.set(0.82, 1, 0.82);

/* ───────── Xe ───────── */
const fillEl = $('#gaugeFill'), numEl = $('#gaugeNum');
const setGauge = k => { fillEl.style.strokeDashoffset = 252 * (1 - k); numEl.textContent = Math.round(k * 100); };
const bike = await loadBike(p => setGauge(p * 0.85));
scene.add(bike.root);
const meshes = [];
bike.root.traverse(o => { if (o.isMesh) meshes.push(o); });

const state = {};  // per-part
const partById = {};
for (const p of PARTS) {
  const g = bike.parts[p.id];
  g.userData.partId = p.id;
  g.traverse(o => { if (o.isMesh) o.userData.partId = p.id; });
  const dir = new THREE.Vector3(...p.explode);
  const sides = [];
  g.children.forEach(c => { if (c.userData.side) sides.push(c); });
  state[p.id] = { fade: 1, fadeT: 1, hl: 0, hlT: 0, dir, group: g, sides, lat: p.lateral || 0 };
  partById[p.id] = p;
}

/* ───────── Màu sắc ───────── */
let variant = VARIANTS[0];
function applyVariant(v) {
  variant = v;
  bike.root.traverse(o => { if (o.material && o.material.userData.role === 'paint') o.material.color.set(v.tint); });
  document.documentElement.style.setProperty('--accent', v.accent);
  ringMat.color.set(v.accent);
  rim.color.set(v.accent);
  drawDial(v.accent);
  $('#variantName').textContent = v.name[lang];
  document.querySelectorAll('.sw').forEach(b => b.classList.toggle('on', b.dataset.id === v.id));
}
const swWrap = $('#swatches');
VARIANTS.forEach(v => {
  const b = document.createElement('button');
  b.className = 'sw';
  b.dataset.id = v.id;
  b.style.setProperty('--p', v.p);
  b.style.setProperty('--p2', v.p2);
  b.onclick = () => applyVariant(v);
  swWrap.append(b);
});

/* ───────── Language ───────── */
let lang = 'en';
try { lang = localStorage.getItem('hb-lang') || 'en'; } catch {}
if (!UI[lang]) lang = 'en';
const T = k => UI[lang][k];

/* ───────── List ───────── */
const ORDER = GROUPS.flatMap(g => PARTS.filter(p => p.group === g.id).map(p => p.id));
ORDER.forEach((id, i) => { partById[id].num = String(i + 1).padStart(2, '0'); });
const listBody = $('#listBody');
function buildList() {
  listBody.innerHTML = '';
  GROUPS.forEach(g => {
    const h = document.createElement('div');
    h.className = 'gh';
    h.innerHTML = `${g[lang]} <i>${g.ja}</i>`;
    listBody.append(h);
    PARTS.filter(p => p.group === g.id).forEach(p => {
      const b = document.createElement('button');
      b.className = 'item' + (p.id === selected ? ' on' : '');
      b.dataset.id = p.id;
      b.innerHTML = `<span class="n">${p.num}</span><span>${p[lang].name}</span>`;
      b.onclick = () => select(p.id);
      listBody.append(b);
    });
  });
}

/* hotspots */
const hsWrap = $('#hotspots');
PARTS.forEach(p => {
  const el = document.createElement('div');
  el.className = 'hs';
  el.innerHTML = `<button>${p.num}</button><span class="lb"></span>`;
  el.querySelector('button').onclick = () => select(p.id);
  el.addEventListener('pointerenter', () => hover(p.id));
  el.addEventListener('pointerleave', () => hover(null));
  hsWrap.append(el);
  state[p.id].hs = el;
  state[p.id].anchor = bike.rest[p.id].anchor.clone();
});

/* ───────── Chọn / hover ───────── */
var selected = null;
let hovered = null;
let isolate = true;
let tween = null;

function hover(id) {
  hovered = id;
  canvas.style.cursor = id ? 'pointer' : '';
}

function fillInfo(p) {
  const body = $('#infoBody');
  const d = p ? p[lang] : OVERVIEW[lang];
  $('#infoGroup').textContent = p ? GROUPS.find(g => g.id === p.group)[lang] : T('tagOverview');
  $('#infoName').textContent = d.name;
  $('#infoEn').textContent = p ? p.ja : OVERVIEW.ja;
  $('#infoDesc').textContent = d.desc;
  $('#infoSpecs').innerHTML = d.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  $('#infoCounter').textContent = p ? `${p.num} / ${String(PARTS.length).padStart(2, '0')}` : T('tagOverview');
  $('#infoGhost').textContent = p ? p.num : '00';
  body.classList.remove('swap'); void body.offsetWidth; body.classList.add('swap');
  body.scrollTop = 0;
}

function applyLang(l) {
  lang = l;
  try { localStorage.setItem('hb-lang', l); } catch {}
  document.documentElement.lang = l;
  document.querySelectorAll('[data-i18n]').forEach(e => { e.textContent = T(e.dataset.i18n); });
  document.querySelectorAll('[data-i18n-title]').forEach(e => { e.title = T(e.dataset.i18nTitle); });
  document.querySelectorAll('[data-i18n-aria]').forEach(e => { e.setAttribute('aria-label', T(e.dataset.i18nAria)); });
  document.querySelectorAll('#lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === l));
  PARTS.forEach(p => { state[p.id].hs.querySelector('.lb').textContent = p[l].name; state[p.id].hs.querySelector('button').setAttribute('aria-label', p[l].name); });
  $('#variantName').textContent = variant.name[l];
  buildList();
  fillInfo(selected ? partById[selected] : null);
}
document.querySelectorAll('#lang button').forEach(b => { b.onclick = () => applyLang(b.dataset.lang); });

function select(id, fly = true) {
  selected = id;
  document.querySelectorAll('.item').forEach(b => b.classList.toggle('on', b.dataset.id === id));
  $('#btnOverview').classList.toggle('on', !id);
  document.querySelectorAll('.views button').forEach(b => b.classList.remove('on'));
  fillInfo(id ? partById[id] : null);
  refreshFade();
  const active = document.querySelector('.item.on');
  if (active) active.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  if (!fly) return;
  if (!id) { flyTo(OVERVIEW_VIEW.pos, OVERVIEW_VIEW.target, 1.3); return; }
  const p = partById[id];
  const g = state[id].group;
  const box = new THREE.Box3().setFromObject(g);
  const c = box.getCenter(new THREE.Vector3());
  const r = box.getBoundingSphere(new THREE.Sphere()).radius;
  const fov = THREE.MathUtils.degToRad(camera.fov);
  let dist = Math.max(0.5, (r / Math.sin(fov / 2)) * 1.3) * p.view.d;
  if (camera.aspect < 1) dist *= 1.5;
  const az = THREE.MathUtils.degToRad(p.view.az), el = THREE.MathUtils.degToRad(p.view.el);
  const dir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
  flyTo(c.clone().addScaledVector(dir, dist), c, 1.25);
}

function refreshFade() {
  for (const id in state) {
    state[id].fadeT = selected && isolate && id !== selected ? 0.06 : 1;
  }
}

function step(dir) {
  const i = selected ? ORDER.indexOf(selected) : -1;
  const n = ORDER.length;
  select(ORDER[(i + dir + n) % n]);
}

function flyTo(pos, target, dur = 1.2) {
  tween = {
    t: 0, dur,
    p0: camera.position.clone(), t0: controls.target.clone(),
    p1: pos.clone(), t1: target.clone(),
  };
}
controls.addEventListener('start', () => { tween = null; userMoved = true; hideHint(); });

/* ───────── Dock ───────── */
const VIEWS = {
  front: [new THREE.Vector3(4.0, 0.85, 0.0), new THREE.Vector3(0, 0.55, 0)],
  side: [new THREE.Vector3(0.0, 0.8, 4.4), new THREE.Vector3(-0.05, 0.55, 0)],
  rear: [new THREE.Vector3(-4.0, 0.85, 0.0), new THREE.Vector3(0, 0.55, 0)],
  top: [new THREE.Vector3(0.01, 5.0, 0.35), new THREE.Vector3(-0.05, 0.3, 0)],
};
document.querySelectorAll('[data-view]').forEach(b => {
  b.onclick = () => {
    select(null, false);
    document.querySelectorAll('.item.on').forEach(x => x.classList.remove('on'));
    const [p, t] = VIEWS[b.dataset.view];
    flyTo(p, t, 1.1);
    document.querySelectorAll('.views button').forEach(x => x.classList.toggle('on', x === b));
  };
});
$('#btnOverview').onclick = () => select(null);
$('#prev').onclick = () => step(-1);
$('#next').onclick = () => step(1);

let explodeT = 0, explodeC = 0;
const ex = $('#explode');
const setExplode = v => {
  explodeT = v;
  ex.value = v;
  ex.style.setProperty('--v', v * 100 + '%');
  $('#explodeOut').textContent = Math.round(v * 100) + '%';
};
ex.oninput = () => { setExplode(+ex.value); };

const toggle = (btn, fn) => btn.addEventListener('click', () => { btn.classList.toggle('on'); fn(btn.classList.contains('on')); });
toggle($('#tgRotate'), on => { controls.autoRotate = on; });
toggle($('#tgIso'), on => { isolate = on; refreshFade(); });
let wire = false;
toggle($('#tgWire'), on => {
  wire = on;
  bike.root.traverse(o => { if (o.isMesh && o.material.type !== 'MeshBasicMaterial') o.material.wireframe = on; });
});
let ride = false, speed = 0;
toggle($('#tgRide'), on => { ride = on; });
let shot = false;
$('#btnShot').onclick = () => { shot = true; };

addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === 'ArrowRight') step(1);
  else if (e.key === 'ArrowLeft') step(-1);
  else if (e.key === 'Escape') select(null);
  else if (e.key === 'e' || e.key === 'E') setExplode(explodeT > 0.5 ? 0 : 1);
  else if (e.key === 'r' || e.key === 'R') $('#tgRide').click();
  else if (e.key === ' ') { e.preventDefault(); $('#tgRotate').click(); }
});

function hideHint() { $('#hint').classList.add('gone'); }

/* ───────── Con trỏ / chọn bằng click ───────── */
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();
let ptr = null, down = null, ptrDirty = false;
const tip = $('#tip');
canvas.addEventListener('pointermove', e => {
  ptr = { x: e.clientX, y: e.clientY };
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ptrDirty = true;
  document.documentElement.style.setProperty('--mx', (e.clientX / innerWidth - 0.5).toFixed(3));
  document.documentElement.style.setProperty('--my', (e.clientY / innerHeight - 0.5).toFixed(3));
  tip.style.left = e.clientX + 'px';
  tip.style.top = e.clientY + 'px';
});
canvas.addEventListener('pointerleave', () => { ptr = null; hover(null); tip.classList.remove('show'); });
canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener('pointerup', e => {
  if (!down) return;
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
  down = null;
  if (moved > 5) return;
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  const id = pick();
  if (id) select(id); else if (selected) select(null);
});
function pick() {
  ray.setFromCamera(ndc, camera);
  const hits = ray.intersectObjects(meshes, false);
  for (const h of hits) {
    const id = h.object.userData.partId;
    if (!id || !h.object.visible) continue;
    if (state[id].fade < 0.4) continue;
    if (h.object.material.userData.role === 'glow' && false) continue;
    return id;
  }
  return null;
}

/* ───────── Resize ───────── */
function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  const portrait = camera.aspect < 1;
  // pull the overview camera back on narrow screens so the whole bike fits
  const k = portrait ? Math.min(2.4, 1 / Math.max(camera.aspect, 0.4) * 1.1) : 1;
  OVERVIEW_VIEW.pos.copy(OVERVIEW_BASE.pos).sub(OVERVIEW_VIEW.target).multiplyScalar(k).add(OVERVIEW_VIEW.target);
  if (!userMoved && !tween && !selected) camera.position.copy(OVERVIEW_VIEW.pos);
  if (!mobile()) {
    const lw = $('#list').offsetWidth + 28, rw = $('#info').offsetWidth + 28;
    camera.setViewOffset(w, h, -(lw - rw) / 2, 0, w, h);
  } else {
    camera.setViewOffset(w, h, 0, h * 0.14, w, h);
  }
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);

/* ───────── Vòng lặp ───────── */
const clock = new THREE.Clock();
const tmp = new THREE.Vector3();
let frame = 0;
const occRay = new THREE.Raycaster();

function tick() {
  const dt = Math.min(clock.getDelta(), 0.05);
  frame++;

  // camera tween
  if (tween) {
    tween.t += dt / tween.dur;
    const k = ease(clamp(tween.t, 0, 1));
    camera.position.lerpVectors(tween.p0, tween.p1, k);
    controls.target.lerpVectors(tween.t0, tween.t1, k);
    if (tween.t >= 1) tween = null;
  }
  controls.update();

  // tách rời
  explodeC += (explodeT - explodeC) * (1 - Math.exp(-5 * dt));
  if (introT !== null) {
    introT += dt / 2.6;
    const k = ease(clamp(introT, 0, 1));
    explodeC = 1 - k;
    explodeT = 0;
    if (introT >= 1) { introT = null; explodeC = 0; setExplode(0); }
  }

  // hover → highlight; fade
  const fadeK = 1 - Math.exp(-8 * dt);
  for (const id in state) {
    const s = state[id];
    s.group.position.copy(s.dir).multiplyScalar(explodeC);
    for (const c of s.sides) c.position.z = c.userData.side * s.lat * explodeC;
    s.hlT = id === hovered ? 1 : id === selected ? 0.1 : 0;
    s.hl += (s.hlT - s.hl) * fadeK;
    s.fade += (s.fadeT - s.fade) * fadeK;
  }
  if (ptrDirty && ptr && !down) {
    ptrDirty = false;
    const id = pick();
    if (id !== hovered) hover(id);
    tip.textContent = id ? partById[id][lang].name : '';
    tip.classList.toggle('show', !!id);
  }
  // áp vật liệu
  const accentC = new THREE.Color(variant.accent);
  for (const m of meshes) {
    const s = state[m.userData.partId];
    const mat = m.material;
    const role = mat.userData.role;
    const op = (mat.userData.baseOpacity ?? 1) * s.fade;
    if (mat.opacity !== op) {
      mat.opacity = op;
      const tr = op < 0.999 || mat.userData.baseOpacity < 1;
      if (mat.transparent !== tr) { mat.transparent = tr; mat.needsUpdate = true; }
      mat.depthWrite = op > 0.5;
    }
    m.castShadow = s.fade > 0.5;
    if (role !== 'glow' && mat.emissive) {
      mat.emissive.copy(accentC);
      mat.emissiveIntensity = s.hl * 0.28;
    }
  }
  for (const sp of bike.sprites) {
    const s = state[sp.parent.name];
    sp.material.opacity = sp.userData.baseOpacity * s.fade;
  }

  // chạy thử
  const target = ride ? 56 : 0;
  speed += (target - speed) * (1 - Math.exp(-1.4 * dt));
  if (speed > 0.05) {
    const w = (speed / 3.6 / 0.274) * dt;
    bike.wheels.front.rotation.z -= w;
    bike.wheels.rear.rotation.z -= w;
    stage.rotation.y += (speed / 3.6) * dt * 0.12;
    dialMesh.rotation.z = stage.rotation.y;
  }

  renderer.render(scene, camera);

  // hotspots
  const occIdx = frame % PARTS.length;
  for (let pi = 0; pi < PARTS.length; pi++) {
    const p = PARTS[pi];
    const s = state[p.id];
    tmp.copy(s.anchor).add(s.group.position);
    const world = tmp.clone();
    tmp.project(camera);
    const x = (tmp.x * 0.5 + 0.5) * innerWidth;
    const y = (-tmp.y * 0.5 + 0.5) * innerHeight;
    s.hs.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    s.hs.classList.toggle('hot', p.id === selected);
    s.hs.classList.toggle('dim', !!selected && p.id !== selected);
    if (pi === occIdx) {
      const dir = world.clone().sub(camera.position);
      const d = dir.length();
      occRay.set(camera.position, dir.normalize());
      const hits = occRay.intersectObjects(meshes, false);
      let occ = false;
      for (const h of hits) {
        if (h.distance > d - 0.03) break;
        const hp = h.object.userData.partId;
        if (state[hp].fade < 0.4) continue;
        if (hp !== p.id) { occ = true; break; }
      }
      s.occ = occ;
    }
    s.hs.classList.toggle('occ', !!s.occ && p.id !== selected && !(selected && isolate));
  }

  if (shot) {
    shot = false;
    canvas.toBlob(b => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = 'air-blade-3d.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    });
  }
  requestAnimationFrame(tick);
}

/* ───────── Khởi động ───────── */
let introT = null;
applyVariant(VARIANTS[0]);
applyLang(lang);
select(null, false);
setExplode(0);
resize();

function boot() {
  let k = 0.85;
  const id = setInterval(() => {
    k += 0.04;
    setGauge(Math.min(1, k));
    if (k >= 1.05) {
      clearInterval(id);
      $('#loader').classList.add('done');
      if (!location.search.includes('nointro')) {
        introT = 0;
        camera.position.set(-4.2, 2.6, 4.6);
        flyTo(OVERVIEW_VIEW.pos, OVERVIEW_VIEW.target, 3.0);
      }
    }
  }, 40);
}

tick();
document.fonts?.ready.then(() => drawDial(variant.accent));
boot();
