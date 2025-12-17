// ===============================
// DIONYSUS CELLAR - JavaScript
// ===============================

// === ІНІЦІАЛІЗАЦІЯ ПРИ ЗАВАНТАЖЕННІ СТОРІНКИ ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('🍷 Dionysus Cellar - сайт завантажено');

    // === МОДАЛЬНІ ВІКНА РЕГІОНІВ ===
    const regionButtons = document.querySelectorAll('.legend-link[data-region]');
    const modals = document.querySelectorAll('.region-modal');
    const modalCloses = document.querySelectorAll('.modal-close');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    // Відкриття модального вікна
    regionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const regionName = button.getAttribute('data-region');
            const modal = document.getElementById(`modal-${regionName}`);

            if (modal) {
                // Блокуємо прокрутку body
                document.body.style.overflow = 'hidden';

                // Показуємо модальне вікно
                modal.style.display = 'flex';
                modal.classList.add('active');
            }
        });
    });

    // Закриття модального вікна через кнопку X
    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeModal(closeBtn.closest('.region-modal'));
        });
    });

    // Закриття модального вікна через оверлей
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            closeModal(overlay.closest('.region-modal'));
        });
    });

    // Закриття модального вікна через ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.region-modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });

    // Функція закриття модального вікна
    function closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            // Відновлюємо прокрутку body
            document.body.style.overflow = '';
        }, 400);
    }

    // === ПЛАВНА ПРОКРУТКА ДО СЕКЦІЙ ===
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

    // === ЗМІНА СТИЛЮ ХЕДЕРА ПРИ ПРОКРУТЦІ ===
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Додаємо тінь при прокрутці
        if (currentScroll > 100) {
            header.style.boxShadow = '0 5px 30px rgba(212, 175, 55, 0.15)';
        } else {
            header.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // === ДОДАТКОВІ МОДАЛЬНІ ВІКНА ===
    const modalButtons = document.querySelectorAll('[data-modal]');

    // Відкриття додаткових модальних вікон
    modalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modalName = button.getAttribute('data-modal');
            const modal = document.getElementById(`modal-${modalName}`);

            if (modal) {
                // Блокуємо прокрутку body
                document.body.style.overflow = 'hidden';

                // Показуємо модальне вікно
                modal.style.display = 'flex';
                modal.classList.add('active');
            }
        });
    });

    // === ФІЛЬТРАЦІЯ ПРОДУКТІВ ===
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Видаляємо активний клас з усіх кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Додаємо активний клас до натиснутої кнопки
            button.classList.add('active');

            // Отримуємо значення фільтра
            const filterValue = button.getAttribute('data-filter');

            // Фільтруємо продукти
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    // Показуємо карточку з анімацією
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    // Ховаємо карточку з анімацією
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Початкова анімація для карточок
    productCards.forEach(card => {
        card.style.transition = 'all 0.3s ease';
    });

    // === АНІМАЦІЯ ПРИ ПРОКРУТЦІ (FADE-IN) ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Застосовуємо анімацію до всіх секцій
    const animatedElements = document.querySelectorAll(
        '.philosophy-card, .product-card, .legend-card, .showcase-container'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // === ВАЛІДАЦІЯ ФОРМИ ПІДПИСКИ ===
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterInput = document.querySelector('.newsletter-input');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = newsletterInput.value.trim();

            // Проста валідація email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!email) {
                showNotification('Будь ласка, введіть email адресу', 'error');
                return;
            }

            if (!emailRegex.test(email)) {
                showNotification('Будь ласка, введіть коректну email адресу', 'error');
                return;
            }

            // Відправка на сервер (реальна реалізація)
            fetch('api.php?action=subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            }).then(r => r.json()).then(data => {
                if (data && data.success) {
                    showNotification(data.message || 'Дякуємо за підписку! Перевірте вашу пошту.', 'success');
                    newsletterInput.value = '';
                } else {
                    showNotification(data.message || 'Не вдалося підписатися. Спробуйте пізніше.', 'error');
                }
            }).catch(err => {
                showNotification('Не вдалося звʼязатися із сервером. Спробуйте пізніше.', 'error');
                console.error('Subscribe error:', err);
            });
        });
    }

    // === ВАЛІДАЦІЯ ФОРМИ ЗАПРОШЕННЯ ===
    const inviteForm = document.querySelector('.invite-form');

    if (inviteForm) {
        inviteForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(inviteForm);
            const data = Object.fromEntries(formData);

            // Валідація
            if (!data.name || !data.email || !data.phone || !data.experience) {
                showNotification('Будь ласка, заповніть всі обов\'язкові поля', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Будь ласка, введіть коректну email адресу', 'error');
                return;
            }

            // Симуляція відправки
            showNotification('Дякуємо за заявку! Ми розглянемо її протягом 48 годин.', 'success');
            inviteForm.reset();
            // Закрити модальне вікно після успішної відправки
            setTimeout(() => {
                const modal = document.getElementById('modal-invite');
                if (modal) closeModal(modal);
            }, 2000);
        });
    }

    // === ВАЛІДАЦІЯ ФОРМИ КУПІВЛІ ===
    const purchaseForm = document.querySelector('.purchase-form');

    if (purchaseForm) {
        purchaseForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(purchaseForm);
            const data = Object.fromEntries(formData);

            // Валідація
            if (!data.wine || !data.quantity || !data.name || !data.email || !data.phone) {
                showNotification('Будь ласка, заповніть всі поля', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Будь ласка, введіть коректну email адресу', 'error');
                return;
            }

            // Симуляція відправки
            showNotification('Дякуємо за замовлення! Ми зв\'яжемося з вами найближчим часом.', 'success');
            purchaseForm.reset();
            // Закрити модальне вікно після успішної відправки
            setTimeout(() => {
                const modal = document.getElementById('modal-buy');
                if (modal) closeModal(modal);
            }, 2000);
        });
    }

    // === ФУНКЦІЯ ПОКАЗУ СПОВІЩЕНЬ ===
    function showNotification(message, type = 'info') {
        // Створюємо елемент сповіщення
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Стилі для сповіщення
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: ${type === 'success' ? '#D4AF37' : '#ff4444'};
            color: ${type === 'success' ? '#0a0a0a' : '#fff'};
            padding: 1rem 2rem;
            border-radius: 5px;
            font-size: 0.9rem;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
            opacity: 0;
            transform: translateX(400px);
        `;

        // Додаємо анімацію
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes slideIn {
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes slideOut {
                to {
                    opacity: 0;
                    transform: translateX(400px);
                }
            }
        `;
        document.head.appendChild(styleSheet);

        document.body.appendChild(notification);

        // Анімація появи
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Автоматичне приховування через 4 секунди
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }

    // === ЕФЕКТ ПАРАЛАКСА ДЛЯ HERO СЕКЦІЇ ===
    const heroSection = document.querySelector('.hero-section');

    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;

            if (scrolled < window.innerHeight) {
                heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });
    }

    // === ЗОЛОТИСТА ПІДСВІТКА ПРИ НАВЕДЕННІ НА ЗОБРАЖЕННЯ ===
    const hoverImages = document.querySelectorAll('.showcase-image, .product-image, .legend-image');

    hoverImages.forEach(image => {
        image.addEventListener('mouseenter', function() {
            this.style.filter = 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.6))';
        });

        image.addEventListener('mouseleave', function() {
            this.style.filter = 'none';
        });
    });

    // === КУРСОР З ЗОЛОТИСТИМ СЛІДОМ (ОПЦІОНАЛЬНО) ===
    let cursorTrail = [];
    const trailLength = 10;

    document.addEventListener('mousemove', (e) => {
        // Додаємо нову позицію курсора
        cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });

        // Обмежуємо довжину сліду
        if (cursorTrail.length > trailLength) {
            cursorTrail.shift();
        }
    });

    // === АНІМАЦІЯ ЛІЧИЛЬНИКІВ (якщо додасте статистику) ===
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // === LAZY LOADING ДЛЯ ЗОБРАЖЕНЬ ===
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // === КНОПКА ПОШУКУ (МОДАЛЬНЕ ВІКНО) ===
    const searchBtn = document.querySelector('.search-btn');

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            // Тут можна додати модальне вікно для пошуку
            showNotification('Функція пошуку буде доступна найближчим часом', 'info');
        });
    }

    // === КНОПКА ВХОДУ ===
    const loginBtn = document.querySelector('.login-btn');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            // Тут можна додати модальне вікно для входу
            showNotification('Сторінка входу відкриється найближчим часом', 'info');
        });
    }

    // === АНІМАЦІЯ ПЕРЕВАГ ПРИВАТНОГО КЛУБУ ===
    const benefitIcons = document.querySelectorAll('.benefit-icon');

    benefitIcons.forEach((icon, index) => {
        setTimeout(() => {
            icon.style.opacity = '0';
            icon.style.transform = 'scale(0)';
            icon.style.transition = 'all 0.5s ease';

            setTimeout(() => {
                icon.style.opacity = '1';
                icon.style.transform = 'scale(1)';
            }, 100);
        }, index * 200);
    });

    // === ОПТИМІЗАЦІЯ ПРОДУКТИВНОСТІ ===
    // Debounce функція для оптимізації обробників подій
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Застосовуємо debounce до обробника прокрутки
    const debouncedScroll = debounce(() => {
        // Додаткова логіка при прокрутці
    }, 100);

    window.addEventListener('scroll', debouncedScroll);

    // Перевіряємо, чи всі зображення завантажені
    const images = document.querySelectorAll('img');
    let loadedImages = 0;

    images.forEach(img => {
        if (img.complete) {
            loadedImages++;
        } else {
            img.addEventListener('load', () => {
                loadedImages++;
                if (loadedImages === images.length) {
                    console.log('✅ Всі зображення завантажено');
                }
            });
        }
    });

    // === ЛОГІКА ВХОДУ КОРИСТУВАЧА ===

    // Елементи DOM
    const loginBtnNew = document.getElementById('loginBtn');
    const navActions = document.querySelector('.nav-actions');
    const loginForm = document.querySelector('.login-form');

    // Перевірка, чи користувач вже увійшов при завантаженні сторінки
    // Дані не зберігаються, тому завжди показуємо кнопку входу

    // Валідація форми входу
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData);

            // Валідація
            if (!data.email || !data.password) {
                showNotification('Будь ласка, заповніть всі поля', 'error');
                return;
            }

            try {
                const response = await fetch('api.php?action=login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (result.success) {
                    // Оновлення кнопки
                    updateLoginButton(result.user.name);

                    // Закриття модального вікна
                    const modal = document.getElementById('modal-login');
                    if (modal) closeModal(modal);

                    // Повідомлення про успіх
                    showNotification('Вітаємо! Ви успішно увійшли до системи.', 'success');

                    // Очищення форми
                    loginForm.reset();
                } else {
                    showNotification(result.message, 'error');
                }
            } catch (error) {
                console.error('Помилка входу:', error);
                showNotification('Помилка з\'єднання з сервером', 'error');
            }
        });
    }

    // Валідація форми реєстрації
    const registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData);

            // Валідація
            if (!data.name || !data.email || !data.phone || !data.password || !data.confirmPassword) {
                showNotification('Будь ласка, заповніть всі поля', 'error');
                return;
            }

            if (data.password !== data.confirmPassword) {
                showNotification('Паролі не співпадають', 'error');
                return;
            }

            if (data.password.length < 6) {
                showNotification('Пароль повинен містити мінімум 6 символів', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Будь ласка, введіть коректну email адресу', 'error');
                return;
            }

            try {
                const response = await fetch('api.php?action=register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        password: data.password
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    // Закриття модального вікна реєстрації
                    const modal = document.getElementById('modal-register');
                    if (modal) closeModal(modal);

                    // Відкриття модального вікна входу
                    const loginModal = document.getElementById('modal-login');
                    if (loginModal) {
                        loginModal.style.display = 'flex';
                        loginModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }

                    // Повідомлення про успіх
                    showNotification('Реєстрація успішна! Тепер увійдіть в акаунт.', 'success');

                    // Очищення форми
                    registerForm.reset();
                } else {
                    showNotification(result.message, 'error');
                }
            } catch (error) {
                console.error('Помилка реєстрації:', error);
                showNotification('Помилка з\'єднання з сервером', 'error');
            }
        });
    }

    // Функція перевірки сесії
    async function checkSession() {
        try {
            const response = await fetch('api.php?action=check_session');
            const result = await response.json();

            if (result.logged_in) {
                updateLoginButton(result.user.name);
            }
        } catch (error) {
            console.error('Помилка перевірки сесії:', error);
        }
    }

    // Функція показу модального вікна реєстрації
    window.showRegisterModal = function() {
        // Закриття модального вікна входу
        const loginModal = document.getElementById('modal-login');
        if (loginModal) closeModal(loginModal);

        // Відкриття модального вікна реєстрації
        const registerModal = document.getElementById('modal-register');
        if (registerModal) {
            registerModal.style.display = 'flex';
            registerModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Виклик перевірки сесії при завантаженні сторінки
    checkSession();

    // Функція оновлення кнопки входу на ім'я користувача
    function updateLoginButton(userName) {
        if (navActions && loginBtnNew) {
            // Видаляємо стару кнопку
            loginBtnNew.remove();

            // Створюємо посилання на кабінет користувача
            const userLink = document.createElement('a');
            userLink.className = 'user-btn';
            userLink.textContent = userName;
            userLink.href = 'cabinet.html';
            userLink.title = 'Перейти до кабінету користувача';

            // Додаємо посилання до nav-actions
            navActions.appendChild(userLink);
        }
    }

    // === ДОДАТКОВІ ФУНКЦІЇ ДЛЯ АВТЕНТИФІКАЦІЇ ===

    // Функція показу повідомлень
    function showNotification(message, type = 'info') {
        // Видаляємо існуючі повідомлення
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Створюємо нове повідомлення
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Додаємо до body
        document.body.appendChild(notification);

        // Показуємо повідомлення
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Автоматично ховаємо через 5 секунд
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Функція закриття модального вікна
    function closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // === ЕКСПОРТ ФУНКЦІЙ (якщо потрібно) ===
    window.DionysusApp = {
        showNotification,
        closeModal,
        animateCounter
    };
});