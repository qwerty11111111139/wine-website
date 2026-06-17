// Ініціалізація при завантаженні

// Helper to build API URL relative to current page (global so other functions can use it)
function getApiUrl(action) {
    const base = 'api.php';
    if (!action) return base;
    return base + '?action=' + encodeURIComponent(action);
}

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

    // Явний обробник для кнопки виходу у адмінці (id="logout-btn")
    (function attachAdminLogout() {
        const adminLogout = document.getElementById('adminLogoutBtn');
        if (adminLogout) {
            adminLogout.addEventListener('click', function(e) {
                e.preventDefault();
                try { localStorage.clear(); sessionStorage.clear(); } catch (err) {}
                // Hard redirect to the unified logout page which will destroy the PHP session and redirect to homepage
                window.location.href = 'logout.php';
            });
        } else {
            console.warn('explicit admin logout button (#adminLogoutBtn) не знайдено на сторінці');
        }
    })();

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

    // getApiUrl is defined globally above so it can be used by functions declared outside DOMContentLoaded
    
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
    
    console.log('Адмін панель ініціалізована');

    // Якщо зараз сторінка управління винами (при первинному завантаженні) — перевіряємо стан БД і підвантажуємо продукти
    const recipesTable = document.getElementById('recipesTable');
    if (recipesTable && document.querySelector('.page-title') && document.querySelector('.page-title').textContent.includes('Керування винами')) {
        // Спочатку перевіряємо 'health' endpoint; якщо успішно — завантажуємо продукти
        checkDbHealth().then(ok => {
            if (ok) {
                loadManagedWines();
            } else {
                const tableBody = document.getElementById('tableBody');
                tableBody.innerHTML = '<tr><td colspan="5">Не вдається підключитися до БД або API</td></tr>';
            }
        });
    }

    // Якщо зараз сторінка "Замовлення" — підвантажуємо таблицю замовлень
    const ordersTable = document.getElementById('ordersTable');
    if (ordersTable && document.querySelector('.page-title') && document.querySelector('.page-title').textContent.includes('Замовлення')) {
        loadAdminOrders();
    }

    // Якщо зараз сторінка "Користувачі" — підвантажуємо таблицю користувачів
    const usersTable = document.getElementById('usersTable');
    if (usersTable && document.querySelector('.page-title') && document.querySelector('.page-title').textContent.includes('Користувачі')) {
        loadUsers();
    }
});

// === ОБРОБКА ВИХОДУ ===
async function handleLogout() {
    const confirmLogout = confirm('Ви впевнені, що хочете вийти з адмін-панелі?');

    if (!confirmLogout) return;

    if (window && typeof window.handleLogout === 'function') {
        window.handleLogout();
        return;
    }

    try {
        localStorage.clear();
        sessionStorage.clear();

        // Request server-side logout (best-effort)
        try {
            await fetch(getApiUrl('logout'), { method: 'GET', credentials: 'same-origin' });
        } catch (e) {
            console.warn('Server logout request failed', e);
        }

        // Verify server session is cleared; if not, force a logout redirect with a query flag
        try {
            const res = await fetch(getApiUrl('check_session'), { credentials: 'same-origin' });
            const data = await res.json();
            if (data && data.logged_in) {
                console.warn('Server still reports an active session after logout. Forcing logout redirect.');
                window.location.href = 'index.html?force_logout=1';
                return;
            }
        } catch (e) {
            console.warn('Could not verify session state after logout', e);
        }

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
        'club_requests': 'Запити в клуб',
        'users': 'Користувачі',
        'settings': 'Налаштування'
    };
    
    pageTitle.textContent = titles[section] || 'Адмін Панель';
    
    // Завантажуємо дані для розділу
    console.log('Завантаження розділу:', section);

    // Якщо це управління винами (колишні рецепти) — завантажуємо продукти
    if (section === 'recipes') {
        loadManagedWines();
    }

    // Якщо це замовлення — підвантажуємо замовлення
    if (section === 'orders') {
        loadAdminOrders();
    }

    // Якщо це запити в клуб — підвантажуємо заявки
    if (section === 'club_requests') {
        loadClubRequests();
    }

    // Якщо це користувачі — підвантажуємо список користувачів
    if (section === 'users') {
        loadUsers();
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

// === ЗАВАНТАЖЕННЯ ТА РЕНДЕР КЕРУВАННЯ ВИНАМИ ===
async function loadManagedWines() {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;

    // restore default table header for products
    const table = document.getElementById('recipesTable');
    if (table) {
        const thead = table.querySelector('thead');
        thead.innerHTML = `<tr>
            <th>ID</th>
            <th>Назва</th>
            <th>Ціна</th>
            <th>Категорія</th>
            <th>Дії</th>
        </tr>`;
    }

    try {
        const resp = await fetch(getApiUrl('get_products'), { method: 'GET', credentials: 'same-origin' });

        // If server responded with non-2xx (500/404/etc.), capture and show the response text for debugging
        if (!resp.ok) {
            const text = await resp.text();
            console.error('API error while fetching products', resp.status, resp.statusText, text);
            // Sanitize snippet for insertion
            const snippet = (text || '').toString().replace(/</g, '&lt;').slice(0, 300);
            tableBody.innerHTML = `<tr><td colspan="5">Помилка сервера: ${resp.status} ${resp.statusText}<br><small>${snippet}</small></td></tr>`;
            // Also show an alert so you see the raw response during testing
            try { alert('API error while fetching products:\n' + resp.status + ' ' + resp.statusText + '\n\n' + (text || '').slice(0,1000)); } catch(e){}
            return;
        }

        // Read raw text first so we can show it when JSON is invalid
        const raw = await resp.text();
        let data;
        try {
            data = JSON.parse(raw);
        } catch (err) {
            console.error('Invalid JSON from products endpoint', err, raw);
            const snippet = (raw || '').toString().replace(/</g, '&lt;').slice(0, 1000);
            tableBody.innerHTML = `<tr><td colspan="5">Помилка сервера: некоректна відповідь<br><small>${snippet}</small></td></tr>`;
            try { alert('Invalid JSON response from get_products:\n\n' + (raw || '').slice(0,2000)); } catch(e){}
            return;
        }

        if (!data || !data.success) {
            console.error('API returned unsuccessful payload', data, raw);
            const snippet = (raw || '').toString().replace(/</g, '&lt;').slice(0, 500);
            tableBody.innerHTML = `<tr><td colspan="5">Не вдалося завантажити продукти<br><small>${snippet}</small></td></tr>`;
            try { alert('API returned error when fetching products:\n\n' + (raw || '').slice(0,2000)); } catch(e){}
            return;
        }

        const products = data.products || [];
        if (products.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">Продуктів поки немає</td></tr>';
            return;
        }

        // Collect categories to populate edit select
        window.__adminCategories = Array.from(new Set((products || []).map(x => (x.category || '').trim()).filter(Boolean))).sort();

        tableBody.innerHTML = '';

        products.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.category || ''}</td>
                <td class="action-buttons">
                    <button class="btn-view">🔵 Переглянути</button>
                    <button class="btn-edit">🟡 Редагувати</button>
                    <button class="btn-delete">🔴 Видалити</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Після рендеру — ініціалізуємо обробники кнопок
        initActionButtons();

    } catch (err) {
        console.error('Не вдалось завантажити продукти', err);
        tableBody.innerHTML = '<tr><td colspan="5">Помилка сервера</td></tr>';
    }
}

// === ЗАВАНТАЖЕННЯ ТА РЕНДЕР ЗАМОВЛЕНЬ ДЛЯ АДМІНА ===
async function loadAdminOrders() {
    const tbody = document.getElementById('ordersBody');
    if (!tbody) return;

    try {
        const resp = await fetch('api_admin_orders.php', { method: 'GET', credentials: 'same-origin' });

        if (!resp.ok) {
            const text = await resp.text();
            console.error('API error while fetching admin orders', resp.status, resp.statusText, text);
            tbody.innerHTML = `<tr><td colspan="6">Помилка сервера: ${resp.status} ${resp.statusText}</td></tr>`;
            return;
        }

        const raw = await resp.text();
        let data;
        try {
            data = JSON.parse(raw);
        } catch (err) {
            console.error('Invalid JSON from admin orders endpoint', err, raw);
            tbody.innerHTML = `<tr><td colspan="6">Некоректна відповідь від сервера</td></tr>`;
            return;
        }

        if (!data || !data.success) {
            console.error('API returned error for admin orders', data, raw);
            tbody.innerHTML = `<tr><td colspan="6">${data.message || 'Не вдалося завантажити замовлення'}</td></tr>`;
            return;
        }

        const orders = data.orders || [];
        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Замовлень поки немає</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        orders.forEach(o => {
            const tr = document.createElement('tr');
            const status = o.status && o.status !== '' ? o.status : 'Нове';
            tr.innerHTML = `
                <td>${o.id}</td>
                <td>${escapeHtml(o.customer_name || '')}</td>
                <td>${escapeHtml(o.product_name || '')}</td>
                <td>${o.quantity}</td>
                <td>${escapeHtml(o.phone || '')}</td>
                <td>${escapeHtml(status)}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error('Не вдалось завантажити замовлення', err);
        tbody.innerHTML = '<tr><td colspan="6">Помилка сервера</td></tr>';
    }
}


// === ЗАВАНТАЖЕННЯ ТА РЕНДЕР КОРИСТУВАЧІВ ДЛЯ АДМІНА ===
async function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    try {
        const resp = await fetch('api_admin_users.php', { method: 'GET', credentials: 'same-origin' });

        if (!resp.ok) {
            const text = await resp.text();
            console.error('API error while fetching admin users', resp.status, resp.statusText, text);
            tbody.innerHTML = `<tr><td colspan="6">Помилка сервера: ${resp.status} ${resp.statusText}</td></tr>`;
            return;
        }

        const raw = await resp.text();
        let data;
        try {
            data = JSON.parse(raw);
        } catch (err) {
            console.error('Invalid JSON from admin users endpoint', err, raw);
            tbody.innerHTML = `<tr><td colspan="6">Некоректна відповідь від сервера</td></tr>`;
            return;
        }

        if (!data || !data.success) {
            console.error('API returned error for admin users', data, raw);
            tbody.innerHTML = `<tr><td colspan="6">${data.message || 'Не вдалося завантажити користувачів'}</td></tr>`;
            return;
        }

        const users = data.users || [];
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Користувачів немає</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        users.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${u.id}</td>
                <td>${escapeHtml(u.name || '')}</td>
                <td>${escapeHtml(u.email || '')}</td>
                <td>${escapeHtml(u.phone || '')}</td>
                <td>${escapeHtml(u.role || '')}</td>
                <td>${escapeHtml(u.created_at || '')}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error('Не вдалось завантажити користувачів', err);
        tbody.innerHTML = '<tr><td colspan="6">Помилка сервера</td></tr>';
    }
}

// === ЗАВАНТАЖЕННЯ ТА РЕНДЕР ЗАЯВОК ДО ПРИВАТНОГО КЛУБУ ===
async function loadClubRequests() {
    const table = document.getElementById('recipesTable');
    if (!table) return;
    const thead = table.querySelector('thead');
    const tbody = document.getElementById('tableBody');
    thead.innerHTML = `<tr>
        <th>Ім'я</th>
        <th>Email</th>
        <th>Повідомлення</th>
        <th>Дії</th>
    </tr>`;
    tbody.innerHTML = '<tr><td colspan="5">Завантаження...</td></tr>';

    try {
        const resp = await fetch('api.php', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'get_club_applications', status: 'pending' })
        });

        if (!resp.ok) {
            const text = await resp.text();
            console.error('API error while fetching club requests', resp.status, resp.statusText, text);
            tbody.innerHTML = `<tr><td colspan="5">Помилка сервера: ${resp.status} ${resp.statusText}</td></tr>`;
            return;
        }

        const raw = await resp.text();
        let data;
        try { data = JSON.parse(raw); } catch (e) {
            console.error('Invalid JSON for club requests', e, raw);
            tbody.innerHTML = `<tr><td colspan="5">Некоректна відповідь від сервера</td></tr>`;
            return;
        }

        if (!data || !data.success) {
            tbody.innerHTML = `<tr><td colspan="5">${(data && data.message) ? data.message : 'Не вдалося завантажити заявки'}</td></tr>`;
            return;
        }

        const rows = data.data || [];
        if (rows.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">Заявок поки немає</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        rows.forEach(req => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${escapeHtml(req.name || '')}</td>
                <td>${escapeHtml(req.email || '')}<br><small>${escapeHtml(req.phone || '')}</small></td>
                <td>${escapeHtml(req.message || '')}</td>
                <td>
                    <button onclick="processRequest(${req.id}, 'approved')" style="background:green;color:white;border:none;padding:6px 8px;border-radius:4px;margin-right:6px;">Прийняти</button>
                    <button onclick="processRequest(${req.id}, 'rejected')" style="background:red;color:white;border:none;padding:6px 8px;border-radius:4px;">Відхилити</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error('Не вдалось завантажити заявки', err);
        tbody.innerHTML = '<tr><td colspan="5">Помилка сервера</td></tr>';
    }
}

// Обробка прийняття/відхилення заявки
async function processRequest(id, status) {
    if (!confirm('Ви впевнені, що хочете ' + (status==='approved' ? 'прийняти' : 'відхилити') + ' цю заявку?')) return;

    try {
        const resp = await fetch('api.php', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'process_club_application', id: id, status: status })
        });

        if (!resp.ok) {
            const text = await resp.text();
            console.error('API error while processing club application', resp.status, resp.statusText, text);
            alert('Помилка сервера при обробці заявки');
            return;
        }

        const data = await resp.json();
        if (data && data.success) {
            let message = status === 'approved' ? 'Заявку прийнято, лист надіслано!' : 'Заявку відхилено.';
            if (data.upgraded_user) message += '\nКористувач оновлений до учасника клубу.';
            alert(message);
            // Refresh list
            loadClubRequests();
        } else {
            alert(data && data.message ? data.message : 'Не вдалося обробити заявку');
        }
    } catch (err) {
        console.error('Processing request failed', err);
        alert('Помилка при обробці заявки');
    }
}

// Small helper to sanitize text inserted into table cells
function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (s) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s];
    });
}

// Check DB/API health endpoint
async function checkDbHealth() {
    try {
        const resp = await fetch(getApiUrl('health'), { method: 'GET', credentials: 'same-origin' });
        if (!resp.ok) {
            const text = await resp.text();
            console.error('Health endpoint returned non-OK', resp.status, resp.statusText, text);
            showNotification('Помилка зв\'язку з API', 'error');
            showHealthBanner(`Помилка API: ${resp.status} ${resp.statusText}<br>${(text||'').toString().replace(/</g,'&lt;').slice(0,400)}`);
            try { alert('Health API error:\n' + resp.status + ' ' + resp.statusText + '\n\n' + (text || '')); } catch (e){}
            return false;
        }

        // Read raw text first so we can show it when JSON is invalid
        const raw = await resp.text();
        let data;
        try {
            data = JSON.parse(raw);
        } catch (e) {
            console.error('Health returned invalid JSON', e, raw);
            showNotification('Помилка бази даних: некоректна відповідь', 'error');
            showHealthBanner('Помилка бази даних: некоректна відповідь');
            try { alert('Invalid JSON from health endpoint:\n\n' + (raw || '')); } catch (er){}
            return false;
        }

        if (!data || !data.success) {
            console.error('Health payload error', data, raw);
            showNotification('Помилка бази даних: ' + (data.message || 'невідома'), 'error');
            showHealthBanner('Помилка бази даних: ' + (data.message || 'невідома'));
            try { alert('Health endpoint returned error:\n\n' + (raw || '')); } catch (er){}
            return false;
        }

        console.log('DB health OK', data);
        removeHealthBanner();
        return true;
    } catch (err) {
        console.error('Health check failed', err);
        showNotification('Не вдається зв\'язатися з API', 'error');
        showHealthBanner('Не вдається зв\'язатися з API');
        return false;
    }
}

// Utility: show persistent health banner at top
function showHealthBanner(message) {
    let el = document.getElementById('api-health-banner');
    if (!el) {
        el = document.createElement('div');
        el.id = 'api-health-banner';
        el.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#c0392b;color:#fff;padding:8px 12px;z-index:99999;text-align:center;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.3);';
        document.body.appendChild(el);
        // push content down so header is not overlapped if necessary
        document.body.style.paddingTop = (parseInt(getComputedStyle(document.body).paddingTop || '0') + 40) + 'px';
    }
    el.textContent = message;
}

function removeHealthBanner() {
    const el = document.getElementById('api-health-banner');
    if (el) {
        el.remove();
        // restore body padding
        document.body.style.paddingTop = '';
    }
}

// Видалення продукту з сервера
async function deleteProduct(id) {
    if (!confirm('Ви впевнені, що хочете видалити цей продукт?')) return null;

    try {
        const resp = await fetch(getApiUrl('delete_product'), {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        if (!resp.ok) {
            const text = await resp.text();
            console.error('API error while deleting product', resp.status, resp.statusText, text);
            showNotification(`Помилка сервера: ${resp.status}`, 'error');
            return null;
        }

        const data = await resp.json();
        if (data && data.success) {
            showNotification('Продукт успішно видалено', 'success');
            // Перезавантажуємо таблицю
            await loadManagedWines();
            return data;
        } else {
            console.error('Delete returned error', data);
            showNotification(data.message || 'Не вдалось видалити продукт', 'error');
            return data;
        }
    } catch (err) {
        console.error('Помилка при видаленні продукту', err);
        showNotification('Помилка сервера при видаленні', 'error');
        return null;
    }
}

// === ІНІЦІАЛІЗАЦІЯ КНОПОК ===
function initActionButtons() {
    // Кнопки "Переглянути" — якщо елемент не є лінком, використовуємо внутрішній перегляд
    document.querySelectorAll('.btn-view').forEach(btn => {
        if (btn.tagName.toLowerCase() === 'a') return; // лінки відкриють сторінку самі
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
    
    // Кнопки "Видалити" — викликаємо серверне видалення
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.cells[0].textContent;
            deleteProduct(id);
        });
    });
}

// === ПЕРЕГЛЯД ЕЛЕМЕНТА (read-only modal preview) ===
function viewItem(id, name) {
    console.log('Переглянути:', { id, name });

    // Fetch product list and find the product
    fetch('api.php?action=get_products').then(r => r.json()).then(data => {
        if (!data || !data.success) return alert('Не вдалося завантажити продукт');
        const prod = (data.products || []).find(p => String(p.id) === String(id));
        if (!prod) return alert('Продукт не знайдено');

        const modalId = `admin-view-${prod.id}`;
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
        const resp = await fetch('api.php?action=get_products');
        const data = await resp.json();
        if (!data || !data.success) return alert('Не вдалося завантажити продукт');

        const prod = (data.products || []).find(p => String(p.id) === String(id));
        if (!prod) return alert('Продукт не знайдено');

        const modalId = `admin-edit-${prod.id}`;
        document.getElementById(modalId)?.remove();

        const categories = window.__adminCategories || ['Вино'];
        const categoryOptions = categories.map(c => `<option value="${escapeHtml(c)}" ${c===prod.category? 'selected' : ''}>${escapeHtml(c)}</option>`).join('');

        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'region-modal admin-modal edit-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-background"><img src="${escapeHtml(prod.image || 'img1/Masseto.jpg')}" alt="${escapeHtml(prod.name)}"></div>
                <div class="modal-info">
                    <h2 class="modal-region-title">Редагувати: ${escapeHtml(prod.name)}</h2>
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

        modal.querySelector('.modal-close').addEventListener('click', () => closeAdminModal(modalId));
        modal.querySelector('.modal-overlay').addEventListener('click', () => closeAdminModal(modalId));
        modal.querySelector('.btn-cancel').addEventListener('click', () => closeAdminModal(modalId));

        function getField(id){ return modal.querySelector('#'+id); }

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
                    const row = Array.from(document.querySelectorAll('#tableBody tr')).find(tr => tr.cells[0].textContent == prod.id);
                    if (row) {
                        row.cells[1].textContent = payload.name;
                        row.cells[2].textContent = payload.price;
                        row.cells[3].textContent = payload.category;
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