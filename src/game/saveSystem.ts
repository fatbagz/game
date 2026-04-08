const STORAGE_KEY = 'meme_platformer_save';

export interface SaveData {
  levelUnlocked: number;
  highScore: number;
  levelScores: Record<number, number>;
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
  };
}

const DEFAULT_SAVE: SaveData = {
  levelUnlocked: 1,
  highScore: 0,
  levelScores: {},
  settings: {
    soundEnabled: true,
    musicEnabled: true,
  },
};

export function loadSave(): SaveData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { ...DEFAULT_SAVE };

    const data = JSON.parse(saved);
    return {
      ...DEFAULT_SAVE,
      ...data,
      settings: {
        ...DEFAULT_SAVE.settings,
        ...data.settings,
      },
    };
  } catch (error) {
    console.error('Failed to load save data:', error);
    return { ...DEFAULT_SAVE };
  }
}

export function saveSave(data: SaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
}

export function updateLevelUnlocked(level: number): void {
  const save = loadSave();
  if (level > save.levelUnlocked) {
    save.levelUnlocked = level;
    saveSave(save);
  }
}

export function updateScore(score: number, level?: number): void {
  const save = loadSave();

  if (score > save.highScore) {
    save.highScore = score;
  }

  if (level !== undefined) {
    if (!save.levelScores[level] || score > save.levelScores[level]) {
      save.levelScores[level] = score;
    }
  }

  saveSave(save);
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
