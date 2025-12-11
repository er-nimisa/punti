// ===== REALISTIC 3D SNOWFALL ANIMATION =====
class Snowfall {
    constructor() {
        this.canvas = document.getElementById('snowfall');
        this.ctx = this.canvas.getContext('2d');
        this.snowflakes = [];
        this.numberOfSnowflakes = 150; // Increased for more realistic effect
        this.wind = 0;
        this.windTarget = 0;

        this.init();
    }

    init() {
        this.resizeCanvas();
        this.createSnowflakes();
        this.animate();
        this.updateWind();

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createSnowflakes() {
        for (let i = 0; i < this.numberOfSnowflakes; i++) {
            this.snowflakes.push(this.createSnowflake());
        }
    }

    createSnowflake() {
        // Create depth layers (0-1, where 1 is closest)
        const depth = Math.random();
        const size = depth * 4 + 1; // Larger flakes appear closer

        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            radius: size,
            speed: depth * 2 + 0.5, // Closer flakes fall faster
            depth: depth,
            drift: (Math.random() - 0.5) * 2,
            opacity: depth * 0.7 + 0.3, // Closer flakes are more opaque
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.02 + 0.01
        };
    }

    updateWind() {
        // Randomly change wind direction
        setInterval(() => {
            this.windTarget = (Math.random() - 0.5) * 0.5;
        }, 3000);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Smoothly transition wind
        this.wind += (this.windTarget - this.wind) * 0.01;

        this.snowflakes.forEach(flake => {
            // Apply wobble effect for realistic movement
            flake.wobble += flake.wobbleSpeed;
            const wobbleX = Math.sin(flake.wobble) * flake.depth * 2;

            // Draw snowflake with blur for depth
            this.ctx.save();

            // Add blur for distant flakes
            if (flake.depth < 0.5) {
                this.ctx.filter = `blur(${(1 - flake.depth) * 2}px)`;
            }

            this.ctx.beginPath();
            this.ctx.arc(flake.x + wobbleX, flake.y, flake.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
            this.ctx.fill();

            // Add subtle glow for closer flakes
            if (flake.depth > 0.7) {
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
                this.ctx.fill();
            }

            this.ctx.restore();

            // Update position
            flake.y += flake.speed;
            flake.x += flake.drift;

            // Reset snowflake when it goes off screen
            if (flake.y > this.canvas.height) {
                flake.y = -10;
                flake.x = Math.random() * this.canvas.width;
            }

            if (flake.x > this.canvas.width) {
                flake.x = 0;
            } else if (flake.x < 0) {
                flake.x = this.canvas.width;
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ===== SURPRISE BUTTON FUNCTIONALITY =====
const birthdayWishes = [
    "May your life be filled with happiness and peace. 🌟",
    "I hope your dreams come true this year. ✨",
    "You deserve love, success, and nothing less. 💖",
    "Thank you for being the kind of sister people pray for. 🙏",
    "May every moment of your life sparkle with joy. 💫",
    "Wishing you endless blessings and beautiful memories. 🌸",
    "May your heart always be as beautiful as you are. 🦋",
    "Here's to another year of being absolutely amazing! 🎉",
    "May your birthday be as special as you make others feel. 🎂",
    "Sending you all the love and happiness in the world. 💗"
];

let lastWishIndex = -1;

function showRandomWish() {
    const wishDisplay = document.getElementById('wish-display');

    // Get a random wish different from the last one
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * birthdayWishes.length);
    } while (randomIndex === lastWishIndex && birthdayWishes.length > 1);

    lastWishIndex = randomIndex;

    // Clear previous wish
    wishDisplay.innerHTML = '';

    // Create and display new wish
    const wishElement = document.createElement('p');
    wishElement.className = 'wish-text';
    wishElement.textContent = birthdayWishes[randomIndex];

    wishDisplay.appendChild(wishElement);
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize snowfall
    new Snowfall();

    // Setup surprise button
    const surpriseBtn = document.getElementById('surprise-btn');
    surpriseBtn.addEventListener('click', showRandomWish);

    // Observe all slide-up elements
    const slideUpElements = document.querySelectorAll('.slide-up');
    slideUpElements.forEach(el => observer.observe(el));

    // Observe fade-in-up elements
    const fadeInElements = document.querySelectorAll('.fade-in-up');
    fadeInElements.forEach(el => observer.observe(el));
});
