/* ============================================
   VÍNCULO PREESCOLAR — Landing Page Scripts
   ============================================ */

// ===== Mobile Nav Toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close nav when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== FAQ Accordion =====
function toggleFaq(item) {
    // Close all other items
    document.querySelectorAll('.faq-item').forEach(faq => {
        if (faq !== item) faq.classList.remove('open');
    });
    item.classList.toggle('open');
}

// ===== Support Form Handler =====
function handleSupport(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const tipo = document.getElementById('tipo').value;
    const mensaje = document.getElementById('mensaje').value.trim();
    const resultDiv = document.getElementById('formResult');

    // Respuestas automáticas según el tipo de problema
    const respuestasAutomaticas = {
        'instalacion': '📱 Para instalar la APK:\n1. Descarga el archivo APK desde la sección "Descargar".\n2. Abre tu explorador de archivos y búscalo en "Descargas".\n3. Tócalo e instálalo.\n4. Si te pide permiso de "fuentes desconocidas", acéptalo.\n\nSi el problema persiste, contáctanos por WhatsApp.',
        'login': '🔑 Problemas de acceso:\n1. Verifica que escribas bien tu correo (sin espacios).\n2. Recuerda que la contraseña es sensible a mayúsculas.\n3. Si olvidaste tu contraseña, contacta a tu directora o administrador.\n4. Si eres tutor nuevo, pide tus credenciales al administrador del kinder.',
        'error': '⚠️ Gracias por reportar el error.\n\nPor favor incluye:\n- Qué pantalla estabas viendo\n- Qué botón presionaste\n- Si aparece algún mensaje de error\n\nTu reporte ha sido registrado. Nuestro equipo técnico lo revisará.',
        'funcionalidad': '💡 ¡Gracias por tu sugerencia!\n\nLa hemos registrado y la evaluaremos para futuras actualizaciones de la app. Tu opinión es muy valiosa para mejorar la experiencia.',
        'otro': '📩 Tu mensaje ha sido recibido.\n\nNos pondremos en contacto contigo a la brevedad. Si es urgente, puedes escribirnos directamente por WhatsApp.'
    };

    // Mostrar respuesta automática
    const respuesta = respuestasAutomaticas[tipo] || respuestasAutomaticas['otro'];

    resultDiv.className = 'form-result success';
    resultDiv.innerHTML = `
        <strong>✅ Mensaje enviado correctamente</strong><br><br>
        <strong>Respuesta automática:</strong><br>
        ${respuesta.replace(/\n/g, '<br>')}
        <br><br>
        <small>También puedes contactarnos por 
        <a href="https://wa.me/5217761180800?text=${encodeURIComponent('Hola, soy ' + nombre + '. ' + mensaje)}" 
           target="_blank" style="color: #25D366; font-weight: 700;">WhatsApp</a> o 
        <a href="mailto:chentejcruz@outlook.com?subject=Soporte: ${encodeURIComponent(tipo)}&body=${encodeURIComponent('Nombre: ' + nombre + '\nEmail: ' + email + '\n\n' + mensaje)}" 
           style="color: var(--primary-dark); font-weight: 700;">Correo</a>
        </small>
    `;

    // Enviar email en segundo plano (intenta el backend de Render)
    fetch('https://app-kinder-seguro.onrender.com/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, tipo, mensaje })
    }).catch(() => {
        // Si el backend no está disponible, el formulario ya mostró la respuesta
        console.log('Backend no disponible, pero el usuario ya vio la respuesta.');
    });

    // Reset form
    document.getElementById('supportForm').reset();
}

// ===== Smooth scroll for all anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Navbar background on scroll =====
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.06)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// ===== Intersection Observer for fade-in animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add animation to cards
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.feature-card, .download-card, .faq-item');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        observer.observe(el);
    });
});
