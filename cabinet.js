// Активний пункт меню
document.addEventListener('DOMContentLoaded', function() {
    
    // Отримуємо всі посилання в сайдбарі
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    // Явний обробник для кнопки виходу (id="logout-btn") — надійний обробник на всіх сторінках
    (function attachExplicitLogout() {
        const explicitLogoutBtn = document.getElementById('logout-btn');
        if (explicitLogoutBtn) {
            explicitLogoutBtn.addEventListener('click', async function(e) {
                e.preventDefault();
                console.log('Explicit cabinet logout clicked');

                const confirmLogout = confirm('Вийти з аккаунта?');
                if (!confirmLogout) return;

                if (window && typeof window.handleLogout === 'function') {
                    try {
                        await window.handleLogout();
                        return;
                    } catch (err) {
                        console.warn('window.handleLogout failed, falling back', err);
                    }
                }

                // Fallback: full cleanup
                try {
                    localStorage.removeItem('user_id');
                    localStorage.clear();
                    sessionStorage.clear();
                    document.cookie.split(';').forEach(c => {
                        const eqPos = c.indexOf('=');
                        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
                        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
                        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + location.hostname;
                    });
                } catch (er) { console.warn('Error clearing client data during logout', er); }

                try {
                    await fetch('api.php?action=logout', { method: 'GET', credentials: 'same-origin' });
                } catch (err) { console.warn('Server logout request failed', err); }

                window.location.href = 'index.html';
            });
        } else {
            console.warn('explicit logout button (#logout-btn) не знайдено на цій сторінці');
        }
    })();
    
    // Отримуємо поточну сторінку
    const currentPage = window.location.pathname.split('/').pop();
    
    // Додаємо клас active до поточної сторінки
    sidebarLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
        
        // Додаємо ефект кліку з анімацією
        link.addEventListener('click', function(e) {
            // Якщо це logout, показуємо підтвердження та виконуємо запит до бека
            if (this.classList.contains('logout-link')) {
                const confirmLogout = confirm('Ви впевнені, що хочете вийти?');
                if (!confirmLogout) {
                    e.preventDefault();
                    return;
                }

                e.preventDefault();

                if (window && typeof window.handleLogout === 'function') {
                    window.handleLogout();
                } else {
                    try { localStorage.clear(); sessionStorage.clear(); } catch (e) {}
                    window.location.href = 'index.html';
                }
            }
        });
    });
    
    // Обробка форми
    const userForm = document.getElementById('userForm');
    
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Отримуємо дані з форми
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            };
            
            console.log('Дані форми:', formData);
            
            // Показуємо повідомлення про успіх
            showSuccessMessage();
            
            // Тут можна додати AJAX запит для відправки даних на сервер
            // fetch('/api/update-profile', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(formData)
            // })
        });
    }
    
    // Функція показу повідомлення про успіх
    function showSuccessMessage() {
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = '✓ ЗБЕРЕЖЕНО';
        submitBtn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = 'linear-gradient(135deg, #B8860B, #D4AF37)';
        }, 2000);
    }
    
    // Анімація для інпутів
    const inputs = document.querySelectorAll('.form-group input');
    
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
    
    // Smooth scroll для навігації
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
    
    // Додавання ефекту підсвічування при наведенні на соціальні іконки
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 10px rgba(184, 134, 11, 0.8)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.textShadow = 'none';
        });
    });
});

// Функція для навігації (можна викликати з будь-якого місця)
function navigateTo(page) {
    window.location.href = page;
}

// Перевірка авторизації (приклад)
function checkAuth() {
    // Тут можна додати перевірку чи користувач авторизований
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
        // Редірект на сторінку входу
        // window.location.href = 'login.html';
    }
}

// Виклик при завантаженні сторінки
checkAuth();