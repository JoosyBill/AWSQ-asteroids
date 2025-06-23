export interface HighScoreEntry {
  score: number;
  date: string;
  level: number;
}

export class HighScoreManager {
  private static readonly STORAGE_KEY = 'retro-arcade-high-scores';
  private static readonly MAX_SCORES = 10;

  static getHighScores(): HighScoreEntry[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const scores = JSON.parse(stored) as HighScoreEntry[];
      return scores.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.warn('Failed to load high scores:', error);
      return [];
    }
  }

  static addScore(score: number, level: number): boolean {
    try {
      const scores = this.getHighScores();
      const newEntry: HighScoreEntry = {
        score,
        level,
        date: new Date().toLocaleDateString()
      };

      scores.push(newEntry);
      scores.sort((a, b) => b.score - a.score);
      
      // Keep only top scores
      const topScores = scores.slice(0, this.MAX_SCORES);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(topScores));
      
      // Return true if this score made it to the high score list
      return topScores.includes(newEntry);
    } catch (error) {
      console.warn('Failed to save high score:', error);
      return false;
    }
  }

  static getHighScore(): number {
    const scores = this.getHighScores();
    return scores.length > 0 ? scores[0].score : 0;
  }

  static isHighScore(score: number): boolean {
    const scores = this.getHighScores();
    return scores.length < this.MAX_SCORES || score > scores[scores.length - 1].score;
  }

  static clearHighScores(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear high scores:', error);
    }
  }
}
