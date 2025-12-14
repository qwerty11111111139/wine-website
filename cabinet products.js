// Активний пункт меню
document.addEventListener('DOMContentLoaded', function() {
    
    // Отримуємо всі посилання в сайдбарі
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    // Отримуємо поточну сторінку
    const currentPage = window.location.pathname.split('/').pop();
    
    // Додаємо клас active до поточної сторінки
    sidebarLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
        
        // Додаємо ефект кліку
        link.addEventListener('click', function(e) {
            // Якщо це logout, показуємо підтвердження
            if (this.classList.contains('logout-link')) {
                const confirmLogout = confirm('Ви впевнені, що хочете вийти?');
                if (!confirmLogout) {
                    e.preventDefault();
                    return;
                }
            }
            
            // Видаляємо активний клас з усіх посилань
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Додаємо активний клас до натиснутого посилання
            this.classList.add('active');
        });
    });
    
    // Обробка кнопок "ПЕРЕГЛЯНУТИ ПРОДУКТ"
    const productButtons = document.querySelectorAll('.product-btn');
    
    productButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            
            console.log('Переглянути продукт:', productName);
            
            // Тут можна додати редірект на сторінку продукту
            // window.location.href = `product-details.html?name=${encodeURIComponent(productName)}`;
            
            // Або показати модальне вікно
            showProductModal(productName);
        });
    });
    
    // Функція показу модального вікна (приклад)
    function showProductModal(productName) {
        // Анімація кнопки
        event.target.textContent = '✓ ВІДКРИТО';
        event.target.style.background = '#B8860B';
        event.target.style.color = '#000';
        
        setTimeout(() => {
            event.target.textContent = 'ПЕРЕГЛЯНУТИ ПРОДУКТ';
            event.target.style.background = 'transparent';
            event.target.style.color = '#B8860B';
        }, 1500);
        
        // Тут можна додати логіку відкриття модального вікна
        console.log('Відкрити модальне вікно для:', productName);
    }
    
    // Анімація при скролі
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Спостерігаємо за картками товарів
    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
    
    // Додавання ефекту золотистого сяйва при наведенні
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 8px 40px rgba(184, 134, 11, 0.5)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 8px 30px rgba(184, 134, 11, 0.3)';
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
    
    // Додавання золотистого підсвічування для соціальних іконок
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 15px rgba(184, 134, 11, 0.8)';
            this.style.boxShadow = '0 0 20px rgba(184, 134, 11, 0.6)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.textShadow = 'none';
            this.style.boxShadow = 'none';
        });
    });
    
    // Функція для фільтрації продуктів (можна додати пізніше)
    function filterProducts(category) {
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            if (category === 'all' || product.dataset.category === category) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }
    
    // Функція для сортування продуктів
    function sortProducts(sortBy) {
        const grid = document.querySelector('.products-grid');
        const products = Array.from(document.querySelectorAll('.product-card'));
        
        products.sort((a, b) => {
            if (sortBy === 'price-asc') {
                const priceA = parseFloat(a.querySelector('.product-price').textContent.replace(/[^\d.]/g, ''));
                const priceB = parseFloat(b.querySelector('.product-price').textContent.replace(/[^\d.]/g, ''));
                return priceA - priceB;
            } else if (sortBy === 'price-desc') {
                const priceA = parseFloat(a.querySelector('.product-price').textContent.replace(/[^\d.]/g, ''));
                const priceB = parseFloat(b.querySelector('.product-price').textContent.replace(/[^\d.]/g, ''));
                return priceB - priceA;
            }
        });
        
        products.forEach(product => grid.appendChild(product));
    }
    
    // Перевірка авторизації
    function checkAuth() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (!isLoggedIn) {
            // Можна редіректити на сторінку входу
            // window.location.href = 'login.html';
        }
    }
    
    checkAuth();
    
    // Додавання товару в обране (приклад)
    function addToFavorites(productId) {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (!favorites.includes(productId)) {
            favorites.push(productId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            console.log('Товар додано в обране:', productId);
        }
    }
    
    // Видалення товару з обраного
    function removeFromFavorites(productId) {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        favorites = favorites.filter(id => id !== productId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        console.log('Товар видалено з обраного:', productId);
    }
});

// Глобальна функція для навігації
function navigateTo(page) {
    window.location.href = page;
}

// Функція для логування дій користувача
function logUserAction(action, details) {
    console.log(`[${new Date().toISOString()}] ${action}:`, details);
    
    // Тут можна додати відправку даних на сервер
    // fetch('/api/log', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ action, details, timestamp: new Date() })
    // });
}