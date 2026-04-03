document.addEventListener('DOMContentLoaded', () => {
    // Navbar styling on scroll
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll reveal: kakao mockup
    const kakaoMockup = document.querySelector('.kakao-mockup');
    if (kakaoMockup) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.3 });
        observer.observe(kakaoMockup);
    }

    // Basic animation for mockup buttons to simulate 'recording'
    const statBtns = document.querySelectorAll('.stat-btn');
    const scoreElements = document.querySelectorAll('.score');

    statBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Visual feedback on button click
            this.style.transform = 'scale(0.95)';
            this.style.background = 'var(--accent-color)';
            this.style.color = '#fff';

            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.background = 'var(--bg-secondary)';
                this.style.color = 'var(--text-primary)';
            }, 200);

            // Mock updating the score occasionally
            if(this.innerText.includes('득점')) {
                const points = parseInt(this.innerText.replace(/[^0-9]/g, ''));
                if(!isNaN(points)) {
                    // arbitrarily update A team score for demo
                    const currentScore = parseInt(scoreElements[0].innerText);
                    scoreElements[0].innerText = currentScore + points;

                    // add visual bounce to score
                    scoreElements[0].style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        scoreElements[0].style.transform = 'scale(1)';
                    }, 200);
                }
            }
        });
    });
});
