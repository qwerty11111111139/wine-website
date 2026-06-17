<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Мій кабінет - Dionysus Cellar</title>
    <link rel="stylesheet" href="cabinet.css">
    <style>
        body.vip-letter-open {
            overflow: hidden;
        }

        .vip-letter-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.85) !important;
            overflow-y: auto;
            padding: 0 !important;
        }

        .vip-letter-card {
            position: relative;
            width: 650px;
            height: 950px;
            box-sizing: border-box;
            padding: 120px 60px 220px 60px;
            overflow: visible;
        }

        .vip-letter-content {
            position: relative;
            z-index: 2;
            color: #2b221a;
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.7;
            text-align: left;
            background: transparent !important;
            margin: 0 auto;
            padding: 0;
            width: calc(100% - 40px);
            max-width: 520px;
        }

        .vip-letter-content p,
        .vip-letter-content h2,
        .vip-letter-content h3,
        .vip-letter-content ul {
            margin: 0 0 18px;
        }

        .vip-letter-content p:last-child {
            margin-bottom: 0;
        }

        .vip-letter-greeting {
            font-size: 1.6rem;
            font-weight: 700;
            margin-bottom: 20px;
            letter-spacing: 0.02em;
        }

        .vip-letter-action {
            display: inline-block;
            margin-top: 1120px;
            padding: 14px 34px;
            border: none;
            border-radius: 999px;
            background: radial-gradient(circle at top left, #d4af37 0%, #b88b2a 100%);
            color: #1a0f05;
            font-family: 'Georgia', serif;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 14px 28px rgba(0, 0, 0, 0.18);
            z-index: 2;
        }

        .vip-letter-action:hover {
            transform: translateY(-2px);
        }

        .vip-letter-card-img {
            position: absolute;
            bottom: 210px;
            left: 50%;
            transform: translateX(-50%);
            width: 290px;
            height: auto;
            z-index: 10;
            display: block;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-container">
            <div class="logo">
                <h1>DIONYSUS CELLAR</h1>
            </div>
            <nav class="nav">
                <a href="index.html">ГОЛОВНА</a>
                <a href="wine.html">ВИНА</a>
                <a href="about.html">ПРО НАС</a>
                <a href="Contacts.html">КОНТАКТИ</a>
            </nav>
            <form id="headerSearchForm" class="header-search-form" role="search">
                <input type="search" id="headerSearchInput" class="header-search-input" placeholder="Пошук товарів..." aria-label="Пошук товарів">
                <button type="submit" class="header-search-btn" aria-label="Пошук">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.6" />
                        <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                    </svg>
                </button>
            </form>
        </div>
    </header>

    <?php if (isset($show_vip_letter) && $show_vip_letter): ?>
    <div class="vip-letter-modal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.93) !important; z-index: 999999; display: flex; align-items: center; justify-content: center; overflow-y: auto; padding: 40px 20px; box-sizing: border-box;">
        <div class="vip-letter-card" style="width: 820px; min-height: 1339px; background-image: url('img1/vip-letter-bg.png') !important; background-size: 100% 100% !important; background-repeat: no-repeat !important; background-position: center !important; position: relative; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 330px 130px 120px 130px; transform: scale(1); margin: auto;">
            <div class="vip-letter-content" style="color: #2b1a08; font-size: 17px; line-height: 1.65; text-align: center; width: 100%; font-family: 'Georgia', serif; box-sizing: border-box; margin-bottom: 20px;">
                <h2 style="color: #8c6207; margin-top: 0; margin-bottom: 25px; font-size: 32px; font-weight: bold; font-family: 'Georgia', serif; letter-spacing: 0.5px; line-height: 1.3;">Ласкаво просимо до<br>Dionysus Club</h2>
                <p style="margin-bottom: 15px; font-weight: bold; font-size: 18px;">Шановний поціновувачу вишуканого стилю, шляхетних напоїв та глибокої філософії виноробного мистецтва!</p>
                <p style="margin-bottom: 15px;">Від імені всієї команди та засновників закритої спільноти висловлюємо Вам свою найглибшу повагу та щиру подяку за Вашу довіру, виявлений інтерес та подачу офіційної заявки на вступ до нашого елітного кола.</p>
                <p style="margin-bottom: 0;">Для нас є надзвичайно великою честю вітати Вас серед обраних членів клубу Dionysus Cellar. Наш закритий клуб народився з безмежної пристрасті до рідкісних колекційних вин, поваги до багатовікових традицій та унікальної естетики сучасного мінімалізму.</p>
            </div>

            <div style="width: 230px; margin-top: auto; margin-bottom: 315px; z-index: 10; transform: translateY(-14px);">
                <img src="img1/vip-letter-card.png" alt="VIP Card" style="width: 100%; height: auto; display: block; border-radius: 8px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6); clip-path: inset(1px round 8px);">
            </div>

            <form method="POST" action="cabinet.php" style="position: absolute; bottom: 329px; left: 50%; transform: translateX(-50%); z-index: 99; margin: 0; padding: 0;">
                <input type="hidden" name="accept_vip" value="1">
                <button type="submit" style="background: linear-gradient(135deg, #2b1a08 0%, #150d04 100%); color: #d4af37; border: 1px solid #d4af37; padding: 14px 55px; font-size: 14px; font-weight: bold; border-radius: 25px; cursor: pointer; box-shadow: 0 6px 20px rgba(0,0,0,0.6); text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap;">
                    Прийняти запрошення
                </button>
            </form>
        </div>
    </div>
    <?php endif; ?>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-overlay"></div>
        <div class="hero-content">
            <p class="hero-subtitle">ВІТАЄМО В ОСОБИСТОМУ КАБІНЕТІ</p>
            <h1 class="hero-title">Мій кабінет</h1>
        </div>
    </section>

    <!-- Main Content -->
    <main class="main-content">
        <div class="container">
            <!-- Left Sidebar - Menu -->
            <aside class="sidebar">
                <a href="cabinet.php" class="sidebar-link active" data-section="profile" aria-current="page">
                    <span class="link-icon">👤</span>
                    <span class="link-text">ОСОБИСТІ ДАНІ</span>
                </a>
                <nav class="sidebar-nav">
                    <a href="cabinet_Order_history.html" class="sidebar-link" data-section="orders">
                        <span class="link-icon">📦</span>
                        <span class="link-text">ІСТОРІЯ ЗАМОВЛЕНЬ</span>
                    </a>
                    <a href="cabinet_products.html" class="sidebar-link" data-section="favorites">
                        <span class="link-icon">❤️</span>
                        <span class="link-text">ОБРАНЕ</span>
                    </a>
                    <a href="settings.html" class="sidebar-link" data-section="settings">
                        <span class="link-icon">⚙️</span>
                        <span class="link-text">НАЛАШТУВАННЯ</span>
                    </a>
                    <a href="logout.php" class="sidebar-link">
                        <span class="link-icon">🚪</span>
                        <span class="link-text">Вихід</span>
                    </a>
                </nav>
            </aside>

            <!-- Right Content - Static Profile -->
            <section class="content-section">
                <h2 class="section-title">ОСОБИСТІ ДАНІ</h2>

                <div class="profile-container">
                    <form id="avatar-form" action="upload_avatar.php" method="POST" enctype="multipart/form-data">
                        <label for="avatar-input" class="profile-avatar" title="Завантажити аватар" onclick="document.getElementById('avatar-input').click();" style="cursor:pointer;">
                            <img src="<?php echo $avatarUrl; ?>" alt="Аватар користувача">
                        </label>
                        <input type="file" id="avatar-input" name="avatar_file" accept="image/*" style="display:none;" onchange="document.getElementById('avatar-form').submit();">
                    </form>

                    <div class="profile-details">
                        <div class="profile-name-row">
                            <h2 class="profile-username"><?php echo $name; ?></h2>
                            <?php if (!empty($isVip)): ?>
                                <span class="vip-badge">VIP</span>
                            <?php endif; ?>
                        </div>

                        <?php if (empty($isVip)): ?>
                            <p class="club-status-text">(не є учасником клубу <a href="club_form.php">Приєднатись?</a>)</p>
                        <?php else: ?>
                            <p class="club-status-text">Ви — VIP учасник. Ласкаво просимо до привілей!</p>
                        <?php endif; ?>

                        <div class="profile-info-block">
                            <p><strong>Ваше ім'я:</strong> <?php echo $name; ?></p>
                            <p><strong>Електронна пошта:</strong> <?php echo $email; ?></p>
                            <p><strong>Телефон:</strong> <?php echo $phone; ?></p>

                            <?php if (!empty($isVip)): ?>
                                <p class="profile-bonus"><strong>Баланс бонусів:</strong> <span class="bonus-count"><?php echo $bonuses; ?> б.</span></p>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-logo">
                <h2>DIONYSUS CELLAR</h2>
            </div>
            <div class="footer-social">
                <a href="#" class="social-link" aria-label="Facebook">f</a>
                <a href="#" class="social-link" aria-label="Instagram">📷</a>
                <a href="#" class="social-link" aria-label="Twitter">🐦</a>
            </div>
        </div>
    </footer>

    <!-- JS вимкнено, щоб він не затирав відрендерені PHP змінні порожніми даними -->
    <!-- <script src="cabinet.js"></script> -->
</body>
</html>