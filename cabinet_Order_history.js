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
        
        if (!confirmLogout) return;

        // Покажемо анімацію виходу
        showLogoutAnimation();

        // Через невелику паузу делегуємо вихід глобальній функції, яка виконає повну очистку
        setTimeout(() => {
            if (window && typeof window.handleLogout === 'function') {
                window.handleLogout();
            } else {
                try { localStorage.clear(); sessionStorage.clear(); } catch(e){}
                window.location.href = 'index.html';
            }
        }, 800);
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

// === ФУНКЦІЯ ЗАВАНТАЖЕННЯ ЗАМОВЛЕНЬ (реальна реалізація) ===
async function loadOrders() {
    const emptyState = document.querySelector('.empty-state');
    const ordersContainer = document.getElementById('ordersContainer');

    try {
        const resp = await fetch('api_orders.php', { method: 'GET', credentials: 'same-origin' });
        const data = await resp.json();

        if (!data || !data.success) {
            // якщо не залогінений або помилка
            emptyState.style.display = 'flex';
            ordersContainer.style.display = 'none';
            return;
        }

        const orders = data.orders || [];

        if (orders.length > 0) {
            emptyState.style.display = 'none';
            ordersContainer.style.display = 'block';
            renderOrders(orders);
        } else {
            emptyState.style.display = 'flex';
            ordersContainer.style.display = 'none';
        }
    } catch (error) {
        console.error('Помилка завантаження замовлень:', error);
        showError('Не вдалося завантажити історію замовлень');
    }
}
    
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
        const resp = await fetch('api_orders.php', { method: 'GET', credentials: 'same-origin' });
        const data = await resp.json();

        if (!data || !data.success) {
            emptyState.style.display = 'flex';
            ordersContainer.style.display = 'none';
            return;
        }

        const orders = data.orders || [];

        if (orders.length > 0) {
            emptyState.style.display = 'none';
            ordersContainer.style.display = 'block';
            renderOrders(orders);
        } else {
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

    // created_at might be present
    const dateStr = order.created_at ? formatDate(order.created_at) : '';
    const imgSrc = order.image ? order.image : 'img1/default.jpg';

    card.innerHTML = `
        <div class="order-thumb-wrap">
            <img src="${imgSrc}" alt="${order.product_name}" class="order-image" />
        </div>
        <div class="order-content">
            <h4 class="order-title">${order.product_name}</h4>
            <p class="order-quantity">Кількість: ${order.quantity}</p>
        </div>
        <div class="order-meta">
            <div class="order-date">Дата: ${dateStr}</div>
            <div class="order-contact">${order.customer_name} — ${order.email}${order.phone ? ' — ' + order.phone : ''}</div>
        </div>
        <div class="order-actions">
            <button class="view-order-btn" onclick="viewOrderDetails(${order.id})">Переглянути</button>
            <button class="delete-order-btn" onclick="deleteOrder(${order.id}, this)">Видалити</button>
        </div>
    `;

    return card;
}

// Видалити замовлення (UI + backend call)
async function deleteOrder(orderId, btn) {
    if (!confirm('Ви впевнені, що хочете видалити замовлення?')) return;

    try {
        const res = await fetch('api_orders.php', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete_order', id: orderId })
        });
        const json = await res.json();
        if (json && json.success) {
            const card = btn.closest('.order-card');
            card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.98)';
            setTimeout(() => card.remove(), 300);
            showNotification('Замовлення видалено', 'success');
        } else {
            showNotification(json.message || 'Не вдалося видалити замовлення', 'error');
        }
    } catch (err) {
        console.error('Delete order error:', err);
        showNotification('Помилка мережі при видаленні замовлення', 'error');
    }
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