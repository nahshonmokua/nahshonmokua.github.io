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
            if (window.scrollY >= sectionTop) {
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

    // Toggle Dark Mode
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
});
