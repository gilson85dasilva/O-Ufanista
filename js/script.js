document.addEventListener('DOMContentLoaded', function () {
    // --- LÓGICA DO CARROSSEL ---
    const SLIDE_INTERVAL = 5000; // 5 segundos

    const carouselContainer = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const btnPrev = document.querySelector('.carousel-btn-prev');
    const btnNext = document.querySelector('.carousel-btn-next');
    const headerTitle = document.querySelector('.header-content h1');

    // Textos correspondentes a cada slide
    const slideTexts = [
        "",
        "",
        "",
        ""
    ];

    let currentSlide = 0;
    let slideInterval;

    // Função centralizada para mostrar um slide específico
    function showSlide(index) {
        slides[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');

        if (headerTitle && slideTexts[currentSlide]) {
            // Efeito de fade para a troca de texto
            headerTitle.style.opacity = 0;

            setTimeout(() => {
                headerTitle.textContent = slideTexts[currentSlide];
                headerTitle.style.opacity = 1;
            }, 400); // Deve corresponder à transição do CSS
        }
    }

    function nextSlide() {
        const newIndex = (currentSlide + 1) % slides.length;
        showSlide(newIndex);
    }

    function prevSlide() {
        const newIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(newIndex);
    }

    // Função para o ciclo automático que também reinicia o timer
    function autoNextSlide() {
        nextSlide();
        resetTimer(); // Reinicia o timer para o próximo slide
    }

    // Reinicia o temporizador do slide automático
    function resetTimer() {
        clearTimeout(slideInterval);
        slideInterval = setTimeout(autoNextSlide, SLIDE_INTERVAL);
    }

    // Inicia o carrossel e adiciona os eventos
    if (slides.length > 1) {
        // Define o texto inicial
        if (headerTitle && slideTexts[0]) {
            headerTitle.textContent = slideTexts[0];
        }

        if (btnPrev && btnNext) {
            btnNext.addEventListener('click', () => {
                nextSlide();
                resetTimer();
            });

            btnPrev.addEventListener('click', () => {
                prevSlide();
                resetTimer();
            });
        }

        // Pausa o carrossel ao passar o mouse e retoma ao sair
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                clearTimeout(slideInterval);
            });

            carouselContainer.addEventListener('mouseleave', () => {
                resetTimer();
            });
        }
        // Inicia o ciclo automático
        resetTimer();

        // --- SUPORTE A TOUCH (SWIPE) ---
        let touchStartX = 0;
        let touchEndX = 0;

        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            // Pausa o timer ao tocar
            clearTimeout(slideInterval);
        }, { passive: true });

        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            // Retoma o timer após o toque
            resetTimer();
        }, { passive: true });

        function handleSwipe() {
            // Limiar mínimo para considerar um swipe
            const SWIPE_THRESHOLD = 50;

            if (touchEndX < touchStartX - SWIPE_THRESHOLD) {
                // Swipe para Esquerda (Próximo)
                nextSlide();
            }

            if (touchEndX > touchStartX + SWIPE_THRESHOLD) {
                // Swipe para Direita (Anterior)
                prevSlide();
            }
        }
    }

    // --- L�GICA DE REVEAL ---
    const reveals = document.querySelectorAll('.reveal');
    // Observer para Anima��es de Scroll
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
});
