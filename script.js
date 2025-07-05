document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.header-nav a');
    const themeToggleButton = document.getElementById('theme-toggle-icon');
    const sectionIds = ['about-me', 'resume', 'research', 'publications', 'presentations', 'teaching', 'news'];
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Scroll to the section smoothly
                targetSection.scrollIntoView({ behavior: 'smooth' });

                // Update active link
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Intersection Observer for active link highlighting
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Triggers when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;

                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                const activeLink = document.querySelector(`.header-nav a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section) {
            observer.observe(section);
        }
    });

    // Dark/Light Mode Toggle Functionality
    if (themeToggleButton) {
        const themeIcon = themeToggleButton.querySelector('i');

        if (themeIcon) {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

            document.documentElement.setAttribute('data-theme', initialTheme);
            updateThemeIcon(initialTheme);

            themeToggleButton.addEventListener('click', () => {
                let currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeIcon(newTheme);
            });

            function updateThemeIcon(theme) {
                if (theme === 'light') {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                    themeToggleButton.setAttribute('aria-label', 'Switch to Dark Mode');
                } else {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                    themeToggleButton.setAttribute('aria-label', 'Switch to Light Mode');
                }
            }
        }
    }
// Search Modal Functionality
    const searchIcon = document.getElementById('search-icon');
    const searchModal = document.getElementById('search-modal');
    const closeButton = document.querySelector('.close-button');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const pageContent = document.getElementById('page-content');

    if (searchIcon && searchModal && closeButton && searchInput && searchResults && pageContent) {
        searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            searchModal.style.display = 'block';
            searchInput.focus();
        });

        closeButton.addEventListener('click', () => {
            searchModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target == searchModal) {
                searchModal.style.display = 'none';
            }
        });

        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            searchResults.innerHTML = '';

            if (searchTerm.length < 2) {
                return;
            }

            const allText = pageContent.innerText.split('\n');
            const matches = [];

            allText.forEach(line => {
                if (line.toLowerCase().includes(searchTerm)) {
                    matches.push(line);
                }
            });

            if (matches.length > 0) {
                matches.forEach(match => {
                    const resultItem = document.createElement('div');
                    resultItem.classList.add('result-item');
                    resultItem.innerHTML = match.replace(new RegExp(searchTerm, 'gi'), (match) => `<strong>${match}</strong>`);
                    searchResults.appendChild(resultItem);
                });
            } else {
                searchResults.innerHTML = '<div class="result-item">No matching documents found.</div>';
            }
        });
    }

    // Responsive Navigation Logic
    const nav = document.querySelector('.header-nav');
    const navVisible = document.querySelector('.nav-visible');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const dropdownMenu = document.getElementById('dropdown-menu');

    function adjustNav() {
        const screenWidth = window.innerWidth;

        if (screenWidth <= 768) {
            // Mobile view: move all items to dropdown
            while (navVisible.children.length > 0) {
                const item = navVisible.firstElementChild;
                dropdownMenu.appendChild(item);
            }
            hamburgerMenu.hidden = false;
        } else {
            // Desktop view: move items back to nav
            while (dropdownMenu.children.length > 0) {
                const item = dropdownMenu.firstElementChild;
                navVisible.appendChild(item);
            }
            hamburgerMenu.hidden = true;
            dropdownMenu.hidden = true;
        }
    }

    hamburgerMenu.addEventListener('click', () => {
        const isExpanded = hamburgerMenu.getAttribute('aria-expanded') === 'true';
        hamburgerMenu.setAttribute('aria-expanded', !isExpanded);
        dropdownMenu.hidden = !dropdownMenu.hidden;
        if (!dropdownMenu.hidden) {
            dropdownMenu.style.display = 'flex';
        } else {
            dropdownMenu.style.display = 'none';
        }
    });

    // Close dropdown when a link is clicked
    dropdownMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            hamburgerMenu.setAttribute('aria-expanded', 'false');
            dropdownMenu.hidden = true;
            dropdownMenu.style.display = 'none';
        }
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', (e) => {
        if (!hamburgerMenu.contains(e.target) && !dropdownMenu.contains(e.target)) {
            hamburgerMenu.setAttribute('aria-expanded', 'false');
            dropdownMenu.hidden = true;
            dropdownMenu.style.display = 'none';
        }
    });

    window.addEventListener('resize', adjustNav);
    adjustNav();
});
