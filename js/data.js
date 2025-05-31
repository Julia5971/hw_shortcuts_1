// 데이터 관리 클래스
class ShortcutData {
    constructor() {
        this.data = null;
        this.learnedShortcuts = new Set();
        this.loadData();
        this.loadLearnedShortcuts();
    }

    // JSON 데이터 로드
    async loadData() {
        try {
            const response = await fetch('../data/shortcuts.json');
            this.data = await response.json();
        } catch (error) {
            console.error('데이터 로드 실패:', error);
        }
    }

    // 학습한 단축키 로드
    loadLearnedShortcuts() {
        const saved = localStorage.getItem('learnedShortcuts');
        if (saved) {
            this.learnedShortcuts = new Set(JSON.parse(saved));
        }
    }

    // 학습한 단축키 저장
    saveLearnedShortcuts() {
        localStorage.setItem('learnedShortcuts', 
            JSON.stringify(Array.from(this.learnedShortcuts)));
    }

    // 단축키 학습 상태 토글
    toggleLearned(shortcutId) {
        if (this.learnedShortcuts.has(shortcutId)) {
            this.learnedShortcuts.delete(shortcutId);
        } else {
            this.learnedShortcuts.add(shortcutId);
        }
        this.saveLearnedShortcuts();
    }

    // 단축키 검색
    searchShortcuts(query) {
        if (!this.data) return [];
        
        query = query.toLowerCase();
        const results = [];

        for (const category in this.data) {
            const shortcuts = this.data[category].shortcuts;
            for (const shortcut of shortcuts) {
                if (shortcut.title.toLowerCase().includes(query) ||
                    shortcut.description.toLowerCase().includes(query) ||
                    shortcut.keys.some(key => key.toLowerCase().includes(query))) {
                    results.push({
                        ...shortcut,
                        category: this.data[category].name
                    });
                }
            }
        }

        return results;
    }

    // 카테고리별 단축키 가져오기
    getShortcutsByCategory(category) {
        if (!this.data || !this.data[category]) return [];
        return this.data[category].shortcuts.map(shortcut => ({
            ...shortcut,
            category: this.data[category].name
        }));
    }

    // 모든 단축키 가져오기
    getAllShortcuts() {
        if (!this.data) return [];
        
        const allShortcuts = [];
        for (const category in this.data) {
            const shortcuts = this.data[category].shortcuts;
            for (const shortcut of shortcuts) {
                allShortcuts.push({
                    ...shortcut,
                    category: this.data[category].name
                });
            }
        }
        return allShortcuts;
    }

    // 학습 진행률 계산
    getLearningProgress() {
        if (!this.data) return 0;
        
        let totalShortcuts = 0;
        let learnedCount = 0;

        for (const category in this.data) {
            const shortcuts = this.data[category].shortcuts;
            totalShortcuts += shortcuts.length;
            for (const shortcut of shortcuts) {
                if (this.learnedShortcuts.has(shortcut.id)) {
                    learnedCount++;
                }
            }
        }

        return totalShortcuts > 0 ? (learnedCount / totalShortcuts) * 100 : 0;
    }
}

// 전역 데이터 인스턴스 생성
const shortcutData = new ShortcutData(); 