// theme.js

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav ul li a');
    const scrollOffset = 70; // Offset for the fixed header

    navLinks.forEach(link => {
        const targetId = link.getAttribute('href');

        // Only add smooth scrolling if the href is an in-page anchor (starts with '#')
        if (targetId.startsWith('#')) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - scrollOffset,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });

    // Highlight active section in the navbar
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - scrollOffset;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Dark/Light Mode Toggle
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeIcon = themeToggleButton ? themeToggleButton.querySelector('i') : null;

    if (themeToggleButton && themeIcon) {
        // Retrieve saved theme from localStorage or set based on system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        // Apply the initial theme
        document.documentElement.setAttribute('data-theme', initialTheme);
        updateIcon(initialTheme);

        // Event Listener for Toggle Button
        themeToggleButton.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            theme = theme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            updateIcon(theme);
        });

        // Function to Update Icon
        function updateIcon(theme) {
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
});
