/* PRELOADER */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => { preloader.classList.add('hidden'); }, 1500);
});

/* NAVBAR SCROLL */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) { navbar.classList.add('scrolled'); } else { navbar.classList.remove('scrolled'); }
}, { passive: true });

/* TYPEWRITER */
const typedTextElement = document.getElementById('typed-text');
const phrases = [
    "Sizokwamukela umdeni nabangane",
    "Sizobonga ngokuhlanganisa",
    "Uthando olungunaphakade",
    "Umembeso weNhliziyo"
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
        typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }
    setTimeout(type, typeSpeed);
}
type();

/* COUNTDOWN */
const eventDate = new Date("2026-10-31T09:00:00+02:00").getTime();
const x = setInterval(function() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
        clearInterval(x);
        document.getElementById("days").innerHTML = "00";
        document.getElementById("hours").innerHTML = "00";
        document.getElementById("minutes").innerHTML = "00";
        document.getElementById("seconds").innerHTML = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerHTML = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerHTML = hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerHTML = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerHTML = seconds < 10 ? "0" + seconds : seconds;
}, 1000);

/* SCROLL REVEAL */
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, { root: null, threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
revealElements.forEach(el => { observer.observe(el); });

/* MOBILE MENU */
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');
function setMenuOpen(open) {
    navLinks.classList.toggle('active', open);
    navLinks.removeAttribute('style');
    menuToggle.setAttribute('aria-expanded', String(open));
}
menuToggle.addEventListener('click', () => setMenuOpen(!navLinks.classList.contains('active')));
menuToggle.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        menuToggle.click();
    }
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMenuOpen(false);
});
window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
    if (event.matches) setMenuOpen(false);
});

/* SMOOTH SCROLL & BACK TO TOP */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const selector = this.getAttribute('href');
        const target = selector === '#' ? document.body : document.querySelector(selector);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (navLinks.classList.contains('active')) {
                setMenuOpen(false);
            }
        }
    });
});

const backToTopBtn = document.getElementById("backToTop");
window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backToTopBtn.classList.add("show");
    } else {
        backToTopBtn.classList.remove("show");
    }
};
backToTopBtn.addEventListener("click", function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =========================================================
   ULTRA-RESPONSIVE BACKGROUND MUSIC (FIXED)
========================================================= */

let bgMusic = document.getElementById('bg-music');
let musicToggle = document.getElementById('music-toggle');
let isPlaying = false;

// Create audio tag if it doesn't exist
if (!bgMusic) {
    bgMusic = document.createElement('audio');
    bgMusic.id = 'bg-music';
    bgMusic.loop = true;
    bgMusic.src = 'assets/audio/song.mp3';
    document.body.appendChild(bgMusic);
}

bgMusic.volume = 0.6;

// Create toggle button if it doesn't exist
if (!musicToggle) {
    musicToggle = document.createElement('button');
    musicToggle.id = 'music-toggle';
    musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    document.body.appendChild(musicToggle);
    
    musicToggle.style.cssText = "position:fixed;bottom:30px;left:30px;width:50px;height:50px;background:var(--bg-dark);border:2px solid var(--gold-bright);border-radius:50%;color:var(--gold-bright);font-size:1.2rem;cursor:pointer;z-index:5000;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow);transition:all 0.3s ease;";
    musicToggle.onmouseover = () => { musicToggle.style.background = 'var(--gold-bright)'; musicToggle.style.color = 'var(--bg-dark)'; };
    musicToggle.onmouseout = () => { musicToggle.style.background = 'var(--bg-dark)'; musicToggle.style.color = 'var(--gold-bright)'; };
}

// The Main Function - DOES NOT BLOCK RETRIES
function tryPlayMusic() {
    // If it's already playing, don't restart it
    if (isPlaying) return;

    bgMusic.play().then(() => {
        isPlaying = true;
        musicToggle.classList.add('playing');
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
    }).catch(() => {
        // If blocked, don't set isPlaying to true. The next interaction will try again.
        // (This was the bug in the last code - it got stuck!)
    });
}

/* 1. THE IMMEDIATE SCROLL TRIGGER (Passive for performance) */
window.addEventListener('scroll', tryPlayMusic, { passive: true });

/* 2. THE WELCOME SECTION TRIGGER */
const welcomeSection = document.getElementById('welcome');
if (welcomeSection) {
    const welcomeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                tryPlayMusic();
                welcomeObserver.disconnect();
            }
        });
    }, { threshold: 0.1 });
    welcomeObserver.observe(welcomeSection);
}

/* 3. THE ULTIMATE TRIGGER: Touch/Click/Key */
// This fires the *millisecond* the user touches the screen to scroll
window.addEventListener('touchstart', tryPlayMusic, { passive: true });
window.addEventListener('pointerdown', tryPlayMusic);
window.addEventListener('keydown', tryPlayMusic);

/* Toggle Button Logic (Allows user to pause/play manually) */
musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        isPlaying = true;
        musicToggle.classList.add('playing');
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        bgMusic.pause();
        isPlaying = false;
        musicToggle.classList.remove('playing');
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    }
});
