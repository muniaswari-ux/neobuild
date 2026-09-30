import { createInitialProgress, type ProgressState } from "../../types/progress";

const STORAGE_KEY = "flipbloom-progress-v1";

export function loadLocalProgress(): ProgressState {
  const initial = createInitialProgress();
  if (typeof window === "undefined") return initial;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
const unlockedLevels = Array.isArray(parsed.unlockedLevels)
      ? parsed.unlockedLevels.filter((level): level is number => Number.isInteger(level) && level >= 0)
      : initial.unlockedLevels;
    const currentLevel = Number.isInteger(parsed.currentLevel) && (parsed.currentLevel as number) >= 0
      ? parsed.currentLevel as number
      : Number.isInteger(parsed.lastCompletedLevel) && (parsed.lastCompletedLevel as number) >= 0
        ? Math.min((parsed.lastCompletedLevel as number) + 1, Math.max(...unlockedLevels))
        : initial.currentLevel;
    return {
      ...initial,
      ...parsed,
      unlockedLevels: unlockedLevels.length ? unlockedLevels : initial.unlockedLevels,
      currentLevel: unlockedLevels.includes(currentLevel) ? currentLevel : initial.currentLevel,
      bestScores: parsed.bestScores && typeof parsed.bestScores === "object" ? parsed.bestScores : initial.bestScores,
      bestTimes: parsed.bestTimes && typeof parsed.bestTimes === "object" ? parsed.bestTimes : initial.bestTimes,
      results: parsed.results && typeof parsed.results === "object" ? parsed.results : initial.results,
    };
  } catch {
    return initial;
  }
}

export function saveLocalProgress(progress: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage can be unavailable or full; progress remains available in memory.
  }
}