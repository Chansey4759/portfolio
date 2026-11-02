// Local canvas playground. Original page elements stay intact underneath.
const physicsButton = document.querySelector('.physics-button');
const physicsMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let physicsStage = null, physicsFrame = null;
let physicsInertStates = [];
let stopPhysicsSensors = () => {};
function stopPhysics() {
  if (!physicsStage) return;
  cancelAnimationFrame(physicsFrame); physicsFrame = null;
  stopPhysicsSensors(); physicsStage.remove(); physicsStage = null;
  document.body.classList.remove('physics-active');
  for (const [element, inert] of physicsInertStates) element.inert = inert;
  physicsInertStates = [];
  physicsButton.setAttribute('aria-pressed', 'false');
  physicsButton.focus({ preventScroll: true });
}
function collectPhysicsPieces() {
  const pieces = [], width = window.innerWidth;
  const measure = document.createElement('canvas').getContext('2d');
  function add(piece, rect) {
    piece.x = Math.max(0, Math.min(width - piece.w, rect.left)) + piece.w / 2;
    piece.y = (rect.top < window.innerHeight && rect.bottom > 0
      ? rect.top : -80 - Math.random() * window.innerHeight * 2) + piece.h / 2;
    piece.vx = (Math.random() - 0.5) * 70; piece.vy = 0;
    piece.angle = 0; piece.spin = (Math.random() - 0.5) * 1.8;
    piece.inverseMass = 1 / Math.max(1, Math.sqrt(piece.w * piece.h) / 25);
    pieces.push(piece);
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.textContent.trim() || node.parentElement.closest('script, style, [hidden], .skip-link, .physics-button')) continue;
    const style = getComputedStyle(node.parentElement);
    const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    measure.font = font;
    measure.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing;
    measure.fontKerning = style.fontKerning;
    const range = document.createRange();
    for (const match of node.textContent.matchAll(/\S+/g)) {
      range.setStart(node, match.index); range.setEnd(node, match.index + match[0].length);
      const rect = range.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1 || style.visibility === 'hidden') continue;
      // Split long words instead of reducing their original font size to fit.
      const chunks = []; let chunk = '';
      for (const character of Array.from(match[0])) {
        if (chunk && measure.measureText(chunk + character).width > width - 24) {
          chunks.push(chunk); chunk = '';
        }
        chunk += character;
      }
      if (chunk) chunks.push(chunk);
      for (const text of chunks) add({ text, font, spacing: measure.letterSpacing,
        kerning: style.fontKerning, color: style.color,
        w: measure.measureText(text).width + 8,
        h: Math.max(rect.height, parseFloat(style.fontSize)) + 6 }, rect);
    }
  }
  for (const image of document.querySelectorAll('img')) {
    const rect = image.getBoundingClientRect();
    if (!image.complete || !image.naturalWidth || rect.width < 1) continue;
    const scale = Math.min(1, 240 / rect.width, 150 / rect.height, (width - 16) / rect.width);
    add({ image, w: rect.width * scale, h: rect.height * scale }, rect);
  }
  return pieces;
}
function physicsAxes(piece) {
  const c = Math.cos(piece.angle), s = Math.sin(piece.angle);
  return [{ x: c, y: s }, { x: -s, y: c }];
}
function physicsRadius(piece, axis) {
  const axes = physicsAxes(piece);
  return Math.abs(axis.x * axes[0].x + axis.y * axes[0].y) * piece.w / 2
    + Math.abs(axis.x * axes[1].x + axis.y * axes[1].y) * piece.h / 2;
}
function collidePhysicsPieces(a, b) {
  // Separating-axis tests keep rotated blocks from passing through one another.
  const dx = b.x - a.x, dy = b.y - a.y;
  const reach = (Math.hypot(a.w, a.h) + Math.hypot(b.w, b.h)) / 2;
  if (Math.abs(dx) > reach || Math.abs(dy) > reach) return;
  let depth = Infinity, normal;
  for (const axis of [...physicsAxes(a), ...physicsAxes(b)]) {
    const distance = dx * axis.x + dy * axis.y;
    const overlap = physicsRadius(a, axis) + physicsRadius(b, axis) - Math.abs(distance);
    if (overlap <= 0) return;
    if (overlap < depth) {
      depth = overlap; const direction = distance < 0 ? -1 : 1;
      normal = { x: axis.x * direction, y: axis.y * direction };
    }
  }
  const total = a.inverseMass + b.inverseMass;
  const correction = Math.max(0, depth - 0.15) * 0.8 / total;
  a.x -= normal.x * correction * a.inverseMass; a.y -= normal.y * correction * a.inverseMass;
  b.x += normal.x * correction * b.inverseMass; b.y += normal.y * correction * b.inverseMass;
  const speed = (b.vx - a.vx) * normal.x + (b.vy - a.vy) * normal.y;
  if (speed < 0) {
    const impulse = -speed / total;
    a.vx -= normal.x * impulse * a.inverseMass; a.vy -= normal.y * impulse * a.inverseMass;
    b.vx += normal.x * impulse * b.inverseMass; b.vy += normal.y * impulse * b.inverseMass;
    // Off-centre impacts add a little spin, while damping lets the pile settle.
    const turn = Math.max(-0.2, Math.min(0.2, (dx * normal.y - dy * normal.x) * impulse * 0.0001));
    a.spin = (a.spin - turn) * 0.88; b.spin = (b.spin + turn) * 0.88;
    a.vx *= 0.98; b.vx *= 0.98;
  }
}
physicsButton.hidden = false;
physicsButton.addEventListener('click', () => {
  if (physicsStage) return stopPhysics();
  if (physicsMotion.matches) {
    window.alert('Physics animation is disabled while reduced motion is enabled.'); return;
  }
  document.dispatchEvent(new Event('portfolio:stop-colors'));
  const pieces = collectPhysicsPieces();
  const background = getComputedStyle(document.body).backgroundColor;
  const surface = getComputedStyle(document.documentElement).getPropertyValue('--surface');
  const border = getComputedStyle(document.documentElement).getPropertyValue('--border');
  const sceneWidth = window.innerWidth, sceneHeight = window.innerHeight;
  physicsStage = document.createElement('div'); const stage = physicsStage;
  stage.className = 'physics-stage'; stage.setAttribute('role', 'dialog');
  stage.setAttribute('aria-modal', 'true'); stage.setAttribute('aria-label', 'Page physics playground');
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-label', 'Original-size page text and pictures tumbling and stacking under gravity');
  canvas.setAttribute('role', 'img');
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(sceneWidth * ratio); canvas.height = Math.round(sceneHeight * ratio);
  const toolbar = document.createElement('div'); toolbar.className = 'physics-toolbar';
  const description = document.createElement('span'); description.setAttribute('role', 'status');
  description.textContent = 'Gravity is on. Escape restores the page.';
  const restore = document.createElement('button'); restore.type = 'button'; restore.textContent = 'Restore page';
  restore.addEventListener('click', stopPhysics);
  const tiltButton = document.createElement('button'); tiltButton.type = 'button';
  tiltButton.textContent = 'Enable tilt'; tiltButton.setAttribute('aria-pressed', 'false');
  toolbar.append(description, tiltButton, restore); stage.append(canvas, toolbar);
  for (const child of document.body.children) {
    if (child.tagName === 'SCRIPT') continue;
    physicsInertStates.push([child, child.inert]); child.inert = true;
  }
  document.body.append(stage); document.body.classList.add('physics-active');
  physicsButton.setAttribute('aria-pressed', 'true'); restore.focus();
  const context = canvas.getContext('2d'); context.setTransform(ratio, 0, 0, ratio, 0, 0);
  let previous = null, idleTime = 0;
  let gravity = { x: 0, y: 950 };
  let tiltEnabled = false, receivedOrientation = false, sensorTimer = null;
  function wakePhysics() {
    idleTime = 0;
    if (physicsStage === stage && physicsFrame === null) {
      previous = null; physicsFrame = requestAnimationFrame(render);
    }
  }
  function updateTilt(x, y) {
    if (!tiltEnabled || !Number.isFinite(x) || !Number.isFinite(y)) return;
    const angle = (screen.orientation?.angle ?? window.orientation ?? 0) * Math.PI / 180;
    const target = { x: (x * Math.cos(angle) + y * Math.sin(angle)) * 950,
      y: (-x * Math.sin(angle) + y * Math.cos(angle)) * 950 };
    const length = Math.hypot(target.x, target.y);
    if (length > 950) { target.x *= 950 / length; target.y *= 950 / length; }
    if (Math.hypot(target.x - gravity.x, target.y - gravity.y) > 8) wakePhysics();
    gravity.x += (target.x - gravity.x) * 0.25; gravity.y += (target.y - gravity.y) * 0.25;
    clearTimeout(sensorTimer);
    const message = 'Tilt gravity is on. Move your device to steer the pieces.';
    if (description.textContent !== message) description.textContent = message;
  }
  function orientationGravity(event) {
    if (!Number.isFinite(event.beta) || !Number.isFinite(event.gamma)) return;
    receivedOrientation = true;
    const beta = event.beta * Math.PI / 180, gamma = event.gamma * Math.PI / 180;
    updateTilt(Math.sin(gamma) * Math.cos(beta), Math.sin(beta));
  }
  function motionGravity(event) {
    if (receivedOrientation) return;
    const a = event.accelerationIncludingGravity;
    if (a && Number.isFinite(a.x) && Number.isFinite(a.y)) updateTilt(-a.x / 9.81, a.y / 9.81);
  }
  function disableTilt() {
    tiltEnabled = false; receivedOrientation = false; clearTimeout(sensorTimer);
    window.removeEventListener('deviceorientation', orientationGravity);
    window.removeEventListener('devicemotion', motionGravity);
    tiltButton.textContent = 'Enable tilt'; tiltButton.setAttribute('aria-pressed', 'false');
    gravity = { x: 0, y: 950 };
  }
  stopPhysicsSensors = disableTilt;
  if (!window.isSecureContext || (!window.DeviceOrientationEvent && !window.DeviceMotionEvent)) tiltButton.hidden = true;
  tiltButton.addEventListener('click', async () => {
    if (tiltEnabled) {
      disableTilt(); description.textContent = 'Normal downward gravity is on.'; wakePhysics(); return;
    }
    tiltButton.disabled = true;
    try {
      // Permission APIs must be called inside the button gesture on iOS.
      const permissions = await Promise.all([window.DeviceOrientationEvent, window.DeviceMotionEvent]
        .filter(Boolean).map(async api => {
          try { return typeof api.requestPermission !== 'function' || (await api.requestPermission()) === 'granted'; }
          catch { return false; }
        }));
      if (physicsStage !== stage) return;
      if (!permissions.some(Boolean)) throw new Error('Sensor access denied');
      tiltEnabled = true;
      tiltButton.textContent = 'Disable tilt'; tiltButton.setAttribute('aria-pressed', 'true');
      description.textContent = 'Waiting for tilt data; normal gravity is on.';
      window.addEventListener('deviceorientation', orientationGravity);
      window.addEventListener('devicemotion', motionGravity);
      sensorTimer = window.setTimeout(() => {
        if (physicsStage === stage && tiltEnabled) description.textContent = 'No tilt readings yet; normal gravity is on.';
      }, 4000);
    } catch {
      if (physicsStage === stage) description.textContent = 'Tilt unavailable or denied; normal gravity is on.';
    } finally { tiltButton.disabled = false; }
  });
  function keepInBounds(piece) {
    const rx = physicsRadius(piece, { x: 1, y: 0 }), ry = physicsRadius(piece, { x: 0, y: 1 });
    let contact = false;
    if (piece.x - rx < 0) { piece.x = rx; piece.vx = Math.abs(piece.vx) * 0.2; contact = true; }
    if (piece.x + rx > sceneWidth) { piece.x = sceneWidth - rx; piece.vx = -Math.abs(piece.vx) * 0.2; contact = true; }
    if (piece.y + ry > sceneHeight) { piece.y = sceneHeight - ry; piece.vy = -Math.abs(piece.vy) * 0.1; contact = true; }
    // Offscreen pieces enter through the ceiling; afterward it acts as a wall.
    if (piece.y - ry >= 0) piece.entered = true;
    if (piece.entered && piece.y - ry < 0) { piece.y = ry; piece.vy = Math.abs(piece.vy) * 0.2; contact = true; }
    if (contact) { piece.spin *= 0.85; piece.vx *= 0.96; piece.vy *= 0.96; }
  }
  function simulate(dt) {
    for (let step = 0; step < 3; step += 1) {
      const delta = dt / 3;
      for (const piece of pieces) {
        piece.vx += gravity.x * delta; piece.vy += gravity.y * delta;
        piece.vx *= 0.997; piece.vy *= 0.997;
        piece.x += piece.vx * delta; piece.y += piece.vy * delta;
        piece.angle += piece.spin * delta; piece.spin *= 0.999;
        keepInBounds(piece);
      }
      for (let i = 0; i < pieces.length; i += 1) {
        for (let j = i + 1; j < pieces.length; j += 1) collidePhysicsPieces(pieces[i], pieces[j]);
      }
      for (const piece of pieces) keepInBounds(piece);
    }
  }
  function render(time) {
    physicsFrame = null;
    if (physicsStage !== stage) return;
    const dt = previous === null ? 0 : Math.min((time - previous) / 1000, 1 / 30);
    previous = time; idleTime += dt; simulate(dt);
    context.fillStyle = background; context.fillRect(0, 0, sceneWidth, sceneHeight);
    for (const piece of pieces) {
      context.save(); context.translate(piece.x, piece.y); context.rotate(piece.angle);
      context.fillStyle = surface; context.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
      if (piece.image) context.drawImage(piece.image, -piece.w / 2, -piece.h / 2, piece.w, piece.h);
      else {
        context.font = piece.font; context.letterSpacing = piece.spacing; context.fontKerning = piece.kerning;
        context.textBaseline = 'middle'; context.fillStyle = piece.color;
        // No maxWidth argument: do not shrink or horizontally squeeze page text.
        context.fillText(piece.text, -piece.w / 2 + 4, 0);
      }
      context.strokeStyle = border; context.strokeRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
      context.restore();
    }
    // A sensor change wakes the pile, including after the idle loop has stopped.
    if (idleTime < 20) physicsFrame = requestAnimationFrame(render);
  }
  physicsFrame = requestAnimationFrame(render);
});
document.addEventListener('keydown', event => {
  if (!physicsStage) return;
  if (event.key === 'Escape') stopPhysics();
  else if (event.key === 'Tab') {
    const controls = [...physicsStage.querySelectorAll('button:not([hidden]):not(:disabled)')];
    const index = controls.indexOf(document.activeElement);
    const next = (index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
    event.preventDefault(); controls[next].focus();
  }
});
window.addEventListener('resize', stopPhysics);
window.addEventListener('pagehide', stopPhysics);
document.addEventListener('visibilitychange', () => { if (document.hidden) stopPhysics(); });
physicsMotion.addEventListener('change', () => { if (physicsMotion.matches) stopPhysics(); });
