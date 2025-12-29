// Дані для кожного вина (тут ви можете змінити інформацію)
const wineData = {
    1: {
        image: 'img1/Romanée-Conti.jpg',
        title: 'Romanée-Conti',
        description: 'імат традицією, де мальовничо приелися, а вірогідні і таємничі',
        price: 'Ціна: 998 000 ₴'
    },
    2: {
        image: 'wine2.jpg',
        title: 'Назва вина 2',
        description: 'Детальний опис вина 2. Тут ви можете вказати інформацію про сорт винограду, регіон виробництва, характеристики смаку та аромату.',
        price: 'Ціна: 720 ₴'
    },
    3: {
        image: 'wine3.jpg',
        title: 'Назва вина 3',
        description: 'Детальний опис вина 3. Тут ви можете вказати інформацію про сорт винограду, регіон виробництва, характеристики смаку та аромату.',
        price: 'Ціна: 680 ₴'
    },
    4: {
        image: 'wine4.jpg',
        title: 'Назва вина 4',
        description: 'Детальний опис вина 4. Тут ви можете вказати інформацію про сорт винограду, регіон виробництва, характеристики смаку та аромату.',
        price: 'Ціна: 790 ₴'
    },
    5: {
        image: 'wine5.jpg',
        title: 'Назва вина 5',
        description: 'Детальний опис вина 5. Тут ви можете вказати інформацію про сорт винограду, регіон виробництва, характеристики смаку та аромату.',
        price: 'Ціна: 650 ₴'
    },
    6: {
        image: 'wine6.jpg',
        title: 'Назва вина 6',
        description: 'Детальний опис вина 6. Тут ви можете вказати інформацію про сорт винограду, регіон виробництва, характеристики смаку та аромату.',
        price: 'Ціна: 920 ₴'
    },
    7: {
        image: 'wine7.jpg',
        title: 'Назва вина 7',
        description: 'Детальний опис вина 7. Тут ви можете вказати інформацію про сорт винограду, регіон виробництва, характеристики смаку та аромату.',
        price: 'Ціна: 890 ₴'
    },
    8: {
        image: 'wine8.jpg',
        title: 'Назва вина 8',
        description: 'Детальний опис вина 8. Тут ви можете вказати інформацію про сорт винограду, регіон виробництва, характеристики смаку та аромату.',
        price: 'Ціна: 750 ₴'
    },
    9: {
        image: 'wine9.jpg',
        title: 'Назва вина 9',
        description: 'Детальний опис вина 9. Тут ви можете вказати інформацію про сорт винограду, регіон виробництва, характеристики смаку та аромату.',
        price: 'Ціна: 820 ₴'
    },
    10: {
        image: 'wine10.jpg',
        title: 'Назва вина 10',
        description: 'Детальний опис вина 10. Тут ви можете вказати інформацію про сорт винограду, регіон виробництва, характеристики смаку та аромату.',
        price: 'Ціна: 950 ₴'
    },
    11: {
        image: 'wine11.jpg',
        title: 'Назва вина 11',
        description: 'Детальний опис вина 11. Тут ви можете вказати інформацію про сорт винограду, регіон виробництва, характеристики смаку та аромату.',
        price: 'Ціна: 700 ₴'
    },
    12: {
        image: 'wine12.jpg',
        title: 'Назва вина 12',
        description: 'Детальний опис вина 12. Тут ви можете вказати інформацію про сорт винограду, регіон виробництва, характеристики смаку та аромату.',
        price: 'Ціна: 880 ₴'
    },
    13: {
        image: 'wine13.jpg',
        title: 'Назва вина 13',
        description: 'Детальний опис вина 13. Тут ви можете вказати інформацію про сорт винограду, регіон виробництва, характеристики смаку та аромату.',
        price: 'Ціна: 760 ₴'
    },
    14: {
        image: 'wine14.jpg',
        title: 'Назва вина 14',
        description: 'Детальний опис вина 14. Тут ви можете вказати інформацію про сорт винограду, регіон виробництва, характеристики смаку та аромату.',
        price: 'Ціна: 840 ₴'
    },
    15: {
        image: 'wine15.jpg',
        title: 'Назва вина 15',
        description: 'Детальний опис вина 15. Тут ви можете вказати інформацію про сорт винограду, регіон виробництва, характеристики смаку та аромату.',
        price: 'Ціна: 690 ₴'
    },
    16: {
        image: 'wine16.jpg',
        title: 'Назва вина 16',
        description: 'Детальний опис вина 16. Тут ви можете вказати інформацію про сорт винограду, регіон виробництва, характеристики смаку та аромату.',
        price: 'Ціна: 910 ₴'
    },
    17: {
        image: 'wine17.jpg',
        title: 'Назва вина 17',
        description: 'Детальний опис вина 17. Тут ви можете вказати інформацію про сорт винограду, регіон виробництва, характеристики смаку та аромату.',
        price: 'Ціна: 780 ₴'
    },
    18: {
        image: 'wine18.jpg',
        title: 'Назва вина 18',
        description: 'Детальний опис вина 18. Тут ви можете вказати інформацію про сорт винограду, регіон виробництва, характеристики смаку та аромату.',
        price: 'Ціна: 860 ₴'
    },
    19: {
        image: 'wine19.jpg',
        title: 'Назва вина 19',
        description: 'Детальний опис вина 19. Тут ви можете вказати інформацію про сорт винограду, регіон виробництва, характеристики смаку та аромату.',
        price: 'Ціна: 730 ₴'
    },
    20: {
        image: 'wine20.jpg',
        title: 'Назва вина 20',
        description: 'Детальний опис вина 20. Тут ви можете вказати інформацію про сорт винограду, регіон виробництва, характеристики смаку та аромату.',
        price: 'Ціна: 980 ₴'
    }
};

// Відкриття модального вікна
function openModal(wineId) {
    const modal = document.getElementById(`modal-${wineId}`);
    
    if (modal) {
        // Показуємо модальне вікно та додаємо клас active для правильної анімації
        document.body.style.overflow = 'hidden';
        modal.style.display = 'flex';
        // невелика перерва щоб CSS transition спрацював
        void modal.offsetWidth;
        modal.classList.add('active');

        // Force overlay / content stacking (inline styles to override any conflicting rules)
        const overlay = modal.querySelector('.modal-overlay');
        const content = modal.querySelector('.modal-content');
        if (overlay) overlay.style.zIndex = '10000';
        if (content) {
            content.style.zIndex = '10001';
            content.style.pointerEvents = 'auto';
        }

        // debug helper: log state
        console.log('openModal:', wineId, { hasOverlay: !!overlay, hasContent: !!content });
    }
} 

// Закриття модального вікна
function closeModal(wineId) {
    const modal = document.getElementById(`modal-${wineId}`);
    
    if (modal) {
        // Видаляємо клас active, після анімації ховаємо модальне вікно
        modal.classList.remove('active');

        // clear inline stacking overrides
        const overlay = modal.querySelector('.modal-overlay');
        const content = modal.querySelector('.modal-content');
        if (overlay) overlay.style.zIndex = '';
        if (content) {
            content.style.zIndex = '';
            content.style.pointerEvents = '';
        }

        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 400);
    }
} 

// Закриття модального вікна при кліку на overlay
document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('modal-overlay')) {
        const modal = event.target.closest('.region-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 400);
        }
    }
});

// Закриття модального вікна клавішею ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.region-modal.active');
        modals.forEach(modal => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 400);
        });
    }
});

// Плавна прокрутка для навігаційних посилань
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

// Якщо сторінка відкрита з хешем #modal-N — відкриваємо відповідний модал
function openModalFromHash() {
    const h = window.location.hash;
    if (!h) return;
    const m = h.match(/#modal-(\d+)/);
    if (m && m[1]) {
        setTimeout(() => { // невелика затримка щоб DOM був готовий
            openModal(m[1]);
            // прибрати хеш з адреси, щоб при закритті не знову відкривало
            history.replaceState(null, '', window.location.pathname);
        }, 120);
    }
}

// Відкрити модаль, якщо хеш присутній при завантаженні
document.addEventListener('DOMContentLoaded', openModalFromHash);
// І реагувати на зміну хеша під час перебування на сторінці
window.addEventListener('hashchange', openModalFromHash);

// --- Перевірка сесії для wine page ---
async function checkUserSessionForWine() {
    try {
        const res = await fetch('api.php?action=check_session', { credentials: 'same-origin' });
        const data = await res.json();
        if (data && data.logged_in) {
            const userName = data.user.name || data.user_name || 'Користувач';
            const role = data.user.role || data.role || 'user';

            // Якщо глобальна функція для рендеру хедера доступна — використовуємо її
            if (window && typeof window.renderUserInHeader === 'function') {
                window.renderUserInHeader(userName, role);
                return;
            }

            // Інакше — просто замінюємо локальний btn
            const btn = document.querySelector('.btn-login');
            if (btn) {
                const href = (role === 'admin') ? 'admin_panel.html' : 'cabinet.html';

                const userLink = document.createElement('a');
                userLink.className = 'user-btn';
                userLink.textContent = userName;
                userLink.href = href;
                btn.replaceWith(userLink);
            }

            // If the user is a club member — render the exclusive section (strict integer check)
            try {
                const memberFlag = (typeof data.is_club_member !== 'undefined') ? parseInt(data.is_club_member, 10) : (data.user && typeof data.user.is_club_member !== 'undefined' ? parseInt(data.user.is_club_member, 10) : 0);
                if (memberFlag === 1) {
                    // Show existing placeholder if present, otherwise render dynamic section
                    const placeholder = document.getElementById('club-wines-section');
                    if (placeholder) placeholder.style.display = 'block';
                    else renderClubMembersSection();
                } else {
                    const placeholder = document.getElementById('club-wines-section');
                    if (placeholder) placeholder.style.display = 'none';
                }
            } catch (err) { /* ignore */ }
        }
    } catch (e) {
        console.error('Session check failed on wine page', e);
    }
}

// Renders an exclusive wine section visible only to club members
function renderClubMembersSection() {
    // Avoid duplicate insertion
    if (document.querySelector('.club-only-section')) return;

    const catalog = document.querySelector('.wine-grid');
    if (!catalog) return;

    const section = document.createElement('section');
    section.className = 'wine-grid club-only-section';
    section.innerHTML = `
        <h2 class="section-title">Ексклюзивно для учасників клубу</h2>
        <div class="grid">
            <div class="wine-card">
                <img src="img1/Romanée-Conti.jpg" alt="Exclusive 1">
                <div class="modal-info">
                    <h3>Romanée-Conti (Ексклюзив)</h3>
                    <p class="price">Ціна: 1 200 000 ₴</p>
                    <button class="btn-buy" data-wine-name="Romanée-Conti (Ексклюзив)">Купити</button>
                </div>
            </div>
            <div class="wine-card">
                <img src="img1/Château Margaux.jpg" alt="Exclusive 2">
                <div class="modal-info">
                    <h3>Château Margaux (Ексклюзив)</h3>
                    <p class="price">Ціна: 980 ₴</p>
                    <button class="btn-buy" data-wine-name="Château Margaux (Ексклюзив)">Купити</button>
                </div>
            </div>
            <div class="wine-card">
                <img src="img1/Domaine de la Romanée-Conti Montrachet.jpg" alt="Exclusive 3">
                <div class="modal-info">
                    <h3>Domaine de la Romanée (Ексклюзив)</h3>
                    <p class="price">Ціна: 870 ₴</p>
                    <button class="btn-buy" data-wine-name="Domaine de la Romanée (Ексклюзив)">Купити</button>
                </div>
            </div>
            <div class="wine-card">
                <img src="img1/Masseto.jpg" alt="Exclusive 4">
                <div class="modal-info">
                    <h3>Вино Ексклюзив 4</h3>
                    <p class="price">Ціна: 1 100 ₴</p>
                    <button class="btn-buy" data-wine-name="Вино Ексклюзив 4">Купити</button>
                </div>
            </div>
            <div class="wine-card">
                <img src="img1/Pétrus.jpg" alt="Exclusive 5">
                <div class="modal-info">
                    <h3>Вино Ексклюзив 5</h3>
                    <p class="price">Ціна: 1 050 ₴</p>
                    <button class="btn-buy" data-wine-name="Вино Ексклюзив 5">Купити</button>
                </div>
            </div>
        </div>
    `;

    // Insert after the main catalog section
    catalog.parentNode.insertBefore(section, catalog.nextSibling);

    // Observe animations for new cards
    const newCards = section.querySelectorAll('.wine-card');
    newCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

document.addEventListener('DOMContentLoaded', checkUserSessionForWine);

// Анімація появи елементів при скролі
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Додаємо анімацію для всіх карток
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.feature-card, .wine-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// Зміна прозорості header при скролі
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Обробник кнопки "Увійти"
const btnLogin = document.querySelector('.btn-login, .login-btn');
if (btnLogin) {
    btnLogin.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById('modal-login');
        if (modal) {
            document.body.style.overflow = 'hidden';
            modal.style.display = 'flex';
            modal.classList.add('active');
        }
    });
}

// Обробник кнопки "Переглянути колекцію"
const btnPrimary = document.querySelector('.btn-primary');
if (btnPrimary) {
    btnPrimary.addEventListener('click', () => {
        const catalog = document.querySelector('.wine-grid');
        if (catalog) {
            catalog.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Обробник кнопки "Замовити" (старий, залишився для сумісності)
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('btn-order')) {
        const wineTitle = document.getElementById('modalWineTitle') ? document.getElementById('modalWineTitle').textContent : 'товар';
        alert(`Замовлення "${wineTitle}" буде оформлено!`);
    }
});

// --- НОВА ЛОГІКА: Обробка кнопок "КУПИТИ" щоб відкривати глобальний order modal ---
document.addEventListener('click', async function(e) {
    if (e.target && e.target.classList.contains('btn-buy')) {
        // знайти назву вина у найближчому modal або картці
        const btn = e.target;
        const wineName = btn.getAttribute('data-wine-name') || (btn.closest('.modal-info') && btn.closest('.modal-info').querySelector('.modal-region-title') ? btn.closest('.modal-info').querySelector('.modal-region-title').textContent.trim() : '') || (btn.closest('.wine-card') && btn.closest('.wine-card').querySelector('h3') ? btn.closest('.wine-card').querySelector('h3').textContent.trim() : '');

        openOrderModal(wineName);
    }
});

function openOrderModal(productName) {
    const modal = document.getElementById('modal-order');
    if (!modal) return;

    document.getElementById('orderProductName').textContent = productName;
    document.getElementById('orderProduct').value = productName;

    // Якщо користувач залогінений — підвантажити його дані
    fetch('api.php?action=check_session', { credentials: 'same-origin' }).then(r => r.json()).then(data => {
        if (data && data.logged_in) {
            const user = data.user || {};
            if (user.name) document.getElementById('orderName').value = user.name;
            if (user.email) document.getElementById('orderEmail').value = user.email;
        }
    }).catch(() => {});

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
    const modal = document.getElementById('modal-order');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Submit order form
const orderForm = document.getElementById('orderForm');
if (orderForm) {
    orderForm.addEventListener('submit', async function(e) {
        // Prevent native form submission as first action
        e.preventDefault();

        const payload = {
            product_name: document.getElementById('orderProduct').value,
            quantity: parseInt(document.getElementById('orderQuantity').value || '1', 10),
            customer_name: document.getElementById('orderName').value.trim(),
            email: document.getElementById('orderEmail').value.trim(),
            phone: document.getElementById('orderPhone').value.trim()
        };

        // simple validation
        if (!payload.product_name || !payload.customer_name || !payload.email || !payload.phone) {
            alert('Будь ласка, заповніть усі поля');
            return;
        }

        try {
            const resp = await fetch('api.php?action=create_order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'same-origin'
            });
            const data = await resp.json();

            if (data && data.success) {
                closeOrderModal();
                alert('Дякуємо за замовлення!');
            } else {
                alert('Помилка при оформленні замовлення: ' + (data.message || 'невідома помилка'));
            }
        } catch (err) {
            console.error('Order error:', err);
            alert('Помилка мережі при оформленні замовлення. Спробуйте пізніше.');
        }
    });
}

// Додаткова анімація для іконок в features
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.feature-icon');
        icon.style.transform = 'scale(1.2) rotate(5deg)';
        icon.style.transition = 'transform 0.4s ease';
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.feature-icon');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Ефект паралаксу для hero секції
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('like-btn')) {
        const rawId = e.target.getAttribute('data-id') || '';
        const m = rawId.match(/(\d+)/);
        const id = m ? m[1] : rawId; // use numeric id when available
        const name = e.target.getAttribute('data-name');
        const img = e.target.getAttribute('data-img');

        // Try to read price from surrounding DOM (modal or card)
        let price = '';
        const modal = e.target.closest('.modal');
        if (modal) {
            const priceEl = modal.querySelector('.modal-price');
            if (priceEl) price = priceEl.textContent.trim();
        }
        if (!price) {
            const card = e.target.closest('.product-card') || e.target.closest('.wine-card');
            if (card) {
                const priceEl = card.querySelector('.wine-price') || card.querySelector('.price-current');
                if (priceEl) price = priceEl.textContent.trim();
            }
        }

        // Attempt to save to server; on failure or not-logged-in, fall back to localStorage
        fetch('api.php?action=add_favorite', { credentials: 'same-origin', 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: id, name: name, img: img, price: price })
        }).then(r => r.json()).then(data => {
            if (data && data.success) {
                alert(data.message || `Додано в обране: ${name}`);
            } else {
                // not logged in or other server-side rejection -> fallback to localStorage
                let favorites = JSON.parse(localStorage.getItem('wineFavorites')) || [];
                if (!favorites.some(fav => String(fav.id) === String(id))) {
                    favorites.push({ id: id, name: name, img: img, price: price });
                    localStorage.setItem('wineFavorites', JSON.stringify(favorites));
                }
                if (data && (data.error === 'not_logged_in' || data.message === 'not_logged_in')) {
                    alert(`Ви не увійшли — товар "${name}" збережено локально в уподобаних.`);
                } else {
                    alert(`Ваш уподобаний товар "${name}" збережено локально.`);
                }
            }
        }).catch(err => {
            // Network error -> fallback
            let favorites = JSON.parse(localStorage.getItem('wineFavorites')) || [];
            if (!favorites.some(fav => String(fav.id) === String(id))) {
                favorites.push({ id: id, name: name, img: img, price: price });
                localStorage.setItem('wineFavorites', JSON.stringify(favorites));
            }
            alert(`Не вдалося зберегти на сервері. Товар "${name}" збережено локально.`);
        });
    }
});

// --- Dynamically load products from server and inject modals/cards for any new products added via admin ---

function formatPrice(val) {
    if (val === null || val === undefined || val === '') return '';
    // Accept either numeric or string, strip non-digits except dot
    const n = Number(String(val).replace(/[^0-9.]/g, ''));
    if (isNaN(n)) return val;
    return '₴ ' + n.toLocaleString('uk-UA');
}

function createProductCardElement(p) {
    const card = document.createElement('div');
    card.className = 'wine-card';
    card.dataset.productId = p.id;
    // store category on the card (lowercase for consistent filtering)
    card.dataset.category = (p.category || '').toString().toLowerCase();
    card.addEventListener('click', () => openModal(p.id));

    const imgDiv = document.createElement('div');
    imgDiv.className = 'wine-image';
    const img = document.createElement('img');
    img.src = p.image ? p.image : 'img1/Masseto.jpg';
    img.alt = p.name || 'product';
    imgDiv.appendChild(img);

    const info = document.createElement('div');
    info.className = 'wine-info';
    const h3 = document.createElement('h3');
    h3.textContent = p.name || 'Без назви';
    const ptype = document.createElement('p');
    ptype.className = 'wine-type';
    ptype.textContent = (p.category ? p.category : '') + (p.region ? (', ' + p.region) : '');
    const price = document.createElement('p');
    price.className = 'wine-price';
    price.textContent = formatPrice(p.price);

    info.appendChild(h3);
    info.appendChild(ptype);
    if (price.textContent) info.appendChild(price);

    card.appendChild(imgDiv);
    card.appendChild(info);

    // Prepare for animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease, transform 0.6s ease`;

    return card;
} 

function createProductModalElement(p, isSpecial = false) {
    const modal = document.createElement('div');
    modal.className = 'region-modal';
    modal.id = `modal-${p.id}`;

    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal('${p.id}')"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal('${p.id}')">&times;</button>
            <div class="modal-background">
                <img src="${p.image ? p.image : 'img1/Masseto.jpg'}" alt="${p.name}">
            </div>
            <div class="modal-info">
                <h2 class="modal-region-title">${p.name}</h2>
                <p class="modal-subtitle">${p.subtitle || (p.category ? p.category : '')}${p.country ? (', ' + p.country) : ''}</p>
                <div class="modal-description">
                    ${isSpecial ? '<p><strong>Елітна анотація:</strong> "Це не вино, це — ікона, що назавжди змінила історію Італії. Sassicaia — це бунтар, який став імператором. Народжене на розпечених сонцем кам\'янистих ґрунтах Болгері, воно стало першим \'супертосканським\', кинувши виклик віковим традиціям. Володіти цією пляшкою — це символ абсолютного статусу."</p><p><strong>Смакові відчуття:</strong> "Вино вражає аристократичною елегантністю. Аромат розкривається складною симфонією: дика вишня, чорна смородина та благородний кедр. У смаку — досконала гармонія сили та грації з нотами дорогого тютюну. Таніни поліровані до блиску."' : (`<p>${(p.description || '')}</p>`)}
                </div>
                <div class="modal-footer">
                    <div class="modal-price">ЦІНА: ${formatPrice(p.price)}</div>
                    <button class="btn-buy" data-wine-name="${p.name}">КУПИТИ</button>
                    <button class="like-btn" data-id="product${p.id}" data-name="${p.name}" data-img="${p.image ? p.image : ''}">❤️ Уподобати</button>
                </div>
            </div>
        </div>
    `;

    return modal;
}

async function loadProductsFromServer() {
    try {
        const resp = await fetch('api.php?action=get_products', { credentials: 'same-origin' });
        const data = await resp.json();
        if (!data || !data.success) {
            console.warn('No products fetched or error', data);
            return;
        }

        // The API returns products ordered by id DESC — we want to append new products at the end (older -> earlier in list), so reverse
        const products = (data.products || []).slice().reverse();
        const grid = document.querySelector('.grid');
        if (!grid) return;

        // Collect existing modal IDs and names to avoid duplicates
        const existingModalIds = new Set(Array.from(document.querySelectorAll('.region-modal')).map(m => m.id.replace(/^modal-/, '')));
        const existingNames = new Set(Array.from(document.querySelectorAll('.modal-region-title')).map(el => el.textContent.trim()));

        for (const p of products) {
            if (existingModalIds.has(String(p.id)) || existingNames.has((p.name || '').trim())) continue;

            const card = createProductCardElement(p);
            grid.appendChild(card);
            observer.observe(card);

            const modal = createProductModalElement(p);
            document.body.appendChild(modal);
        }

        // Ensure Tenuta San Guido Sassicaia exists (hardcoded fallback)
        const hasSass = (products.some(pr => pr.name && pr.name.includes('Sassicaia')) || Array.from(existingNames).some(n => n.includes('Sassicaia')));
        if (!hasSass) {
            const sass = {
                id: 'sassicaia',
                name: 'Tenuta San Guido Sassicaia',
                subtitle: 'Легенда Супертоскани',
                price: '14500',
                image: 'img1/Masseto.jpg' // placeholder image
            };
            // append card + modal
            const card = createProductCardElement(sass);
            card.addEventListener('click', () => openModal('sassicaia'));
            document.querySelector('.grid').appendChild(card);
            observer.observe(card);

            const modal = createProductModalElement(sass, true);
            document.body.appendChild(modal);
        }

        // If hash refers to dynamic modal, try opening it
        openModalFromHash();
    } catch (err) {
        console.error('Failed to load products from server:', err);
    }
}

// Load products after DOM ready
document.addEventListener('DOMContentLoaded', loadProductsFromServer);

// --- Live search / filter functionality ---
function filterWineCards(term) {
    const grid = document.querySelector('.grid');
    if (!grid) return;
    const q = String(term || '').trim().toLowerCase();
    const cards = Array.from(grid.querySelectorAll('.wine-card'));
    let matches = 0;

    cards.forEach(card => {
        const titleEl = card.querySelector('h3');
        const name = titleEl ? titleEl.textContent.trim().toLowerCase() : '';
        if (!q || name.indexOf(q) !== -1) {
            card.style.display = '';
            matches++;
        } else {
            card.style.display = 'none';
        }
    });

    let noEl = grid.querySelector('.no-results');
    if (matches === 0) {
        if (!noEl) {
            noEl = document.createElement('div');
            noEl.className = 'no-results';
            noEl.textContent = 'За вашим запитом нічого не знайдено';
            grid.appendChild(noEl);
        } else {
            noEl.style.display = '';
        }
    } else if (noEl) {
        noEl.style.display = 'none';
    }
}

// Hook up search input (live + on Enter) and category filter
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('headerSearchForm');
    const searchInput = document.getElementById('headerSearchInput');
    const categorySelect = document.getElementById('categoryFilter');
    let debounceTimer = null;

    function getCurrentSearchValue() {
        return searchInput ? searchInput.value : '';
    }

    function runFilter() {
        filterWineCards(getCurrentSearchValue());
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(runFilter, 220);
        });

        // Optional: support Escape to clear
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                filterWineCards('');
            }
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            // re-run filter with current search input
            runFilter();
        });
    }

    // Reset filters button
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (categorySelect) categorySelect.value = '';
            filterWineCards('');
            if (searchInput) searchInput.focus();
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            runFilter();
        });
    }
});

// Updated filtering to also consider category in the header
function filterWineCards(term) {
    const grid = document.querySelector('.grid');
    if (!grid) return;
    const q = String(term || '').trim().toLowerCase();
    const selectedCategory = (document.getElementById('categoryFilter')?.value || '').trim().toLowerCase();
    const cards = Array.from(grid.querySelectorAll('.wine-card'));
    let matches = 0;

    cards.forEach(card => {
        const titleEl = card.querySelector('h3');
        const name = titleEl ? titleEl.textContent.trim().toLowerCase() : '';

        // category can be stored in data-category for dynamic cards or inside .wine-type text for static cards
        const cardCategory = (card.dataset.category || (card.querySelector('.wine-type') ? card.querySelector('.wine-type').textContent : '')).toString().trim().toLowerCase();

        const matchesText = !q || name.indexOf(q) !== -1;
        const matchesCategory = !selectedCategory || (cardCategory && cardCategory.indexOf(selectedCategory) !== -1);

        if (matchesText && matchesCategory) {
            card.style.display = '';
            matches++;
        } else {
            card.style.display = 'none';
        }
    });

    let noEl = grid.querySelector('.no-results');
    if (matches === 0) {
        if (!noEl) {
            noEl = document.createElement('div');
            noEl.className = 'no-results';
            noEl.textContent = 'За вашим запитом нічого не знайдено';
            grid.appendChild(noEl);
        } else {
            noEl.style.display = '';
        }
    } else if (noEl) {
        noEl.style.display = 'none';
    }
} 

console.log('Wine Collection website loaded successfully! (search enabled)');

/* --- Order modal wiring --- */
function openOrderModal() {
    const modal = document.getElementById('modal-order');
    if (!modal) return;
    document.body.style.overflow = 'hidden';
    modal.style.display = 'flex';
    void modal.offsetWidth;
    modal.classList.add('active');
    const overlay = modal.querySelector('.modal-overlay');
    const content = modal.querySelector('.modal-content');
    if (overlay) overlay.style.zIndex = '10000';
    if (content) content.style.zIndex = '10001';
}

function closeOrderModal() {
    const modal = document.getElementById('modal-order');
    if (!modal) return;
    modal.classList.remove('active');
    const overlay = modal.querySelector('.modal-overlay');
    const content = modal.querySelector('.modal-content');
    if (overlay) overlay.style.zIndex = '';
    if (content) content.style.zIndex = '';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Populate select and wire buy buttons
document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('orderSelect');
    if (select && typeof wineData === 'object') {
        Object.keys(wineData).forEach(id => {
            const opt = document.createElement('option');
            opt.value = id;
            opt.textContent = wineData[id].title || `Wine ${id}`;
            select.appendChild(opt);
        });

        function getOrderImageElement() {
            return document.getElementById('order-wine-img') || document.getElementById('orderModalImg') || document.querySelector('#modal-order .modal-left img');
        }

        select.addEventListener('change', (e) => {
            const id = e.target.value;
            const img = getOrderImageElement();
            const nameP = document.getElementById('orderProductName');
            const hidden = document.getElementById('orderProduct');
            if (wineData[id]) {
                if (wineData[id].image && img) img.src = wineData[id].image;
                nameP.textContent = wineData[id].title;
                hidden.value = wineData[id].title;
            } else {
                nameP.textContent = select.options[select.selectedIndex].textContent;
                hidden.value = nameP.textContent;
            }
        });
    }

    // Fixed handler: scope image & title lookup to the clicked button's nearest container (.modal-content or .wine-card)
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.btn-buy, .btn-buy-now');
        if (!btn) return;

        // Ignore clicks inside order modal itself
        if (btn.closest('#modal-order')) return;

        e.preventDefault();

        // 1) Determine the nearest container for this button (prefer modal-content)
        let currentCard = btn.closest('.modal-content') || btn.closest('.region-modal') || btn.closest('.modal') || btn.closest('.wine-card');

        // 2) Find image only inside that container
        let imgEl = null;
        if (currentCard) {
            imgEl = currentCard.querySelector('.modal-background img, .wine-image img, img');
        }

        let imgSrc = '';
        if (imgEl) imgSrc = imgEl.src || imgEl.getAttribute('src') || '';
        if (!imgSrc) imgSrc = btn.dataset.img || btn.getAttribute('data-img') || '';

        // 3) Find name/title only inside that container
        let wineName = '';
        if (currentCard) {
            const titleEl = currentCard.querySelector('h1, h2, .modal-region-title, .modal-title, .wine-title, h3');
            if (titleEl) wineName = titleEl.textContent.trim();
        }
        wineName = wineName || btn.dataset.name || btn.dataset.wineName || btn.getAttribute('data-name') || '';

        // 4) wine id (if any)
        let wineId = btn.dataset.wineId || btn.getAttribute('data-wine-id') || null;
        if (!wineId && currentCard && currentCard.id) {
            const m = currentCard.id.match(/modal-(\d+)/);
            if (m) wineId = m[1];
        }

        console.log('Клік по вину:', wineName);
        console.log('Знайдено фото:', imgSrc);

        // 5) Close source modal if it is a modal
        if (wineId) closeModal(wineId);
        else if (currentCard && (currentCard.classList.contains('region-modal') || currentCard.classList.contains('modal') || currentCard.classList.contains('modal-content'))) {
            const parentModal = currentCard.closest('.region-modal') || currentCard.closest('.modal');
            if (parentModal) {
                parentModal.classList.remove('active');
                setTimeout(() => { parentModal.style.display = 'none'; }, 300);
            }
        }

        // 6) Open order modal
        openOrderModal();

        // 7) Insert image into prepared tag
        const orderImg = document.getElementById('order-wine-img') || document.getElementById('orderModalImg') || document.querySelector('#modal-order .modal-left img');
        if (orderImg) {
            if (imgSrc) orderImg.src = imgSrc;
            else if (wineId && wineData[wineId] && wineData[wineId].image) orderImg.src = wineData[wineId].image;
            else {
                orderImg.removeAttribute('src');
                console.warn('Не вдалося знайти зображення у попередньому вікні!');
            }
        }

        // 8) Select / input selection
        const orderModal = document.getElementById('modal-order');
        const select = document.getElementById('orderSelect') || (orderModal ? orderModal.querySelector('select[name="product_id"], select[name="wine_name"], select') : null);
        const orderNameEl = document.getElementById('orderProductName') || (orderModal ? orderModal.querySelector('.order-product-name') : null);
        const hiddenInput = document.getElementById('orderProduct') || (orderModal ? orderModal.querySelector('input[name="product_name"]') : null);

        let optionFound = false;
        if (select) {
            if (wineId) {
                const opt = Array.from(select.options).find(o => o.value === String(wineId));
                if (opt) { select.value = String(wineId); optionFound = true; }
            }

            if (!optionFound && wineName) {
                const opt = Array.from(select.options).find(o => o.textContent.includes(wineName));
                if (opt) { select.value = opt.value; optionFound = true; }
            }

            if (!optionFound && wineName) {
                const tmp = document.createElement('option');
                tmp.value = wineId ? String(wineId) : wineName;
                tmp.textContent = wineName;
                select.appendChild(tmp);
                select.value = tmp.value;
            }

            select.dispatchEvent(new Event('change'));
        }

        if (orderNameEl) orderNameEl.textContent = wineName || (select && select.options[select.selectedIndex] ? select.options[select.selectedIndex].textContent : '');
        if (hiddenInput) hiddenInput.value = wineName || (select && select.options[select.selectedIndex] ? select.options[select.selectedIndex].textContent : '');

        // focus name input
        const nameField = document.getElementById('orderName'); if (nameField) nameField.focus();
    });

    // Keep hidden input synced if select changes (backup)
    const selectEl2 = document.getElementById('orderSelect');
    if (selectEl2) {
        selectEl2.addEventListener('change', (e) => {
            const val = e.target.value;
            const orderNameEl = document.getElementById('orderProductName');
            const hiddenInput = document.getElementById('orderProduct');
            if (wineData[val]) {
                orderNameEl.textContent = wineData[val].title;
                hiddenInput.value = wineData[val].title;
                const orderImg = document.getElementById('orderModalImg');
                if (orderImg && wineData[val].image) orderImg.src = wineData[val].image;
            } else {
                const text = e.target.options[e.target.selectedIndex].textContent;
                orderNameEl.textContent = text;
                hiddenInput.value = text;
            }
        });
    }
});