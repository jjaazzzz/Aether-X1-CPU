document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    let ticking = false;

    // Optimized mouse movement handling
    document.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const { clientX, clientY } = e;
                const xPct = (clientX / window.innerWidth) * 100;
                const yPct = (clientY / window.innerHeight) * 100;
                
                body.style.setProperty('--mouse-x', `${xPct}%`);
                body.style.setProperty('--mouse-y', `${yPct}%`);

                // Cosmic Parallax (Planets & Ships)
                const planets = document.querySelectorAll('.planet');
                const ships = document.querySelectorAll('.spaceship');
                
                planets.forEach((planet, i) => {
                    const factor = (i + 1) * 20;
                    const pX = (clientX - window.innerWidth / 2) / factor;
                    const pY = (clientY - window.innerHeight / 2) / factor;
                    planet.style.transform = `translate(${pX}px, ${pY}px)`;
                });

                ships.forEach((ship, i) => {
                    const factor = (i + 1) * 10;
                    const sX = (clientX - window.innerWidth / 2) / factor;
                    const sY = (clientY - window.innerHeight / 2) / factor;
                    // Keep the original rotation while translating
                    const rotation = i === 0 ? 15 : -45;
                    ship.style.transform = `translate(${sX}px, ${sY}px) rotate(${rotation}deg)`;
                });

                // Central Image & Reflection Parallax
                const heroTitle = document.querySelector('.hero h1');
                const heroImgContainer = document.querySelector('.hero-img-container');
                
                if (heroTitle && heroImgContainer) {
                    const moveX = (clientX - window.innerWidth / 2) / 20; // Even more sensitive
                    const moveY = (clientY - window.innerHeight / 2) / 20;
                    
                    heroTitle.style.transform = `translateZ(100px) translate(${moveX * 2}px, ${moveY * 2}px)`;
                    // Adding more rotation range for 'Dynamic' feel
                    heroImgContainer.style.transform = `rotateY(${moveX * 1.5}deg) rotateX(${-moveY * 1.5}deg)`;
                }

                // 3D Tilt for cards (Only if in viewport for better performance)
                const cards = document.querySelectorAll('.card-3d');
                cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const cardX = rect.left + rect.width / 2;
                        const cardY = rect.top + rect.height / 2;
                        const angleX = (clientY - cardY) / 35; // Reduced sensitivity
                        const angleY = (cardX - clientX) / 35;
                        card.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    });

    // Reset tilt
    document.addEventListener('mouseleave', () => {
        document.querySelectorAll('.card-3d').forEach(card => {
            card.style.transform = `rotateX(0deg) rotateY(0deg)`;
        });
    });

    // Intersection Observer for reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Smooth scroll
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
