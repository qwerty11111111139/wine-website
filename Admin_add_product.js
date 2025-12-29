document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addProductForm');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Завантаження...';

        const formData = new FormData(form);

        try {
            const res = await fetch('api_add_product.php', {
                method: 'POST',
                body: formData
            });
            const text = await res.text();
            let data;
            try { data = JSON.parse(text); } catch (parseErr) { data = { success: false, message: 'Invalid server response' }; }

            if (data.success) {
                alert('Вино успішно додано!');
                window.location.href = 'Wine_admin.html';
            } else {
                alert('Помилка: ' + (data.message || 'Невідома помилка'));
                submitBtn.disabled = false;
                submitBtn.textContent = 'Зберегти товар';
            }
        } catch (err) {
            console.error(err);
            alert('Сталася помилка при відправці. Перевірте консоль.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Зберегти товар';
        }
    });
});