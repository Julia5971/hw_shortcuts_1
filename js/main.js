// UI 관리 클래스
class ShortcutUI {
    constructor() {
        this.shortcutsGrid = document.querySelector('.shortcuts-grid');
        this.searchInput = document.querySelector('.search-box input');
        this.searchButton = document.querySelector('.search-box button');
        this.categoryLinks = document.querySelectorAll('.category-nav a');
        
        this.initializeEventListeners();
        this.loadInitialData();
    }

    // 이벤트 리스너 초기화
    initializeEventListeners() {
        // 검색 기능
        this.searchInput.addEventListener('input', () => this.handleSearch());
        this.searchButton.addEventListener('click', () => this.handleSearch());

        // 카테고리 네비게이션
        this.categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.getAttribute('href').substring(1);
                this.loadCategory(category);
            });
        });

        // 모바일 메뉴 토글
        const menuButton = document.createElement('button');
        menuButton.className = 'menu-toggle';
        menuButton.innerHTML = '☰';
        document.querySelector('.header .container').prepend(menuButton);

        menuButton.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('active');
        });
    }

    // 초기 데이터 로드
    async loadInitialData() {
        await new Promise(resolve => setTimeout(resolve, 100)); // 데이터 로드 대기
        this.displayShortcuts(shortcutData.getAllShortcuts());
        this.updateProgress();
    }

    // 검색 처리
    handleSearch() {
        const query = this.searchInput.value.trim();
        if (query) {
            const results = shortcutData.searchShortcuts(query);
            this.displayShortcuts(results);
        } else {
            this.loadInitialData();
        }
    }

    // 카테고리 로드
    loadCategory(category) {
        const shortcuts = shortcutData.getShortcutsByCategory(category);
        this.displayShortcuts(shortcuts);
    }

    // 단축키 카드 생성
    createShortcutCard(shortcut) {
        const card = document.createElement('div');
        card.className = 'shortcut-card';
        card.innerHTML = `
            <div class="card-header">
                <h3>${shortcut.title}</h3>
                <span class="category">${shortcut.category}</span>
            </div>
            <div class="card-body">
                <div class="keys">
                    ${shortcut.keys.map(key => `<kbd>${key}</kbd>`).join(' + ')}
                </div>
                <p class="description">${shortcut.description}</p>
            </div>
            <div class="card-footer">
                <label class="learned-toggle">
                    <input type="checkbox" 
                           ${shortcutData.learnedShortcuts.has(shortcut.id) ? 'checked' : ''}>
                    <span>학습 완료</span>
                </label>
                <span class="difficulty ${shortcut.difficulty}">${this.getDifficultyText(shortcut.difficulty)}</span>
            </div>
        `;

        // 학습 상태 토글 이벤트
        const checkbox = card.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            shortcutData.toggleLearned(shortcut.id);
            this.updateProgress();
        });

        return card;
    }

    // 난이도 텍스트 변환
    getDifficultyText(difficulty) {
        const difficultyMap = {
            'easy': '쉬움',
            'medium': '보통',
            'hard': '어려움'
        };
        return difficultyMap[difficulty] || difficulty;
    }

    // 단축키 목록 표시
    displayShortcuts(shortcuts) {
        this.shortcutsGrid.innerHTML = '';
        shortcuts.forEach(shortcut => {
            this.shortcutsGrid.appendChild(this.createShortcutCard(shortcut));
        });
    }

    // 진행률 업데이트
    updateProgress() {
        const progress = shortcutData.getLearningProgress();
        const progressText = `학습 진행률: ${Math.round(progress)}%`;
        
        // 진행률 표시 요소가 없으면 생성
        let progressElement = document.querySelector('.learning-progress');
        if (!progressElement) {
            progressElement = document.createElement('div');
            progressElement.className = 'learning-progress';
            document.querySelector('.sidebar').prepend(progressElement);
        }
        
        progressElement.textContent = progressText;
    }
}

// UI 초기화
document.addEventListener('DOMContentLoaded', () => {
    new ShortcutUI();
}); 