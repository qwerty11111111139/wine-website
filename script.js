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

    // Delegated fallback: open modals for dynamically created or replaced buttons
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal], .login-btn, .btn-login');
        if (!trigger) return;
        const modalName = trigger.getAttribute('data-modal') || trigger.dataset.modal || 'login';
        const modal = document.getElementById(`modal-${modalName}`);
        if (modal) {
            e.preventDefault();
            document.body.style.overflow = 'hidden';
            modal.style.display = 'flex';
            modal.classList.add('active');
        }
    });

    // Delegated close handler (overlay or close button)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay') || e.target.closest('.modal-close')) {
            const modal = e.target.closest('.region-modal') || (e.target.closest('.modal-overlay') && e.target.closest('.modal-overlay').closest('.region-modal'));
            if (modal) {
                closeModal(modal);
            }
        }
    });

    // === АВТОРИЗАЦІЯ В ХЕДЕРІ: перевірка сесії та логіку відображення ===
    // Показує або кнопку входу (гость) або одну кнопку з іменем користувача (зайшов)
    function renderUserInHeader(userName, role = 'user') {
        const selectors = ['#loginBtn', '.login-btn', '.btn-login'];
        const selQuery = selectors.join(',');

            // Remove duplicate user elements but preserve first login placeholder if present
        const nav = document.querySelector('.nav-actions');

        // Find any existing login placeholders; keep the first (primary), remove extras
        const existingPlaceholders = Array.from(document.querySelectorAll(selectors));
        const primaryPlaceholder = existingPlaceholders.length ? existingPlaceholders[0] : null;
        existingPlaceholders.slice(1).forEach(el => el.remove());

        // Remove leftover user buttons/auth actions (to avoid duplicates)
        document.querySelectorAll('.user-btn, .auth-actions').forEach(el => el.remove());

        if (userName) {
            // Create a single user button matching the primary placeholder's tag when possible
            const createUserElement = (tagName = 'a') => {
                const el = document.createElement(tagName.toLowerCase());
                el.className = 'user-btn';
                el.textContent = userName;
                if (tagName.toLowerCase() === 'a') {
                    el.href = (role === 'admin') ? 'admin_panel.html' : 'cabinet.php';
                } else {
                    el.addEventListener('click', () => {
                        window.location.href = (role === 'admin') ? 'admin_panel.html' : 'cabinet.php';
                    });
                }
                el.title = (role === 'admin') ? 'Перейти до панелі адміністратора' : 'Перейти до кабінету користувача';
                return el;
            };

            if (primaryPlaceholder) {
                // Replace primary placeholder in-place to preserve layout
                const tag = primaryPlaceholder.tagName || 'BUTTON';
                const userEl = createUserElement(tag);
                primaryPlaceholder.replaceWith(userEl);
            } else if (nav) {
                nav.appendChild(createUserElement('BUTTON'));
            } else {
                // Try to append into common header content regions used by other pages
                const headerContent = document.querySelector('.header .header-content') || document.querySelector('.header .container') || document.querySelector('.header');
                if (headerContent) headerContent.appendChild(createUserElement('BUTTON'));
                else (document.querySelector('header') || document.body).appendChild(createUserElement('BUTTON'));
            }

            return;
        }

        // Guest: ensure there is only one login button and it appears in the expected place
        if (primaryPlaceholder) {
            // If primary existed but was replaced earlier, ensure it's a proper login button
            const loginBtn = document.createElement(primaryPlaceholder.tagName.toLowerCase());
            loginBtn.className = 'login-btn';
            loginBtn.id = 'loginBtn';
            loginBtn.setAttribute('data-modal', 'login');
            loginBtn.textContent = 'УВІЙТИ';
            loginBtn.addEventListener('click', (ev) => {
                ev.preventDefault();
                const modal = document.getElementById('modal-login');
                if (modal) {
                    document.body.style.overflow = 'hidden';
                    modal.style.display = 'flex';
                    modal.classList.add('active');
                }
            });
            primaryPlaceholder.replaceWith(loginBtn);
            return;
        }

        // No placeholder: append login button to nav if possible, otherwise put it into header content
        const loginBtn = document.createElement('button');
        loginBtn.className = 'login-btn';
        loginBtn.id = 'loginBtn';
        loginBtn.setAttribute('data-modal', 'login');
        loginBtn.textContent = 'УВІЙТИ';
        loginBtn.addEventListener('click', (ev) => {
            ev.preventDefault();
            const modal = document.getElementById('modal-login');
            if (modal) {
                document.body.style.overflow = 'hidden';
                modal.style.display = 'flex';
                modal.classList.add('active');
            }
        });

        if (nav) nav.appendChild(loginBtn);
        else {
            const headerContent = document.querySelector('.header .header-content') || document.querySelector('.header .container') || document.querySelector('.header');
            if (headerContent) headerContent.appendChild(loginBtn);
            else (document.querySelector('header') || document.body).appendChild(loginBtn);
        }
    }

    // Глобальна функція виходу, можна викликати звідусіль (window.handleLogout)
    async function handleLogout() {
        console.log('handleLogout triggered');

        // FULL AMNESIA: clear storages first
        try {
            localStorage.clear();
            sessionStorage.clear();
        } catch (e) {
            console.warn('Не вдалося очистити сховище:', e);
        }

        // Attempt server-side logout (best-effort)
        try {
            await fetch('api.php?action=logout', { method: 'GET', credentials: 'same-origin' });
        } catch (err) {
            console.warn('Помилка при виклику logout на сервері:', err);
        }

        // Remove all cookies (best-effort)
        try {
            document.cookie.split(';').forEach(c => {
                const eqPos = c.indexOf('=');
                const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + location.hostname;
            });
        } catch (e) {
            console.warn('Не вдалося видалити куки:', e);
        }

        // Verify server state: request check_session to confirm logout
        try {
            const res = await fetch('api.php?action=check_session', { credentials: 'same-origin' });
            const data = await res.json();
            if (data && data.logged_in) {
                console.warn('Server still reports an active session after logout. Forcing logout redirect.');
                // Force redirect with query param to indicate forced logout
                window.location.href = 'index.html?force_logout=1';
                return;
            }
        } catch (err) {
            console.warn('Не вдалося перевірити стан сесії після logout:', err);
        }

        // Redirect to homepage (homepage now ignores any stored session)
        window.location.href = 'index.html';
    }

    // Експортуємо на window щоб інші скрипти могли викликати
    window.handleLogout = handleLogout;
    window.renderUserInHeader = renderUserInHeader;

    // Перевірити сесію користувача і відобразити відповідні кнопки
    async function checkSessionForHeader() {
        try {
            const res = await fetch('api.php?action=check_session', { credentials: 'same-origin' });
            const data = await res.json();
            if (data && data.logged_in) {
                const name = (data.user && (data.user.name || data.user_name)) ? (data.user.name || data.user_name) : 'Користувач';
                const role = (data.user && data.user.role) ? data.user.role : (data.role || 'user');
                renderUserInHeader(name, role);

                // Strict visibility: show club section only when user is logged in AND explicitly marked as club member
                try {
                    const memberFlag = (typeof data.is_club_member !== 'undefined') ? parseInt(data.is_club_member, 10) : (data.user && typeof data.user.is_club_member !== 'undefined' ? parseInt(data.user.is_club_member, 10) : 0);
                    const el = document.getElementById('club-wines-section');
                    if (memberFlag === 1) {
                        if (el) {
                            el.style.display = 'block';
                        } else if (typeof window.renderClubMembersSection === 'function') {
                            window.renderClubMembersSection();
                        }
                    } else {
                        // Ensure the section is hidden for non-members
                        if (el) el.style.display = 'none';
                    }
                } catch (e) { /* ignore */ }
            } else {
                // Not logged in: make sure the club section is hidden
                try {
                    const el2 = document.getElementById('club-wines-section');
                    if (el2) el2.style.display = 'none';
                } catch (err) {}
                renderUserInHeader(null);
            }
        } catch (e) {
            console.error('Помилка перевірки сесії:', e);
        }
    }

    // Викликаємо при завантаженні (ВИМКНЕНО НА ГОЛОВНІЙ)
    (function() {
        const path = window.location.pathname.split('/').pop();
        if (!path || path === '' || path === 'index.html') {
            console.log('Header session check disabled on homepage');
            return;
        }
        checkSessionForHeader();
    })();

    // Ensure login buttons always open the modal (fallback + dynamic additions)
    function ensureLoginBtnListener() {
        document.querySelectorAll('#loginBtn, .login-btn').forEach(b => {
            try {
                if (!b.dataset._loginHandlerAttached) {
                    b.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        const modal = document.getElementById('modal-login');
                        if (modal) {
                            document.body.style.overflow = 'hidden';
                            modal.style.display = 'flex';
                            modal.classList.add('active');
                        }
                    });
                    b.dataset._loginHandlerAttached = '1';
                }
            } catch (err) {
                // swallow any errors to avoid breaking other scripts
                console.debug('ensureLoginBtnListener error', err);
            }
        });
    }
    ensureLoginBtnListener();
    // Watch for dynamic insertion/replacement of header buttons
    const _loginBtnObserver = new MutationObserver(() => ensureLoginBtnListener());
    _loginBtnObserver.observe(document.body, { childList: true, subtree: true });

    // Делегований обробник нажаття на logout у сайдбарі/хедері (універсальний)
    document.addEventListener('click', (e) => {
        const target = e.target.closest && e.target.closest('.logout-link, #logout-btn, .logout, .logout-btn');
        if (!target) return;

        // Якщо елемент вимагає підтвердження — підтверджуємо
        const needsConfirm = target.classList.contains('logout-link') || target.classList.contains('logout');
        if (needsConfirm) {
            if (!confirm('Ви впевнені, що хочете вийти?')) {
                e.preventDefault();
                return;
            }
        }

        e.preventDefault();
        // Викликаємо глобальний вихід
        if (window && typeof window.handleLogout === 'function') {
            window.handleLogout();
        } else {
            // fallback: чистимо localStorage і редірект
            ['isLoggedIn','userToken','userData','user_id','adminToken','isAdmin'].forEach(k => localStorage.removeItem(k));
            window.location.href = 'index.html';
        }
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
            if (!data.name || !data.email || !data.phone) {
                showNotification('Будь ласка, заповніть всі обов\'язкові поля', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Будь ласка, введіть коректну email адресу', 'error');
                return;
            }

            // Visual debug to confirm handler runs
            alert('Form submitting...');
            // Відправляємо запит на сервер (relative path)
            fetch('./join_club.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(res => {
                console.log('join_club response', res.status, res.statusText);
                if (!res.ok) {
                    return res.text().then(t => { throw new Error('Server error: ' + res.status + ' ' + t); });
                }
                return res.json();
            })
            .then(resp => {
                if (resp && resp.success) {
                    showNotification('Дякуємо за заявку! Ми розглянемо її протягом 48 годин.', 'success');
                    inviteForm.reset();
                    setTimeout(() => {
                        const modal = document.getElementById('modal-invite');
                        if (modal) closeModal(modal);
                    }, 1500);
                } else {
                    showNotification((resp && resp.message) ? resp.message : 'Помилка при відправці заявки', 'error');
                }
            })
            .catch(err => {
                console.error('Invite submit failed:', err);
                // Fallback: submit the form normally to ensure server-side handling
                try { inviteForm.submit(); } catch (e) { showNotification('Помилка зв\'язку з сервером', 'error'); }
            });
        });
    }

    // === ВАЛІДАЦІЯ ФОРМИ КУПІВЛІ ===
    const purchaseForm = document.querySelector('.purchase-form');

    if (purchaseForm) {
        purchaseForm.addEventListener('submit', async (e) => {
            // Prevent the browser's default submit behaviour first to avoid accidental reloads
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

            // Збираємо реальну назву продукту (текст опції), щоб знайти її у таблиці products
            let productName = data.wine;
            const selectEl = purchaseForm.querySelector('#wine-select');
            if (selectEl && selectEl.selectedIndex > 0) {
                productName = selectEl.options[selectEl.selectedIndex].text;
            }

            const payload = {
                product_name: productName,
                quantity: parseInt(data.quantity, 10) || 1,
                customer_name: data.name,
                email: data.email,
                phone: data.phone
            };

            try {
                const resp = await fetch('api_orders.php', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const json = await resp.json();
                if (json && json.success) {
                    // Show success and keep user on the same page (no reload / no redirect)
                    const orderId = json.order && json.order.id ? json.order.id : '';
                    showNotification(orderId ? `Замовлення #${orderId} успішно створено` : 'Замовлення успішно створено', 'success');
                    // Reset the form and close modal, but do NOT reload or redirect
                    purchaseForm.reset();
                    setTimeout(() => {
                        const modal = document.getElementById('modal-buy');
                        if (modal) closeModal(modal);
                        // Intentionally staying on the same page to preserve session state
                    }, 700);
                } else {
                    showNotification(json.message || 'Помилка при створенні замовлення', 'error');
                }
            } catch (err) {
                console.error('Order submission error:', err);
                showNotification('Помилка мережі при створенні замовлення', 'error');
            }
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
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (result.success) {
                    // Оновлення кнопки (передаємо роль, якщо вона є)
                    const role = (result.user && (result.user.role || result.role)) ? (result.user.role || result.role) : 'user';
                    updateLoginButton(result.user.name, role);

                    // Закриття модального вікна
                    const modal = document.getElementById('modal-login');
                    if (modal) closeModal(modal);

                    // Повідомлення про успіх
                    showNotification('Вітаємо! Ви успішно увійшли до системи.', 'success');

                    // Очищення форми
                    loginForm.reset();

                    // Перенаправлення в кабінет після успіху
                    setTimeout(() => {
                        window.location.href = 'cabinet.php';
                    }, 1500);
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
                    credentials: 'same-origin',
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

                    // Перенаправлення в кабінет після успіху
                    setTimeout(() => {
                        window.location.href = 'cabinet.php';
                    }, 1500);
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
            const response = await fetch('api.php?action=check_session', { credentials: 'same-origin' });
            const result = await response.json();

            if (result.logged_in) {
                const role = result.user.role || result.role || 'user';
                updateLoginButton(result.user.name, role);
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

    // Функція оновлення кнопки входу на ім'я користувача (універсальна, працює на всіх сторінках)
    function updateLoginButton(userName, role = 'user') {
        // Якщо є централізована логіка рендера — використовуємо її (щоб уникнути дублювання)
        if (window && typeof window.renderUserInHeader === 'function') {
            window.renderUserInHeader(userName, role);
            return;
        }

        // Candidate selectors for login button across pages
        const selectors = ['#loginBtn', '.login-btn', '.btn-login'];
        const selQuery = selectors.join(',');

        // Видаляємо потенційні дублікати
        document.querySelectorAll(selQuery + ', .user-btn, .auth-actions').forEach(el => el.remove());

        let replaced = false;

        // choose destination based on role
        const href = (role === 'admin') ? 'admin_panel.html' : 'cabinet.php';
        const title = (role === 'admin') ? 'Перейти до панелі адміністратора' : 'Перейти до кабінету користувача';

        selectors.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) {
                // Replace with a user link
                const userLink = document.createElement('a');
                userLink.className = 'user-btn';
                userLink.textContent = userName;
                userLink.href = href;
                userLink.title = title;

                el.replaceWith(userLink);
                replaced = true;
            }
        });

        // Fallback: append to nav-actions if present and nothing replaced
        if (!replaced) {
            const nav = document.querySelector('.nav-actions') || document.querySelector('.header .nav') || document.querySelector('.nav-container');
            if (nav) {
                const userLink = document.createElement('a');
                userLink.className = 'user-btn';
                userLink.textContent = userName;
                userLink.href = href;
                userLink.title = title;
                nav.appendChild(userLink);
            }
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