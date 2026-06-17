// Отримання елементів
const profileForm = document.getElementById('profileForm');
const changeDataForm = document.getElementById('changeDataForm');
const inputFields = document.querySelectorAll('.input-field');

// Додавання золотистого свічення при фокусі
inputFields.forEach(input => {
    input.addEventListener('focus', function() {
        this.classList.add('glow');
    });
    
    input.addEventListener('blur', function() {
        setTimeout(() => {
            this.classList.remove('glow');
        }, 1000);
    });
    
    // Динамічна підсвітка при введенні
    input.addEventListener('input', function() {
        this.style.borderColor = '#d4af37';
        this.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.4)';
        
        setTimeout(() => {
            if (document.activeElement !== this) {
                this.style.borderColor = '#333';
                this.style.boxShadow = 'none';
            }
        }, 2000);
    });
});

// Previously profileForm was editable — now left panel is INFO ONLY, we don't submit it
if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // no-op (preserve for backwards compatibility)
    });
}

// Обробка форми зміни даних (фактичний запит до бекенду)
changeDataForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const changeName = document.getElementById('changeName').value.trim();
    const changeEmail = document.getElementById('changeEmail').value.trim();
    const changePassword = document.getElementById('changePassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageEl = document.getElementById('changeMessage');

    // Validate at least one field
    if (!changeName && !changeEmail && !changePassword) {
        alert('Будь ласка, заповніть хоча б одне поле для зміни');
        return;
    }

    if (changePassword && changePassword !== confirmPassword) {
        alert('Паролі не співпадають');
        return;
    }

    const submitBtn = this.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'ЗБЕРЕЖЕННЯ...';

    try {
        const payload = { name: changeName || null, email: changeEmail || null };
        if (changePassword) payload.password = changePassword;

        const resp = await fetch('api.php?action=update_profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify(payload)
        });
        const data = await resp.json();

        if (data && data.success) {
            // Clear only password fields
            document.getElementById('changePassword').value = '';
            document.getElementById('confirmPassword').value = '';

            // Update left info panel instantly
            const user = data.user || {};
            if (user.name) document.getElementById('infoName').textContent = user.name;
            if (user.email) document.getElementById('infoEmail').textContent = user.email;

            // show success message
            if (messageEl) {
                messageEl.style.display = 'block';
                messageEl.style.color = '#d4af37';
                messageEl.textContent = 'Зміни збережено';
                setTimeout(() => messageEl.style.display = 'none', 3000);
            } else {
                alert('Зміни збережено');
            }
        } else {
            const err = data && data.message ? data.message : 'Помилка на сервері';
            alert(err);
        }
    } catch (err) {
        console.error('Update error:', err);
        alert('Не вдалося зберегти зміни. Спробуйте пізніше.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'ЗБЕРЕГТИ ЗМІНИ';
    }
});

// Додаємо ефект появи при завантаженні
window.addEventListener('load', () => {
    const panels = document.querySelectorAll('.left-panel, .right-panel');
    panels.forEach((panel, index) => {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            panel.style.transition = 'all 0.6s ease';
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Маска для телефону
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value.length <= 2) {
                value = `+${value}`;
            } else if (value.length <= 5) {
                value = `+${value.slice(0, 2)} (${value.slice(2)}`;
            } else if (value.length <= 8) {
                value = `+${value.slice(0, 2)} (${value.slice(2, 5)}) ${value.slice(5)}`;
            } else if (value.length <= 10) {
                value = `+${value.slice(0, 2)} (${value.slice(2, 5)}) ${value.slice(5, 8)}-${value.slice(8)}`;
            } else {
                value = `+${value.slice(0, 2)} (${value.slice(2, 5)}) ${value.slice(5, 8)}-${value.slice(8, 10)}-${value.slice(10, 12)}`;
            }
        }
        
        e.target.value = value;
    });
}

// Populate left info panel from session
async function populateProfileInfo() {
    try {
        const resp = await fetch('api.php?action=check_session', { credentials: 'same-origin' });
        const data = await resp.json();
        if (data && data.logged_in && data.user) {
            document.getElementById('infoName').textContent = data.user.name || '—';
            document.getElementById('infoEmail').textContent = data.user.email || '—';
            document.getElementById('infoPhone').textContent = data.user.phone || '—';
        }
    } catch (err) {
        console.error('Failed to load profile info', err);
    }
}

window.addEventListener('load', () => {
    populateProfileInfo();
});