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
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Закриття модального вікна
function closeModal(wineId) {
    const modal = document.getElementById(`modal-${wineId}`);
    
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Закриття модального вікна при кліку на overlay
document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('modal-overlay')) {
        const modal = event.target.closest('.region-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
});

// Закриття модального вікна клавішею ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.region-modal');
        modals.forEach(modal => {
            if (modal.style.display === 'flex') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
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
const btnLogin = document.querySelector('.btn-login');
if (btnLogin) {
    btnLogin.addEventListener('click', () => {
        alert('Функція входу буде реалізована');
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

// Обробник кнопки "Замовити"
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('btn-order')) {
        const wineTitle = document.getElementById('modalWineTitle').textContent;
        alert(`Замовлення "${wineTitle}" буде оформлено!`);
    }
});

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
        const id = e.target.getAttribute('data-id');
        const name = e.target.getAttribute('data-name');
        const img = e.target.getAttribute('data-img');
        
        // Get existing favorites from localStorage
        let favorites = JSON.parse(localStorage.getItem('wineFavorites')) || [];
        
        // Check if already added
        if (!favorites.some(fav => fav.id === id)) {
            favorites.push({id, name, img});
            localStorage.setItem('wineFavorites', JSON.stringify(favorites));
        }
        
        alert(`Ваш уподобаний товар "${name}" було переміщено на вкладку уподобані товари`);
    }
});

console.log('Wine Collection website loaded successfully!');