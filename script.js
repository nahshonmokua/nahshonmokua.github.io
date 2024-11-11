// theme.js

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav ul li a');
    let scrollOffset = 0; // This will be set based on the header's height

    /**
     * Retrieves the current height of the header.
     * @returns {number} The height of the header in pixels.
     */
    function getHeaderHeight() {
        const header = document.querySelector('header');
        return header ? header.offsetHeight : 70; // Default to 70px if header is not found
    }

    /**
     * Adjusts the body's padding-top to match the header's height.
     * This ensures that the content below the header is not overlapped.
     */
    function adjustBodyPadding() {
        const header = document.querySelector('header');
        const body = document.body;
        if (header) {
            const headerHeight = header.offsetHeight;
            body.style.paddingTop = `${headerHeight}px`;
            scrollOffset = headerHeight; // Update scrollOffset to align with the header's height
        }
    }

    // Initial adjustment when the DOM is fully loaded
    adjustBodyPadding();

    // Adjust padding after all resources have loaded (e.g., images)
    window.addEventListener('load', adjustBodyPadding);

    // Adjust padding on window resize to handle dynamic changes in header size
    window.addEventListener('resize', adjustBodyPadding);

    /**
     * Implements smooth scrolling behavior for in-page navigation links.
     */
    navLinks.forEach(link => {
        const targetId = link.getAttribute('href');

        // Only add smooth scrolling if the href is an in-page anchor
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

    /**
     * Highlights the active section's corresponding navigation link based on scroll position.
     */
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - scrollOffset;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // Dark/Light Mode Toggle Functionality
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeIcon = themeToggleButton ? themeToggleButton.querySelector('i') : null;

    if (themeToggleButton && themeIcon) {
        // Determine the initial theme based on localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        // Apply the initial theme to the document
        document.documentElement.setAttribute('data-theme', initialTheme);
        updateThemeIcon(initialTheme);

        // Toggle theme on button click
        themeToggleButton.addEventListener('click', () => {
            let currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });

        /**
         * Updates the theme toggle button icon based on the current theme.
         * @param {string} theme - The current theme ('light' or 'dark').
         */
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
});
