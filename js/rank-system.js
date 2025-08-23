// Solo Leveling Inspired Rank System

class RankSystem {
  constructor() {
    this.ranks = ['E', 'D', 'C', 'B', 'A', 'S'];
    this.playerData = this.loadPlayerData();
    this.init();
  }

  init() {
    this.setupEventListeners();
    if (this.playerData.name) {
      this.showPlayerProfile();
    }
  }

  setupEventListeners() {
    const checkRankBtn = document.getElementById('check-rank-btn');
    const showQuestsBtn = document.getElementById('show-quests-btn');
    const resetRankBtn = document.getElementById('reset-rank-btn');
    const backToProfileBtn = document.getElementById('back-to-profile-btn');
    const nameInput = document.getElementById('player-name');

    checkRankBtn?.addEventListener('click', () => this.checkRank());
    showQuestsBtn?.addEventListener('click', () => this.showQuests());
    resetRankBtn?.addEventListener('click', () => this.resetPlayer());
    backToProfileBtn?.addEventListener('click', () => this.showPlayerProfile());

    nameInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.checkRank();
    });

    // Quest completion buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('quest-complete-btn')) {
        const questType = e.target.dataset.quest;
        this.completeQuest(questType, e.target);
      }
    });
  }

  checkRank() {
    const nameInput = document.getElementById('player-name');
    const name = nameInput.value.trim();
    
    if (!name) {
      this.showError('Please enter your name!');
      return;
    }

    // Generate "random" rank based on name
    const rank = this.generateRank(name);
    const level = this.generateLevel(name);
    const power = this.calculatePower(rank, level);

    this.playerData = {
      name,
      rank,
      level,
      exp: 0,
      maxExp: 100,
      power,
      completedQuests: []
    };

    this.savePlayerData();
    this.showPlayerProfile();
  }

  generateRank(name) {
    // Simple hash function to generate consistent rank
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) & 0xffffffff;
    }
    const index = Math.abs(hash) % this.ranks.length;
    return this.ranks[index];
  }

  generateLevel(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 3) - hash + name.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(hash) % 10 + 1; // Level 1-10
  }

  calculatePower(rank, level) {
    const rankMultiplier = {
      'E': 10, 'D': 25, 'C': 50, 'B': 100, 'A': 200, 'S': 500
    };
    return rankMultiplier[rank] * level;
  }

  showPlayerProfile() {
    document.getElementById('rank-checker').style.display = 'none';
    document.getElementById('daily-quests').style.display = 'none';
    
    const profile = document.getElementById('player-profile');
    profile.style.display = 'block';

    // Update profile data
    document.getElementById('player-name-display').textContent = this.playerData.name;
    document.getElementById('rank-letter').textContent = this.playerData.rank;
    document.getElementById('player-level').textContent = this.playerData.level;
    document.getElementById('player-exp').textContent = `${this.playerData.exp}/${this.playerData.maxExp}`;
    document.getElementById('player-power').textContent = this.playerData.power;

    // Update rank badge color
    const rankBadge = document.querySelector('.rank-badge');
    rankBadge.style.background = this.getRankColor(this.playerData.rank);
  }

  showQuests() {
    document.getElementById('player-profile').style.display = 'none';
    document.getElementById('daily-quests').style.display = 'block';

    // Reset quest buttons if new day
    this.resetDailyQuests();
  }

  completeQuest(questType, button) {
    if (button.classList.contains('completed')) return;

    // Mark as completed
    button.classList.add('completed');
    button.textContent = 'Completed!';
    
    // Add EXP
    this.playerData.exp += 10;
    
    // Check for level up
    if (this.playerData.exp >= this.playerData.maxExp) {
      this.levelUp();
    }

    // Save progress
    if (!this.playerData.completedQuests.includes(questType)) {
      this.playerData.completedQuests.push(questType);
    }
    
    this.savePlayerData();
    this.showQuestComplete(questType);
  }

  levelUp() {
    this.playerData.level++;
    this.playerData.exp = 0;
    this.playerData.maxExp += 20;
    this.playerData.power = this.calculatePower(this.playerData.rank, this.playerData.level);
    
    this.showLevelUp();
  }

  resetPlayer() {
    this.playerData = {};
    this.savePlayerData();
    
    document.getElementById('player-profile').style.display = 'none';
    document.getElementById('daily-quests').style.display = 'none';
    document.getElementById('rank-checker').style.display = 'block';
    document.getElementById('player-name').value = '';
  }

  resetDailyQuests() {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('lastQuestReset');
    
    if (lastReset !== today) {
      this.playerData.completedQuests = [];
      localStorage.setItem('lastQuestReset', today);
      this.savePlayerData();
    }

    // Update quest buttons
    document.querySelectorAll('.quest-complete-btn').forEach(btn => {
      const questType = btn.dataset.quest;
      if (this.playerData.completedQuests.includes(questType)) {
        btn.classList.add('completed');
        btn.textContent = 'Completed!';
      } else {
        btn.classList.remove('completed');
        btn.textContent = 'Complete';
      }
    });
  }

  getRankColor(rank) {
    const colors = {
      'E': 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
      'D': 'linear-gradient(135deg, #ffa726, #ff7043)',
      'C': 'linear-gradient(135deg, #66bb6a, #43a047)',
      'B': 'linear-gradient(135deg, #42a5f5, #1e88e5)',
      'A': 'linear-gradient(135deg, #ab47bc, #8e24aa)',
      'S': 'linear-gradient(135deg, #ffd700, #ffb300)'
    };
    return colors[rank] || colors['E'];
  }

  showError(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4757;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  showQuestComplete(questType) {
    const messages = {
      pushups: '💪 Push-ups completed! +10 EXP',
      run: '🏃 Run completed! +10 EXP',
      situps: '🤸 Sit-ups completed! +10 EXP'
    };
    
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #2ed573;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    toast.textContent = messages[questType] || 'Quest completed!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  showLevelUp() {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #ffd700, #ffb300);
      color: #333;
      padding: 24px 48px;
      border-radius: 16px;
      z-index: 1000;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      animation: levelUpPulse 2s ease;
    `;
    toast.innerHTML = `
      🎉 LEVEL UP! 🎉<br>
      <span style="font-size: 18px;">Level ${this.playerData.level}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  loadPlayerData() {
    try {
      const saved = localStorage.getItem('playerRankData');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      return {};
    }
  }

  savePlayerData() {
    try {
      localStorage.setItem('playerRankData', JSON.stringify(this.playerData));
    } catch (error) {
      console.warn('Failed to save player data');
    }
  }
}

// Add level up animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes levelUpPulse {
    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  }
`;
document.head.appendChild(style);

// Initialize rank system
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('rank-checker')) {
    new RankSystem();
  }
});

export default RankSystem;