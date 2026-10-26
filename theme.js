// Run before the stylesheet so navigation never flashes the opposite theme.
(() => {
  let theme = null;
  try { theme = localStorage.getItem('portfolio-theme'); } catch { /* Try session storage below. */ }
  if (theme !== 'light' && theme !== 'dark') {
    try { theme = sessionStorage.getItem('portfolio-theme'); } catch { /* Use the system theme. */ }
  }
  if (theme === 'light' || theme === 'dark') {
    document.documentElement.dataset.theme = theme;
  }
})();
