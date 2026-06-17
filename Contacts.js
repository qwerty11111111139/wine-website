// Ініціалізація при завантаженні
document.addEventListener('DOMContentLoaded', function() {
    
    // === ОБРОБКА ФОРМИ КОНТАКТІВ ===
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit();
        });
    }
    
    // === ЗОЛОТИСТЕ ПІДСВІЧУВАННЯ ===
    addGoldenEffects();
    
    // === АНІМАЦІЇ ПРИ СКРОЛІ ===
    initScrollAnimations();
    
    // === ВАЛІДАЦІЯ ФОРМИ В РЕАЛЬНОМУ ЧАСІ ===
    initFormValidation();
    
    console.log('Сторінка контактів ініціалізована');
});

// === ОБРОБКА ВІДПРАВКИ ФОРМИ ===
function handleFormSubmit() {
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    console.log('Відправка форми:', formData);
    
    // Показуємо індикатор завантаження
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'ВІДПРАВКА...';
    submitBtn.disabled = true;
    
    // ТУТ БУДЕ ЗАПИТ НА СЕРВЕР
    // sendContactForm(formData);
    
    // Симуляція відправки
    setTimeout(() => {
        submitBtn.textContent = '✓ ВІДПРАВЛЕНО';
        submitBtn.style.background = '#27ae60';
        submitBtn.style.color = '#fff';
        submitBtn.style.borderColor = '#27ae60';
        
        // Очищаємо форму
        document.getElementById('contactForm').reset();
        
        // Показуємо повідомлення
        showNotification('Дякуємо! Ваше повідомлення відправлено', 'success');
        
        // Повертаємо кнопку до початкового стану
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.style.color = '';
            submitBtn.style.borderColor = '';
            submitBtn.disabled = false;
        }, 3000);
        
    }, 1500);
}

// === ВІДПРАВКА НА СЕРВЕР (ПРИКЛАД) ===
async function sendContactForm(formData) {
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Помилка відправки');
        }
        
        const data = await response.json();
        console.log('Відповідь сервера:', data);
        
        showNotification('Повідомлення успішно відправлено!', 'success');
        
    } catch (error) {
        console.error('Помилка:', error);
        showNotification('Помилка відправки. Спробуйте пізніше', 'error');
    }
}

// === ЗОЛОТИСТІ ЕФЕКТИ ===
function addGoldenEffects() {
    // Підсвічування навігації
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 10px rgba(184, 134, 11, 0.8)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.textShadow = '';
        });
    });
    
    // Підсвічування карток контактів
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 8px 40px rgba(184, 134, 11, 0.5), 0 0 60px rgba(184, 134, 11, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 8px 30px rgba(184, 134, 11, 0.3)';
        });
    });
    
    // Підсвічування іконок
    const contactIcons = document.querySelectorAll('.contact-icon, .hours-icon');
    
    contactIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(184, 134, 11, 0.3)';
            this.style.borderColor = '#B8860B';
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'all 0.3s ease';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(184, 134, 11, 0.15)';
            this.style.borderColor = 'rgba(184, 134, 11, 0.3)';
            this.style.transform = 'scale(1)';
        });
    });
    
    // Підсвічування соціальних іконок
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 20px rgba(184, 134, 11, 0.9)';
            this.style.boxShadow = '0 0 25px rgba(184, 134, 11, 0.7)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.textShadow = '';
            this.style.boxShadow = '';
        });
    });
}

// === АНІМАЦІЇ ПРИ СКРОЛІ ===
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Анімуємо картки
    document.querySelectorAll('.contact-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
    
    // Анімуємо форму
    const form = document.querySelector('.contact-form');
    if (form) {
        form.style.opacity = '0';
        form.style.transform = 'translateY(30px)';
        form.style.transition = 'all 0.6s ease';
        observer.observe(form);
    }
}

// === ВАЛІДАЦІЯ ФОРМИ ===
function initFormValidation() {
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    // Валідація email
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                this.style.borderColor = '#e74c3c';
                showFieldError(this, 'Невірний формат email');
            } else {
                this.style.borderColor = 'rgba(184, 134, 11, 0.3)';
                hideFieldError(this);
            }
        });
    }
    
    // Валідація телефону
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Автоматичне форматування номера
            let value = this.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    this.value = '+38 (' + value;
                } else if (value.length <= 6) {
                    this.value = '+38 (' + value.slice(2, 5) + ') ' + value.slice(5);
                } else if (value.length <= 9) {
                    this.value = '+38 (' + value.slice(2, 5) + ') ' + value.slice(5, 8) + '-' + value.slice(8);
                } else {
                    this.value = '+38 (' + value.slice(2, 5) + ') ' + value.slice(5, 8) + '-' + value.slice(8, 10) + '-' + value.slice(10, 12);
                }
            }
        });
    }
    
    // Золотисте підсвічування при фокусі
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.querySelector('label').style.color = '#D4AF37';
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.querySelector('label').style.color = '#B8860B';
            }
        });
    });
}

// === ПОКАЗ ПОМИЛКИ ПОЛЯ ===
function showFieldError(field, message) {
    let errorDiv = field.parentElement.querySelector('.field-error');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.8rem;
            margin-top: 0.5rem;
        `;
        field.parentElement.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
}

// === ПРИХОВУВАННЯ ПОМИЛКИ ПОЛЯ ===
function hideFieldError(field) {
    const errorDiv = field.parentElement.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// === ПОКАЗ ПОВІДОМЛЕНЬ ===
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1.5rem 2rem;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#B8860B'};
        color: white;
        border-radius: 8px;
        z-index: 9999;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.4s ease;
        font-size: 0.95rem;
        letter-spacing: 0.5px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// === АНІМАЦІЇ ===
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// === ОБРОБКА ІКОНОК В HEADER ===
const searchIcon = document.querySelector('.search-icon');
const cartIcon = document.querySelector('.cart-icon');

if (searchIcon) {
    searchIcon.addEventListener('click', function() {
        console.log('Відкрити пошук');
        // Тут можна додати логіку відкриття пошуку
    });
}

if (cartIcon) {
    cartIcon.addEventListener('click', function() {
        console.log('Відкрити кошик');
        // window.location.href = 'cart.html';
    });
}