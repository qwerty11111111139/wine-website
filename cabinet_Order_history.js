// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    
    // === АКТИВНИЙ ПУНКТ МЕНЮ ===
    const menuLinks = document.querySelectorAll('.menu-link');
    
    menuLinks.forEach(link => {
        // Обробка кліку на посилання
        link.addEventListener('click', function(e) {
            // Якщо це кнопка виходу
            if (this.classList.contains('logout-link')) {
                e.preventDefault();
                handleLogout();
                return;
            }
        });
    });
    
    // === ОБРОБКА ВИХОДУ ===
    function handleLogout() {
        const confirmLogout = confirm('Ви впевнені, що хочете вийти з кабінету?');
        
        if (confirmLogout) {
            // Показуємо анімацію
            showLogoutAnimation();
            
            // Очищаємо дані користувача
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            
            // Через 1 секунду редіректимо
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }
    }
    
    // Анімація виходу
    function showLogoutAnimation() {
        const logoutLink = document.querySelector('.logout-link');
        const originalText = logoutLink.querySelector('.menu-text').textContent;
        
        logoutLink.querySelector('.menu-text').textContent = 'ВИХІД...';
        logoutLink.style.background = 'rgba(255, 107, 107, 0.2)';
        logoutLink.style.color = '#ff6b6b';
    }
    
    // === ЗОЛОТИСТЕ ПІДСВІЧУВАННЯ МЕНЮ ===
    menuLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.boxShadow = '0 0 25px rgba(184, 134, 11, 0.5)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.boxShadow = '';
            }
        });
    });
    
    // === ЗАВАНТАЖЕННЯ ЗАМОВЛЕНЬ ===
    loadOrders();
    
    // === ЗОЛОТИСТЕ ПІДСВІЧУВАННЯ СОЦІАЛЬНИХ ІКОНОК ===
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
    
    // === АНІМАЦІЯ ПОЯВИ ПОРОЖНЬОГО СТАНУ ===
    const emptyState = document.querySelector('.empty-state');
    
    if (emptyState) {
        setTimeout(() => {
            emptyState.style.opacity = '1';
            emptyState.style.transform = 'translateY(0)';
        }, 200);
        
        emptyState.style.opacity = '0';
        emptyState.style.transform = 'translateY(20px)';
        emptyState.style.transition = 'all 0.6s ease';
    }
    
    // === АНІМАЦІЯ КНОПКИ ===
    const catalogBtn = document.querySelector('.catalog-btn');
    
    if (catalogBtn) {
        catalogBtn.addEventListener('click', function(e) {
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }
    
    // Логуємо відкриття сторінки
    logAction('PAGE_VIEW', { page: 'order-history', url: window.location.href });
});

// === ФУНКЦІЯ ЗАВАНТАЖЕННЯ ЗАМОВЛЕНЬ З БАЗИ ДАНИХ ===
async function loadOrders() {
    const emptyState = document.querySelector('.empty-state');
    const ordersContainer = document.getElementById('ordersContainer');
    
    try {
        // ТУТ БУДЕ ЗАПИТ ДО БАЗИ ДАНИХ
        // const response = await fetch('/api/orders');
        // const orders = await response.json();
        
        // Тимчасово використовуємо порожній масив
        const orders = [];
        
        if (orders.length > 0) {
            // Приховуємо порожній стан
            emptyState.style.display = 'none';
            
            // Показуємо контейнер з замовленнями
            ordersContainer.style.display = 'block';
            
            // Рендеримо замовлення
            renderOrders(orders);
        } else {
            // Показуємо порожній стан
            emptyState.style.display = 'flex';
            ordersContainer.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Помилка завантаження замовлень:', error);
        showError('Не вдалося завантажити історію замовлень');
    }
}

// === ФУНКЦІЯ РЕНДЕРИНГУ ЗАМОВЛЕНЬ ===
function renderOrders(orders) {
    const ordersContainer = document.getElementById('ordersContainer');
    ordersContainer.innerHTML = '';
    
    orders.forEach(order => {
        const orderCard = createOrderCard(order);
        ordersContainer.appendChild(orderCard);
    });
}

// === СТВОРЕННЯ КАРТКИ ЗАМОВЛЕННЯ ===
function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';
    
    card.innerHTML = `
        <div class="order-header">
            <h3>Замовлення #${order.id}</h3>
            <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
        </div>
        <div class="order-body">
            <p class="order-date">Дата: ${formatDate(order.date)}</p>
            <p class="order-total">Сума: ${order.total} EUR</p>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name}</span>
                        <span>${item.quantity} x ${item.price} EUR</span>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="order-footer">
            <button class="view-order-btn" onclick="viewOrderDetails(${order.id})">
                Переглянути деталі
            </button>
        </div>
    `;
    
    return card;
}

// === ДОПОМІЖНІ ФУНКЦІЇ ===

// Текст статусу замовлення
function getStatusText(status) {
    const statuses = {
        'pending': 'В обробці',
        'processing': 'Обробляється',
        'shipped': 'Відправлено',
        'delivered': 'Доставлено',
        'cancelled': 'Скасовано'
    };
    return statuses[status] || 'Невідомо';
}

// Форматування дати
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Перегляд деталей замовлення
function viewOrderDetails(orderId) {
    console.log('Переглянути деталі замовлення:', orderId);
    
    // Редірект на сторінку деталей
    // window.location.href = `order-details.html?id=${orderId}`;
    
    // АБО відкрити модальне вікно
    showOrderModal(orderId);
}

// Показати модальне вікно замовлення
function showOrderModal(orderId) {
    console.log('Відкрити модальне вікно для замовлення:', orderId);
    
    // ТУТ БУДЕ ЛОГІКА МОДАЛЬНОГО ВІКНА
}

// Показати помилку
function showError(message) {
    const emptyState = document.querySelector('.empty-state');
    
    if (emptyState) {
        emptyState.innerHTML = `
            <div class="empty-icon">⚠️</div>
            <h2 class="empty-title">Помилка</h2>
            <p class="empty-description">${message}</p>
            <button class="catalog-btn" onclick="loadOrders()">Спробувати ще раз</button>
        `;
    }
}

// Логування дій
function logAction(action, details) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${action}:`, details);
    
    // Відправка на сервер (якщо потрібно)
    // fetch('/api/log', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ action, details, timestamp })
    // });
}

// === ПРИКЛАД ВИКОРИСТАННЯ З БАЗОЮ ДАНИХ ===

/*
// Приклад функції для завантаження замовлень з сервера
async function fetchOrdersFromDatabase() {
    try {
        const token = localStorage.getItem('userToken');
        
        const response = await fetch('/api/user/orders', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Помилка завантаження замовлень');
        }
        
        const data = await response.json();
        return data.orders;
        
    } catch (error) {
        console.error('Помилка:', error);
        throw error;
    }
}

// Використання:
async function loadOrders() {
    try {
        const orders = await fetchOrdersFromDatabase();
        
        if (orders.length > 0) {
            renderOrders(orders);
        } else {
            showEmptyState();
        }
    } catch (error) {
        showError('Не вдалося завантажити замовлення');
    }
}
*/