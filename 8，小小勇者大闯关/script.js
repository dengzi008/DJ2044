// 游戏状态管理
const gameState = {
    currentHero: 'girl',
    currentLevel: 1,
    completedLevels: [],
    soundEnabled: true,
    startTime: null,
    endTime: null,
    playerName: '小勇者'
};

// 鼓励语音数组
const encouragements = [
    '你真聪明！', '太棒了！', '继续加油！', '真厉害！', 
    '做得好！', '加油加油！', '你真棒！', '再加把劲！'
];

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    loadProgress();
    initStars();
    setupEventListeners();
    checkParentMode();
});

// 初始化游戏
function initGame() {
    // 勇者选择
    document.querySelectorAll('.hero-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.hero-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            gameState.currentHero = option.dataset.hero;
            gameState.playerName = option.dataset.hero === 'boy' ? '小勇士' : '小勇者';
        });
    });

    // 开始按钮
    document.getElementById('startBtn').addEventListener('click', () => {
        startGame();
    });

    // 音效开关
    document.getElementById('soundToggle').addEventListener('click', toggleSound);

    // 返回首页
    document.getElementById('homeBtn').addEventListener('click', () => {
        showScreen('homeScreen');
        document.getElementById('progressBar').classList.add('hidden');
        document.getElementById('homeBtn').classList.add('hidden');
    });

    // 标题长按进入家长模式
    let longPressTimer;
    const title = document.getElementById('titleLongPress');
    title.addEventListener('mousedown', () => {
        longPressTimer = setTimeout(() => {
            showParentMode();
        }, 3000);
    });
    title.addEventListener('mouseup', () => clearTimeout(longPressTimer));
    title.addEventListener('mouseleave', () => clearTimeout(longPressTimer));

    // 证书保存和分享
    document.getElementById('saveCertBtn').addEventListener('click', saveCertificate);
    document.getElementById('shareCertBtn').addEventListener('click', shareCertificate);
    document.getElementById('restartBtn').addEventListener('click', restartGame);
}

// 星空粒子背景
function initStars() {
    const canvas = document.getElementById('starsCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const stars = [];
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.2,
            opacity: Math.random()
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
            
            star.y += star.speed;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
            
            star.opacity += Math.sin(Date.now() * 0.001 + star.x) * 0.02;
            star.opacity = Math.max(0.3, Math.min(1, star.opacity));
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// 设置事件监听
function setupEventListeners() {
    // 防止右键菜单
    document.addEventListener('contextmenu', e => e.preventDefault());
}

// 开始游戏
function startGame() {
    gameState.startTime = new Date().toLocaleString('zh-CN');
    showScreen('gameScreen');
    document.getElementById('progressBar').classList.remove('hidden');
    document.getElementById('homeBtn').classList.remove('hidden');
    updateProgress();
    loadLevel(gameState.currentLevel);
}

// 加载关卡
function loadLevel(level) {
    const container = document.getElementById('gameContainer');
    container.innerHTML = '';
    
    switch(level) {
        case 1: loadLevel1(); break;
        case 2: loadLevel2(); break;
        case 3: loadLevel3(); break;
        case 4: loadLevel4(); break;
        case 5: loadLevel5(); break;
        case 6: loadLevel6(); break;
        case 7: loadLevel7(); break;
        case 8: loadLevel8(); break;
    }
}

// 关卡1：找不同
function loadLevel1() {
    const container = document.getElementById('gameContainer');
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    let differentEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    while (differentEmoji === randomEmoji) {
        differentEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    }
    
    const differentIndex = Math.floor(Math.random() * 5);
    
    container.innerHTML = `
        <h2 class="game-title">第1关：找不同 👀</h2>
        <p class="game-instruction">找出那个不一样的！</p>
        <div class="difference-game">
            ${Array.from({length: 5}, (_, i) => `
                <div class="difference-item" data-index="${i}" onclick="checkDifference(${i}, ${differentIndex})">
                    ${i === differentIndex ? differentEmoji : randomEmoji}
                </div>
            `).join('')}
        </div>
    `;
}

window.checkDifference = function(selected, correct) {
    const items = document.querySelectorAll('.difference-item');
    if (selected === correct) {
        items[selected].style.borderColor = 'gold';
        items[selected].style.boxShadow = '0 0 30px gold';
        setTimeout(() => {
            levelComplete();
            playSound('success');
        }, 800);
    } else {
        items[selected].style.borderColor = 'red';
        items[selected].style.animation = 'shake 0.5s';
        playSound('fail');
        setTimeout(() => {
            items[selected].style.borderColor = 'transparent';
            items[selected].style.animation = '';
        }, 500);
    }
};

// 关卡2：数学加减法
function loadLevel2() {
    const container = document.getElementById('gameContainer');
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * num1) + 1;
    const operator = Math.random() > 0.5 ? '+' : '-';
    const correct = operator === '+' ? num1 + num2 : num1 - num2;
    
    const options = [correct];
    while (options.length < 4) {
        const wrong = correct + Math.floor(Math.random() * 10) - 5;
        if (wrong !== correct && wrong >= 0 && !options.includes(wrong)) {
            options.push(wrong);
        }
    }
    options.sort(() => Math.random() - 0.5);
    
    const emoji = ['🐶', '🐱', '🐭', '🐹', '🐰'][Math.floor(Math.random() * 5)];
    
    container.innerHTML = `
        <h2 class="game-title">第2关：数学挑战 🔢</h2>
        <p class="game-instruction">${emoji} 来帮小动物算算吧！</p>
        <div class="math-game">
            <div class="math-question">
                <span class="math-number">${num1}</span>
                <span class="math-operator">${operator}</span>
                <span class="math-number">${num2}</span>
                <span class="math-operator">=</span>
                <span class="math-number">?</span>
            </div>
            <div class="math-options">
                ${options.map((opt, i) => `
                    <div class="math-option" onclick="checkMath(${opt}, ${correct}, this)">
                        ${opt}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    window.checkMath = function(selected, correct, element) {
        if (selected === correct) {
            levelComplete();
            playSound('success');
        } else {
            playSound('fail');
            if (element) {
                element.style.background = 'red';
                setTimeout(() => {
                    element.style.background = 'white';
                }, 500);
            }
        }
    };
}

// 关卡3：拼图
function loadLevel3() {
    const container = document.getElementById('gameContainer');
    const size = 3; // 3x3拼图
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨'];
    const shuffled = [...emojis].sort(() => Math.random() - 0.5);
    
    let pieceIndex = 0;
    
    container.innerHTML = `
        <h2 class="game-title">第3关：拼图挑战 🧩</h2>
        <p class="game-instruction">把拼图拖到正确的位置！</p>
        <div class="puzzle-game">
            <div class="puzzle-container" id="puzzleContainer" style="grid-template-columns: repeat(${size}, 100px);">
                ${Array.from({length: size * size}, (_, i) => {
                    const row = Math.floor(i / size);
                    const col = i % size;
                    const correctIndex = row * size + col;
                    return `
                        <div class="puzzle-piece" 
                             data-correct="${correctIndex}"
                             data-current="${pieceIndex}"
                             style="width: 100px; height: 100px;"
                             draggable="true">
                            ${shuffled[pieceIndex++]}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    initPuzzleDrag();
}

function initPuzzleDrag() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    let draggedElement = null;
    
    pieces.forEach(piece => {
        piece.addEventListener('dragstart', (e) => {
            draggedElement = piece;
            e.dataTransfer.effectAllowed = 'move';
            piece.style.opacity = '0.5';
        });
        
        piece.addEventListener('dragend', () => {
            piece.style.opacity = '1';
        });
        
        piece.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        piece.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedElement !== piece) {
                const tempEmoji = draggedElement.textContent;
                const tempCurrent = draggedElement.dataset.current;
                
                draggedElement.textContent = piece.textContent;
                draggedElement.dataset.current = piece.dataset.current;
                
                piece.textContent = tempEmoji;
                piece.dataset.current = tempCurrent;
                
                checkPuzzleComplete();
            }
        });
    });
}

function checkPuzzleComplete() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    let allCorrect = true;
    
    pieces.forEach(piece => {
        const correct = parseInt(piece.dataset.correct);
        const current = parseInt(piece.dataset.current);
        if (correct === current) {
            piece.classList.add('correct');
        } else {
            piece.classList.remove('correct');
            allCorrect = false;
        }
    });
    
    if (allCorrect) {
        setTimeout(() => {
            levelComplete();
            playSound('success');
        }, 500);
    }
}

// 关卡4：颜色分类
function loadLevel4() {
    const container = document.getElementById('gameContainer');
    const colors = [
        {name: '红', color: '#FF6B9D', emoji: '🔴'},
        {name: '蓝', color: '#4ECDC4', emoji: '🔵'},
        {name: '黄', color: '#FFE66D', emoji: '🟡'},
        {name: '绿', color: '#95E1D3', emoji: '🟢'}
    ];
    
    const balls = [];
    colors.forEach(color => {
        balls.push(color, color, color); // 每种颜色3个球
    });
    balls.sort(() => Math.random() - 0.5);
    
    container.innerHTML = `
        <h2 class="game-title">第4关：颜色分类 🌈</h2>
        <p class="game-instruction">把小球拖到相同颜色的罐子里！</p>
        <div class="color-game">
            <div class="color-balls" id="colorBalls">
                ${balls.map((ball, i) => `
                    <div class="color-ball" 
                         data-color="${ball.color}" 
                         data-name="${ball.name}"
                         style="background: ${ball.color};"
                         draggable="true">
                        ${ball.emoji}
                    </div>
                `).join('')}
            </div>
            <div class="color-jars">
                ${colors.map(jar => `
                    <div class="color-jar" 
                         data-color="${jar.color}"
                         style="background: ${jar.color}; opacity: 0.3;">
                        <div class="color-jar-label">${jar.name}色</div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div id="colorScore" style="font-size: 1.5rem; margin-top: 30px;">已完成: 0 / ${balls.length}</div>
    `;
    
    initColorDrag();
}

function initColorDrag() {
    const balls = document.querySelectorAll('.color-ball');
    const jars = document.querySelectorAll('.color-jar');
    let score = 0;
    const totalBalls = balls.length;
    
    balls.forEach(ball => {
        ball.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', ball.dataset.color);
            ball.classList.add('dragging');
        });
        
        ball.addEventListener('dragend', () => {
            ball.classList.remove('dragging');
        });
    });
    
    jars.forEach(jar => {
        jar.addEventListener('dragover', (e) => {
            e.preventDefault();
            jar.classList.add('active');
        });
        
        jar.addEventListener('dragleave', () => {
            jar.classList.remove('active');
        });
        
        jar.addEventListener('drop', (e) => {
            e.preventDefault();
            jar.classList.remove('active');
            const ballColor = e.dataTransfer.getData('text/plain');
            
            if (ballColor === jar.dataset.color) {
                const ball = Array.from(balls).find(b => 
                    b.dataset.color === ballColor && !b.style.display
                );
                if (ball) {
                    ball.style.display = 'none';
                    score++;
                    document.getElementById('colorScore').textContent = 
                        `已完成: ${score} / ${totalBalls}`;
                    playSound('success');
                    
                    if (score === totalBalls) {
                        setTimeout(() => {
                            levelComplete();
                            playSound('success');
                        }, 500);
                    }
                }
            } else {
                playSound('fail');
            }
        });
    });
}

// 关卡5：记忆翻牌
function loadLevel5() {
    const container = document.getElementById('gameContainer');
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    let flippedCards = [];
    let matchedPairs = 0;
    
    container.innerHTML = `
        <h2 class="game-title">第5关：记忆翻牌 🃏</h2>
        <p class="game-instruction">找到相同的两张卡片！</p>
        <div class="memory-game" id="memoryGame">
            ${cards.map((emoji, i) => `
                <div class="memory-card" data-index="${i}" data-emoji="${emoji}" onclick="flipMemoryCard(${i}, '${emoji}')">
                    ❓
                </div>
            `).join('')}
        </div>
    `;
    
    window.flippedMemoryCards = [];
    window.matchedPairs = 0;
    
    window.flipMemoryCard = function(index, emoji) {
        const card = document.querySelector(`.memory-card[data-index="${index}"]`);
        if (card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }
        
        card.classList.add('flipped');
        card.textContent = emoji;
        playSound('click');
        
        window.flippedMemoryCards.push({index, emoji, card});
        
        if (window.flippedMemoryCards.length === 2) {
            const [first, second] = window.flippedMemoryCards;
            if (first.emoji === second.emoji) {
                setTimeout(() => {
                    first.card.classList.add('matched');
                    second.card.classList.add('matched');
                    window.flippedMemoryCards = [];
                    window.matchedPairs++;
                    playSound('success');
                    
                    if (window.matchedPairs === emojis.length) {
                        setTimeout(() => levelComplete(), 500);
                    }
                }, 500);
            } else {
                setTimeout(() => {
                    first.card.classList.remove('flipped');
                    first.card.textContent = '❓';
                    second.card.classList.remove('flipped');
                    second.card.textContent = '❓';
                    window.flippedMemoryCards = [];
                }, 1000);
            }
        }
    };
}

// 关卡6：连线题
function loadLevel6() {
    const container = document.getElementById('gameContainer');
    const pairs = [
        {left: '🐶', right: '🦴', name: '骨头'},
        {left: '🐱', right: '🐟', name: '鱼'},
        {left: '🐰', right: '🥕', name: '胡萝卜'},
        {left: '🐻', right: '🍯', name: '蜂蜜'}
    ];
    
    const shuffledPairs = [...pairs].sort(() => Math.random() - 0.5);
    const leftItems = shuffledPairs.map(p => p.left).sort(() => Math.random() - 0.5);
    const rightItems = shuffledPairs.map(p => p.right).sort(() => Math.random() - 0.5);
    
    container.innerHTML = `
        <h2 class="game-title">第6关：连线题 🔗</h2>
        <p class="game-instruction">把动物和它的食物连起来！</p>
        <div class="connect-game" style="position: relative;">
            <svg id="connectSvg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;"></svg>
            <div class="connect-items" style="position: relative; z-index: 2;">
                ${leftItems.map((item, i) => `
                    <div class="connect-item" data-side="left" data-emoji="${item}" data-index="${i}" onclick="selectConnectItem('left', ${i}, '${item}')">
                        ${item}
                    </div>
                `).join('')}
            </div>
            <div class="connect-items" style="margin-top: 200px; position: relative; z-index: 2;">
                ${rightItems.map((item, i) => `
                    <div class="connect-item" data-side="right" data-emoji="${item}" data-index="${i}" onclick="selectConnectItem('right', ${i}, '${item}')">
                        ${item}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    window.connectState = {
        left: null,
        right: null,
        pairs: shuffledPairs,
        completed: [],
        leftItems: leftItems,
        rightItems: rightItems
    };
    
    window.selectConnectItem = function(side, index, emoji) {
        const item = document.querySelector(`.connect-item[data-side="${side}"][data-index="${index}"]`);
        
        if (side === 'left') {
            if (window.connectState.left === index) {
                window.connectState.left = null;
                item.classList.remove('selected');
            } else {
                document.querySelectorAll('.connect-item[data-side="left"]').forEach(i => i.classList.remove('selected'));
                window.connectState.left = index;
                item.classList.add('selected');
            }
            window.connectState.right = null;
            document.querySelectorAll('.connect-item[data-side="right"]').forEach(i => i.classList.remove('selected'));
        } else {
            if (window.connectState.right === index) {
                window.connectState.right = null;
                item.classList.remove('selected');
            } else {
                if (window.connectState.left !== null) {
                    window.connectState.right = index;
                    item.classList.add('selected');
                    checkConnection();
                }
            }
        }
    };
    
    window.checkConnection = function() {
        const leftEmoji = window.connectState.leftItems[window.connectState.left];
        const rightEmoji = window.connectState.rightItems[window.connectState.right];
        
        const pair = window.connectState.pairs.find(p => p.left === leftEmoji && p.right === rightEmoji);
        
        if (pair && !window.connectState.completed.includes(pair)) {
            window.connectState.completed.push(pair);
            const leftEl = document.querySelector(`.connect-item[data-side="left"][data-index="${window.connectState.left}"]`);
            const rightEl = document.querySelector(`.connect-item[data-side="right"][data-index="${window.connectState.right}"]`);
            
            leftEl.style.opacity = '0.5';
            leftEl.style.pointerEvents = 'none';
            rightEl.style.opacity = '0.5';
            rightEl.style.pointerEvents = 'none';
            
            drawConnection(leftEl, rightEl);
            playSound('success');
            
            if (window.connectState.completed.length === window.connectState.pairs.length) {
                setTimeout(() => levelComplete(), 500);
            }
        } else {
            playSound('fail');
        }
        
        window.connectState.left = null;
        window.connectState.right = null;
        document.querySelectorAll('.connect-item').forEach(i => i.classList.remove('selected'));
    };
    
    window.drawConnection = function(leftEl, rightEl) {
        const svg = document.getElementById('connectSvg');
        const connectGame = svg.parentElement;
        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();
        const gameRect = connectGame.getBoundingClientRect();
        
        // 设置SVG尺寸
        svg.setAttribute('width', connectGame.offsetWidth);
        svg.setAttribute('height', connectGame.offsetHeight);
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', leftRect.left + leftRect.width / 2 - gameRect.left);
        line.setAttribute('y1', leftRect.top + leftRect.height / 2 - gameRect.top);
        line.setAttribute('x2', rightRect.left + rightRect.width / 2 - gameRect.left);
        line.setAttribute('y2', rightRect.top + rightRect.height / 2 - gameRect.top);
        line.setAttribute('stroke', 'gold');
        line.setAttribute('stroke-width', '4');
        svg.appendChild(line);
    };
}

// 关卡7：迷宫
function loadLevel7() {
    const container = document.getElementById('gameContainer');
    const size = 12; // 增大迷宫尺寸
    const maze = generateMaze(size, size);
    
    container.innerHTML = `
        <h2 class="game-title">第7关：走出迷宫 🗺️</h2>
        <p class="game-instruction">带小熊从起点走到终点！</p>
        <div class="maze-game">
            <div class="maze-wrapper">
                <div class="maze-container" id="mazeContainer" style="width: ${size * 35}px; height: ${size * 35}px;">
                </div>
            </div>
            <div class="maze-controls">
                <div class="control-button" id="btnUp">
                    ⬆️<br><span class="control-label">上</span>
                </div>
                <div class="control-row">
                    <div class="control-button" id="btnLeft">
                        ⬅️<br><span class="control-label">左</span>
                    </div>
                    <div class="control-button" id="btnDown">
                        ⬇️<br><span class="control-label">下</span>
                    </div>
                    <div class="control-button" id="btnRight">
                        ➡️<br><span class="control-label">右</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    renderMaze(maze, size);
}

function generateMaze(width, height) {
    // 改进的迷宫生成算法，确保有一条从起点到终点的路径
    const maze = Array(height).fill().map(() => Array(width).fill(1));
    
    // 先设置外墙
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
                maze[y][x] = 1; // 外墙
            }
        }
    }
    
    // 起点和终点
    const startX = 1, startY = 1;
    const endX = width - 2, endY = height - 2;
    maze[startY][startX] = 0;
    maze[endY][endX] = 0;
    
    // 使用简单的路径生成算法
    function carvePath(x, y, visited) {
        if (x < 1 || x >= width - 1 || y < 1 || y >= height - 1 || visited[y][x]) {
            return;
        }
        
        visited[y][x] = true;
        maze[y][x] = 0;
        
        // 随机选择方向
        const directions = [
            [0, -1], // 上
            [0, 1],  // 下
            [-1, 0], // 左
            [1, 0]   // 右
        ];
        
        // 打乱方向顺序
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }
        
        // 递归挖掘路径
        for (const [dx, dy] of directions) {
            const nx = x + dx * 2;
            const ny = y + dy * 2;
            
            if (nx >= 1 && nx < width - 1 && ny >= 1 && ny < height - 1 && !visited[ny][nx]) {
                maze[y + dy][x + dx] = 0; // 打通中间
                carvePath(nx, ny, visited);
            }
        }
    }
    
    // 生成主路径
    const visited = Array(height).fill().map(() => Array(width).fill(false));
    carvePath(startX, startY, visited);
    
    // 确保终点可达
    maze[endY][endX] = 0;
    // 在终点周围创建一些通道
    const endDirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    for (const [dx, dy] of endDirs) {
        if (endY + dy >= 1 && endY + dy < height - 1 && 
            endX + dx >= 1 && endX + dx < width - 1) {
            if (Math.random() > 0.3) {
                maze[endY + dy][endX + dx] = 0;
            }
        }
    }
    
    // 添加一些额外的路径使迷宫更有趣
    for (let y = 2; y < height - 2; y++) {
        for (let x = 2; x < width - 2; x++) {
            if (maze[y][x] === 1 && Math.random() > 0.75) {
                // 检查周围是否有路径
                let hasPath = false;
                for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
                    if (maze[y + dy][x + dx] === 0) {
                        hasPath = true;
                        break;
                    }
                }
                if (hasPath) {
                    maze[y][x] = 0;
                }
            }
        }
    }
    
    // 保存起点和终点位置
    maze.startX = startX;
    maze.startY = startY;
    maze.endX = endX;
    maze.endY = endY;
    
    return maze;
}

function renderMaze(maze, size) {
    const container = document.getElementById('mazeContainer');
    container.innerHTML = '';
    
    const startX = maze.startX || 1;
    const startY = maze.startY || 1;
    const endX = maze.endX || (size - 2);
    const endY = maze.endY || (size - 2);
    
    let playerX = startX, playerY = startY;
    const cellSize = 35;
    
    // 创建迷宫网格
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const cell = document.createElement('div');
            cell.className = 'maze-cell';
            cell.style.width = cellSize + 'px';
            cell.style.height = cellSize + 'px';
            cell.style.position = 'absolute';
            cell.style.left = (x * cellSize) + 'px';
            cell.style.top = (y * cellSize) + 'px';
            
            if (maze[y][x] === 1) {
                cell.classList.add('maze-wall');
            } else {
                cell.classList.add('maze-path');
                
                // 标记起点
                if (x === startX && y === startY) {
                    cell.classList.add('maze-start');
                    const startLabel = document.createElement('div');
                    startLabel.className = 'maze-label start-label';
                    startLabel.textContent = '🚩 起点';
                    cell.appendChild(startLabel);
                }
                
                // 标记终点
                if (x === endX && y === endY) {
                    cell.classList.add('maze-end');
                    const endLabel = document.createElement('div');
                    endLabel.className = 'maze-label end-label';
                    endLabel.textContent = '🏁 终点';
                    cell.appendChild(endLabel);
                }
            }
            
            container.appendChild(cell);
        }
    }
    
    // 创建玩家
    const player = document.createElement('div');
    player.className = 'maze-player';
    player.id = 'mazePlayer';
    player.textContent = '🐻';
    player.style.left = (startX * cellSize + 2) + 'px';
    player.style.top = (startY * cellSize + 2) + 'px';
    container.appendChild(player);
    
    // 移动函数
    window.mazeGameState = {
        playerX: startX,
        playerY: startY,
        maze: maze,
        size: size,
        cellSize: cellSize,
        endX: endX,
        endY: endY,
        player: player
    };
    
    // 移动函数
    function movePlayer(direction) {
        const state = window.mazeGameState;
        if (!state) return;
        
        let newX = state.playerX;
        let newY = state.playerY;
        
        switch(direction) {
            case 'up': newY--; break;
            case 'down': newY++; break;
            case 'left': newX--; break;
            case 'right': newX++; break;
        }
        
        // 检查是否可以移动
        if (newX >= 0 && newX < state.size && 
            newY >= 0 && newY < state.size && 
            state.maze[newY][newX] === 0) {
            
            state.playerX = newX;
            state.playerY = newY;
            
            state.player.style.left = (newX * state.cellSize + 2) + 'px';
            state.player.style.top = (newY * state.cellSize + 2) + 'px';
            
            playSound('click');
            
            // 检查是否到达终点
            if (state.playerX === state.endX && state.playerY === state.endY) {
                setTimeout(() => {
                    levelComplete();
                    playSound('success');
                    window.mazeGameState = null; // 清理
                }, 500);
            }
        } else {
            playSound('fail');
        }
    }
    
    // 全局移动函数（供按钮和键盘调用）
    window.moveMazePlayer = movePlayer;
    
    // 绑定按钮事件
    document.getElementById('btnUp').addEventListener('click', () => movePlayer('up'));
    document.getElementById('btnDown').addEventListener('click', () => movePlayer('down'));
    document.getElementById('btnLeft').addEventListener('click', () => movePlayer('left'));
    document.getElementById('btnRight').addEventListener('click', () => movePlayer('right'));
    
    // 移动端触摸支持
    document.getElementById('btnUp').addEventListener('touchstart', (e) => {
        e.preventDefault();
        movePlayer('up');
    });
    document.getElementById('btnDown').addEventListener('touchstart', (e) => {
        e.preventDefault();
        movePlayer('down');
    });
    document.getElementById('btnLeft').addEventListener('touchstart', (e) => {
        e.preventDefault();
        movePlayer('left');
    });
    document.getElementById('btnRight').addEventListener('touchstart', (e) => {
        e.preventDefault();
        movePlayer('right');
    });
    
    // 键盘控制（保留原有功能）
    function handleKeyMove(e) {
        const key = e.key;
        let direction = null;
        
        if (key === 'ArrowUp' || key === 'w' || key === 'W') direction = 'up';
        else if (key === 'ArrowDown' || key === 's' || key === 'S') direction = 'down';
        else if (key === 'ArrowLeft' || key === 'a' || key === 'A') direction = 'left';
        else if (key === 'ArrowRight' || key === 'd' || key === 'D') direction = 'right';
        
        if (direction && window.moveMazePlayer) {
            window.moveMazePlayer(direction);
            e.preventDefault();
        }
    }
    
    // 添加键盘事件
    document.addEventListener('keydown', handleKeyMove);
    
    // 清理函数（当关卡结束时）
    window.cleanupMazeListeners = function() {
        document.removeEventListener('keydown', handleKeyMove);
    };
}

// 关卡8：Boss关
function loadLevel8() {
    const container = document.getElementById('gameContainer');
    let timeLeft = 20;
    let score = 0;
    let balloons = [];
    let gameInterval;
    let timerInterval;
    
    container.innerHTML = `
        <h2 class="game-title">第8关：Boss挑战！🎈</h2>
        <p class="game-instruction">20秒内点击闪烁的气球！</p>
        <div class="boss-timer">时间：<span id="bossTimer">${timeLeft}</span>秒</div>
        <div class="boss-score">得分：<span id="bossScore">0</span></div>
        <div class="boss-game">
            <div class="boss-container" id="bossContainer"></div>
        </div>
    `;
    
    const containerEl = document.getElementById('bossContainer');
    const timerEl = document.getElementById('bossTimer');
    const scoreEl = document.getElementById('bossScore');
    const targetScore = 15;
    
    function createBalloon() {
        if (balloons.length >= 6) return;
        
        const balloon = document.createElement('div');
        balloon.className = 'boss-balloon';
        const colors = ['#FF6B9D', '#4ECDC4', '#FFE66D', '#95E1D3', '#BA55D3'];
        balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.left = Math.random() * (containerEl.offsetWidth - 80) + 'px';
        balloon.style.top = Math.random() * (containerEl.offsetHeight - 100) + 'px';
        balloon.textContent = '🎈';
        balloon.onclick = function() {
            if (balloon.classList.contains('active')) {
                score++;
                scoreEl.textContent = score;
                balloon.remove();
                balloons = balloons.filter(b => b !== balloon);
                playSound('success');
                
                if (score >= targetScore) {
                    clearInterval(gameInterval);
                    clearInterval(timerInterval);
                    setTimeout(() => {
                        levelComplete();
                        playSound('success');
                    }, 500);
                }
            }
        };
        
        containerEl.appendChild(balloon);
        balloons.push(balloon);
        
        setTimeout(() => {
            if (balloon.parentNode) {
                balloon.classList.add('active');
                setTimeout(() => {
                    if (balloon.parentNode && balloon.classList.contains('active')) {
                        balloon.classList.remove('active');
                        setTimeout(() => {
                            if (balloon.parentNode) {
                                balloon.remove();
                                balloons = balloons.filter(b => b !== balloon);
                            }
                        }, 1000);
                    }
                }, 2000);
            }
        }, Math.random() * 500);
    }
    
    gameInterval = setInterval(() => {
        if (timeLeft > 0) {
            createBalloon();
        }
    }, 800);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            clearInterval(timerInterval);
            if (score < targetScore) {
                showFailMessage();
            }
        }
    }, 1000);
}

// 关卡完成
function levelComplete() {
    // 清理迷宫监听器
    if (window.cleanupMazeListeners) {
        window.cleanupMazeListeners();
    }
    
    if (!gameState.completedLevels.includes(gameState.currentLevel)) {
        gameState.completedLevels.push(gameState.currentLevel);
        saveProgress();
    }
    
    showVictoryAnimation();
    playSound('victory');
    
    setTimeout(() => {
        hideVictoryAnimation();
        updateProgress();
        
        if (gameState.currentLevel < 8) {
            gameState.currentLevel++;
            loadLevel(gameState.currentLevel);
        } else {
            // 全部通关
            gameState.endTime = new Date().toLocaleString('zh-CN');
            saveProgress();
            showCertificate();
        }
    }, 2000);
}

// 胜利动画
function showVictoryAnimation() {
    const screen = document.getElementById('victoryAnimation');
    screen.classList.remove('hidden');
    
    // 烟花效果
    createFireworks();
    createConfetti();
    
    // 随机鼓励语音
    const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    const text = document.querySelector('.victory-text');
    text.textContent = encouragement + ' 🎉';
}

function hideVictoryAnimation() {
    document.getElementById('victoryAnimation').classList.add('hidden');
}

// 烟花效果
function createFireworks() {
    const container = document.getElementById('fireworks');
    container.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.style.position = 'absolute';
            firework.style.left = Math.random() * 100 + '%';
            firework.style.top = Math.random() * 50 + '%';
            firework.style.fontSize = '50px';
            firework.textContent = '✨';
            firework.style.animation = 'fireworkBurst 1s ease-out forwards';
            container.appendChild(firework);
            
            setTimeout(() => firework.remove(), 1000);
        }, i * 200);
    }
}

// 彩带效果
function createConfetti() {
    const container = document.getElementById('confetti');
    container.innerHTML = '';
    
    const colors = ['#FF6B9D', '#4ECDC4', '#FFE66D', '#95E1D3', '#BA55D3'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.animation = `confettiFall ${Math.random() * 2 + 1}s linear forwards`;
        container.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// 失败提示
function showFailMessage() {
    document.getElementById('failMessage').classList.remove('hidden');
    playSound('fail');
}

function retryCurrentLevel() {
    document.getElementById('failMessage').classList.add('hidden');
    loadLevel(gameState.currentLevel);
}

// 证书生成
function showCertificate() {
    showScreen('certificateScreen');
    generateCertificate();
}

function generateCertificate() {
    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');
    
    // 背景渐变
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FFE66D');
    gradient.addColorStop(0.5, '#FF6B9D');
    gradient.addColorStop(1, '#4ECDC4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 边框
    ctx.strokeStyle = 'gold';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // 标题
    ctx.fillStyle = '#333';
    ctx.font = 'bold 60px Comic Sans MS';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 闯关证书 🏆', canvas.width / 2, 100);
    
    // 内容
    ctx.font = '40px Comic Sans MS';
    ctx.fillText(`${gameState.playerName}`, canvas.width / 2, 220);
    ctx.fillText('成功完成了所有8关挑战！', canvas.width / 2, 280);
    
    // 日期
    ctx.font = '30px Comic Sans MS';
    ctx.fillText(`完成时间：${gameState.endTime || new Date().toLocaleString('zh-CN')}`, canvas.width / 2, 350);
    
    // 奖章
    ctx.font = '100px Arial';
    ctx.fillText('🏅', canvas.width / 2, 480);
    
    // 装饰
    ctx.font = '40px Arial';
    ctx.fillText('✨', 100, 200);
    ctx.fillText('✨', canvas.width - 100, 200);
    ctx.fillText('⭐', 100, 500);
    ctx.fillText('⭐', canvas.width - 100, 500);
}

function saveCertificate() {
    const canvas = document.getElementById('certificateCanvas');
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `小小勇者证书_${gameState.playerName}_${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

function shareCertificate() {
    const canvas = document.getElementById('certificateCanvas');
    canvas.toBlob((blob) => {
        if (navigator.share) {
            const file = new File([blob], '证书.png', { type: 'image/png' });
            navigator.share({
                title: '我的闯关证书',
                files: [file]
            });
        } else {
            // 备用方案：复制到剪贴板
            canvas.toBlob((blob) => {
                navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]).then(() => {
                    alert('证书已复制到剪贴板！');
                });
            });
        }
    });
}

// 进度保存
function saveProgress() {
    localStorage.setItem('littleHeroProgress', JSON.stringify({
        currentLevel: gameState.currentLevel,
        completedLevels: gameState.completedLevels,
        currentHero: gameState.currentHero,
        playerName: gameState.playerName,
        startTime: gameState.startTime,
        endTime: gameState.endTime
    }));
}

function loadProgress() {
    const saved = localStorage.getItem('littleHeroProgress');
    if (saved) {
        const data = JSON.parse(saved);
        gameState.currentLevel = data.currentLevel || 1;
        gameState.completedLevels = data.completedLevels || [];
        gameState.currentHero = data.currentHero || 'girl';
        gameState.playerName = data.playerName || '小勇者';
        gameState.startTime = data.startTime;
        gameState.endTime = data.endTime;
        
        // 恢复勇者选择
        document.querySelectorAll('.hero-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.hero === gameState.currentHero);
        });
    }
}

function updateProgress() {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (gameState.completedLevels.includes(index + 1)) {
            star.classList.add('completed');
        }
    });
}

// 家长模式
function showParentMode() {
    showScreen('parentMode');
    document.getElementById('parentStats').textContent = gameState.completedLevels.length;
    document.getElementById('startTime').textContent = gameState.startTime || '-';
    document.getElementById('endTime').textContent = gameState.endTime || '-';
}

function exitParentMode() {
    if (gameState.completedLevels.length > 0) {
        showScreen('gameScreen');
    } else {
        showScreen('homeScreen');
    }
}

function checkParentMode() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('parent') === 'true') {
        showParentMode();
    }
}

// 音效
function playSound(type) {
    if (!gameState.soundEnabled) return;
    
    // 使用Web Audio API生成简单音效
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'success':
            oscillator.frequency.value = 800;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
        case 'fail':
            oscillator.frequency.value = 300;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
        case 'victory':
            // 胜利音效：上升的音调
            [400, 500, 600, 700, 800].forEach((freq, i) => {
                setTimeout(() => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    osc.connect(gain);
                    gain.connect(audioContext.destination);
                    osc.frequency.value = freq;
                    gain.gain.setValueAtTime(0.2, audioContext.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    osc.start(audioContext.currentTime);
                    osc.stop(audioContext.currentTime + 0.2);
                }, i * 100);
            });
            break;
        case 'click':
            oscillator.frequency.value = 600;
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
    }
}

function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    const btn = document.getElementById('soundToggle');
    btn.textContent = gameState.soundEnabled ? '🔊' : '🔇';
    btn.classList.toggle('muted', !gameState.soundEnabled);
}

// 工具函数
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.remove('hidden');
    document.getElementById(screenId).classList.add('active');
}

function restartGame() {
    if (confirm('确定要重新开始吗？进度将会清空。')) {
        localStorage.removeItem('littleHeroProgress');
        gameState.currentLevel = 1;
        gameState.completedLevels = [];
        gameState.startTime = null;
        gameState.endTime = null;
        showScreen('homeScreen');
        document.getElementById('progressBar').classList.add('hidden');
        document.getElementById('homeBtn').classList.add('hidden');
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    @keyframes fireworkBurst {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
    }
    
    @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
`;
document.head.appendChild(style);

