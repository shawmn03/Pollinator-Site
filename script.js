const cursor = document.getElementById('bee-cursor');

if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
} else {
    cursor.style.display = 'none';
}

const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prev-slide');
const nextBtn = document.getElementById('next-slide');
const slideshowSection = document.getElementById('slideshow-section');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    slides[currentSlide].classList.add('active');
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }

function startSlideshow() {
    slideInterval = setInterval(nextSlide, 3500);
}

function stopSlideshow() {
    clearInterval(slideInterval);
}

nextBtn.addEventListener('click', () => { 
    nextSlide(); 
    stopSlideshow(); 
    startSlideshow(); 
});

prevBtn.addEventListener('click', () => { 
    prevSlide(); 
    stopSlideshow(); 
    startSlideshow(); 
});

slideshowSection.addEventListener('mouseenter', stopSlideshow);
slideshowSection.addEventListener('mouseleave', startSlideshow);
startSlideshow();

const scrollContainer = document.getElementById('scroll-container');
let scrollTimeout;
window.addEventListener('scroll', () => {
    scrollContainer.classList.add('bouncing');
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => scrollContainer.classList.remove('bouncing'), 150);

    const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
    scrollContainer.style.opacity = atBottom ? '0' : '1';
});

const carousel = document.getElementById('processCarousel');
const scrollbarArea = document.getElementById('customScrollbar');
const thumb = document.getElementById('hummingbirdThumb');
const fill = document.getElementById('scrollbarFill');
let isDragging = false;

function updateUI(percentage) {
    thumb.style.left = (percentage * 100) + '%';
    fill.style.width = (percentage * 100) + '%';
}

carousel.addEventListener('scroll', () => {
    if (!isDragging) {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        const percentage = maxScroll <= 0 ? 0 : carousel.scrollLeft / maxScroll;
        updateUI(percentage);
    }
});

function handleMove(e) {
    if (!isDragging) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = scrollbarArea.getBoundingClientRect();
    let clickX = clientX - rect.left;
    clickX = Math.max(0, Math.min(clickX, rect.width));
    
    const percentage = clickX / rect.width;
    updateUI(percentage);
    
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    carousel.scrollLeft = percentage * maxScroll;
}

scrollbarArea.addEventListener('mousedown', (e) => {
    isDragging = true;
    handleMove(e);
});

document.addEventListener('mousemove', handleMove);
document.addEventListener('mouseup', () => {
    isDragging = false;
});

scrollbarArea.addEventListener('touchstart', (e) => {
    isDragging = true;
    handleMove(e);
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (isDragging) {
        e.preventDefault();
        handleMove(e);
    }
}, { passive: false });

document.addEventListener('touchend', () => {
    isDragging = false;
});

function jsDramaticBloom(element) {
    let progress = 0;
    const animationSpeed = 0.02; 
    
    function step() {
        progress += animationSpeed;
        if (progress > 1) progress = 1;
        
        const c1 = 1.70158;
        const c3 = c1 + 1;
        const scale = 1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);
        
        element.style.transform = `scale(${scale})`;
        element.style.opacity = progress;
        
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        }
    }
    requestAnimationFrame(step);
}

window.addEventListener('load', () => {
    document.querySelectorAll('.landing-flower').forEach((f, i) => {
        setTimeout(() => jsDramaticBloom(f), i * 150); 
    });
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            jsDramaticBloom(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.bloom-js').forEach(el => observer.observe(el));
