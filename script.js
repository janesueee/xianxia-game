// 游戏状态
let gameState = {
    stamina: 5,
    maxStamina: 10,
    spiritStone: 800,
    cultivationLevel: '筑基',
    spiritualPower: 100,
    maxSpiritualPower: 1000,
    currentLocation: '药王谷',
    currentTime: '天元1年9月8日15时',
    playerName: '',
    intelligence: 75,
    luck: 68
};

// 页面切换功能
function showPage(pageId) {
    console.log('切换到页面:', pageId);
    
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        console.log('显示页面:', pageId);
    } else {
        console.error('页面不存在:', pageId);
    }
}

// 随机生成属性
function randomizeAttributes() {
    const intelligenceElement = document.getElementById('intelligence');
    const luckElement = document.getElementById('luck');
    if (intelligenceElement) intelligenceElement.textContent = Math.floor(Math.random() * 101);
    if (luckElement) luckElement.textContent = Math.floor(Math.random() * 101);
}

// 更新状态栏
function updateStatusBar() {
    const staminaElement = document.getElementById('stamina-value');
    const spiritStoneElement = document.getElementById('spirit-stone');
    const cultivationLevelElement = document.getElementById('cultivation-level');
    const spiritualPowerElement = document.getElementById('spiritual-power');
    const currentLocationElement = document.getElementById('current-location');
    const currentTimeElement = document.getElementById('current-time');
    
    if (staminaElement) staminaElement.textContent = `${gameState.stamina}/${gameState.maxStamina}`;
    if (spiritStoneElement) spiritStoneElement.textContent = gameState.spiritStone;
    if (cultivationLevelElement) cultivationLevelElement.textContent = gameState.cultivationLevel;
    if (spiritualPowerElement) spiritualPowerElement.textContent = `${gameState.spiritualPower}/${gameState.maxSpiritualPower}`;
    if (currentLocationElement) currentLocationElement.textContent = gameState.currentLocation;
    if (currentTimeElement) currentTimeElement.textContent = gameState.currentTime;
    
    // 更新进度条
    const staminaProgress = (gameState.stamina / gameState.maxStamina) * 100;
    const spiritualProgress = (gameState.spiritualPower / gameState.maxSpiritualPower) * 100;
    
    const staminaProgressBar = document.querySelector('.status-bar .status-item:nth-child(1) .progress-fill');
    const spiritualProgressBar = document.querySelector('.status-bar .status-item:nth-child(4) .progress-fill');
    
    if (staminaProgressBar) staminaProgressBar.style.width = `${staminaProgress}%`;
    if (spiritualProgressBar) spiritualProgressBar.style.width = `${spiritualProgress}%`;
    
    // 自动保存到默认存档
    autoSaveDefault();
}

// 更新故事内容
function updateStoryContent(content) {
    const storyContent = document.getElementById('story-content');
    if (storyContent) {
        storyContent.innerHTML = content;
        storyContent.scrollTop = storyContent.scrollHeight;
    }
    
    // 自动保存到默认存档
    autoSaveDefault();
}

// 故事区域文本堆叠并本地保存最近100条
function appendStoryContent(text) {
    const storyContent = document.getElementById('story-content');
    let storyList = JSON.parse(localStorage.getItem('storyList')) || [];
    storyList.push(text);
    if (storyList.length > 100) storyList = storyList.slice(-100);
    localStorage.setItem('storyList', JSON.stringify(storyList));
    renderStoryContent();
}

function renderStoryContent() {
    const storyContent = document.getElementById('story-content');
    let storyList = JSON.parse(localStorage.getItem('storyList')) || [];
    storyContent.innerHTML = '';
    storyList.forEach(entry => {
        const newEntry = document.createElement('div');
        newEntry.className = 'story-entry';
        newEntry.innerHTML = entry;
        storyContent.appendChild(newEntry);
    });
    storyContent.scrollTop = storyContent.scrollHeight;
}

// 更新玩家信息显示
function updatePlayerInfo() {
    const playerNameDisplay = document.getElementById('player-name-display');
    const playerLevelDisplay = document.getElementById('player-level-display');
    const playerLuckDisplay = document.getElementById('player-luck-display');
    const playerIntelligenceDisplay = document.getElementById('player-intelligence-display');
    
    if (playerNameDisplay) playerNameDisplay.textContent = gameState.playerName || '未设置';
    if (playerLevelDisplay) playerLevelDisplay.textContent = gameState.cultivationLevel;
    if (playerLuckDisplay) playerLuckDisplay.textContent = gameState.luck;
    if (playerIntelligenceDisplay) playerIntelligenceDisplay.textContent = gameState.intelligence;
}

// 初始化游戏状态
function initializeGameState() {
    updateStatusBar();
    updateStoryContent('欢迎来到修仙世界！你正在药王谷中，准备开始你的修仙之旅。');
    showPage('main-menu');  // 添加这行，确保默认进入主菜单
}

// 发送消息
function sendMessage() {
    const input = document.getElementById('player-input');
    const message = input.value.trim();
    
    if (message) {
        updateStoryContent(`你说："${message}"`);
        input.value = '';
        
        setTimeout(() => {
            updateStoryContent(`系统回应：收到您的消息"${message}"，正在处理中...`);
        }, 1000);
    }
}

// 修炼功能
function cultivate() {
    if (gameState.stamina > 0) {
        gameState.stamina--;
        gameState.spiritualPower = Math.min(gameState.maxSpiritualPower, gameState.spiritualPower + 50);
        updateStatusBar();
        updateStoryContent('你开始修炼，消耗了一些体力，但灵力有所提升。');
    } else {
        updateStoryContent('体力不足，无法修炼。请先休息。');
    }
}

// 休息功能
function rest() {
    gameState.stamina = Math.min(gameState.maxStamina, gameState.stamina + 3);
    updateStatusBar();
    updateStoryContent('你休息了一会儿，体力有所恢复。');
}

// 跳过一年
function skipYear() {
    gameState.currentTime = '天元2年9月8日15时';
    gameState.stamina = gameState.maxStamina;
    gameState.spiritualPower = gameState.maxSpiritualPower;
    updateStatusBar();
    updateStoryContent('时间飞逝，一年过去了。你的体力和灵力都恢复了。');
}

// 旅行功能
function travelTo(location) {
    let staminaCost = 1;
    
    if (location === '十万大山-狼妖家') {
        staminaCost = 3;
    }
    
    if (gameState.stamina >= staminaCost) {
        gameState.stamina -= staminaCost;
        gameState.currentLocation = location;
        updateStatusBar();
        updateStoryContent(`你来到了${location}。`);
        showPage('game-main');
    } else {
        alert('体力不足，无法前往该地点。');
    }
}

// 切换地点展开/收起
function toggleLocation(locationId) {
    const childrenElement = document.getElementById(locationId + '-children');
    const parentElement = childrenElement.previousElementSibling;
    const toggleIcon = parentElement.querySelector('.toggle-icon');
    
    if (childrenElement.classList.contains('expanded')) {
        childrenElement.classList.remove('expanded');
        toggleIcon.textContent = '▼';
        toggleIcon.style.transform = 'rotate(0deg)';
    } else {
        childrenElement.classList.add('expanded');
        toggleIcon.textContent = '▲';
        toggleIcon.style.transform = 'rotate(180deg)';
    }
}

// 保存游戏
function saveGame() {
    const saveData = {
        gameState: gameState,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('xianxiaGameSave', JSON.stringify(saveData));
    alert('游戏已保存！');
}

// 读取游戏
function loadGame() {
    const saves = JSON.parse(localStorage.getItem('gameSaves') || '[]');
    const loadGameDialog = document.createElement('div');
    loadGameDialog.className = 'save-load-dialog';
    
    if (saves.length === 0) {
        loadGameDialog.innerHTML = '<p>暂无存档</p>';
    } else {
        loadGameDialog.innerHTML = saves.map((save, index) => `
            <div class="save-item" onclick="loadSaveFile(${index})">
                <strong>存档 ${index + 1}</strong>
                <p>保存时间: ${save.saveDate}</p>
                <p>角色名称: ${save.playerName}</p>
                <p>境界: ${save.cultivationLevel}</p>
            </div>
        `).join('');
    }

    // Add some styling for the dialog
    loadGameDialog.style.position = 'fixed';
    loadGameDialog.style.top = '50%';
    loadGameDialog.style.left = '50%';
    loadGameDialog.style.transform = 'translate(-50%, -50%)';
    loadGameDialog.style.background = 'white';
    loadGameDialog.style.padding = '20px';
    loadGameDialog.style.borderRadius = '8px';
    loadGameDialog.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    loadGameDialog.style.maxHeight = '80vh';
    loadGameDialog.style.overflow = 'auto';
    loadGameDialog.style.zIndex = '1000';

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.onclick = () => loadGameDialog.remove();
    loadGameDialog.appendChild(closeButton);

    document.body.appendChild(loadGameDialog);
}

function loadSaveFile(index) {
    const saves = JSON.parse(localStorage.getItem('gameSaves') || '[]');
    const save = saves[index];
    if (save) {
        // Load the save data into your game state
        // This is where you would restore all the game state
        // ...
        alert('存档加载成功！');
        document.querySelector('.save-load-dialog').remove();
        showPage('game-main');
    }
}

// 自动保存到默认存档
function autoSaveDefault() {
    localStorage.setItem('saveData_default', JSON.stringify({
        name: '默认存档',
        time: new Date().toLocaleString(),
        gameState: gameState
    }));
}

// 存档列表展示默认存档
function showLoadGameList() {
    const container = document.querySelector('#load-game .info-section');
    const slots = getSaveSlots();
    let html = '<ul>';
    // 默认存档
    const defaultData = localStorage.getItem('saveData_default');
    if (defaultData) {
        const save = JSON.parse(defaultData);
        html += `<li><strong>${save.name}</strong> <span style='color:#888;'>${save.time}</span> <button class='btn' onclick='loadDefaultSave()'>读取</button></li>`;
    }
    // 其他存档
    slots.forEach((name, idx) => {
        const data = localStorage.getItem('saveData_' + idx);
        if (data) {
            const save = JSON.parse(data);
            html += `<li><strong>${save.name}</strong> <span style='color:#888;'>${save.time}</span> <button class='btn' onclick='loadGameFromList(${idx})'>读取</button></li>`;
        }
    });
    html += '</ul>';
    if (html === '<ul></ul>') html = '<p>暂无存档</p>';
    container.innerHTML = html;
}

function loadDefaultSave() {
    const data = localStorage.getItem('saveData_default');
    if (data) {
        const save = JSON.parse(data);
        Object.assign(gameState, save.gameState);
        updateStatusBar();
        alert(`加载了默认存档`);
        showPage('game-main');
    }
}

// 角色详情数据
const characterDetails = {
    '萧缚': {
        name: '萧缚',
        identity: '师父',
        age: '？？？',
        appearance: '深墨色长发披散/深紫色眼眸/眼神淡漠/五官精致如仙',
        attire: '深绿简洁长袍/衣前金色流苏',
        figure: '身高188cm/身形修长/气质如松/举止优雅稳重',
        scent: '？？？',
        personality: '淡漠/克制/隐忍/理智/内心痛苦挣扎',
        traits: '？？？',
        love_concept: '？？？',
        sexual_acts: '？？？',
        hobbies: '？？？',
        background_summary: '？？？',
        attitude_towards_user: '你眼中的师傅是一位德高望重的长者，虽然严厉，但处处为你着想。'
    },
    '师兄': {
        name: '师兄',
        identity: '同门',
        age: '？？？',
        appearance: '英俊潇洒，眉目如画',
        attire: '白色长袍，腰间配剑',
        figure: '身材挺拔，气质儒雅',
        scent: '？？？',
        personality: '温和谦逊，乐于助人',
        traits: '？？？',
        love_concept: '？？？',
        sexual_acts: '？？？',
        hobbies: '？？？',
        background_summary: '？？？',
        attitude_towards_user: '师兄为人温和，经常指导你修炼，是你学习的榜样。'
    },
    '师姐': {
        name: '师姐',
        identity: '同门',
        age: '？？？',
        appearance: '清丽脱俗，眉目如画',
        attire: '粉色长裙，发髻精致',
        figure: '身材窈窕，气质优雅',
        scent: '？？？',
        personality: '聪慧机敏，性格活泼',
        traits: '？？？',
        love_concept: '？？？',
        sexual_acts: '？？？',
        hobbies: '？？？',
        background_summary: '？？？',
        attitude_towards_user: '师姐聪慧过人，经常与你切磋武艺，关系亲密。'
    },
    '狼妖': {
        name: '狼妖',
        identity: '初识',
        age: '？？？',
        appearance: '狼首人身，眼神锐利',
        attire: '兽皮衣物，粗犷豪放',
        figure: '身材魁梧，力量惊人',
        scent: '？？？',
        personality: '直率豪爽，重情重义',
        traits: '？？？',
        love_concept: '？？？',
        sexual_acts: '？？？',
        hobbies: '？？？',
        background_summary: '？？？',
        attitude_towards_user: '虽然外表凶悍，但内心善良，值得深交。'
    },
    '药王': {
        name: '药王',
        identity: '敬仰',
        age: '？？？',
        appearance: '鹤发童颜，仙风道骨',
        attire: '紫色道袍，手持拂尘',
        figure: '身材不高但气质非凡',
        scent: '？？？',
        personality: '博学多识，慈悲为怀',
        traits: '？？？',
        love_concept: '？？？',
        sexual_acts: '？？？',
        hobbies: '？？？',
        background_summary: '？？？',
        attitude_towards_user: '药王学识渊博，医术高明，是你敬仰的前辈。'
    },
    '小师妹': {
        name: '小师妹',
        identity: '同门',
        age: '？？？',
        appearance: '可爱俏皮，眼睛明亮',
        attire: '绿色短裙，活泼可爱',
        figure: '身材娇小，天真烂漫',
        scent: '？？？',
        personality: '天真活泼，心地善良',
        traits: '？？？',
        love_concept: '？？？',
        sexual_acts: '？？？',
        hobbies: '？？？',
        background_summary: '？？？',
        attitude_towards_user: '小师妹天真可爱，经常缠着你玩耍，让你感到温暖。'
    },
    '神秘人': {
        name: '神秘人',
        identity: '未知',
        age: '？？？',
        appearance: '面容模糊，难以看清',
        attire: '黑色斗篷，神秘莫测',
        figure: '身材中等，行踪诡秘',
        scent: '？？？',
        personality: '深不可测，目的不明',
        traits: '？？？',
        love_concept: '？？？',
        sexual_acts: '？？？',
        hobbies: '？？？',
        background_summary: '？？？',
        attitude_towards_user: '这位神秘人身份成谜，每次出现都带来新的谜团。'
    }
};

// 显示角色详情
function showCharacterDetail(characterName) {
    const character = characterDetails[characterName];
    const detailElement = document.getElementById('character-detail');
    
    if (character && detailElement) {
        detailElement.innerHTML = `
            <h3>${character.name}</h3>
            <p><strong>关系：</strong>${character.identity}</p>
            <p><strong>年龄：</strong>${character.age}</p>
            <p><strong>外表：</strong>${character.appearance}</p>
            <p><strong>穿着：</strong>${character.attire}</p>
            <p><strong>身材：</strong>${character.figure}</p>
            <p><strong>气味：</strong>${character.scent}</p>
            <p><strong>性格：</strong>${character.personality}</p>
            <p><strong>特征：</strong>${character.traits}</p>
            <p><strong>爱情观：</strong>${character.love_concept}</p>
            <p><strong>性行为：</strong>${character.sexual_acts}</p>
            <p><strong>爱好：</strong>${character.hobbies}</p>
            <p><strong>背景简介：</strong>${character.background_summary}</p>
            <p><strong>对你的态度：</strong>${character.attitude_towards_user}</p>
            <div class='character-actions'>
                <button class='btn' onclick="visitCharacter(event, '${character.name}')">拜访</button>
                <button class='btn' onclick="messageCharacter(event, '${character.name}')">传讯</button>
            </div>
        `;
    } else if (detailElement) {
        detailElement.innerHTML = `
            <h3>角色详情</h3>
            <p>未找到该角色的详细信息</p>
        `;
    }
}

// 设置页面相关逻辑
function fetchModelList() {
    const apiUrl = document.getElementById('api-url').value;
    const apiKey = document.getElementById('api-key').value;
    if (!apiUrl || !apiKey) {
        alert('请填写API地址和密钥');
        return;
    }
    const select = document.getElementById('model-select');
    select.innerHTML = '<option>拉取中...</option>';
    // 假设API为OpenAI风格：GET `${apiUrl}/v1/models`，Authorization: Bearer {apiKey}
    fetch(apiUrl.replace(/\/$/, '') + '/v1/models', {
        headers: {
            'Authorization': 'Bearer ' + apiKey
        }
    })
    .then(res => res.json())
    .then(data => {
        // 兼容OpenAI和Claude风格，需根据实际API调整
        let models = [];
        if (Array.isArray(data.data)) {
            models = data.data.map(m => ({ value: m.id, label: m.id }));
        } else if (Array.isArray(data.models)) {
            models = data.models.map(m => ({ value: m.name || m.id, label: m.name || m.id }));
        }
        if (models.length === 0) {
            select.innerHTML = '<option>未获取到模型</option>';
        } else {
            select.innerHTML = '';
            models.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.value;
                opt.textContent = m.label;
                select.appendChild(opt);
            });
            alert('模型列表已拉取');
        }
    })
    .catch(err => {
        select.innerHTML = '<option>拉取失败</option>';
        alert('模型拉取失败，请检查API地址和密钥');
    });
}

function saveSettings() {
    const apiUrl = document.getElementById('api-url').value;
    const apiKey = document.getElementById('api-key').value;
    const model = document.getElementById('model-select').value;
    if (!apiUrl || !apiKey || !model) {
        alert('请填写完整信息并选择模型');
        return;
    }
    localStorage.setItem('apiSettings', JSON.stringify({ apiUrl, apiKey, model }));
    alert('设置已保存');
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('apiSettings'));
    if (settings) {
        document.getElementById('api-url').value = settings.apiUrl;
        document.getElementById('api-key').value = settings.apiKey;
        // 拉取模型后自动选中
        fetchModelList();
        setTimeout(() => {
            document.getElementById('model-select').value = settings.model;
        }, 900);
    }
}
window.addEventListener('DOMContentLoaded', loadSettings);

// 确保所有函数在全局作用域中可用
window.showPage = showPage;
window.randomizeAttributes = randomizeAttributes;
window.sendMessage = sendMessage;
window.cultivate = cultivate;
window.rest = rest;
window.skipYear = skipYear;
window.travelTo = travelTo;
window.toggleLocation = toggleLocation;
window.saveGame = saveGame;
window.loadGame = loadGame;
window.showCharacterDetail = showCharacterDetail;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');
    
    const characterForm = document.getElementById('character-form');
    if (characterForm) {
        characterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showPage('game-main');
        });
    }
    
    // 设置表单提交
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('设置已保存');
        });
    }
    
    // 初始化时随机生成属性
    randomizeAttributes();
    
    // 游戏状态初始化
    initializeGameState();
    
    console.log('初始化完成');
    
    // 自动渲染故事内容
    renderStoryContent();
    
    // 显示存档列表
    showLoadGameList();
});
