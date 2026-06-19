const THEME_KEY = 'portfolio-theme';
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle-icon');
const menuButton = document.getElementById('hamburger-menu');
const dropdownMenu = document.getElementById('dropdown-menu');
const searchButton = document.getElementById('search-icon');
const searchModal = document.getElementById('search-modal');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const searchCount = document.getElementById('search-count');
const closeSearchButton = searchModal?.querySelector('.close-button');
const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
const sections = Array.from(document.querySelectorAll('main section[id]'));

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);

  const icon = themeToggle?.querySelector('i');
  if (!themeToggle || !icon) return;

  const isDark = theme === 'dark';
  icon.classList.toggle('fa-moon', !isDark);
  icon.classList.toggle('fa-sun', isDark);
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  themeToggle.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
}

setTheme(getInitialTheme());

themeToggle?.addEventListener('click', () => {
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
});

function closeMenu() {
  if (!dropdownMenu || !menuButton) return;
  dropdownMenu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
}

menuButton?.addEventListener('click', () => {
  if (!dropdownMenu) return;
  const willOpen = dropdownMenu.hidden;
  dropdownMenu.hidden = !willOpen;
  menuButton.setAttribute('aria-expanded', String(willOpen));
});

dropdownMenu?.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('click', (event) => {
  if (!dropdownMenu || dropdownMenu.hidden) return;
  if (event.target.closest('#dropdown-menu') || event.target.closest('#hamburger-menu')) return;
  closeMenu();
});

function setActiveNav() {
  let activeId = sections[0]?.id;
  const offset = window.scrollY + 120;

  sections.forEach((section) => {
    if (section.offsetTop <= offset) activeId = section.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });
window.addEventListener('resize', setActiveNav);
setActiveNav();

const searchableSections = sections.map((section) => {
  const heading = section.querySelector('h2')?.textContent.trim() || section.id;
  return {
    id: section.id,
    heading,
    text: section.textContent.replace(/\s+/g, ' ').trim()
  };
});

function openSearch() {
  if (!searchModal || !searchInput) return;
  searchModal.hidden = false;
  document.body.classList.add('modal-open');
  searchInput.focus();
  renderSearch(searchInput.value);
}

function closeSearch() {
  if (!searchModal) return;
  searchModal.hidden = true;
  document.body.classList.remove('modal-open');
  searchButton?.focus();
}

function renderSearch(query) {
  if (!searchResults || !searchCount) return;
  const term = query.trim().toLowerCase();
  searchResults.innerHTML = '';

  if (!term) {
    searchCount.textContent = 'Type to search the portfolio.';
    return;
  }

  const matches = searchableSections.filter((section) => section.text.toLowerCase().includes(term));
  searchCount.textContent = `${matches.length} result${matches.length === 1 ? '' : 's'}`;

  matches.forEach((section) => {
    const link = document.createElement('a');
    link.href = `#${section.id}`;
    link.className = 'search-result';
    link.innerHTML = `<strong>${section.heading}</strong><span>${section.text.slice(0, 180)}...</span>`;
    link.addEventListener('click', closeSearch);
    searchResults.appendChild(link);
  });
}

searchButton?.addEventListener('click', openSearch);
closeSearchButton?.addEventListener('click', closeSearch);
searchInput?.addEventListener('input', () => renderSearch(searchInput.value));
searchModal?.addEventListener('click', (event) => {
  if (event.target === searchModal) closeSearch();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  closeMenu();
  closeSearch();
});