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
