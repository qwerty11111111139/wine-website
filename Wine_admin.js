// Ініціалізація при завантаженні
document.addEventListener('DOMContentLoaded', function() {
    
    // === НАВІГАЦІЯ В САЙДБАРІ ===
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // If this is the explicit admin logout anchor, allow its native navigation / handler
            if (this.id === 'adminLogoutBtn') {
                return;
            }

            // Якщо це вихід
            if (this.classList.contains('logout')) {
                e.preventDefault();
                handleLogout();
                return;
            }

            // Якщо це пункт меню, що веде на іншу сторінку (має реальний href), дозволяємо стандартну навігацію
            const href = this.getAttribute('href');
            if (this.dataset.section && href && href !== '#') {
                // Активний клас буде встановлено під час завантаження сторінки
                return; // дозволь браузеру переходити на іншу сторінку
            }

            // Якщо це пункт меню для SPA (href='#'), обробляємо локально
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

    // Встановлюємо активний пункт меню на підставі шляху URL
    setActiveNavByPath();

    // Функція для встановлення активного пункту меню в залежності від поточної сторінки
    function setActiveNavByPath() {
        const path = window.location.pathname.split('/').pop();
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (!href) return;
            const filename = href.split('/').pop();
            if (filename === path || (filename === 'admin_panel.html' && (path === '' || path === 'admin_panel.html'))) {
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            }
        });
    }
    
    // === ПОШУК ===
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterTable(this.value);
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            filterTable(searchInput ? searchInput.value : '');
        });
    }
    
    // === КНОПКИ ДІЙ ===
    initActionButtons();
    
    // === ЗОЛОТИСТЕ ПІДСВІЧУВАННЯ ===
    addGoldenGlow();

    // Завантажуємо продукти для сторінки Вина (якщо є таблиця)
    loadAdminProducts();
    
    console.log('Адмін панель ініціалізована');
});

// --- Завантаження продуктів та рендер для Wine_admin.html ---
async function loadAdminProducts() {
    const productsBody = document.getElementById('productsBody');
    if (!productsBody) return;

    try {
        const resp = await fetch('api.php?action=get_products', { method: 'GET', credentials: 'same-origin' });
        const data = await resp.json();

        if (!data || !data.success) {
            productsBody.innerHTML = '<tr><td colspan="5">Не вдалося завантажити продукти</td></tr>';
            return;
        }

        const products = data.products || [];
        if (products.length === 0) {
            productsBody.innerHTML = '<tr><td colspan="5">Продуктів поки немає</td></tr>';
            return;
        }

        productsBody.innerHTML = '';
        // collect categories for edit select
        window.__adminCategories = Array.from(new Set((products || []).map(x => (x.category || '').trim()).filter(Boolean))).sort();

        products.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.price}</td>
                <td>${p.image ? '<img src="' + p.image + '" alt="' + p.name + '" style="height:40px;">' : ''}</td>
                <td>${p.category || ''}</td>
            `;
            productsBody.appendChild(tr);
        });

        // Public wines page is a simple overview; actions are available in Manage Wines (admin panel)

    } catch (err) {
        console.error('Не вдалось завантажити продукти для адміністратора', err);
        productsBody.innerHTML = '<tr><td colspan="5">Помилка сервера</td></tr>';
    }
}

// === ОБРОБКА ВИХОДУ ===
async function handleLogout() {
    const confirmLogout = confirm('Ви впевнені, що хочете вийти з адмін-панелі?');

    if (!confirmLogout) return;

    // Якщо доступна глобальна функція, використаємо її
    if (window && typeof window.handleLogout === 'function') {
        window.handleLogout();
        return;
    }

    try {
        // Fallback
        localStorage.clear();
        sessionStorage.clear();
        await fetch('api.php?action=logout', { method: 'GET', credentials: 'same-origin' });
        window.location.href = 'index.html';
    } catch (err) {
        console.error('Помилка при виході:', err);
        alert('Сталася помилка при виході. Спробуйте ще раз.');
    }
}

// === ЗАВАНТАЖЕННЯ РОЗДІЛІВ ===
function loadSection(section) {
    const pageTitle = document.querySelector('.page-title');
    const tableBody = document.getElementById('tableBody');
    
    // Змінюємо заголовок
    const titles = {
        'recipes': 'Керування винами',
        'wines': 'Вина',
        'orders': 'Замовлення',
        'users': 'Користувачі',
        'settings': 'Налаштування'
    };
    
    pageTitle.textContent = titles[section] || 'Адмін Панель';
    
    // Завантажуємо дані для розділу
    console.log('Завантаження розділу:', section);
    
    // Завантажуємо дані для конкретних розділів
    if (section === 'wines') {
        loadAdminProducts();
    }

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

    // request fresh product data and show readonly modal
    fetch(`api.php?action=get_products`).then(r => r.json()).then(data => {
        if (!data || !data.success) return alert('Не вдалося завантажити продукт');
        const prod = (data.products || []).find(p => String(p.id) === String(id));
        if (!prod) return alert('Продукт не знайдено');

        const modalId = `admin-view-${prod.id}`;
        // remove existing modal if any
        document.getElementById(modalId)?.remove();

        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'region-modal admin-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-background"><img src="${prod.image || 'img1/Masseto.jpg'}" alt="${prod.name}"></div>
                <div class="modal-info">
                    <h2 class="modal-region-title">${prod.name}</h2>
                    <p class="modal-subtitle">${prod.category || ''}</p>
                    <div class="modal-description"><p>${(prod.description || '').replace(/\n/g,'<br>')}</p></div>
                    <div class="modal-footer">
                        <div class="modal-price">ЦІНА: ${prod.price}</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        // hook close
        modal.querySelector('.modal-close').addEventListener('click', () => closeAdminModal(modalId));
        modal.querySelector('.modal-overlay').addEventListener('click', () => closeAdminModal(modalId));
        modal.style.display = 'flex';
        void modal.offsetWidth;
        modal.classList.add('active');
    }).catch(err => { console.error(err); alert('Помилка завантаження'); });
}

function closeAdminModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 400);
}

// === РЕДАГУВАННЯ ЕЛЕМЕНТА ===
async function editItem(id, name) {
    console.log('Редагувати:', { id, name });

    try {
        const resp = await fetch(`api.php?action=get_products`);
        const data = await resp.json();
        if (!data || !data.success) return alert('Не вдалося завантажити продукт');

        const prod = (data.products || []).find(p => String(p.id) === String(id));
        if (!prod) return alert('Продукт не знайдено');

        const modalId = `admin-edit-${prod.id}`;
        document.getElementById(modalId)?.remove();

        // build category options
        const categories = window.__adminCategories || ['Вино'];
        const categoryOptions = categories.map(c => `<option value="${c}" ${c===prod.category? 'selected' : ''}>${c}</option>`).join('');

        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'region-modal admin-modal edit-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-background"><img src="${prod.image || 'img1/Masseto.jpg'}" alt="${prod.name}"></div>
                <div class="modal-info">
                    <h2 class="modal-region-title">Редагувати: ${prod.name}</h2>
                    <form id="editProductForm">
                        <div class="form-group">
                            <label>Назва</label>
                            <input type="text" name="name" id="editName" value="${escapeHtml(prod.name)}" />
                        </div>
                        <div class="form-group">
                            <label>Ціна</label>
                            <input type="number" step="0.01" name="price" id="editPrice" value="${parseFloat(prod.price) || 0}" />
                        </div>
                        <div class="form-group">
                            <label>Категорія</label>
                            <select name="category" id="editCategory">${categoryOptions}<option value="">Інше...</option></select>
                        </div>
                        <div class="form-group">
                            <label>Опис (елітна анотація)</label>
                            <textarea id="editDesc" rows="3">${escapeHtml((prod.description||'')).replace(/<br\s*\/?>/g,'\n')}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Посилання на зображення</label>
                            <input type="text" id="editImage" value="${escapeHtml(prod.image || '')}" />
                        </div>
                        <div style="margin-top:10px; display:flex; gap:8px;">
                            <button type="submit" class="submit-btn">Зберегти зміни</button>
                            <button type="button" class="btn-cancel">Скасувати</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // hook close
        modal.querySelector('.modal-close').addEventListener('click', () => closeAdminModal(modalId));
        modal.querySelector('.modal-overlay').addEventListener('click', () => closeAdminModal(modalId));
        modal.querySelector('.btn-cancel').addEventListener('click', () => closeAdminModal(modalId));

        // escape helper
        function getField(id){ return modal.querySelector('#'+id); }

        // submit handler
        modal.querySelector('#editProductForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const payload = {
                id: prod.id,
                name: getField('editName').value.trim(),
                price: getField('editPrice').value.trim(),
                category: getField('editCategory').value.trim(),
                description: getField('editDesc').value.trim().replace(/\n/g,'<br>'),
                image: getField('editImage').value.trim()
            };

            try {
                const r = await fetch('api.php?action=update_product', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    credentials: 'same-origin'
                });
                const dd = await r.json();
                if (dd && dd.success) {
                    showNotification('Продукт оновлено', 'success');
                    // update row in table without reload
                    const row = Array.from(document.querySelectorAll('#productsBody tr')).find(tr => tr.cells[0].textContent == prod.id);
                    if (row) {
                        row.cells[1].textContent = payload.name;
                        row.cells[2].textContent = payload.price;
                        row.cells[3].innerHTML = payload.image ? `<img src="${payload.image}" style="height:40px;">` : '';
                        row.cells[4].textContent = payload.category;
                    }
                    closeAdminModal(modalId);
                } else {
                    alert(dd && dd.message ? dd.message : 'Не вдалося оновити');
                }
            } catch (err) {
                console.error(err);
                alert('Помилка при оновленні');
            }
        });

        modal.style.display = 'flex';
        void modal.offsetWidth;
        modal.classList.add('active');

    } catch (err) {
        console.error(err);
        alert('Помилка при завантаженні для редагування');
    }
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

    // Delegate event listeners for dynamic action buttons
    document.body.addEventListener('click', function(e) {
        if (e.target && e.target.matches('.btn-view')) {
            e.target.closest('tr') && viewItem(e.target.closest('tr').cells[0].textContent, e.target.closest('tr').cells[1].textContent);
        }
        if (e.target && e.target.matches('.btn-edit')) {
            e.target.closest('tr') && editItem(e.target.closest('tr').cells[0].textContent, e.target.closest('tr').cells[1].textContent);
        }
        if (e.target && e.target.matches('.btn-delete')) {
            e.target.closest('tr') && deleteItem(e.target.closest('tr').cells[0].textContent, e.target.closest('tr').cells[1].textContent, e.target.closest('tr'));
        }
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
const adminAnimationsStyle = document.createElement('style');
adminAnimationsStyle.textContent = `
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
document.head.appendChild(adminAnimationsStyle);