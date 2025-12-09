document.addEventListener('DOMContentLoaded', () => {
    // --- Dynamic Background Animation ---
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configuration
    const particleCount = 100; // Adjustable density
    const connectionDist = 150;
    const mouseDist = 200;

    // Mouse tracking
    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Resize handling
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5; // Slow ambient movement
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = Math.random() > 0.9 ? '#d4af37' : 'rgba(255, 255, 255, 0.5)'; // Gold or White
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse Interaction: Repel/Attract
            // Let's make it a subtle attraction for a "control" feel, or repulsion for "disturbance"
            // User asked for "mouse effect". A gentle attraction feels more "magical".
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouseDist) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouseDist - distance) / mouseDist;
                    // Attraction (move towards mouse)
                    // If you split vx/vy into velocity and acceleration, this is smoother.
                    // For simple effect:
                    this.x += forceDirectionX * force * 1;
                    this.y += forceDirectionY * force * 1;
                }
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize Particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update and draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        connectParticles();

        requestAnimationFrame(animate);
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDist) {
                    let opacityValue = 1 - (distance / connectionDist);
                    ctx.strokeStyle = 'rgba(255, 255, 255,' + (opacityValue * 0.1) + ')'; // Faint lines
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    animate();
    // --- End Dynamic Background ---

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Placeholder interactions - REMOVED, replaced by global openPreview
    // const videoPlaceholders = document.querySelectorAll('.video-placeholder');
    // videoPlaceholders.forEach(vp => {
    //     vp.addEventListener('click', () => {
    //         alert('Video content will be uploaded here.');
    //     });
    // });
});

// Modal Logic
function openPreview(title, contentUrl, type = 'pdf') {
    const modal = document.getElementById('previewModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const downloadLink = document.getElementById('downloadLink');

    modalTitle.textContent = title;
    downloadLink.href = contentUrl;

    // Clear previous content
    modalBody.innerHTML = '';

    if (type === 'video') {
        // For video, we can use an iframe or video tag. 
        // Using iframe for versatility (YouTube/Vimeo) or raw file.
        // If it's a raw file, video tag is better, but assuming iframe for general embed.
        const iframe = document.createElement('iframe');
        iframe.src = contentUrl;
        iframe.allow = "autoplay; encrypted-media; picture-in-picture";
        iframe.allowFullscreen = true;
        modalBody.appendChild(iframe);
    } else if (type === 'image') {
        const img = document.createElement('img');
        img.src = contentUrl;
        modalBody.appendChild(img);
    } else {
        // Default to PDF/Document in iframe
        const iframe = document.createElement('iframe');
        iframe.src = contentUrl;
        modalBody.appendChild(iframe);
    }

    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('previewModal');
    const modalBody = document.getElementById('modalBody');

    modal.classList.remove('active');

    // Clear content after transition to stop video/clean up
    setTimeout(() => {
        modalBody.innerHTML = '';
    }, 300);
}

// Close on outside click
window.addEventListener('click', (e) => {
    const modal = document.getElementById('previewModal');
    if (e.target === modal) {
        closeModal();
    }
});
