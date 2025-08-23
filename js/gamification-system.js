// Enhanced Gamification System

class GamificationSystem {
    constructor() {
        this.player = {
            name: 'Guest User',
            level: 1,
            xp: 0,
            xpToNext: 100,
            title: 'Beginner Explorer',
            achievements: [],
            dailyProgress: {
                calculations: 0,
                contacts: 0,
                images: 0
            },
            stats: {
                totalCalculations: 0,
                totalContacts: 0,
                totalImages: 0,
                pagesVisited: new Set(),
                darkModeTime: 0
            }
        };

        this.achievements = {
            'first-calc': { name: 'First Calculation', description: 'Complete your first calculation', xp: 25 },
            'contact-master': { name: 'Contact Master', description: 'Add 10 contacts to phonebook', xp: 100 },
            'gallery-curator': { name: 'Gallery Curator', description: 'Upload 5 images to gallery', xp: 75 },
            'power-user': { name: 'Power User', description: 'Reach level 5', xp: 200 },
            'night-owl': { name: 'Night Owl', description: 'Use dark theme for 1 hour', xp: 50 },
            'explorer': { name: 'Explorer', description: 'Visit all pages', xp: 150 }
        };

        this.dailyChallenges = {
            calculations: { target: 20, reward: 50 },
            social: { target: 5, reward: 75 },
            creative: { target: 3, reward: 100 }
        };

        this.levelTitles = {
            1: 'Beginner Explorer',
            2: 'Novice User',
            3: 'Skilled Navigator',
            4: 'Expert Operator',
            5: 'Master User',
            6: 'Elite Professional',
            7: 'Legendary Expert',
            8: 'Ultimate Master',
            9: 'Supreme Legend',
            10: 'Grandmaster'
        };

        this.init();
    }

    init() {
        this.loadPlayerData();
        this.setupEventListeners();
        this.updateUI();
        this.trackPageVisit();
        this.startDarkModeTimer();
        this.resetDailyChallengesIfNeeded();
    }

    // Load player data from localStorage
    loadPlayerData() {
        const saved = localStorage.getItem('webtoolkit_player');
        if (saved) {
            const savedData = JSON.parse(saved);
            this.player = { ...this.player, ...savedData };
            // Convert pagesVisited back to Set
            this.player.stats.pagesVisited = new Set(this.player.stats.pagesVisited || []);
        }
    }

    // Save player data to localStorage
    savePlayerData() {
        const dataToSave = {
            ...this.player,
            stats: {
                ...this.player.stats,
                pagesVisited: Array.from(this.player.stats.pagesVisited)
            }
        };
        localStorage.setItem('webtoolkit_player', JSON.stringify(dataToSave));
    }

    // Setup event listeners for gamification
    setupEventListeners() {
        // Calculator usage
        document.addEventListener('calculationPerformed', () => {
            this.addXP(5, 'Calculation completed!');
            this.updateDailyProgress('calculations', 1);
            this.player.stats.totalCalculations++;
            this.checkAchievements();
        });

        // Contact added
        document.addEventListener('contactAdded', () => {
            this.addXP(10, 'Contact added!');
            this.updateDailyProgress('contacts', 1);
            this.player.stats.totalContacts++;
            this.checkAchievements();
        });

        // Image uploaded
        document.addEventListener('imageUploaded', () => {
            this.addXP(15, 'Image uploaded!');
            this.updateDailyProgress('images', 1);
            this.player.stats.totalImages++;
            this.checkAchievements();
        });

        // Theme toggle
        document.addEventListener('themeChanged', (e) => {
            if (e.detail.theme === 'dark') {
                this.startDarkModeTimer();
            } else {
                this.stopDarkModeTimer();
            }
        });

        // Action card clicks
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', () => {
                const action = card.dataset.action;
                this.handleActionClick(action);
            });
        });
    }

    // Handle action card clicks
    handleActionClick(action) {
        const urls = {
            calculator: 'calculator.html',
            phonebook: 'phonebook.html',
            gallery: 'gallery.html'
        };

        if (urls[action]) {
            window.location.href = urls[action];
        }
    }

    // Add XP and handle level ups
    addXP(amount, message = '') {
        this.player.xp += amount;

        // Check for level up
        while (this.player.xp >= this.player.xpToNext) {
            this.levelUp();
        }

        this.updateUI();
        this.savePlayerData();

        if (message) {
            this.showNotification('success', 'XP Gained!', `${message} +${amount} XP`);
        }
    }

    // Handle level up
    levelUp() {
        this.player.xp -= this.player.xpToNext;
        this.player.level++;
        this.player.xpToNext = Math.floor(this.player.xpToNext * 1.5);
        this.player.title = this.levelTitles[this.player.level] || 'Legendary Master';

        this.showNotification('achievement', 'Level Up!', `Welcome to level ${this.player.level}!`);
        this.checkAchievements();
    }

    // Update daily progress
    updateDailyProgress(type, amount) {
        this.player.dailyProgress[type] += amount;
        this.updateChallengeProgress();
        this.savePlayerData();
    }

    // Update challenge progress UI
    updateChallengeProgress() {
        // Math Wizard Challenge
        const calcProgress = Math.min(this.player.dailyProgress.calculations, 20);
        const calcPercentage = (calcProgress / 20) * 100;
        const calcProgressBar = document.getElementById('calc-challenge-progress');
        const calcProgressText = document.getElementById('calc-challenge-text');

        if (calcProgressBar) {
            calcProgressBar.style.width = calcPercentage + '%';
            calcProgressBar.dataset.percentage = calcPercentage;
        }
        if (calcProgressText) {
            calcProgressText.textContent = `${calcProgress}/20`;
        }

        // Social Butterfly Challenge
        const socialProgress = Math.min(this.player.dailyProgress.contacts, 5);
        const socialPercentage = (socialProgress / 5) * 100;
        const socialProgressBar = document.getElementById('social-challenge-progress');
        const socialProgressText = document.getElementById('social-challenge-text');

        if (socialProgressBar) {
            socialProgressBar.style.width = socialPercentage + '%';
            socialProgressBar.dataset.percentage = socialPercentage;
        }
        if (socialProgressText) {
            socialProgressText.textContent = `${socialProgress}/5`;
        }

        // Creative Soul Challenge
        const creativeProgress = Math.min(this.player.dailyProgress.images, 3);
        const creativePercentage = (creativeProgress / 3) * 100;
        const creativeProgressBar = document.getElementById('creative-challenge-progress');
        const creativeProgressText = document.getElementById('creative-challenge-text');

        if (creativeProgressBar) {
            creativeProgressBar.style.width = creativePercentage + '%';
            creativeProgressBar.dataset.percentage = creativePercentage;
        }
        if (creativeProgressText) {
            creativeProgressText.textContent = `${creativeProgress}/3`;
        }

        // Check for completed challenges
        this.checkCompletedChallenges();
    }

    // Check for completed daily challenges
    checkCompletedChallenges() {
        const challenges = [
            { id: 'challenge-calculations', progress: this.player.dailyProgress.calculations, target: 20, reward: 50 },
            { id: 'challenge-social', progress: this.player.dailyProgress.contacts, target: 5, reward: 75 },
            { id: 'challenge-creative', progress: this.player.dailyProgress.images, target: 3, reward: 100 }
        ];

        challenges.forEach(challenge => {
            const element = document.getElementById(challenge.id);
            if (element && challenge.progress >= challenge.target && !element.classList.contains('completed')) {
                element.classList.add('completed');
                this.addXP(challenge.reward, `Daily challenge completed!`);
                this.showNotification('achievement', 'Challenge Complete!', `You earned ${challenge.reward} XP!`);
            }
        });
    }

    // Check and unlock achievements
    checkAchievements() {
        // First Calculation
        if (this.player.stats.totalCalculations >= 1 && !this.player.achievements.includes('first-calc')) {
            this.unlockAchievement('first-calc');
        }

        // Contact Master
        if (this.player.stats.totalContacts >= 10 && !this.player.achievements.includes('contact-master')) {
            this.unlockAchievement('contact-master');
        }

        // Gallery Curator
        if (this.player.stats.totalImages >= 5 && !this.player.achievements.includes('gallery-curator')) {
            this.unlockAchievement('gallery-curator');
        }

        // Power User
        if (this.player.level >= 5 && !this.player.achievements.includes('power-user')) {
            this.unlockAchievement('power-user');
        }

        // Night Owl
        if (this.player.stats.darkModeTime >= 3600000 && !this.player.achievements.includes('night-owl')) { // 1 hour
            this.unlockAchievement('night-owl');
        }

        // Explorer
        const requiredPages = ['index.html', 'calculator.html', 'phonebook.html', 'gallery.html', 'about.html'];
        const visitedPages = Array.from(this.player.stats.pagesVisited);
        const hasVisitedAll = requiredPages.every(page =>
            visitedPages.some(visited => visited.includes(page) || visited === page)
        );

        if (hasVisitedAll && !this.player.achievements.includes('explorer')) {
            this.unlockAchievement('explorer');
        }
    }

    // Unlock achievement
    unlockAchievement(achievementId) {
        this.player.achievements.push(achievementId);
        const achievement = this.achievements[achievementId];

        if (achievement) {
            this.addXP(achievement.xp, `Achievement unlocked: ${achievement.name}!`);
            this.showNotification('achievement', 'Achievement Unlocked!', achievement.name);

            // Update UI
            const element = document.getElementById(`achievement-${achievementId}`);
            if (element) {
                element.classList.remove('locked');
                element.classList.add('unlocked');
                element.querySelector('.achievement-status').textContent = '🏆';
            }
        }

        this.savePlayerData();
    }

    // Track page visits
    trackPageVisit() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.player.stats.pagesVisited.add(currentPage);
        this.savePlayerData();
        this.checkAchievements();
    }

    // Dark mode timer
    startDarkModeTimer() {
        if (this.darkModeTimer) return;

        this.darkModeStartTime = Date.now();
        this.darkModeTimer = setInterval(() => {
            this.player.stats.darkModeTime += 1000; // Add 1 second
            this.savePlayerData();
            this.checkAchievements();
        }, 1000);
    }

    stopDarkModeTimer() {
        if (this.darkModeTimer) {
            clearInterval(this.darkModeTimer);
            this.darkModeTimer = null;
        }
    }

    // Reset daily challenges if needed
    resetDailyChallengesIfNeeded() {
        const lastReset = localStorage.getItem('webtoolkit_last_reset');
        const today = new Date().toDateString();

        if (lastReset !== today) {
            this.player.dailyProgress = {
                calculations: 0,
                contacts: 0,
                images: 0
            };
            localStorage.setItem('webtoolkit_last_reset', today);
            this.savePlayerData();
        }
    }

    // Update UI elements
    updateUI() {
        // Player info
        const playerNameEl = document.getElementById('player-name-display');
        const playerTitleEl = document.getElementById('player-title');
        const levelBadgeEl = document.getElementById('player-level-badge');
        const xpFillEl = document.getElementById('xp-fill');
        const xpTextEl = document.getElementById('xp-text');

        if (playerNameEl) playerNameEl.textContent = this.player.name;
        if (playerTitleEl) playerTitleEl.textContent = this.player.title;
        if (levelBadgeEl) levelBadgeEl.textContent = this.player.level;

        if (xpFillEl && xpTextEl) {
            const xpPercentage = (this.player.xp / this.player.xpToNext) * 100;
            xpFillEl.style.width = xpPercentage + '%';
            xpTextEl.textContent = `${this.player.xp} / ${this.player.xpToNext} XP`;
        }

        // Update action progress
        this.updateActionProgress();
        this.updateChallengeProgress();

        // Update achievements
        this.player.achievements.forEach(achievementId => {
            const element = document.getElementById(`achievement-${achievementId}`);
            if (element) {
                element.classList.remove('locked');
                element.classList.add('unlocked');
                element.querySelector('.achievement-status').textContent = '🏆';
            }
        });
    }

    // Update action progress rings
    updateActionProgress() {
        // Calculator progress
        const calcProgress = Math.min(this.player.stats.totalCalculations, 10);
        const calcProgressEl = document.getElementById('calc-progress');
        if (calcProgressEl) {
            calcProgressEl.textContent = `${calcProgress}/10`;
        }

        // Contact progress
        const contactProgress = Math.min(this.player.stats.totalContacts, 5);
        const contactProgressEl = document.getElementById('contact-progress');
        if (contactProgressEl) {
            contactProgressEl.textContent = `${contactProgress}/5`;
        }

        // Gallery progress
        const galleryProgress = Math.min(this.player.stats.totalImages, 3);
        const galleryProgressEl = document.getElementById('gallery-progress');
        if (galleryProgressEl) {
            galleryProgressEl.textContent = `${galleryProgress}/3`;
        }
    }

    // Show notification
    showNotification(type, title, message) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">${type === 'achievement' ? '🏆' : '✨'}</div>
        <div class="notification-text">
          <div class="notification-title">${title}</div>
          <div class="notification-message">${message}</div>
        </div>
      </div>
    `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Hide notification after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }

    // Public methods for external use
    triggerCalculation() {
        document.dispatchEvent(new CustomEvent('calculationPerformed'));
    }

    triggerContactAdd() {
        document.dispatchEvent(new CustomEvent('contactAdded'));
    }

    triggerImageUpload() {
        document.dispatchEvent(new CustomEvent('imageUploaded'));
    }

    // Get player stats for display
    getPlayerStats() {
        return {
            ...this.player,
            achievements: this.player.achievements.map(id => this.achievements[id])
        };
    }
}

// Initialize gamification system
document.addEventListener('DOMContentLoaded', () => {
    window.gamificationSystem = new GamificationSystem();
});

// Export for use in other modules
export default GamificationSystem;