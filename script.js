// Theme preferences are shared between the five portfolio pages.
const themeToggle = document.querySelector('.theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let savedTheme = null;
try { savedTheme = localStorage.getItem('portfolio-theme'); } catch { /* Storage can be unavailable. */ }
if (savedTheme === 'light' || savedTheme === 'dark') {
  document.documentElement.dataset.theme = savedTheme;
}
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
  try { localStorage.setItem('portfolio-theme', theme); } catch { /* The toggle still works without storage. */ }
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
