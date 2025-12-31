// Получение элементов DOM
const splashScreen = document.getElementById('splash-screen');
const mainMenu = document.getElementById('main-menu');
const nameInputSection = document.getElementById('name-input-section');
const characterSelect = document.getElementById('character-select');
const modeSelect = document.getElementById('mode-select');
const startGameBtn = document.getElementById('start-game-btn');
const gameContainer = document.getElementById('game-container');
const gameCanvas = document.getElementById('game-canvas');
const playerHealthDisplay = document.getElementById('player-health');
const enemiesRemainingDisplay = document.getElementById('enemies-remaining');
const trophyCountDisplay = document.getElementById('trophy-count');
const playerNameInput = document.getElementById('player-name');
const acceptNameBtn = document.getElementById('accept-name-btn');
const sheggaBtn = document.getElementById('shegga-btn');
const mortakBtn = document.getElementById('mortak-btn');
const bullyBtn = document.getElementById('bully-btn');
const scrapBtn = document.getElementById('scrap-btn');
const clancyBtn = document.getElementById('clancy-btn');
const soloModeBtn = document.getElementById('solo-mode-btn');
const teamModeBtn = document.getElementById('team-mode-btn');
const shopBtn = document.getElementById('shop-btn');
const shopMenu = document.getElementById('shop-menu');
const winScreen = document.getElementById('win-screen');
const loseScreen = document.getElementById('lose-screen');
const playAgainBtnWin = document.getElementById('play-again-btn-win');
const mainMenuBtnWin = document.getElementById('main-menu-btn-win');
const playAgainBtnLose = document.getElementById('play-again-btn-lose');
const mainMenuBtnLose = document.getElementById('main-menu-btn-lose');
const trophiesCountDisplay = document.getElementById('trophies-count');
const playerNameDisplay = document.getElementById('current-player-name');
const teamScoreDisplay = document.getElementById('team-score');
const blueTeamScore = document.getElementById('blue-team-score');
const redTeamScore = document.getElementById('red-team-score');
const diamondCountDisplay = document.getElementById('diamond-count');
const diamondsCollected = document.getElementById('diamonds-collected');
const superCooldownDisplay = document.getElementById('super-cooldown');
const playerTeamDisplay = document.getElementById('player-team');
const teamColorDisplay = document.getElementById('team-color');
const winMessage = document.getElementById('win-message');
const loseMessage = document.getElementById('lose-message');
const jadeCountDisplay = document.getElementById('jade-count-display');
const clancyImg = document.getElementById('clancy-img');
const soundActivatorBtn = document.getElementById('sound-activator');
const mobileControls = document.getElementById('mobile-controls');
const movementJoystick = document.getElementById('movement-joystick');
const joystickHandle = movementJoystick.querySelector('.joystick-handle');
const attackBtn = document.getElementById('attack-btn');
const superBtn = document.getElementById('super-btn');
const desktopControlsInfo = document.getElementById('desktop-controls');
const mobileControlsInfo = document.getElementById('mobile-controls-info');

// Получаем аудио элементы
const menuMusic = document.getElementById('menu-music');
const shootSound = document.getElementById('shoot-sound');
const diamondSound = document.getElementById('diamond-sound');
const superSound = document.getElementById('super-sound');

const ctx = gameCanvas.getContext('2d');

// Размеры карты
let mapWidth = 800;
let mapHeight = 600;

// Переменная для отслеживания разрешения звука
let soundEnabled = false;

// Проверка устройства (мобильное или ПК)
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768;

// Переменные для управления джойстиком
let joystickActive = false;
let joystickStartX = 0;
let joystickStartY = 0;
let joystickCurrentX = 0;
let joystickCurrentY = 0;
let joystickRadius = 75;
let touchId = null;

// Игровые данные
let playerName = '';
let selectedCharacter = null;
let gameMode = 'solo';
let totalTrophies = 0;
let jadeCount = 0;
let isClancyUnlocked = false;
let player = {
    x: 100,
    y: 100,
    radius: 15,
    health: 4000,
    damage: 2000,
    speed: 3,
    color: 'blue',
    superActive: false,
    superTimer: 0,
    superCooldown: 0,
    superReady: true,
    trophies: 0,
    diamonds: 0,
    team: 'blue',
    ammoType: 'single',
    barrels: [],
    shootCooldown: 0,
    isDead: false,
    respawnTimer: 0,
    inTree: false,
    moveX: 0,
    moveY: 0
};

let enemies = [];
let bots = [];
let bullets = [];
let powerUps = [];
let obstacles = [];
let trees = [];
let diamonds = [];
let diamondSpawner = { x: 400, y: 300, radius: 20 };
let enemiesRemaining = 9;
let diamondSpawnTimer = 0;
let gameRunning = false;
let snowflakes = [];

// Ключи управления для ПК
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    ' ': false,
    Shift: false
};

// Цены в магазине
const SHOP_PRICES = {
    clancy: 2500
};

// URL изображений для Клэнси - ИСПРАВЛЕНО!
const CHARACTER_IMAGES = {
    clancy: {
        locked: 'https://sun9-64.userapi.com/s/v1/ig2/7WV2AnVVPvNduW0TpOXo1W3DHnjj_eWy8yhCbuhmvQpUWNZssOYlbwY-HileN1YGgMI2hBVpN4lDjdVh5LcnFvfc.jpg?quality=95&as=32x28,48x42,72x64,108x95,137x121&from=bu&u=7DAybgAqVc5VyILsualmnHOEwGqVhoB_m9cyVcjSu_A&cs=137x0',
        unlocked: 'https://sun9-64.userapi.com/s/v1/ig2/7WV2AnVVPvNduW0TpOXo1W3DHnjj_eWy8yhCbuhmvQpUWNZssOYlbwY-HileN1YGgMI2hBVpN4lDjdVh5LcnFvfc.jpg?quality=95&as=32x28,48x42,72x64,108x95,137x121&from=bu&u=7DAybgAqVc5VyILsualmnHOEwGqVhoB_m9cyVcjSu_A&cs=137x0',
        shopLocked: 'https://sun9-64.userapi.com/s/v1/ig2/7WV2AnVVPvNduW0TpOXo1W3DHnjj_eWy8yhCbuhmvQpUWNZssOYlbwY-HileN1YGgMI2hBVpN4lDjdVh5LcnFvfc.jpg?quality=95&as=32x28,48x42,72x64,108x95,137x121&from=bu&u=7DAybgAqVc5VyILsualmnHOEwGqVhoB_m9cyVcjSu_A&cs=137x0',
        shopUnlocked: 'https://sun9-64.userapi.com/s/v1/ig2/7WV2AnVVPvNduW0TpOXo1W3DHnjj_eWy8yhCbuhmvQpUWNZssOYlbwY-HileN1YGgMI2hBVpN4lDjdVh5LcnFvfc.jpg?quality=95&as=32x28,48x42,72x64,108x95,137x121&from=bu&u=7DAybgAqVc5VyILsualmnHOEwGqVhoB_m9cyVcjSu_A&cs=137x0'
    }
};

// Инициализация игры
function init() {
    console.log("Инициализация игры...");
    console.log("Мобильное устройство:", isMobile);

    // Загружаем сохраненные данные
    loadGameData();

    // Адаптация размеров canvas под устройство
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Адаптация под мобильные устройства
    if (isMobile) {
        console.log("Активация мобильного режима");
        desktopControlsInfo.classList.add('hidden');
        mobileControlsInfo.classList.remove('hidden');
        // Скрываем мобильное управление изначально
        mobileControls.classList.add('hidden');
    } else {
        mobileControls.classList.add('hidden');
    }

    // Обработчик клика по кнопке активации звука
    soundActivatorBtn.addEventListener('click', enableSound);

    // Показываем главное меню после загрузки
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        mainMenu.classList.remove('hidden');
        nameInputSection.classList.remove('hidden');
        characterSelect.classList.add('hidden');
        modeSelect.classList.add('hidden');
        startGameBtn.classList.add('hidden');

        // Воспроизводим музыку меню
        if (soundEnabled) {
            menuMusic.volume = 0.3;
            menuMusic.play().catch(e => {
                console.log('Музыка меню:', e);
            });
        }
    }, 2000);

    // Обработчики событий
    acceptNameBtn.addEventListener('click', handleNameAccept);
    playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleNameAccept();
    });

    sheggaBtn.addEventListener('click', () => selectCharacter('shegga'));
    mortakBtn.addEventListener('click', () => selectCharacter('mortak'));
    bullyBtn.addEventListener('click', () => selectCharacter('bully'));
    scrapBtn.addEventListener('click', () => selectCharacter('scrap'));
    clancyBtn.addEventListener('click', () => selectCharacter('clancy'));

    soloModeBtn.addEventListener('click', () => selectGameMode('solo'));
    teamModeBtn.addEventListener('click', () => selectGameMode('team'));

    startGameBtn.addEventListener('click', startGame);

    shopBtn.addEventListener('click', () => {
        updateShopDisplay();
        shopMenu.classList.remove('hidden');
        mainMenu.classList.add('hidden');
    });

    // Обработчик закрытия магазина
    document.addEventListener('click', (e) => {
        if (e.target.id === 'close-shop-btn' || e.target.classList.contains('shop-close-btn')) {
            shopMenu.classList.add('hidden');
            mainMenu.classList.remove('hidden');
            saveGameData();
        }
    });

    playAgainBtnWin.addEventListener('click', startGame);
    mainMenuBtnWin.addEventListener('click', returnToMainMenu);
    playAgainBtnLose.addEventListener('click', startGame);
    mainMenuBtnLose.addEventListener('click', returnToMainMenu);

    // Управление для ПК
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Управление для мобильных
    setupMobileControls();

    updateTotalTrophiesDisplay();
    updateJadeDisplay();
    updateCharacterButtons();

    // Создаем снежинки
    createSnowflakes();

    // Запускаем анимацию снежинок
    requestAnimationFrame(animateSnowflakes);
}

// Загрузка сохраненных данных
function loadGameData() {
    try {
        const savedData = localStorage.getItem('brawlBallsData');
        if (savedData) {
            const data = JSON.parse(savedData);
            totalTrophies = data.totalTrophies || 0;
            jadeCount = data.jadeCount || 0;
            isClancyUnlocked = data.isClancyUnlocked || false;
            playerName = data.playerName || '';

            if (playerName) {
                playerNameInput.value = playerName;
                playerNameDisplay.textContent = playerName;
            }

            console.log("Данные загружены:", data);
            console.log("Клэнси разблокирован:", isClancyUnlocked);
        }
    } catch (e) {
        console.log('Ошибка загрузки данных:', e);
        resetGameData();
    }
}

// Сохранение данных игры
function saveGameData() {
    const data = {
        totalTrophies: totalTrophies,
        jadeCount: jadeCount,
        isClancyUnlocked: isClancyUnlocked,
        playerName: playerName
    };
    localStorage.setItem('brawlBallsData', JSON.stringify(data));
    console.log("Данные сохранены:", data);
}

// Настройка мобильного управления
function setupMobileControls() {
    console.log("Настройка мобильного управления...");

    // Обработчики для джойстика
    movementJoystick.addEventListener('touchstart', handleJoystickStart, { passive: false });
    movementJoystick.addEventListener('touchmove', handleJoystickMove, { passive: false });
    movementJoystick.addEventListener('touchend', handleJoystickEnd);

    // Обработчики для кнопок атаки
    attackBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (gameRunning && !player.isDead && player.shootCooldown <= 0) {
            shoot();
            player.shootCooldown = 10;
        }
    }, { passive: false });

    superBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (gameRunning && !player.isDead && player.superReady) {
            superAttack();
        }
    }, { passive: false });

    // Также добавляем обработчики для кликов
    attackBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (gameRunning && !player.isDead && player.shootCooldown <= 0) {
            shoot();
            player.shootCooldown = 10;
        }
    });

    superBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (gameRunning && !player.isDead && player.superReady) {
            superAttack();
        }
    });
}

// Обработка начала касания джойстика
function handleJoystickStart(e) {
    if (!gameRunning || player.isDead) return;

    e.preventDefault();
    if (!joystickActive) {
        joystickActive = true;
        const touch = e.touches[0];
        touchId = touch.identifier;

        const rect = movementJoystick.getBoundingClientRect();
        joystickStartX = rect.left + rect.width / 2;
        joystickStartY = rect.top + rect.height / 2;
        joystickCurrentX = touch.clientX;
        joystickCurrentY = touch.clientY;

        updateJoystickPosition();
    }
}

// Обработка движения джойстика
function handleJoystickMove(e) {
    if (!joystickActive || !gameRunning || player.isDead) return;

    e.preventDefault();

    // Находим касание с нужным идентификатором
    for (let i = 0; i < e.touches.length; i++) {
        if (e.touches[i].identifier === touchId) {
            joystickCurrentX = e.touches[i].clientX;
            joystickCurrentY = e.touches[i].clientY;
            updateJoystickPosition();
            break;
        }
    }
}

// Обработка окончания касания джойстика
function handleJoystickEnd(e) {
    if (!joystickActive) return;

    e.preventDefault();

    // Проверяем, было ли отпущено нужное касание
    let touchEnded = false;
    for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) {
            touchEnded = true;
            break;
        }
    }

    if (touchEnded) {
        joystickActive = false;
        touchId = null;
        player.moveX = 0;
        player.moveY = 0;
        joystickHandle.style.transform = 'translate(-50%, -50%)';
    }
}

// Обновление позиции джойстика
function updateJoystickPosition() {
    if (!joystickActive || !gameRunning || player.isDead) return;

    const dx = joystickCurrentX - joystickStartX;
    const dy = joystickCurrentY - joystickStartY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Ограничиваем расстояние ручки джойстика
    let angle = Math.atan2(dy, dx);
    let limitedDistance = Math.min(distance, joystickRadius);

    // Вычисляем движение игрока
    player.moveX = Math.cos(angle) * (limitedDistance / joystickRadius);
    player.moveY = Math.sin(angle) * (limitedDistance / joystickRadius);

    // Обновляем позицию ручки джойстика
    const handleX = (dx / distance) * limitedDistance;
    const handleY = (dy / distance) * limitedDistance;
    joystickHandle.style.transform = `translate(calc(-50% + ${handleX}px), calc(-50% + ${handleY}px))`;
}

// Анимация снежинок
function animateSnowflakes() {
    updateSnowflakes();
    if (!gameRunning) {
        drawSnowflakesOnMenu();
    }
    requestAnimationFrame(animateSnowflakes);
}

// Рисование снежинок в меню
function drawSnowflakesOnMenu() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';

    document.body.appendChild(canvas);

    snowflakes.forEach(flake => {
        ctx.save();
        ctx.globalAlpha = flake.opacity;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    setTimeout(() => canvas.remove(), 100);
}

// Адаптация размеров canvas
function resizeCanvas() {
    const container = gameContainer;
    const canvas = gameCanvas;

    if (container && canvas) {
        // Для мобильных - полный экран
        if (isMobile) {
            mapWidth = window.innerWidth;
            mapHeight = window.innerHeight;
            canvas.width = mapWidth;
            canvas.height = mapHeight;
            canvas.style.width = mapWidth + 'px';
            canvas.style.height = mapHeight + 'px';

            // Обновляем позиции элементов HUD
            updateHUDPositions();
        } else {
            // Для ПК - фиксированный размер
            mapWidth = 800;
            mapHeight = 600;
            canvas.width = mapWidth;
            canvas.height = mapHeight;
        }
    }
}

// Обновление позиций HUD для мобильных
function updateHUDPositions() {
    const hud = document.getElementById('game-hud');
    if (hud && isMobile) {
        hud.style.top = '10px';
        hud.style.left = '10px';
        hud.style.right = 'auto';
        hud.style.bottom = 'auto';
        hud.style.fontSize = Math.min(14, mapWidth / 50) + 'px';
    }
}

// Создание снежинок
function createSnowflakes() {
    snowflakes = [];
    const count = isMobile ? 20 : 30;
    for (let i = 0; i < count; i++) {
        snowflakes.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 4 + 2,
            speed: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.3,
            sway: Math.random() * 2 - 1
        });
    }
}

// Обновление снежинок
function updateSnowflakes() {
    snowflakes.forEach(flake => {
        flake.y += flake.speed;
        flake.x += flake.sway * 0.5;

        if (flake.y > window.innerHeight) {
            flake.y = -10;
            flake.x = Math.random() * window.innerWidth;
        }
        if (flake.x > window.innerWidth) flake.x = 0;
        if (flake.x < 0) flake.x = window.innerWidth;
    });
}

// Функция для активации звука
function enableSound() {
    soundEnabled = true;
    soundActivatorBtn.textContent = '🔊 Звук включен';
    soundActivatorBtn.style.background = 'linear-gradient(45deg, #4caf50, #2e7d32)';

    menuMusic.volume = 0.3;
    menuMusic.play().catch(e => {
        console.log('Не удалось воспроизвести музыку:', e);
    });

    setTimeout(() => {
        soundActivatorBtn.style.display = 'none';
    }, 2000);
}

// Функция для воспроизведения звука выстрела
function playShootSound() {
    if (!soundEnabled) return;

    shootSound.currentTime = 0;
    shootSound.volume = 0.3;
    shootSound.play().catch(e => {
        console.log('Не удалось воспроизвести звук выстрела');
    });
}

// Функция для воспроизведения звука алмаза
function playDiamondSound() {
    if (!soundEnabled) return;

    diamondSound.currentTime = 0;
    diamondSound.volume = 0.5;
    diamondSound.play().catch(e => {
        console.log('Не удалось воспроизвести звук алмаза');
    });
}

// Функция для воспроизведения звука супер-атаки
function playSuperSound() {
    if (!soundEnabled) return;

    superSound.currentTime = 0;
    superSound.volume = 0.5;
    superSound.play().catch(e => {
        console.log('Не удалось воспроизвести звук супер-атаки');
    });
}

// Возврат в главное меню
function returnToMainMenu() {
    hideScreens();
    mainMenu.classList.remove('hidden');
    gameRunning = false;

    // Скрываем мобильное управление
    if (isMobile) {
        mobileControls.classList.add('hidden');
    }

    // Обновляем данные
    updateTotalTrophiesDisplay();
    updateJadeDisplay();
    updateCharacterButtons();
    saveGameData();

    // Воспроизводим музыку меню
    if (soundEnabled && menuMusic.paused) {
        menuMusic.play();
    }
}

// Сброс всех игровых данных к начальным значениям
function resetGameData() {
    totalTrophies = 0;
    jadeCount = 0;
    isClancyUnlocked = false;
    playerName = '';

    updateJadeDisplay();
    updateTotalTrophiesDisplay();
    updateCharacterButtons();
    saveGameData();
}

// Обновление отображения нефритов
function updateJadeDisplay() {
    jadeCountDisplay.textContent = jadeCount;
    // Обновляем счет в магазине, если он открыт
    const jadeCountValue = document.getElementById('jade-count-value');
    if (jadeCountValue) {
        jadeCountValue.textContent = jadeCount;
    }
}

// Обработка ввода имени
function handleNameAccept() {
    playerName = playerNameInput.value.trim();
    if (playerName) {
        playerNameDisplay.textContent = playerName;
        playerNameInput.disabled = true;
        acceptNameBtn.disabled = true;
        showCharacterSelect();
        saveGameData();
    } else {
        alert('Пожалуйста, введите имя!');
    }
}

// Показать выбор персонажа
function showCharacterSelect() {
    nameInputSection.classList.add('hidden');
    characterSelect.classList.remove('hidden');
    updateCharacterButtons();
}

// Выбор персонажа
function selectCharacter(character) {
    if (character === 'clancy' && !isClancyUnlocked) {
        alert('Клэнси не разблокирован! Купите его в магазине за 2500 нефритов.');
        return;
    }

    selectedCharacter = character;

    switch (character) {
        case 'shegga':
            player.color = '#9c27b0';
            player.ammoType = 'wave';
            player.damage = 1500;
            break;
        case 'mortak':
            player.color = '#f44336';
            player.ammoType = 'double';
            player.damage = 2000;
            break;
        case 'bully':
            player.color = '#212121';
            player.ammoType = 'quad';
            player.damage = 1000;
            break;
        case 'scrap':
            player.color = '#ff5722';
            player.ammoType = 'triple';
            player.damage = 1250;
            break;
        case 'clancy':
            player.color = '#ffeb3b';
            player.ammoType = 'quad';
            player.damage = 1800;
            break;
    }

    characterSelect.classList.add('hidden');
    modeSelect.classList.remove('hidden');
}

// Выбор режима игры
function selectGameMode(mode) {
    gameMode = mode;
    modeSelect.classList.add('hidden');
    startGameBtn.classList.remove('hidden');

    if (mode === 'team') {
        player.team = 'blue';
        playerTeamDisplay.classList.remove('hidden');
        teamColorDisplay.textContent = 'Синяя';
        teamColorDisplay.style.color = '#2196f3';
    } else {
        playerTeamDisplay.classList.add('hidden');
    }
}

// Начать игру
function startGame() {
    if (!selectedCharacter) {
        alert('Пожалуйста, выберите персонажа!');
        returnToMainMenu();
        return;
    }

    hideScreens();
    gameContainer.classList.remove('hidden');
    resetGame();

    // Показываем мобильное управление на мобильных устройствах
    if (isMobile) {
        console.log("Показываем мобильное управление");
        mobileControls.classList.remove('hidden');
        mobileControls.style.display = 'flex';
        mobileControls.style.visibility = 'visible';
        mobileControls.style.opacity = '1';
    }

    if (gameMode === 'solo') {
        teamScoreDisplay.classList.add('hidden');
        diamondCountDisplay.classList.add('hidden');
        initSoloMap();
        for (let i = 0; i < enemiesRemaining; i++) {
            createEnemy();
        }
    } else {
        teamScoreDisplay.classList.remove('hidden');
        diamondCountDisplay.classList.remove('hidden');
        initTeamMap();
        createBots();
        createInitialDiamond();
    }

    updateHUD();
    gameRunning = true;
    gameLoop();
}

// Создание ботов для режима 3 на 3
function createBots() {
    bots = [];

    for (let i = 0; i < 2; i++) {
        bots.push(createTeamBot('blue', i));
    }

    for (let i = 0; i < 3; i++) {
        bots.push(createTeamBot('red', i));
    }
}

// Создание бота
function createTeamBot(team, index) {
    return {
        id: `${team}-${Date.now()}-${index}`,
        x: team === 'blue' ? 100 + index * 200 : 100 + index * 200,
        y: team === 'blue' ? 100 : 500,
        radius: 15,
        health: 4000,
        damage: 1500,
        speed: 2,
        color: team === 'blue' ? '#2196f3' : '#f44336',
        team: team,
        type: 'bot',
        diamonds: 0,
        target: null,
        aiTimer: 0,
        lastShotTime: 0,
        shootCooldown: 0,
        inTree: false,
        isDead: false,
        respawnTimer: 0,
        aiState: 'collect',
        hasDiamond: false
    };
}

// Создание врага для одиночного режима
function createEnemy() {
    const winterColors = ['#ff4444', '#ff8c00', '#4a90e2', '#9c27b0', '#00bcd4'];
    const enemy = {
        x: Math.random() * (mapWidth - 100) + 50,
        y: Math.random() * (mapHeight - 100) + 50,
        radius: 15,
        health: 4000,
        damage: 2000,
        speed: 1,
        color: winterColors[Math.floor(Math.random() * winterColors.length)],
        type: 'enemy',
        inTree: false
    };
    enemies.push(enemy);
}

// Создание алмаза
function createDiamond(x = null, y = null) {
    let diamondX, diamondY;

    if (x && y) {
        diamondX = x;
        diamondY = y;
    } else {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        diamondX = diamondSpawner.x + Math.cos(angle) * distance;
        diamondY = diamondSpawner.y + Math.sin(angle) * distance;
    }

    diamonds.push({
        x: diamondX,
        y: diamondY,
        radius: 10,
        collected: false
    });
}

// Создание начального алмаза
function createInitialDiamond() {
    diamonds = [];
    createDiamond();
}

// Обработка нажатия клавиш для ПК
function handleKeyDown(e) {
    if (keys.hasOwnProperty(e.key)) {
        e.preventDefault();
        keys[e.key] = true;

        if (e.key === ' ' && player.shootCooldown <= 0 && !player.isDead) {
            shoot();
            player.shootCooldown = 10;
        }

        if (e.key === 'Shift' && player.superReady && !player.isDead) {
            superAttack();
        }
    }
}

// Обработка отпускания клавиш для ПК
function handleKeyUp(e) {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
}

// Проверка коллизии с препятствиями
function checkCollisionWithObstacles(x, y, radius) {
    for (const obstacle of obstacles) {
        let closestX = Math.max(obstacle.x, Math.min(x, obstacle.x + obstacle.width));
        let closestY = Math.max(obstacle.y, Math.min(y, obstacle.y + obstacle.height));

        let distanceX = x - closestX;
        let distanceY = y - closestY;
        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < radius) {
            return true;
        }
    }
    return false;
}

// Обработка движения игрока
function handleMovement() {
    if (player.isDead) {
        player.respawnTimer--;
        if (player.respawnTimer <= 0) {
            respawnPlayer();
        }
        return;
    }

    let dx = 0;
    let dy = 0;

    // Управление для ПК
    if (!isMobile) {
        if (keys.ArrowUp) dy = -player.speed;
        if (keys.ArrowDown) dy = player.speed;
        if (keys.ArrowLeft) dx = -player.speed;
        if (keys.ArrowRight) dx = player.speed;
    } else {
        // Управление для мобильных (джойстик)
        dx = player.moveX * player.speed;
        dy = player.moveY * player.speed;
    }

    if (dx !== 0 && dy !== 0) {
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        dx = (dx / magnitude) * player.speed;
        dy = (dy / magnitude) * player.speed;
    }

    let newX = player.x + dx;
    let newY = player.y + dy;

    // Проверка коллизии с препятствиями
    if (!checkCollisionWithObstacles(newX, newY, player.radius)) {
        player.x = Math.max(player.radius, Math.min(mapWidth - player.radius, newX));
        player.y = Math.max(player.radius, Math.min(mapHeight - player.radius, newY));
    }

    // Проверка нахождения в елке
    player.inTree = false;
    for (const tree of trees) {
        if (player.x > tree.x && player.x < tree.x + tree.width &&
            player.y > tree.y && player.y < tree.y + tree.height) {
            player.inTree = true;
            break;
        }
    }
}

// Движение врага с проверкой коллизий
function moveEnemy(enemy) {
    const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
    const newX = enemy.x + Math.cos(angle) * enemy.speed;
    const newY = enemy.y + Math.sin(angle) * enemy.speed;

    if (!checkCollisionWithObstacles(newX, newY, enemy.radius)) {
        enemy.x = Math.max(enemy.radius, Math.min(mapWidth - enemy.radius, newX));
        enemy.y = Math.max(enemy.radius, Math.min(mapHeight - enemy.radius, newY));
    } else {
        const randomAngle = Math.random() * Math.PI * 2;
        const altX = enemy.x + Math.cos(randomAngle) * enemy.speed;
        const altY = enemy.y + Math.sin(randomAngle) * enemy.speed;

        if (!checkCollisionWithObstacles(altX, altY, enemy.radius)) {
            enemy.x = Math.max(enemy.radius, Math.min(mapWidth - enemy.radius, altX));
            enemy.y = Math.max(enemy.radius, Math.min(mapHeight - enemy.radius, altY));
        }
    }

    enemy.inTree = false;
    for (const tree of trees) {
        if (enemy.x > tree.x && enemy.x < tree.x + tree.width &&
            enemy.y > tree.y && enemy.y < tree.y + tree.height) {
            enemy.inTree = true;
            break;
        }
    }
}

// Стрельба
function shoot() {
    if (player.isDead) return;

    playShootSound();

    switch (selectedCharacter) {
        case 'shegga':
            createWaveBullets();
            break;
        case 'mortak':
            createDoubleBullets();
            break;
        case 'bully':
            createQuadBullets();
            break;
        case 'scrap':
            createTripleBullets();
            break;
        case 'clancy':
            createQuadBullets();
            break;
    }
}

// Создание пули
function createBullet(angle, type = 'normal', team = null) {
    bullets.push({
        x: player.x,
        y: player.y,
        radius: 5,
        speed: 5,
        angle: angle,
        color: player.color,
        damage: player.damage,
        type: type,
        team: team || (gameMode === 'team' ? player.team : null)
    });
}

// Создание волновых пуль
function createWaveBullets() {
    const bulletCount = 5;
    const angleIncrement = 0.2;
    let startAngle = -angleIncrement * (bulletCount - 1) / 2;

    for (let i = 0; i < bulletCount; i++) {
        const angle = startAngle + i * angleIncrement;
        createBullet(angle);
    }
}

// Создание двойных пуль
function createDoubleBullets() {
    createBullet(-0.1);
    createBullet(0.1);
}

// Создание четырех пуль
function createQuadBullets() {
    createBullet(-0.2);
    createBullet(-0.1);
    createBullet(0.1);
    createBullet(0.2);
}

// Создание тройных пуль
function createTripleBullets() {
    createBullet(0);
    createBullet(-0.1);
    createBullet(0.1);
}

// Супер-атака
function superAttack() {
    if (!player.superReady || player.superActive) return;

    player.superActive = true;
    player.superReady = false;
    player.superCooldown = 300;

    playSuperSound();

    switch (selectedCharacter) {
        case 'shegga':
            for (let i = 0; i < 20; i++) {
                const angle = Math.PI * 2 * i / 20;
                createBullet(angle);
            }
            player.damage = 3000;
            setTimeout(() => { player.damage = 1500; }, 5000);
            break;

        case 'mortak':
            player.speed = 6;
            player.damage = 3000;
            setTimeout(() => {
                player.speed = 3;
                player.damage = 2000;
            }, 5000);
            break;

        case 'bully':
            for (let i = 0; i < 24; i++) {
                const angle = Math.PI * 2 * i / 24;
                createBullet(angle);
            }
            break;

        case 'scrap':
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    createTripleBullets();
                }, i * 200);
            }
            break;

        case 'clancy':
            for (let i = 0; i < 4; i++) {
                const angle = Math.PI * 2 * i / 4;
                createBullet(angle, 'super', player.team);
                createBullet(angle + 0.1, 'super', player.team);
                createBullet(angle - 0.1, 'super', player.team);
            }
            break;
    }

    setTimeout(() => {
        player.superActive = false;
    }, 3000);
}

// Обновление пуль
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.x += Math.cos(bullet.angle) * bullet.speed;
        bullet.y += Math.sin(bullet.angle) * bullet.speed;

        if (bullet.x < 0 || bullet.x > mapWidth || bullet.y < 0 || bullet.y > mapHeight) {
            bullets.splice(i, 1);
        }
    }

    if (player.shootCooldown > 0) player.shootCooldown--;
}

// Обновление врагов
function updateEnemies() {
    if (gameMode === 'solo') {
        enemies.forEach((enemy, index) => {
            moveEnemy(enemy);
        });

        enemiesRemainingDisplay.innerText = 'Бойцов осталось: ' + enemies.length;
    }
}

// Обновление ботов
function updateBots() {
    if (gameMode !== 'team') return;

    bots.forEach((bot, index) => {
        if (bot.isDead) {
            bot.respawnTimer--;
            if (bot.respawnTimer <= 0) {
                respawnBot(bot);
            }
            return;
        }

        bot.aiTimer++;

        bot.inTree = false;
        for (const tree of trees) {
            if (bot.x > tree.x && bot.x < tree.x + tree.width &&
                bot.y > tree.y && bot.y < tree.y + tree.height) {
                bot.inTree = true;
                break;
            }
        }

        if (bot.aiTimer > 60) {
            bot.aiTimer = 0;

            if (bot.diamonds > 0) {
                bot.aiState = 'retreat';
                bot.target = getTeamBase(bot.team);
                bot.hasDiamond = true;

                if (bot.inTree && Math.random() < 0.5) {
                } else {
                    bot.target = getTeamBase(bot.team);
                }
            } else {
                if (diamonds.length > 0 && Math.random() < 0.7) {
                    bot.aiState = 'collect';
                    bot.target = findClosestDiamond(bot);
                    bot.hasDiamond = false;
                } else {
                    bot.aiState = 'attack';
                    bot.target = findVisibleEnemy(bot);
                    bot.hasDiamond = false;
                }
            }
        }

        if (bot.target) {
            const angle = Math.atan2(bot.target.y - bot.y, bot.target.x - bot.x);
            const newX = bot.x + Math.cos(angle) * bot.speed;
            const newY = bot.y + Math.sin(angle) * bot.speed;

            if (!checkCollisionWithObstacles(newX, newY, bot.radius)) {
                bot.x = newX;
                bot.y = newY;
            }

            if (bot.aiState === 'attack' && bot.target && bot.shootCooldown <= 0) {
                createBotBullet(bot, angle);
                bot.shootCooldown = 40;
            }
        }

        bot.x = Math.max(bot.radius, Math.min(mapWidth - bot.radius, bot.x));
        bot.y = Math.max(bot.radius, Math.min(mapHeight - bot.radius, bot.y));

        if (bot.shootCooldown > 0) bot.shootCooldown--;
    });
}

// Поиск ближайшего алмаза
function findClosestDiamond(bot) {
    let closest = null;
    let minDist = Infinity;

    diamonds.forEach(diamond => {
        if (!diamond.collected) {
            const dist = Math.hypot(bot.x - diamond.x, bot.y - diamond.y);
            if (dist < minDist) {
                minDist = dist;
                closest = diamond;
            }
        }
    });

    return closest;
}

// Поиск видимого врага (учитывает елки)
function findVisibleEnemy(bot) {
    if (player.team !== bot.team && !player.inTree && !bot.inTree && !player.isDead) {
        const dist = Math.hypot(bot.x - player.x, bot.y - player.y);
        if (dist < 250) return player;
    }

    let visibleEnemies = [];
    bots.forEach(otherBot => {
        if (!otherBot.isDead && otherBot.team !== bot.team &&
            !otherBot.inTree && !bot.inTree) {
            const dist = Math.hypot(bot.x - otherBot.x, bot.y - otherBot.y);
            if (dist < 250) {
                visibleEnemies.push({ bot: otherBot, dist: dist });
            }
        }
    });

    if (visibleEnemies.length > 0) {
        visibleEnemies.sort((a, b) => a.dist - b.dist);
        return visibleEnemies[0].bot;
    }

    return null;
}

// Получение координат базы команды
function getTeamBase(team) {
    return {
        x: team === 'blue' ? 100 : mapWidth - 100,
        y: team === 'blue' ? 100 : mapHeight - 100
    };
}

// Создание пули бота
function createBotBullet(bot, angle) {
    bullets.push({
        x: bot.x,
        y: bot.y,
        radius: 5,
        speed: 5,
        angle: angle,
        damage: bot.damage,
        color: bot.color,
        type: 'bot',
        team: bot.team
    });
}

// Обновление алмазов
function updateDiamonds() {
    if (gameMode !== 'team') return;

    diamondSpawnTimer++;
    if (diamondSpawnTimer >= 300) {
        diamondSpawnTimer = 0;
        createDiamond();
    }

    let blueScore = player.team === 'blue' ? player.diamonds : 0;
    let redScore = player.team === 'red' ? player.diamonds : 0;

    bots.forEach(bot => {
        if (!bot.isDead) {
            if (bot.team === 'blue') blueScore += bot.diamonds;
            else redScore += bot.diamonds;
        }
    });

    blueTeamScore.textContent = blueScore;
    redTeamScore.textContent = redScore;

    if (blueScore >= 10) {
        if (player.team === 'blue') {
            player.trophies += 20;
            totalTrophies += 20;
            jadeCount += 20;
            updateJadeDisplay();
            updateTotalTrophiesDisplay();
        }
        winGame('Синяя команда победила!');
    } else if (redScore >= 10) {
        if (player.team === 'red') {
            player.trophies += 20;
            totalTrophies += 20;
            jadeCount += 20;
            updateJadeDisplay();
            updateTotalTrophiesDisplay();
        }
        loseGame('Красная команда победила!');
    }
}

// Обновление кулдауна супер-атаки
function updateSuperCooldown() {
    if (player.superCooldown > 0) {
        player.superCooldown--;
        const seconds = Math.ceil(player.superCooldown / 60);
        superCooldownDisplay.textContent = `Супер: ${seconds}с`;
        superCooldownDisplay.style.color = '#f44336';
    } else if (!player.superReady) {
        player.superReady = true;
        superCooldownDisplay.textContent = 'Супер готов!';
        superCooldownDisplay.style.color = '#4caf50';
    }
}

// Проверка столкновений
function checkCollisions() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];

        if (gameMode === 'solo') {
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                if (enemy.inTree) continue;

                const distance = Math.sqrt(Math.pow(bullet.x - enemy.x, 2) + Math.pow(bullet.y - enemy.y, 2));
                if (distance < bullet.radius + enemy.radius) {
                    enemy.health -= bullet.damage;
                    bullets.splice(i, 1);

                    if (enemy.health <= 0) {
                        enemies.splice(j, 1);
                        player.trophies += 10;
                        trophyCountDisplay.innerText = 'Трофеи: ' + player.trophies;

                        if (enemies.length <= 0) {
                            winGame('Все враги повержены!');
                        }
                    }
                    break;
                }
            }
        } else {
            for (let j = bots.length - 1; j >= 0; j--) {
                const bot = bots[j];
                if (bot.isDead || bot.inTree) continue;
                if (bullet.team === bot.team) continue;

                const distance = Math.sqrt(Math.pow(bullet.x - bot.x, 2) + Math.pow(bullet.y - bot.y, 2));
                if (distance < bullet.radius + bot.radius) {
                    bot.health -= bullet.damage;
                    bullets.splice(i, 1);

                    if (bot.health <= 0) {
                        bot.isDead = true;
                        bot.respawnTimer = 180;

                        if (bot.diamonds > 0) {
                            for (let k = 0; k < bot.diamonds; k++) {
                                createDiamond(bot.x + (Math.random() - 0.5) * 30,
                                    bot.y + (Math.random() - 0.5) * 30);
                            }
                            bot.diamonds = 0;
                        }

                        if (bullet.team === player.team) {
                            player.trophies += 5;
                            trophyCountDisplay.innerText = 'Трофеи: ' + player.trophies;
                        }
                    }
                    break;
                }
            }

            if (!player.isDead && !player.inTree && bullet.team && bullet.team !== player.team) {
                const distance = Math.sqrt(Math.pow(bullet.x - player.x, 2) + Math.pow(bullet.y - player.y, 2));
                if (distance < bullet.radius + player.radius) {
                    player.health -= bullet.damage / 100;
                    bullets.splice(i, 1);

                    playerHealthDisplay.innerText = 'Здоровье: ' + player.health.toFixed(0);

                    if (player.health <= 0) {
                        player.isDead = true;
                        player.respawnTimer = 180;

                        if (player.diamonds > 0) {
                            for (let k = 0; k < player.diamonds; k++) {
                                createDiamond(player.x + (Math.random() - 0.5) * 30,
                                    player.y + (Math.random() - 0.5) * 30);
                            }
                            player.diamonds = 0;
                            diamondsCollected.textContent = player.diamonds;
                        }
                        playerHealthDisplay.innerText = 'Возрождение: ' + Math.ceil(player.respawnTimer / 60) + 'с';
                    }
                }
            }
        }
    }

    if (gameMode === 'solo') {
        enemies.forEach((enemy, enemyIndex) => {
            const distance = Math.sqrt(Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2));
            if (distance < player.radius + enemy.radius) {
                player.health -= (enemy.damage / 100);
                playerHealthDisplay.innerText = 'Здоровье: ' + player.health.toFixed(0);

                if (player.health <= 0) {
                    loseGame('Вы проиграли!');
                }
            }
        });
    } else {
        if (!player.isDead) {
            diamonds.forEach((diamond, index) => {
                if (!diamond.collected) {
                    const playerDist = Math.sqrt(Math.pow(player.x - diamond.x, 2) + Math.pow(player.y - diamond.y, 2));
                    if (playerDist < player.radius + diamond.radius) {
                        diamond.collected = true;
                        player.diamonds++;
                        diamondsCollected.textContent = player.diamonds;
                        diamonds.splice(index, 1);
                        playDiamondSound();
                    }
                }
            });
        }

        bots.forEach(bot => {
            if (!bot.isDead && !bot.inTree) {
                diamonds.forEach((diamond, index) => {
                    if (!diamond.collected) {
                        const botDist = Math.sqrt(Math.pow(bot.x - diamond.x, 2) + Math.pow(bot.y - diamond.y, 2));
                        if (botDist < bot.radius + diamond.radius) {
                            diamond.collected = true;
                            bot.diamonds++;
                            diamonds.splice(index, 1);
                        }
                    }
                });
            }
        });
    }
}

// Возрождение бота
function respawnBot(bot) {
    bot.isDead = false;
    bot.health = 4000;
    bot.x = bot.team === 'blue' ? 100 : mapWidth - 100;
    bot.y = bot.team === 'blue' ? 100 : mapHeight - 100;
    bot.respawnTimer = 0;
    bot.diamonds = 0;
    bot.hasDiamond = false;
}

// Возрождение игрока
function respawnPlayer() {
    player.isDead = false;
    player.health = 4000;
    player.x = player.team === 'blue' ? 100 : mapWidth - 100;
    player.y = player.team === 'blue' ? 100 : mapHeight - 100;
    player.respawnTimer = 0;
    playerHealthDisplay.innerText = 'Здоровье: 4000';
}

// Инициализация карты для одиночного режима
function initSoloMap() {
    obstacles = [
        { x: mapWidth * 0.2, y: mapHeight * 0.3, width: 100, height: 20 },
        { x: mapWidth * 0.5, y: mapHeight * 0.4, width: 50, height: 80 },
        { x: mapWidth * 0.7, y: mapHeight * 0.25, width: 80, height: 30 }
    ];

    // Елки вместо кустов
    trees = [
        { x: mapWidth * 0.1, y: mapHeight * 0.3, width: 60, height: 80 },
        { x: mapWidth * 0.3, y: mapHeight * 0.6, width: 60, height: 80 },
        { x: mapWidth * 0.5, y: mapHeight * 0.3, width: 60, height: 80 },
        { x: mapWidth * 0.7, y: mapHeight * 0.6, width: 60, height: 80 },
        { x: mapWidth * 0.4, y: mapHeight * 0.5, width: 80, height: 100 }
    ];

    diamonds = [];
}

// Инициализация карты для командного режима
function initTeamMap() {
    obstacles = [
        { x: mapWidth * 0.25, y: mapHeight * 0.25, width: 80, height: 20 },
        { x: mapWidth * 0.6, y: mapHeight * 0.25, width: 80, height: 20 },
        { x: mapWidth * 0.25, y: mapHeight * 0.75, width: 80, height: 20 },
        { x: mapWidth * 0.6, y: mapHeight * 0.75, width: 80, height: 20 },
        { x: mapWidth * 0.4, y: mapHeight * 0.5, width: 100, height: 30 }
    ];

    trees = [
        { x: mapWidth * 0.1, y: mapHeight * 0.3, width: 60, height: 80 },
        { x: mapWidth * 0.8, y: mapHeight * 0.3, width: 60, height: 80 },
        { x: mapWidth * 0.1, y: mapHeight * 0.7, width: 60, height: 80 },
        { x: mapWidth * 0.8, y: mapHeight * 0.7, width: 60, height: 80 },
        { x: mapWidth * 0.4, y: mapHeight * 0.3, width: 80, height: 100 },
        { x: mapWidth * 0.4, y: mapHeight * 0.7, width: 80, height: 100 },
        { x: mapWidth * 0.3, y: mapHeight * 0.5, width: 70, height: 90 },
        { x: mapWidth * 0.6, y: mapHeight * 0.5, width: 70, height: 90 }
    ];
}

// Победа в игре
function winGame(message = 'Вы победили!') {
    gameRunning = false;

    totalTrophies += player.trophies;
    jadeCount += player.trophies;

    winMessage.textContent = `${message}\nТрофеев получено: +${player.trophies}\nНефритов получено: +${player.trophies}`;

    updateTotalTrophiesDisplay();
    updateJadeDisplay();
    saveGameData();

    hideScreens();
    winScreen.classList.remove('hidden');

    // Скрываем мобильное управление
    if (isMobile) {
        mobileControls.classList.add('hidden');
    }

    // Останавливаем музыку игры
    if (soundEnabled) {
        menuMusic.pause();
        menuMusic.currentTime = 0;
    }
}

// Поражение в игре
function loseGame(message = 'Вы проиграли!') {
    gameRunning = false;
    loseMessage.textContent = message;

    hideScreens();
    loseScreen.classList.remove('hidden');

    // Скрываем мобильное управление
    if (isMobile) {
        mobileControls.classList.add('hidden');
    }

    // Останавливаем музыку игры
    if (soundEnabled) {
        menuMusic.pause();
        menuMusic.currentTime = 0;
    }
}

// Сброс игры (только игрового состояния)
function resetGame() {
    player.x = 100;
    player.y = 100;
    player.health = 4000;
    player.speed = 3;
    player.superActive = false;
    player.superReady = true;
    player.superCooldown = 0;
    player.trophies = 0;
    player.diamonds = 0;
    player.barrels = [];
    player.shootCooldown = 0;
    player.isDead = false;
    player.respawnTimer = 0;
    player.inTree = false;
    player.moveX = 0;
    player.moveY = 0;

    enemies = [];
    bots = [];
    bullets = [];
    powerUps = [];
    obstacles = [];
    trees = [];
    diamonds = [];

    playerHealthDisplay.innerText = 'Здоровье: ' + player.health;
    trophyCountDisplay.innerText = 'Трофеи: ' + player.trophies;
    diamondsCollected.textContent = player.diamonds;
    superCooldownDisplay.textContent = 'Супер готов!';
    superCooldownDisplay.style.color = '#4caf50';

    enemiesRemaining = 9;
    diamondSpawnTimer = 0;
}

// Скрыть все экраны
function hideScreens() {
    splashScreen.classList.add('hidden');
    mainMenu.classList.add('hidden');
    gameContainer.classList.add('hidden');
    winScreen.classList.add('hidden');
    loseScreen.classList.add('hidden');
    shopMenu.classList.add('hidden');
}

// Обновление HUD
function updateHUD() {
    playerHealthDisplay.textContent = '❤️ Здоровье: ' + Math.floor(player.health);
    trophyCountDisplay.textContent = '🏆 Трофеи: ' + player.trophies;
    diamondsCollected.textContent = player.diamonds;
}

// Обновление отображения трофеев
function updateTotalTrophiesDisplay() {
    trophiesCountDisplay.innerText = totalTrophies;
}

// Обновление магазина - ИСПРАВЛЕННАЯ ВЕРСИЯ
function updateShopDisplay() {
    // Создаем содержимое магазина
    shopMenu.innerHTML = `
        <div class="shop-container">
            <h2>🛒 Магазин персонажей</h2>
            <div id="jade-count" class="jade-display">
                💎 Нефриты: <span id="jade-count-value">${jadeCount}</span>
            </div>
            
            <div class="shop-item">
                <div class="shop-item-header">
                    <h3>🔥 Клэнси</h3>
                    <div class="shop-character-image">
                        <img src="${CHARACTER_IMAGES.clancy.shopLocked}" 
                             id="shop-clancy-img" 
                             alt="Клэнси"
                             style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid ${isClancyUnlocked ? '#4CAF50' : '#FF9800'};">
                    </div>
                </div>
                <div class="shop-item-details">
                    <p><strong>Мощный боец с оружием на 4 патрона</strong></p>
                    <p>⚔️ Урон: 1800</p>
                    <p>⚡ Особый навык: 4 направленных выстрела</p>
                    <p>🛡️ Супер-атака: Шторм пуль</p>
                    <div class="shop-price">
                        💎 Цена: <span class="price-value">2500</span> нефритов
                    </div>
                </div>
                <div class="shop-item-actions">
                    <button id="buy-clancy-btn" class="shop-item-btn" ${isClancyUnlocked || jadeCount < 2500 ? 'disabled' : ''}>
                        ${isClancyUnlocked ? '✓ Куплено' : `Купить за 2500💎`}
                    </button>
                    <div id="clancy-status" class="${isClancyUnlocked ? 'status-unlocked' : 'status-locked'}">
                        ${isClancyUnlocked ? '✓ Разблокирован' : '🔒 Заблокирован'}
                    </div>
                </div>
            </div>
            
            <div class="shop-footer">
                <p>Нефриты можно получить, побеждая в боях!</p>
                <button id="close-shop-btn" class="shop-close-btn">Вернуться в меню</button>
            </div>
        </div>
    `;

    // Добавляем обработчик для кнопки покупки
    const buyClancyBtn = document.getElementById('buy-clancy-btn');
    if (buyClancyBtn && !isClancyUnlocked && jadeCount >= 2500) {
        buyClancyBtn.addEventListener('click', buyClancy);
    }

    // Добавляем обработчик для кнопки закрытия
    const closeShopBtn = document.getElementById('close-shop-btn');
    if (closeShopBtn) {
        closeShopBtn.addEventListener('click', () => {
            shopMenu.classList.add('hidden');
            mainMenu.classList.remove('hidden');
            saveGameData();
        });
    }
}

// Обновление кнопок персонажей - ИСПРАВЛЕННАЯ ВЕРСИЯ
function updateCharacterButtons() {
    if (clancyBtn && clancyImg) {
        if (isClancyUnlocked) {
            clancyBtn.disabled = false;
            clancyBtn.innerHTML = 'Клэнси';
            // Используем тот же URL изображения, но разблокированную версию
            clancyImg.src = CHARACTER_IMAGES.clancy.unlocked;
            clancyImg.alt = 'Клэнси (разблокирован)';
        } else {
            clancyBtn.disabled = true;
            clancyBtn.innerHTML = 'Клэнси 🔒';
            // Используем URL изображения для заблокированного состояния
            clancyImg.src = CHARACTER_IMAGES.clancy.locked;
            clancyImg.alt = 'Клэнси (заблокирован)';
        }
    }
}

// Покупка Клэнси - ИСПРАВЛЕННАЯ ВЕРСИЯ
function buyClancy() {
    if (isClancyUnlocked) {
        alert('Клэнси уже куплен!');
        return;
    }

    if (jadeCount >= SHOP_PRICES.clancy) {
        jadeCount -= SHOP_PRICES.clancy;
        isClancyUnlocked = true;

        // Обновляем интерфейс
        updateShopDisplay();
        updateCharacterButtons();
        updateJadeDisplay();
        saveGameData();

        alert('🎉 Поздравляем! Клэнси разблокирован!\nТеперь вы можете выбрать его в меню выбора персонажа.');
    } else {
        alert(`Недостаточно нефритов! Нужно 2500 нефритов.\nУ вас: ${jadeCount} нефритов.\nПобеждайте в боях, чтобы получить больше нефритов!`);
    }
}

// Главный игровой цикл
function gameLoop() {
    if (!gameRunning) return;

    handleMovement();
    updateBullets();
    updateEnemies();
    updateBots();
    updateDiamonds();
    updateSuperCooldown();
    checkCollisions();

    draw();

    requestAnimationFrame(gameLoop);
}

// Отрисовка игры
function draw() {
    ctx.clearRect(0, 0, mapWidth, mapHeight);

    drawMap();
    drawObstacles();
    drawTrees();

    if (gameMode === 'team') {
        drawDiamondSpawner();
        drawDiamonds();
    }

    if (gameMode === 'solo') {
        enemies.forEach(enemy => drawCharacter(enemy));
    } else {
        bots.filter(bot => !bot.isDead).forEach(bot => drawCharacter(bot));
        bots.filter(bot => bot.isDead).forEach(bot => drawDeadCharacter(bot));
    }

    bullets.forEach(bullet => drawBullet(bullet));

    if (!player.isDead) {
        drawCharacter(player);

        if (player.inTree) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(player.x, player.y, player.radius + 5, 0, Math.PI * 2);
            ctx.fill();
        }
    } else {
        drawDeadCharacter(player);
    }
}

// Отрисовка карты
function drawMap() {
    if (gameMode === 'solo') {
        const gradient = ctx.createLinearGradient(0, 0, 0, mapHeight);
        gradient.addColorStop(0, '#e6f7ff');
        gradient.addColorStop(1, '#cceeff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, mapWidth, mapHeight);

        // Ледяные участки
        ctx.fillStyle = 'rgba(173, 216, 230, 0.5)';
        ctx.fillRect(mapWidth * 0.1, mapHeight * 0.2, 150, 50);
        ctx.fillRect(mapWidth * 0.6, mapHeight * 0.5, 100, 70);

        // Снежные сугробы
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(mapWidth * 0.3, mapHeight * 0.1, 80, 80);
        ctx.fillRect(mapWidth * 0.7, mapHeight * 0.6, 70, 60);
    } else {
        const gradient = ctx.createLinearGradient(0, 0, 0, mapHeight);
        gradient.addColorStop(0, '#e6f7ff');
        gradient.addColorStop(1, '#cceeff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, mapWidth, mapHeight);

        ctx.strokeStyle = 'rgba(100, 100, 255, 0.3)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, mapHeight / 2);
        ctx.lineTo(mapWidth, mapHeight / 2);
        ctx.stroke();

        // Базы команд
        ctx.fillStyle = 'rgba(33, 150, 243, 0.2)';
        ctx.fillRect(50, 50, 100, 100);

        ctx.fillStyle = 'rgba(244, 67, 54, 0.2)';
        ctx.fillRect(mapWidth - 150, mapHeight - 150, 100, 100);
    }
}

// Отрисовка препятствий
function drawObstacles() {
    obstacles.forEach(obstacle => {
        // Ледяные блоки
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        ctx.fillStyle = '#B0E0E6';
        ctx.fillRect(obstacle.x + 2, obstacle.y + 2, obstacle.width - 4, obstacle.height - 4);

        // Блеск на льду
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(obstacle.x + 5, obstacle.y + 5, 10, 5);
        ctx.fillRect(obstacle.x + obstacle.width - 15, obstacle.y + obstacle.height - 10, 8, 8);
    });
}

// Отрисовка елок
function drawTrees() {
    trees.forEach(tree => {
        // Ствол
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(tree.x + tree.width/2 - 10, tree.y + tree.height - 20, 20, 20);

        // Крона (треугольники)
        ctx.fillStyle = '#228B22';
        // Нижний треугольник
        ctx.beginPath();
        ctx.moveTo(tree.x + tree.width/2, tree.y + tree.height - 40);
        ctx.lineTo(tree.x + tree.width/2 - 25, tree.y + tree.height - 10);
        ctx.lineTo(tree.x + tree.width/2 + 25, tree.y + tree.height - 10);
        ctx.closePath();
        ctx.fill();

        // Средний треугольник
        ctx.fillStyle = '#2E8B57';
        ctx.beginPath();
        ctx.moveTo(tree.x + tree.width/2, tree.y + tree.height - 60);
        ctx.lineTo(tree.x + tree.width/2 - 20, tree.y + tree.height - 30);
        ctx.lineTo(tree.x + tree.width/2 + 20, tree.y + tree.height - 30);
        ctx.closePath();
        ctx.fill();

        // Верхний треугольник
        ctx.fillStyle = '#3CB371';
        ctx.beginPath();
        ctx.moveTo(tree.x + tree.width/2, tree.y + tree.height - 80);
        ctx.lineTo(tree.x + tree.width/2 - 15, tree.y + tree.height - 50);
        ctx.lineTo(tree.x + tree.width/2 + 15, tree.y + tree.height - 50);
        ctx.closePath();
        ctx.fill();

        // Снег на елке
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(tree.x + tree.width/2 - 10, tree.y + tree.height - 60, 3, 0, Math.PI * 2);
        ctx.arc(tree.x + tree.width/2 + 10, tree.y + tree.height - 40, 3, 0, Math.PI * 2);
        ctx.arc(tree.x + tree.width/2, tree.y + tree.height - 20, 3, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Отрисовка источника алмазов
function drawDiamondSpawner() {
    ctx.fillStyle = '#6a1b9a';
    ctx.beginPath();
    ctx.arc(diamondSpawner.x, diamondSpawner.y, diamondSpawner.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#8e24aa';
    ctx.beginPath();
    ctx.arc(diamondSpawner.x, diamondSpawner.y, diamondSpawner.radius - 5, 0, Math.PI * 2);
    ctx.fill();
}

// Отрисовка алмазов
function drawDiamonds() {
    diamonds.forEach(diamond => {
        if (!diamond.collected) {
            // Ледяные алмазы
            ctx.fillStyle = '#00bcd4';
            ctx.beginPath();
            ctx.arc(diamond.x, diamond.y, diamond.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#0097a7';
            ctx.beginPath();
            ctx.arc(diamond.x, diamond.y, diamond.radius - 3, 0, Math.PI * 2);
            ctx.fill();

            // Блеск
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(diamond.x - 3, diamond.y - 3, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// Отрисовка персонажа
function drawCharacter(character) {
    // Основной круг
    ctx.beginPath();
    ctx.arc(character.x, character.y, character.radius, 0, Math.PI * 2);
    ctx.fillStyle = character.color;
    ctx.fill();

    // Обводка для ботов
    if (character.type === 'bot') {
        ctx.strokeStyle = character.team === 'blue' ? '#0d47a1' : '#b71c1c';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Снег на голове персонажей в зимнем режиме
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(character.x, character.y - character.radius, 4, 0, Math.PI * 2);
    ctx.fill();

    if (character.diamonds > 0) {
        ctx.fillStyle = '#00bcd4';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`💎${character.diamonds}`, character.x, character.y - character.radius - 10);
    }

    if (character === player) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(playerName || 'Игрок', character.x, character.y + character.radius + 20);
    }
}

// Отрисовка мертвого персонажа
function drawDeadCharacter(character) {
    // Ледяная глыба вместо трупа
    ctx.fillStyle = 'rgba(100, 149, 237, 0.7)';
    ctx.beginPath();
    ctx.arc(character.x, character.y, character.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(70, 130, 180, 0.9)';
    ctx.beginPath();
    ctx.arc(character.x, character.y, character.radius - 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(Math.ceil(character.respawnTimer / 60) + 'с', character.x, character.y + 5);
}

// Отрисовка пули
function drawBullet(bullet) {
    // Ледяные пули
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);

    if (bullet.type === 'super') {
        ctx.fillStyle = '#ff9800';
    } else if (bullet.team) {
        ctx.fillStyle = bullet.team === 'blue' ? '#2196f3' : '#f44336';
    } else {
        ctx.fillStyle = bullet.color;
    }

    ctx.fill();

    // Блестящий эффект
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(bullet.x - 2, bullet.y - 2, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.closePath();
}

// Запуск игры при загрузке страницы
window.onload = init;

// Предотвращаем стандартное поведение браузера для мобильных
document.addEventListener('touchstart', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'A') {
        return;
    }
    if (gameRunning) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (gameRunning) {
        e.preventDefault();
    }
}, { passive: false });

// Обработка ухода со страницы
window.addEventListener('beforeunload', () => {
    saveGameData();
});

// Обработка возврата на страницу
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        loadGameData();
    }
});

console.log("Игра Brawl Balls загружена и готова!");