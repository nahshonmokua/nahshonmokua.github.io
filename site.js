function initSite() {
    const sectionIds = ['about-me', 'news', 'projects', 'talks', 'publications', 'awards', 'teaching', 'cv', 'contact'];
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
    const themeToggleButton = document.getElementById('theme-toggle-icon');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const searchIcon = document.getElementById('search-icon');
    const searchModal = document.getElementById('search-modal');
    const closeButton = document.querySelector('.close-button');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchCount = document.getElementById('search-count');
    const pageContent = document.getElementById('page-content');

    function scrollToTarget(hash, behavior = 'smooth') {
        if (!hash || hash === '#') return;
        const target = document.querySelector(hash);
        if (!target) return;
        target.scrollIntoView({ behavior, block: 'start' });
    }

    function setActiveNav(sectionId) {
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${sectionId}`;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const hash = link.getAttribute('href');
            scrollToTarget(hash);
            history.pushState(null, '', hash);
            if (hash.startsWith('#')) {
                setActiveNav(hash.slice(1));
            }
            closeDropdown();
        });
    });

    if ('IntersectionObserver' in window && sections.length) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveNav(entry.target.id);
                }
            });
        }, {
            root: null,
            rootMargin: '-30% 0px -58% 0px',
            threshold: 0.01
        });

        sections.forEach(section => observer.observe(section));
    }

    function applyTheme(theme) {
        const nextTheme = theme === 'dark' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', nextTheme);

        if (!themeToggleButton) return;
        const themeIcon = themeToggleButton.querySelector('i');
        if (!themeIcon) return;

        themeIcon.classList.toggle('fa-moon', nextTheme === 'light');
        themeIcon.classList.toggle('fa-sun', nextTheme === 'dark');
        themeToggleButton.setAttribute('aria-label', nextTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
        themeToggleButton.setAttribute('title', nextTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    }

    if (themeToggleButton) {
        const savedTheme = localStorage.getItem('theme');
        applyTheme(savedTheme || 'light');

        themeToggleButton.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    function closeDropdown() {
        if (!hamburgerMenu || !dropdownMenu) return;
        hamburgerMenu.setAttribute('aria-expanded', 'false');
        hamburgerMenu.setAttribute('aria-label', 'Open menu');
        dropdownMenu.hidden = true;
    }

    function toggleDropdown() {
        if (!hamburgerMenu || !dropdownMenu) return;
        const isOpen = hamburgerMenu.getAttribute('aria-expanded') === 'true';
        hamburgerMenu.setAttribute('aria-expanded', String(!isOpen));
        hamburgerMenu.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
        dropdownMenu.hidden = isOpen;
    }

    if (hamburgerMenu && dropdownMenu) {
        hamburgerMenu.addEventListener('click', event => {
            event.stopPropagation();
            toggleDropdown();
        });

        document.addEventListener('click', event => {
            if (!dropdownMenu.hidden && !dropdownMenu.contains(event.target) && !hamburgerMenu.contains(event.target)) {
                closeDropdown();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1040) {
                closeDropdown();
            }
        });
    }

    function buildSearchIndex() {
        if (!pageContent) return [];
        const candidates = Array.from(pageContent.querySelectorAll('article, .contact-panel'));
        const seen = new Set();

        return candidates.map((item, index) => {
            const section = item.closest('section[id]');
            const titleElement = item.querySelector('h3, h2') || section?.querySelector('h2');
            const title = titleElement?.textContent.trim() || section?.id || `Result ${index + 1}`;
            const text = item.textContent.replace(/\s+/g, ' ').trim();
            const targetId = section?.id || '';
            const key = `${targetId}-${title}-${index}`;
            const classes = item.className || '';
            let priority = 1;
            if (classes.includes('project-card')) priority = 7;
            if (classes.includes('publication-entry')) priority = 6;
            if (classes.includes('timeline-event')) priority = 5;
            if (classes.includes('presentation-item')) priority = 4;
            if (classes.includes('award-entry')) priority = 6;
            if (classes.includes('teaching-card')) priority = 3;
            if (classes.includes('cv-panel')) priority = 3;
            if (classes.includes('contact-panel')) priority = 3;
            if (classes.includes('info-panel')) priority = 2;
            return { key, title, text, targetId, priority };
        }).filter(item => {
            if (!item.text || seen.has(item.key)) return false;
            seen.add(item.key);
            return true;
        });
    }

    let searchIndex = [];

    function createHighlightedText(text, query) {
        const fragment = document.createDocumentFragment();
        if (!query) {
            fragment.append(document.createTextNode(text));
            return fragment;
        }

        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const matcher = new RegExp(`(${escaped})`, 'ig');
        const parts = text.split(matcher);

        parts.forEach(part => {
            if (!part) return;
            if (part.toLowerCase() === query.toLowerCase()) {
                const mark = document.createElement('mark');
                mark.textContent = part;
                fragment.append(mark);
            } else {
                fragment.append(document.createTextNode(part));
            }
        });

        return fragment;
    }

    function getSnippet(text, query) {
        const normalized = text.replace(/\s+/g, ' ').trim();
        const index = normalized.toLowerCase().indexOf(query.toLowerCase());
        const start = Math.max(0, index - 70);
        const end = Math.min(normalized.length, index + query.length + 150);
        const prefix = start > 0 ? '...' : '';
        const suffix = end < normalized.length ? '...' : '';
        return `${prefix}${normalized.slice(start, end)}${suffix}`;
    }

    function renderSearchResults(query) {
        if (!searchResults || !searchCount) return;
        searchResults.innerHTML = '';
        searchCount.textContent = '';

        if (query.length < 2) {
            searchCount.textContent = 'Type at least two characters.';
            return;
        }

        const normalizedQuery = query.toLowerCase();
        const matches = searchIndex
            .filter(item => item.text.toLowerCase().includes(normalizedQuery) || item.title.toLowerCase().includes(normalizedQuery))
            .map(item => {
                const titleHit = item.title.toLowerCase().includes(normalizedQuery) ? 10 : 0;
                return { ...item, score: item.priority + titleHit };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 12);

        searchCount.textContent = matches.length === 1 ? '1 result' : `${matches.length} results`;

        if (!matches.length) {
            const empty = document.createElement('p');
            empty.className = 'result-snippet';
            empty.textContent = 'No matching content found.';
            searchResults.append(empty);
            return;
        }

        matches.forEach(match => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'result-item';

            const title = document.createElement('span');
            title.className = 'result-title';
            title.append(createHighlightedText(match.title, query));

            const snippet = document.createElement('span');
            snippet.className = 'result-snippet';
            snippet.append(createHighlightedText(getSnippet(match.text, query), query));

            button.append(title, snippet);
            button.addEventListener('click', () => {
                closeSearch();
                if (match.targetId) {
                    scrollToTarget(`#${match.targetId}`);
                    history.pushState(null, '', `#${match.targetId}`);
                    setActiveNav(match.targetId);
                }
            });

            searchResults.append(button);
        });
    }

    function openSearch() {
        if (!searchModal || !searchInput) return;
        searchIndex = buildSearchIndex();
        searchModal.hidden = false;
        document.body.classList.add('modal-open');
        searchInput.value = '';
        renderSearchResults('');
        window.setTimeout(() => searchInput.focus(), 20);
    }

    function closeSearch() {
        if (!searchModal) return;
        searchModal.hidden = true;
        document.body.classList.remove('modal-open');
        searchIcon?.focus();
    }

    if (searchIcon && searchModal && closeButton && searchInput) {
        searchIcon.addEventListener('click', openSearch);
        closeButton.addEventListener('click', closeSearch);
        searchInput.addEventListener('input', () => renderSearchResults(searchInput.value.trim()));

        searchModal.addEventListener('click', event => {
            if (event.target === searchModal) {
                closeSearch();
            }
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                closeDropdown();
                if (!searchModal.hidden) {
                    closeSearch();
                }
            }
        });
    }

    window.addEventListener('popstate', () => {
        scrollToTarget(window.location.hash, 'auto');
    });

    if (window.location.hash) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => scrollToTarget(window.location.hash, 'auto'));
        });
    } else {
        setActiveNav('about-me');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSite);
} else {
    initSite();
}
