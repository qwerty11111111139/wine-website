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
            // Якщо це logout, показуємо підтвердження та виконуємо запит до бека
            if (this.classList.contains('logout-link')) {
                const confirmLogout = confirm('Ви впевнені, що хочете вийти?');
                if (!confirmLogout) {
                    e.preventDefault();
                    return;
                }

                e.preventDefault();

                // Показуємо анімацію або миттєво делегуємо повний вихід
                if (window && typeof window.handleLogout === 'function') {
                    window.handleLogout();
                } else {
                    try { localStorage.clear(); sessionStorage.clear(); } catch(e) {}
                    window.location.href = 'index.html';
                }
            }
        });
    });
    
    // Обробка кнопок "ПЕРЕГЛЯНУТИ ПРОДУКТ"
    const productButtons = document.querySelectorAll('.product-btn');
    
    productButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const productCard = this.closest('.product-card, .wine-card');
            let productName = '';
            if (productCard) {
                const nameEl = productCard.querySelector('.product-name') || productCard.querySelector('h3');
                if (nameEl) productName = nameEl.textContent.trim();
            }

            console.log('Переглянути продукт:', productName);

            // Тут можна додати редірект на сторінку продукту
            // window.location.href = `product-details.html?name=${encodeURIComponent(productName)}`;

            // Або показати модальне вікно
            showProductModal(productName, event);
        });
    });
    
    // Функція показу модального вікна (приклад)
    function showProductModal(productName, event) {
        // Анімація кнопки (безпечна перевірка event.target)
        if (event && event.target) {
            const btn = event.target;
            btn.textContent = '✓ ВІДКРИТО';
            btn.style.background = '#B8860B';
            btn.style.color = '#000';
            
            setTimeout(() => {
                btn.textContent = 'ПЕРЕГЛЯНУТИ ПРОДУКТ';
                btn.style.background = 'transparent';
                btn.style.color = '#B8860B';
            }, 1500);
        }
        
        // Тут можна додати логіку відкриття модального вікна (placeholder)
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
    
    // Завантажуємо уподобані товари зі серверу; якщо не вдалось, використовуємо localStorage
    function loadFavorites() {
        fetch('api.php?action=get_favorites', { credentials: 'same-origin' })
            .then(r => r.json())
            .then(data => {
                console.log('get_favorites result:', data);
                if (data && data.success && Array.isArray(data.favorites) && data.favorites.length) {
                    renderFavorites(data.favorites);
                } else {
                    // Якщо сервер відповів, що немає уподобаних або користувач не в сесії — перевіряємо localStorage
                    const local = JSON.parse(localStorage.getItem('wineFavorites') || '[]');
                    console.log('local wineFavorites:', local);
                    if (local && local.length) {
                        renderFavorites(local.map(f => ({ product_id: f.id, name: f.name, img: f.img, price: f.price || '' })));
                    } else {
                        const noEl = document.getElementById('no-favorites');
                        if (noEl) noEl.style.display = 'block';
                    }
                }
            }).catch(err => {
                console.warn('get_favorites failed:', err);
                // Network error — fallback to localStorage
                const local = JSON.parse(localStorage.getItem('wineFavorites') || '[]');
                if (local && local.length) {
                    renderFavorites(local.map(f => ({ product_id: f.id, name: f.name, img: f.img, price: f.price || '' })));
                } else {
                    const noEl = document.getElementById('no-favorites');
                    if (noEl) noEl.style.display = 'block';
                }
            });
    }

    function renderFavorites(items) {
        const grid = document.getElementById('favorites-grid');
        if (!grid) {
            console.warn('favorites-grid element not found');
            return;
        }
        grid.innerHTML = '';
        const noFav = document.getElementById('no-favorites');
        if (noFav) noFav.style.display = 'none';

        items.forEach(item => {
            // Use wine-card markup so layout matches the main wine page, include data-id on product button
            const card = document.createElement('div');
            card.className = 'wine-card';
            card.innerHTML = `
                <div class="wine-image">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div class="wine-info">
                    <h3>${item.name}</h3>
                    <p class="wine-type">${item.price ? item.price : ''}</p>
                    <div class="product-actions">
                        <button class="product-btn" data-id="${item.product_id}">ПЕРЕГЛЯНУТИ ПРОДУКТ</button>
                        <button class="remove-btn remove-fav" data-id="${item.product_id}">ВИДАЛИТИ</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        // Підключаємо обробники для кнопок видалення
        document.querySelectorAll('.remove-fav').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const pidRaw = this.getAttribute('data-id') || this.dataset.id || '';
                const m = pidRaw && pidRaw.match(/(\d+)/);
                const pid = m ? m[1] : pidRaw;
                console.log('remove clicked', pid);
                const card = this.closest('.wine-card');
                const btnEl = this;
                btnEl.disabled = true;
                btnEl.textContent = 'ВИДАЛЯЄТЬСЯ...';
                // call the top-level removeFavorite (defined below)
                removeFavorite(pid, card, btnEl);
            });
        });

        // Підключаємо обробники для кнопки "ПЕРЕГЛЯНУТИ ПРОДУКТ"
        document.querySelectorAll('.product-btn').forEach(btn => {
            btn.addEventListener('click', function(event) {
                const pid = this.getAttribute('data-id');
                // pid expected format like 'wine1' — extract number
                const m = pid && pid.match(/(\d+)/);
                if (m && m[1]) {
                    const idNum = m[1];
                    // If we are on wine.html we can open the modal directly
                    if (window.location.pathname.endsWith('wine.html')) {
                        // openModal is defined in wine_script.js
                        if (typeof openModal === 'function') openModal(idNum);
                    } else {
                        // redirect to wine page and open modal via hash
                        window.location.href = `wine.html#modal-${idNum}`;
                    }
                } else {
                    // Fallback: show product modal placeholder
                    const productName = this.closest('.wine-card').querySelector('h3').textContent;
                    showProductModal(productName, event);
                }
            });
        });


    }

    // Локальні помічники для сумісності
    function addToFavorites(product) {
        let favorites = JSON.parse(localStorage.getItem('wineFavorites') || '[]');
        if (!favorites.some(fav => fav.id === product.id)) {
            favorites.push(product);
            localStorage.setItem('wineFavorites', JSON.stringify(favorites));
            console.log('Товар додано в обране (локально):', product.id);
        }
    }

    function removeFromFavoritesLocal(productId) {
        let favorites = JSON.parse(localStorage.getItem('wineFavorites') || '[]');
        favorites = favorites.filter(f => {
            const fid = String(f.id || f.product_id || '');
            // support legacy 'wine11' or 'product11' ids as well as numeric ids
            return !(fid === String(productId) || fid === ('wine' + productId) || fid === ('product' + productId));
        });
        localStorage.setItem('wineFavorites', JSON.stringify(favorites));
        console.log('Товар видалено з обраного (локально):', productId);
    }

    // Видалення уподобаного товару (зовнішня функція, яка викликається кнопкою)
    function removeFavorite(productId, cardElement = null, buttonElement = null) {
        if (!productId) return;
        fetch('api.php?action=remove_favorite', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId })
        }).then(r => r.json()).then(data => {
            if (data && data.success) {
                // Visual removal with small animation
                if (cardElement) {
                    cardElement.style.transition = 'all 0.3s ease';
                    cardElement.style.opacity = '0';
                    cardElement.style.transform = 'translateY(-10px)';
                    setTimeout(() => cardElement.remove(), 300);
                } else {
                    loadFavorites();
                }
                removeFromFavoritesLocal(productId);
                if (typeof showNotification === 'function') showNotification(data.message || 'Видалено з обраного', 'success');
            } else {
                // Server rejected (possibly not logged in) -> remove locally and update UI
                removeFromFavoritesLocal(productId);
                if (cardElement) cardElement.remove(); else loadFavorites();
                if (typeof showNotification === 'function') showNotification(data && data.message ? data.message : 'Не вдалось видалити з сервера, видалено локально', 'info');
            }
        }).catch(err => {
            console.warn('remove_favorite fetch failed', err);
            // network error -> remove locally and update UI
            removeFromFavoritesLocal(productId);
            if (cardElement) cardElement.remove(); else loadFavorites();
            if (typeof showNotification === 'function') showNotification('Проблеми з мережею. Товар видалений локально.', 'info');
        }).finally(() => {
            if (buttonElement) {
                buttonElement.disabled = false;
                buttonElement.textContent = 'ВИДАЛИТИ';
            }
        });
    }

    // Завантажити при завантаженні сторінки
    loadFavorites();
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