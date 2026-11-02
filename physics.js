// A small canvas sandbox: gravity, wall bounces, and rectangular stacking.
// The real page stays intact underneath and is restored when the sandbox closes.
const physicsButton = document.querySelector('.physics-button');
const physicsMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let physicsStage = null;
let physicsFrame = null;
let physicsInertStates = [];

function stopPhysics() {
  if (!physicsStage) return;
  cancelAnimationFrame(physicsFrame);
  physicsStage.remove();
  physicsStage = null;
  document.body.classList.remove('physics-active');
  for (const [element, inert] of physicsInertStates) element.inert = inert;
  physicsInertStates = [];
  physicsButton.setAttribute('aria-pressed', 'false');
  physicsButton.focus({ preventScroll: true });
}

function collectPhysicsPieces() {
  const pieces = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const width = window.innerWidth;
  function addPiece(piece, rect) {
    piece.w = Math.min(piece.w, width - 16);
    piece.x = Math.max(8, Math.min(width - piece.w - 8, rect.left));
    piece.y = rect.top < window.innerHeight && rect.bottom > 0
      ? rect.top : -80 - Math.random() * window.innerHeight * 2;
    piece.vx = (Math.random() - 0.5) * 70;
    piece.vy = 0;
    pieces.push(piece);
  }
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.textContent.trim() || node.parentElement.closest('script, style, [hidden], .skip-link, .physics-button')) continue;
    const style = getComputedStyle(node.parentElement);
    if (style.visibility === 'hidden' || style.display === 'none') continue;
    const range = document.createRange();
    for (const match of node.textContent.matchAll(/\S+/g)) {
      range.setStart(node, match.index);
      range.setEnd(node, match.index + match[0].length);
      const rect = range.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) continue;
      addPiece({ text: match[0], font: `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
        color: style.color, w: rect.width + 8, h: rect.height + 6 }, rect);
    }
  }
  for (const image of document.querySelectorAll('img')) {
    const rect = image.getBoundingClientRect();
    if (!image.complete || !image.naturalWidth || rect.width < 1) continue;
    const scale = Math.min(1, 240 / rect.width, 150 / rect.height, (width - 16) / rect.width);
    addPiece({ image, w: rect.width * scale, h: rect.height * scale }, rect);
  }
  return pieces;
}

physicsButton.hidden = false;
physicsButton.addEventListener('click', () => {
  if (physicsStage) return stopPhysics();
  if (physicsMotion.matches) {
    window.alert('Physics animation is disabled while reduced motion is enabled.');
    return;
  }
  document.dispatchEvent(new Event('portfolio:stop-colors'));
  const pieces = collectPhysicsPieces();
  const background = getComputedStyle(document.body).backgroundColor;
  const surface = getComputedStyle(document.documentElement).getPropertyValue('--surface');
  const border = getComputedStyle(document.documentElement).getPropertyValue('--border');
  physicsStage = document.createElement('div');
  physicsStage.className = 'physics-stage';
  physicsStage.setAttribute('role', 'dialog');
  physicsStage.setAttribute('aria-modal', 'true');
  physicsStage.setAttribute('aria-label', 'Page physics playground');
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-label', 'Page text and pictures falling and stacking under gravity');
  canvas.setAttribute('role', 'img');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const toolbar = document.createElement('div');
  toolbar.className = 'physics-toolbar';
  const description = document.createElement('span');
  description.textContent = 'Gravity is on. Escape restores the page.';
  const restore = document.createElement('button');
  restore.type = 'button';
  restore.textContent = 'Restore page';
  restore.addEventListener('click', stopPhysics);
  toolbar.append(description, restore);
  physicsStage.append(canvas, toolbar);
  for (const child of document.body.children) {
    if (child.tagName === 'SCRIPT') continue;
    physicsInertStates.push([child, child.inert]);
    child.inert = true;
  }
  document.body.append(physicsStage);
  document.body.classList.add('physics-active');
  physicsButton.setAttribute('aria-pressed', 'true');
  restore.focus();
  const context = canvas.getContext('2d');
  let previous = null;
  let elapsed = 0;
  function simulate(dt) {
    // Substeps stop fast-moving pieces from passing through each other.
    for (let step = 0; step < 3; step += 1) {
      const delta = dt / 3;
      for (const piece of pieces) {
        piece.vy += 950 * delta;
        piece.x += piece.vx * delta;
        piece.y += piece.vy * delta;
        piece.vx *= 0.995;
        if (piece.x < 0 || piece.x + piece.w > canvas.width) {
          piece.x = Math.max(0, Math.min(canvas.width - piece.w, piece.x));
          piece.vx *= -0.35;
        }
        if (piece.y + piece.h > canvas.height) {
          piece.y = canvas.height - piece.h;
          piece.vy = 0;
          piece.vx *= 0.8;
        }
      }
      // Bottom-up resolution lets supported blocks carry the blocks above them.
      pieces.sort((a, b) => b.y - a.y);
      for (let i = 1; i < pieces.length; i += 1) {
        const top = pieces[i];
        for (let j = 0; j < i; j += 1) {
          const bottom = pieces[j];
          if (top.x < bottom.x + bottom.w && top.x + top.w > bottom.x
            && top.y < bottom.y + bottom.h && top.y + top.h > bottom.y) {
            top.y = bottom.y - top.h;
            top.vy = Math.min(top.vy, bottom.vy);
            top.vx *= 0.9;
          }
        }
      }
    }
  }
  function render(time) {
    if (!physicsStage) return;
    const dt = previous === null ? 0 : Math.min((time - previous) / 1000, 1 / 30);
    previous = time;
    elapsed += dt;
    simulate(dt);
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (const piece of pieces) {
      context.fillStyle = surface;
      context.fillRect(piece.x, piece.y, piece.w, piece.h);
      if (piece.image) context.drawImage(piece.image, piece.x, piece.y, piece.w, piece.h);
      else {
        context.font = piece.font;
        context.textBaseline = 'middle';
        context.fillStyle = piece.color;
        context.fillText(piece.text, piece.x + 4, piece.y + piece.h / 2, piece.w - 8);
      }
      context.strokeStyle = border;
      context.strokeRect(piece.x, piece.y, piece.w, piece.h);
    }
    // Leave the settled pile visible without running an endless animation loop.
    if (elapsed < 20) physicsFrame = requestAnimationFrame(render);
  }
  physicsFrame = requestAnimationFrame(render);
});
document.addEventListener('keydown', event => {
  if (!physicsStage) return;
  if (event.key === 'Escape') stopPhysics();
  if (event.key === 'Tab') {
    event.preventDefault();
    physicsStage.querySelector('button').focus();
  }
});
window.addEventListener('resize', stopPhysics);
window.addEventListener('pagehide', stopPhysics);
document.addEventListener('visibilitychange', () => { if (document.hidden) stopPhysics(); });
physicsMotion.addEventListener('change', () => { if (physicsMotion.matches) stopPhysics(); });
