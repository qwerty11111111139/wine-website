// Ініціалізація при завантаженні
document.addEventListener('DOMContentLoaded', function() {
    
    // === НАВІГАЦІЯ В САЙДБАРІ ===
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Якщо це вихід
            if (this.classList.contains('logout')) {
                e.preventDefault();
                handleLogout();
                return;
            }
            
            // Якщо це звичайний пункт меню
            if (this.dataset.section) {
                e.preventDefault();
                
                // Видаляємо активний клас з усіх
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Додаємо активний клас
                this.classList.add('active');
                
                // Завантажуємо відповідний розділ
                loadSection(this.dataset.section);
            }
        });
    });
    
    // === ПОШУК ===
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    searchInput.addEventListener('input', function() {
        filterTable(this.value);
    });
    
    searchBtn.addEventListener('click', function() {
        filterTable(searchInput.value);
    });
    
    // === КНОПКИ ДІЙ ===
    initActionButtons();
    
    // === ЗОЛОТИСТЕ ПІДСВІЧУВАННЯ ===
    addGoldenGlow();
    
    console.log('Адмін панель ініціалізована');
});

// === ОБРОБКА ВИХОДУ ===
function handleLogout() {
    const confirmLogout = confirm('Ви впевнені, що хочете вийти з адмін-панелі?');
    
    if (confirmLogout) {
        // Очищаємо дані
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isAdmin');
        
        // Редірект
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    }
}

// === ЗАВАНТАЖЕННЯ РОЗДІЛІВ ===
function loadSection(section) {
    const pageTitle = document.querySelector('.page-title');
    const tableBody = document.getElementById('tableBody');
    
    // Змінюємо заголовок
    const titles = {
        'recipes': 'Рецепти',
        'wines': 'Вина',
        'orders': 'Замовлення',
        'users': 'Користувачі',
        'settings': 'Налаштування'
    };
    
    pageTitle.textContent = titles[section] || 'Адмін Панель';
    
    // Завантажуємо дані для розділу
    console.log('Завантаження розділу:', section);
    
    // ТУТ БУДЕ ЗАПИТ ДО API
    // fetchSectionData(section);
}

// === ФІЛЬТРАЦІЯ ТАБЛИЦІ ===
function filterTable(searchTerm) {
    const table = document.getElementById('recipesTable');
    const rows = table.getElementsByTagName('tr');
    
    searchTerm = searchTerm.toLowerCase();
    
    // Починаємо з 1, щоб пропустити заголовок
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        let found = false;
        
        // Перевіряємо всі комірки в рядку
        for (let j = 0; j < cells.length; j++) {
            const cellText = cells[j].textContent.toLowerCase();
            if (cellText.includes(searchTerm)) {
                found = true;
                break;
            }
        }
        
        // Показуємо або ховаємо рядок
        row.style.display = found ? '' : 'none';
    }
}

// === ІНІЦІАЛІЗАЦІЯ КНОПОК ===
function initActionButtons() {
    // Кнопки "Переглянути"
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.cells[0].textContent;
            const name = row.cells[1].textContent;
            
            viewItem(id, name);
        });
    });
    
    // Кнопки "Редагувати"
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.cells[0].textContent;
            const name = row.cells[1].textContent;
            
            editItem(id, name);
        });
    });
    
    // Кнопки "Видалити"
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.cells[0].textContent;
            const name = row.cells[1].textContent;
            
            deleteItem(id, name, row);
        });
    });
}

// === ПЕРЕГЛЯД ЕЛЕМЕНТА ===
function viewItem(id, name) {
    console.log('Переглянути:', { id, name });
    
    // Відкрити модальне вікно або редірект
    // window.location.href = `view-item.html?id=${id}`;
    
    alert(`Перегляд: ${name} (ID: ${id})`);
}

// === РЕДАГУВАННЯ ЕЛЕМЕНТА ===
function editItem(id, name) {
    console.log('Редагувати:', { id, name });
    
    // Відкрити форму редагування
    // window.location.href = `edit-item.html?id=${id}`;
    
    alert(`Редагування: ${name} (ID: ${id})`);
}

// === ВИДАЛЕННЯ ЕЛЕМЕНТА ===
function deleteItem(id, name, row) {
    const confirmDelete = confirm(`Ви впевнені, що хочете видалити "${name}"?`);
    
    if (confirmDelete) {
        console.log('Видалити:', { id, name });
        
        // Анімація видалення
        row.style.transition = 'all 0.3s ease';
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            row.remove();
            showNotification('Елемент успішно видалено', 'success');
        }, 300);
        
        // ТУТ БУДЕ ЗАПИТ НА ВИДАЛЕННЯ
        // deleteFromDatabase(id);
    }
}

// === ЗОЛОТИСТЕ ПІДСВІЧУВАННЯ ===
function addGoldenGlow() {
    // Підсвічування навігації
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.boxShadow = 'inset 3px 0 0 #B8860B';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.boxShadow = '';
            }
        });
    });
    
    // Підсвічування рядків таблиці
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 15px rgba(184, 134, 11, 0.2)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

// === ПОКАЗ ПОВІДОМЛЕНЬ ===
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#B8860B'};
        color: white;
        border-radius: 6px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// === РОБОТА З API (ПРИКЛАД) ===

// Завантаження даних з сервера
async function fetchData(endpoint) {
    try {
        const token = localStorage.getItem('adminToken');
        
        const response = await fetch(`/api/admin/${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Помилка завантаження даних');
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Помилка:', error);
        showNotification('Помилка завантаження даних', 'error');
        return null;
    }
}

// Видалення з бази даних
async function deleteFromDatabase(id) {
    try {
        const token = localStorage.getItem('adminToken');
        
        const response = await fetch(`/api/admin/recipes/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Помилка видалення');
        }
        
        showNotification('Успішно видалено', 'success');
        
    } catch (error) {
        console.error('Помилка:', error);
        showNotification('Помилка видалення', 'error');
    }
}

// Оновлення даних
async function updateData(id, data) {
    try {
        const token = localStorage.getItem('adminToken');
        
        const response = await fetch(`/api/admin/recipes/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Помилка оновлення');
        }
        
        showNotification('Успішно оновлено', 'success');
        
    } catch (error) {
        console.error('Помилка:', error);
        showNotification('Помилка оновлення', 'error');
    }
}

// === ЕКСПОРТ ДАНИХ ===
function exportToCSV() {
    const table = document.getElementById('recipesTable');
    let csv = [];
    
    // Заголовки
    const headers = [];
    table.querySelectorAll('thead th').forEach(th => {
        headers.push(th.textContent);
    });
    csv.push(headers.join(','));
    
    // Дані
    table.querySelectorAll('tbody tr').forEach(row => {
        const rowData = [];
        row.querySelectorAll('td').forEach((td, index) => {
            if (index < 4) { // Без колонки "Дії"
                rowData.push(td.textContent);
            }
        });
        csv.push(rowData.join(','));
    });
    
    // Завантаження
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recipes_export.csv';
    a.click();
}

// === АНІМАЦІЇ ===
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
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