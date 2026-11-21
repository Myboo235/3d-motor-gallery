import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MODEL = 'models/suzuki_hayabusa/scene.gltf';
const PAINT_PARTS = new Set(['front-fairing', 'side-fairing', 'tail', 'tank']);
const SIDED = new Set(['side-fairing', 'exhaust']);
export const PART_IDS = ['front-fairing', 'windscreen', 'headlight', 'handlebar', 'tank', 'seat', 'side-fairing', 'tail', 'engine', 'exhaust', 'fork', 'front-wheel', 'swingarm', 'rear-wheel'];

/** Assign a connected piece of the source meshes to a bike part.
 *  Source axes: x = lateral, y = up, z = forward. b = piece bounding box. */
function classify(name, b, n) {
  const c = b.getCenter(new THREE.Vector3());
  if (name.includes('Wheel_F')) return 'front-wheel';
  if (name.includes('Wheel_B')) return 'rear-wheel';
  if (name.includes('exhaust')) return 'exhaust';
  if (name.includes('glasses')) return b.max.z > 0.75 && b.max.y < 0.95 ? 'headlight' : 'windscreen';
  if (name.includes('D_17')) return 'engine';
  if (name.includes('_Fl_') || name.includes('_FR_')) return 'side-fairing';
  if (name.includes('B_25')) return 'tail';
  if (name.includes('mate_plastic')) {
    if (c.y > 0.95) return 'handlebar';
    if (c.z < -0.1) return 'seat';
    return 'tank';
  }
  if (name.includes('chassis_details')) {
    if (c.z < -0.85 && c.y > 0.7) return 'tail';
    if (c.y > 0.3 && c.z > 0.25) return 'front-fairing';
    return 'engine';
  }
  if (name.includes('chassis_chassis')) {
    if (c.z > 0.8 && c.y < 0.85 && n < 600) return 'headlight';
    if (n > 4000 && c.z > 0.3) return 'front-fairing';
    if (b.min.z > -0.3 && b.max.z < 0.42 && b.max.y > 0.9 && n > 2500) return 'tank';
    if (b.max.y < 0.76 && (Math.abs(c.x) > 0.04) && c.z > -0.4 && c.z < 0.45) return 'side-fairing';
    if (c.z < -0.2) return 'tail';
    if (c.z > 0.3) return 'front-fairing';
    return 'tank';
  }
  // skinned_mesh_* : forks, fender, bars, swingarm, frame bits
  if (c.y > 0.84 && c.z > 0.3) return 'handlebar';
  if (c.z > 0.35) return 'fork';
  if (c.z < -0.1) return 'swingarm';
  return 'engine';
}

export async function loadBike(onProgress) {
  const gltf = await new GLTFLoader().loadAsync(MODEL, e => onProgress?.(e.total ? e.loaded / e.total : 0.5));
  const src = gltf.scene;
  src.updateMatrixWorld(true);

  const buckets = new Map(); // key -> {part, side, mat, geoms[]}
  const meshes = [];
  src.traverse(m => { if (m.isMesh) meshes.push(m); });

  const v = new THREE.Vector3();
  for (const m of meshes) {
    const g = m.geometry.clone();
    g.applyMatrix4(m.matrixWorld);
    const pos = g.attributes.position, idx = g.index;
    const vid = new Int32Array(pos.count), seen = new Map();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const k = Math.round(v.x * 1e4) + ',' + Math.round(v.y * 1e4) + ',' + Math.round(v.z * 1e4);
      let id = seen.get(k);
      if (id === undefined) { id = seen.size; seen.set(k, id); }
      vid[i] = id;
    }
    const par = Int32Array.from({ length: seen.size }, (_, i) => i);
    const find = a => { while (par[a] !== a) { par[a] = par[par[a]]; a = par[a]; } return a; };
    const unite = (a, b) => { a = find(a); b = find(b); if (a !== b) par[a] = b; };
    for (let i = 0; i < idx.count; i += 3) {
      unite(vid[idx.getX(i)], vid[idx.getX(i + 1)]);
      unite(vid[idx.getX(i)], vid[idx.getX(i + 2)]);
    }
    const comps = new Map();
    for (let i = 0; i < pos.count; i++) {
      const c = find(vid[i]);
      let o = comps.get(c);
      if (!o) { o = { n: 0, b: new THREE.Box3() }; comps.set(c, o); }
      o.n++;
      o.b.expandByPoint(v.fromBufferAttribute(pos, i));
    }
    for (const o of comps.values()) {
      o.part = classify(m.name, o.b, o.n);
      const cx = (o.b.min.x + o.b.max.x) / 2;
      o.side = SIDED.has(o.part) ? (cx > 0 ? 1 : -1) : 0;
    }
    // collect triangles per (part, side)
    const lists = new Map();
    for (let i = 0; i < idx.count; i += 3) {
      const o = comps.get(find(vid[idx.getX(i)]));
      const key = o.part + '|' + o.side;
      let l = lists.get(key);
      if (!l) { l = { part: o.part, side: o.side, tris: [] }; lists.set(key, l); }
      l.tris.push(idx.getX(i), idx.getX(i + 1), idx.getX(i + 2));
    }
    for (const l of lists.values()) {
      const map = new Map(), order = [];
      const index = l.tris.map(t => { let n = map.get(t); if (n === undefined) { n = order.length; map.set(t, n); order.push(t); } return n; });
      const ng = new THREE.BufferGeometry();
      for (const name of Object.keys(g.attributes)) {
        const a = g.attributes[name], arr = new Float32Array(order.length * a.itemSize);
        order.forEach((o, i) => { for (let k = 0; k < a.itemSize; k++) arr[i * a.itemSize + k] = a.array[o * a.itemSize + k]; });
        ng.setAttribute(name, new THREE.BufferAttribute(arr, a.itemSize));
      }
      ng.setIndex(index);
      buckets.set(`${l.part}|${l.side}|${m.material.uuid}|${m.uuid}`, { part: l.part, side: l.side, srcMat: m.material, geom: ng });
    }
  }

  // orient: source forward (+z) → +x, centre on x
  const rot = new THREE.Matrix4().makeRotationY(Math.PI / 2);
  const all = new THREE.Box3();
  for (const b of buckets.values()) { b.geom.applyMatrix4(rot); b.geom.computeBoundingBox(); all.union(b.geom.boundingBox); }
  const shift = new THREE.Matrix4().makeTranslation(-(all.min.x + all.max.x) / 2, -all.min.y, 0);
  for (const b of buckets.values()) b.geom.applyMatrix4(shift);

  // materials
  const cache = new Map();
  const matFor = (srcMat, part) => {
    const key = srcMat.uuid + (PAINT_PARTS.has(part) ? '|paint' : '');
    if (cache.has(key)) return cache.get(key);
    let m;
    if (srcMat.name === 'Material.004') {
      m = new THREE.MeshPhysicalMaterial({ color: 0x1a2733, roughness: 0.04, metalness: 0, clearcoat: 1, transparent: true, opacity: 0.38 });
      m.userData.baseOpacity = 0.38;
    } else if (srcMat.name === 'Material.005') {
      m = new THREE.MeshStandardMaterial({ color: 0x101012, roughness: 0.9, metalness: 0 });
    } else if (PAINT_PARTS.has(part) && srcMat.name === 'Material.001') {
      m = new THREE.MeshPhysicalMaterial({ map: srcMat.map, color: 0xffffff, roughness: 0.32, metalness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 });
      m.userData.role = 'paint';
    } else {
      m = new THREE.MeshStandardMaterial({ map: srcMat.map, color: 0xffffff, roughness: srcMat.name === 'Material.003' ? 0.38 : 0.55, metalness: srcMat.name === 'Material.003' ? 0.55 : 0.2 });
    }
    if (m.userData.baseOpacity === undefined) m.userData.baseOpacity = 1;
    cache.set(key, m);
    return m;
  };

  const root = new THREE.Group();
  const parts = {};
  for (const id of PART_IDS) { const g = new THREE.Group(); g.name = id; root.add(g); parts[id] = g; }

  const wheels = {};
  for (const id of ['front-wheel', 'rear-wheel']) {
    const box = new THREE.Box3();
    for (const b of buckets.values()) if (b.part === id) { b.geom.computeBoundingBox(); box.union(b.geom.boundingBox); }
    const c = box.getCenter(new THREE.Vector3());
    const spin = new THREE.Group();
    spin.position.set(c.x, c.y, 0);
    parts[id].add(spin);
    wheels[id === 'front-wheel' ? 'front' : 'rear'] = spin;
    for (const b of buckets.values()) if (b.part === id) b.geom.translate(-c.x, -c.y, 0);
  }

  const sideGroups = {};
  for (const b of buckets.values()) {
    const mesh = new THREE.Mesh(b.geom, matFor(b.srcMat, b.part));
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    let parent = parts[b.part];
    if (b.part === 'front-wheel') parent = wheels.front;
    else if (b.part === 'rear-wheel') parent = wheels.rear;
    else if (b.side) {
      const key = b.part + b.side;
      if (!sideGroups[key]) { const sg = new THREE.Group(); sg.userData.side = b.side; parts[b.part].add(sg); sideGroups[key] = sg; }
      parent = sideGroups[key];
    }
    parent.add(mesh);
  }
  // after rotation, source +x (left) → -z; side flag should map to world z
  for (const sg of Object.values(sideGroups)) sg.userData.side = -sg.userData.side;

  // clone materials per mesh so parts can fade independently
  root.traverse(o => {
    if (o.isMesh) {
      const m = o.material.clone();
      m.userData = { ...o.material.userData };
      o.material = m;
    }
  });

  const rest = {};
  for (const id of PART_IDS) {
    root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(parts[id]);
    const center = box.getCenter(new THREE.Vector3());
    const anchor = center.clone();
    if (box.min.z < -0.05 && box.max.z > 0.05) anchor.z = box.max.z * 0.8;
    rest[id] = { center, radius: box.getBoundingSphere(new THREE.Sphere()).radius, anchor };
  }
  return { root, parts, wheels, sprites: [], rest };
}
