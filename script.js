// ===== Pantalla de bienvenida (solo móviles) =====
(function initWelcomeOverlay() {
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    if (!welcomeOverlay || !mobileQuery.matches) return;

    document.body.classList.add('welcome-overlay-visible');

    welcomeOverlay.addEventListener('click', function dismissOverlay() {
        welcomeOverlay.classList.add('welcome-overlay--hiding');
        setTimeout(function () {
            welcomeOverlay.style.display = 'none';
            document.body.classList.remove('welcome-overlay-visible');
        }, 500);
    }, { once: true });
})();

// Fecha objetivo: 17 de octubre de 2026
const targetDate = new Date('2026-10-17T12:00:00').getTime();

// Elementos del contador
const monthsElement = document.getElementById('months');
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        // Si la fecha ya pasó
        monthsElement.textContent = '00';
        daysElement.textContent = '00';
        hoursElement.textContent = '00';
        minutesElement.textContent = '00';
        secondsElement.textContent = '00';
        return;
    }

    // Calcular meses y días de forma precisa
    const nowDate = new Date(now);
    const targetDateObj = new Date(targetDate);
    
    // Calcular diferencia de meses
    let months = (targetDateObj.getFullYear() - nowDate.getFullYear()) * 12;
    months += targetDateObj.getMonth() - nowDate.getMonth();
    
    // Calcular días restantes después de los meses completos
    const dateAfterMonths = new Date(nowDate);
    dateAfterMonths.setMonth(nowDate.getMonth() + months);
    let days = Math.floor((targetDateObj - dateAfterMonths) / (1000 * 60 * 60 * 24));
    
    // Ajustar meses si los días son negativos
    if (days < 0) {
        months--;
        const dateAfterAdjustedMonths = new Date(nowDate);
        dateAfterAdjustedMonths.setMonth(nowDate.getMonth() + months);
        days = Math.max(0, Math.floor((targetDateObj - dateAfterAdjustedMonths) / (1000 * 60 * 60 * 24)));
    }
    
    months = Math.max(0, months);
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Actualizar elementos
    monthsElement.textContent = String(months).padStart(2, '0');
    daysElement.textContent = String(days).padStart(2, '0');
    hoursElement.textContent = String(hours).padStart(2, '0');
    minutesElement.textContent = String(minutes).padStart(2, '0');
    secondsElement.textContent = String(seconds).padStart(2, '0');
}

// Actualizar cada segundo
updateCountdown();
setInterval(updateCountdown, 1000);

// Funcionalidad para copiar IBAN al portapapeles
const copyBtn = document.getElementById('copyBtn');
const ibanElement = document.getElementById('iban');
const copyFeedback = document.getElementById('copyFeedback');

if (copyBtn && ibanElement) {
    copyBtn.addEventListener('click', async () => {
        const ibanText = ibanElement.textContent.trim();
        
        try {
            // Intentar usar la API moderna del portapapeles
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(ibanText.replace(/\s/g, ''));
                showFeedback('✓ IBAN copiado al portapapeles');
            } else {
                // Fallback para navegadores más antiguos
                const textArea = document.createElement('textarea');
                textArea.value = ibanText.replace(/\s/g, '');
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showFeedback('✓ IBAN copiado al portapapeles');
            }
        } catch (err) {
            showFeedback('Error al copiar. Por favor, copia manualmente.');
            console.error('Error al copiar:', err);
        }
    });
}

function showFeedback(message) {
    if (copyFeedback) {
        copyFeedback.textContent = message;
        copyFeedback.classList.add('show');
        
        setTimeout(() => {
            copyFeedback.classList.remove('show');
            setTimeout(() => {
                copyFeedback.textContent = '';
            }, 300);
        }, 2000);
    }
}
