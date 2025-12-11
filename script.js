// ===== PASSWORD AND LOADING SYSTEM =====
const PASSWORD = "punti";
let passwordVerified = false;

function initPasswordSystem() {
    const passwordScreen = document.getElementById('password-screen');
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const passwordInput = document.getElementById('password-input');
    const unlockBtn = document.getElementById('unlock-btn');
    const passwordError = document.getElementById('password-error');

    // Check password on button click
    unlockBtn.addEventListener('click', checkPassword);

    // Check password on Enter key
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });

    function checkPassword() {
        const enteredPassword = passwordInput.value.toLowerCase().trim();

        if (enteredPassword === PASSWORD) {
            passwordVerified = true;
            passwordError.textContent = '';

            // Hide password screen with fade out
            passwordScreen.style.animation = 'fadeOut 0.5s ease-out forwards';

            setTimeout(() => {
                passwordScreen.style.display = 'none';
                loadingScreen.style.display = 'flex';

                // Show main content after loading
                setTimeout(() => {
                    loadingScreen.style.animation = 'fadeOut 0.5s ease-out forwards';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        mainContent.style.display = 'block';
                        mainContent.style.animation = 'fadeIn 0.8s ease-out forwards';

                        // Initialize snowfall after content is visible
                        new Snowfall();
                    }, 500);
                }, 2500); // Loading duration
            }, 500);
        } else {
            passwordError.textContent = '❌ Incorrect password. Try again!';
            passwordInput.value = '';
            passwordInput.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                passwordInput.style.animation = '';
            }, 500);
        }
    }
}

// Add fade animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

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

// ===== MUSIC PLAYER FUNCTIONALITY =====
let isPlaying = false;
const musicPlayer = document.getElementById('music-player');
const playPauseBtn = document.getElementById('play-pause-btn');

function togglePlayPause() {
    if (isPlaying) {
        musicPlayer.pause();
        isPlaying = false;
        // Change to play icon
        playPauseBtn.innerHTML = `
            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"></path>
        `;
    } else {
        musicPlayer.play();
        isPlaying = true;
        // Change to pause icon
        playPauseBtn.innerHTML = `
            <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>
        `;
    }
}

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize password system first
    initPasswordSystem();

    // Setup surprise button (will work after password is entered)
    const surpriseBtn = document.getElementById('surprise-btn');
    if (surpriseBtn) {
        surpriseBtn.addEventListener('click', showRandomWish);
    }

    // Observe all slide-up elements
    const slideUpElements = document.querySelectorAll('.slide-up');
    slideUpElements.forEach(el => observer.observe(el));

    // Observe fade-in-up elements
    const fadeInElements = document.querySelectorAll('.fade-in-up');
    fadeInElements.forEach(el => observer.observe(el));

    // Setup music player controls
    const playPauseBtn = document.getElementById('play-pause-btn');
    const musicPlayer = document.getElementById('music-player');

    if (playPauseBtn && musicPlayer) {
        playPauseBtn.addEventListener('click', togglePlayPause);

        // Add smooth volume fade in when playing
        musicPlayer.addEventListener('play', () => {
            musicPlayer.volume = 0;
            let vol = 0;
            const fadeIn = setInterval(() => {
                if (vol < 0.7) {
                    vol += 0.05;
                    musicPlayer.volume = vol;
                } else {
                    clearInterval(fadeIn);
                }
            }, 50);
        });

        // Update progress bar
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            musicPlayer.addEventListener('timeupdate', () => {
                const progress = (musicPlayer.currentTime / musicPlayer.duration) * 100;
                progressBar.style.width = progress + '%';
            });
        }
    }

    // Add interactive hover effects to all cards
    const cards = document.querySelectorAll('.glass-card, .admire-card, .prayer-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});
