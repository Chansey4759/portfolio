// Theme preferences are shared between the five portfolio pages.
const themeToggle = document.querySelector('.theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
function updateThemeButton() {
  const dark = document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === 'dark'
    : systemTheme.matches;
  themeToggle.textContent = dark ? 'Light mode' : 'Dark mode';
  themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}
themeToggle.hidden = false;
updateThemeButton();
systemTheme.addEventListener('change', updateThemeButton);
themeToggle.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === 'dark'
    : systemTheme.matches;
  const theme = dark ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('portfolio-theme', theme); } catch { /* Session storage is a fallback. */ }
  try { sessionStorage.setItem('portfolio-theme', theme); } catch { /* The current page still changes if storage is blocked. */ }
  updateThemeButton();
});

// Without JavaScript, navigation remains visible at every screen size.
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
const mobileScreen = window.matchMedia('(max-width: 959px)');
menuToggle.hidden = false;
function setMenu(open) {
  navigation.hidden = mobileScreen.matches && !open;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? 'Close menu' : 'Menu';
}
setMenu(false);
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
mobileScreen.addEventListener('change', () => setMenu(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileScreen.matches && !navigation.hidden) {
    setMenu(false);
    menuToggle.focus();
  }
});

const crazyButton = document.querySelector('.crazy-button');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const crazyWarning = "WARNING, USING THE BUTTON IS NOT FOR IF YOU HAVE EPILEPSY, IF YOU DO DON'T PRESS IT AGAIN!";
let crazyPresses = 0;
let crazyTimer = null;
let crazyElements = [];
let crazyTextNodes = [];
const crazyClasses = Array.from({ length: 7 }, (_, index) => [
  `rainbow-text-${index}`, `rainbow-background-${index}`,
]).flat();

function stopCrazyColors() {
  clearInterval(crazyTimer);
  crazyTimer = null;
  for (const element of crazyElements) element.classList.remove(...crazyClasses);
  crazyElements = [];
  for (const { wrapper, original } of crazyTextNodes) {
    if (wrapper.isConnected) wrapper.replaceWith(original);
  }
  crazyTextNodes = [];
  crazyPresses = 0;
  crazyButton.textContent = 'Crazy Button';
  crazyButton.setAttribute('aria-pressed', 'false');
}

function randomizeCrazyColors() {
  for (const element of crazyElements) {
    element.classList.remove(...crazyClasses);
    element.classList.add(`rainbow-text-${Math.floor(Math.random() * 7)}`);
    if (!element.classList.contains('crazy-character')) {
      element.classList.add(`rainbow-background-${Math.floor(Math.random() * 7)}`);
    }
  }
}

function wrapCrazyCharacters() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.textContent.trim() && !node.parentElement.closest('script, style, button, textarea, select')) {
      textNodes.push(node);
    }
  }
  // Keep emoji and combined characters intact when supported by the browser.
  const segmenter = typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
  for (const original of textNodes) {
    const wrapper = document.createElement('span');
    wrapper.className = 'crazy-text-wrapper';
    const characters = segmenter
      ? Array.from(segmenter.segment(original.textContent), item => item.segment)
      : Array.from(original.textContent);
    for (const character of characters) {
      const span = document.createElement('span');
      span.className = 'crazy-character';
      span.textContent = character;
      wrapper.append(span);
    }
    original.replaceWith(wrapper);
    crazyTextNodes.push({ wrapper, original });
  }
}

crazyButton.hidden = false;
crazyButton.addEventListener('click', () => {
  if (crazyTimer !== null) {
    stopCrazyColors();
    return;
  }
  crazyPresses += 1;
  if (crazyPresses === 1) {
    window.alert(crazyWarning);
  } else if (crazyPresses === 2) {
    window.alert(`${crazyWarning}\n\nAre you really sure? This is a bit blinding....`);
  } else if (reducedMotion.matches) {
    window.alert('Flashing is disabled because your device requests reduced motion.');
    stopCrazyColors();
  } else {
    // Keep the stop control readable. Color changes never alter the saved theme.
    wrapCrazyCharacters();
    crazyElements = [document.body, ...document.body.querySelectorAll('*')]
      .filter(element => !element.matches('script, .crazy-button, .crazy-text-wrapper'));
    crazyButton.textContent = 'Stop Crazy Colors';
    crazyButton.setAttribute('aria-pressed', 'true');
    crazyTimer = window.setInterval(randomizeCrazyColors, 40);
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && crazyTimer !== null) stopCrazyColors();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopCrazyColors();
});
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) stopCrazyColors();
});
window.addEventListener('pagehide', stopCrazyColors);
