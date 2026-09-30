import type { Difficulty, CardCount } from "../hooks/useMemoryGame";

export interface LevelDefinition {
  index: number;
  id: string;
  cardCount: CardCount;
  difficulty: Difficulty;
}

export interface ProgressResult {
  score: number;
  time: number;
  moves: number;
  completedAt: string;
}

export interface ProgressState {
  unlockedLevels: number[];
  lastCompletedLevel: number;
  /** The level the player was last playing, including an unfinished level. */
  currentLevel: number;
  bestScores: Record<string, number>;
  bestTimes: Record<string, number>;
  results: Record<string, ProgressResult>;
}

const PROGRESSION_CARD_COUNTS: CardCount[] = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48];
const PROGRESSION_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard", "expert", "master"];

/** The order here is the unlock order: all five challenges for a board size,
 * followed by Easy for the next board size. */
export const LEVELS: LevelDefinition[] = PROGRESSION_CARD_COUNTS.flatMap((cardCount) =>
  PROGRESSION_DIFFICULTIES.map((difficulty, difficultyIndex) => {
    const index = PROGRESSION_CARD_COUNTS.indexOf(cardCount) * PROGRESSION_DIFFICULTIES.length + difficultyIndex;
    return { index, id: `${cardCount}-${difficulty}`, cardCount, difficulty };
  }),
);

export function createInitialProgress(): ProgressState {
return { unlockedLevels: [0], lastCompletedLevel: -1, currentLevel: 0, bestScores: {}, bestTimes: {}, results: {} };
}

export function mergeProgress(base: ProgressState, update: Partial<ProgressState>): ProgressState {
  return {
    ...base,
    ...update,
    unlockedLevels: Array.from(new Set([...(base.unlockedLevels || []), ...(update.unlockedLevels || [])])).sort((a, b) => a - b),
    bestScores: { ...base.bestScores, ...update.bestScores },
    bestTimes: { ...base.bestTimes, ...update.bestTimes },
    results: { ...base.results, ...update.results },
  };
}