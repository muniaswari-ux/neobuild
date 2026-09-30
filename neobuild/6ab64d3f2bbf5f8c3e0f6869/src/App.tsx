import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthGate from "./components/AuthGate";
import { LEVELS, mergeProgress, type LevelDefinition, type ProgressState } from "./types/progress";
import { loadLocalProgress, saveLocalProgress } from "./lib/progress/storage";
import { loadCloudProgress, saveCloudProgress } from "./lib/progress/progressApi";
import { Brain, ChevronRight, RotateCcw, Sparkles, Trophy, WandSparkles } from "lucide-react";
import { useMemoryGame, type CardCount, type Difficulty } from "./hooks/useMemoryGame";
import Scoreboard, { formatTime } from "./components/Scoreboard";
import DifficultySelector from "./components/DifficultySelector";
import MemoryCard from "./components/MemoryCard";

function App(): JSX.Element {
  const { user } = useAuth();
const [progress, setProgress] = useState<ProgressState>(() => loadLocalProgress());
  const [levelIndex, setLevelIndex] = useState(() => loadLocalProgress().currentLevel);
  const [showSetup, setShowSetup] = useState(false);
  const level: LevelDefinition = LEVELS[levelIndex] ?? LEVELS[0];
  const { cardCount, difficulty } = level;
useEffect(() => {
if (!user) {
      const local = loadLocalProgress();
      setProgress(local);
      setLevelIndex(local.currentLevel);
      return;
    }

    // Cloud progress is optional. Keep sign-in and local play working when the
    // cloud adapter is unavailable or a request fails.
    void Promise.resolve()
      .then(() => loadCloudProgress(user.id))
.then(cloud => {
        if (cloud) {
          const merged = mergeProgress(loadLocalProgress(), cloud);
          setProgress(merged);
          setLevelIndex(merged.currentLevel);
        }
      })
      .catch(() => {
        // Local progress remains the source of truth until cloud sync is ready.
      });
  }, [user]);
  const recordCompletion = useCallback((result: { score: number; time: number; moves: number }) => { setProgress(current => { const nextIndex = Math.min(levelIndex + 1, LEVELS.length - 1); const next = mergeProgress(current, { currentLevel: nextIndex, unlockedLevels: [...current.unlockedLevels, nextIndex], lastCompletedLevel: levelIndex, bestScores: { [level.id]: Math.max(current.bestScores[level.id] || 0, result.score) }, bestTimes: { [level.id]: current.bestTimes[level.id] ? Math.min(current.bestTimes[level.id], result.time) : result.time }, results: { [level.id]: { ...result, completedAt: new Date().toISOString() } } }); saveLocalProgress(next); if (user) void Promise.resolve().then(() => saveCloudProgress(user.id, next)).catch(() => { /* local save succeeded */ }); return next; }); }, [level.id, levelIndex, user]);
  const game = useMemoryGame(cardCount, difficulty, recordCompletion);
const changeLevel = (selected: LevelDefinition): void => {
    if (!progress.unlockedLevels.includes(selected.index)) return;
    setLevelIndex(selected.index);
    setProgress(current => {
      const next = { ...current, currentLevel: selected.index };
      saveLocalProgress(next);
      if (user) void Promise.resolve().then(() => saveCloudProgress(user.id, next)).catch(() => { /* local save succeeded */ });
      return next;
    });
    setShowSetup(true);
  };
  const columns = cardCount <= 16 ? "grid-cols-4" : cardCount <= 20 ? "grid-cols-5" : cardCount <= 36 ? "grid-cols-6" : "grid-cols-8";
  return <main className="min-h-screen overflow-x-hidden px-4 py-5 sm:px-8 sm:py-8"><div className="mx-auto max-w-5xl"><header className="mb-7 flex items-center justify-between"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-lavender-400 to-coral-400 shadow-glow"><Brain className="h-6 w-6 text-white" /></div><div><h1 className="text-xl font-black tracking-tight sm:text-2xl">FlipBloom</h1><p className="text-xs text-white/45">{user ? `Signed in as ${user.email}` : "A little spark for your memory"}</p></div></div><div className="rounded-xl border border-lavender-400/25 bg-lavender-500/10 px-3 py-2 text-center" aria-label={`Current level: ${level.index + 1}`}><span className="block text-[10px] font-bold uppercase tracking-widest text-lavender-300">Current level</span><strong className="text-lg font-black text-white">{level.index + 1}</strong></div><button type="button" onClick={() => { game.newGame(); setShowSetup(true); }} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.06] px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/10"><WandSparkles className="h-4 w-4 text-lavender-300" /><span className="hidden sm:inline">New game</span></button></header>
  {showSetup ? <section className="animate-float rounded-[2rem] border border-white/10 bg-white/[.06] p-6 shadow-2xl backdrop-blur sm:p-10"><div className="max-w-xl"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-lavender-400/20 bg-lavender-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-lavender-300"><Sparkles className="h-3.5 w-3.5" /> Choose your challenge</div><h2 className="text-3xl font-black leading-tight sm:text-5xl">Find the pairs.<br /><span className="text-lavender-300">Feel the flow.</span></h2><p className="mt-4 max-w-md text-sm leading-6 text-white/55">Turn over two cards at a time, match every symbol, and chase your personal best.</p></div><div className="mt-8"><DifficultySelector levels={LEVELS} progress={progress} selected={levelIndex} onChange={changeLevel} /></div><AuthGate /><button type="button" onClick={() => { game.newGame(); setShowSetup(false); }} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-lavender-500 px-5 py-4 font-bold shadow-glow transition hover:bg-lavender-400 active:scale-[.98] sm:w-auto">Start playing <ChevronRight className="h-5 w-5" /></button></section> : <><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-lavender-300">{cardCount} cards · {difficulty} mode</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">Stay curious.</h2></div><button type="button" onClick={() => game.newGame()} className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-white/65 transition hover:bg-white/10"><RotateCcw className="h-4 w-4" /> Restart</button></div><div className="scoreboard-scroll -mx-1 overflow-x-auto px-1 pb-1"><Scoreboard score={game.score} best={progress.bestScores[level.id] || game.best.score} bestTime={progress.bestTimes[level.id] || 0} moves={game.moves} moveLimit={game.moveLimit} time={game.time} pairs={game.pairs} totalPairs={game.totalPairs} /></div><div className={`game-grid mx-auto mt-5 grid max-w-3xl gap-2.5 sm:mt-6 sm:gap-4 ${columns}`}>{game.cards.map((card, index) => <MemoryCard key={card.id} {...card} disabled={card.matched || game.complete || (game.cards.filter(item => item.flipped && !item.matched).length >= 2 && !card.flipped)} index={index} onClick={() => game.chooseCard(card.id)} />)}</div>{game.complete && <div className="fixed inset-0 z-10 grid place-items-center bg-ink-950/80 p-5 backdrop-blur-md"><section role="dialog" aria-modal="true" className="w-full max-w-md animate-pop rounded-[2rem] border border-white/15 bg-ink-800 p-7 text-center shadow-2xl sm:p-10"><div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-amber-300 to-coral-400 shadow-glow"><Trophy className="h-8 w-8 text-ink-950" /></div><p className="mt-5 text-sm font-bold uppercase tracking-[.2em] text-mint-400">Board complete</p><h2 className="mt-2 text-4xl font-black">You Won!</h2><p className="mt-3 text-sm text-white/55">A brilliant run. Your memory is blooming.</p><div className="my-7 grid grid-cols-3 gap-2"><div className="rounded-2xl bg-white/[.06] p-3"><strong className="block text-xl">{game.score}</strong><span className="text-[10px] uppercase tracking-wider text-white/45">Score</span></div><div className="rounded-2xl bg-white/[.06] p-3"><strong className="block text-xl">{formatTime(game.time)}</strong><span className="text-[10px] uppercase tracking-wider text-white/45">Time</span></div><div className="rounded-2xl bg-white/[.06] p-3"><strong className="block text-xl">{game.moves}</strong><span className="text-[10px] uppercase tracking-wider text-white/45">Moves</span></div></div><p className="mb-6 rounded-xl bg-lavender-500/10 px-4 py-3 text-sm text-lavender-300">Best {cardCount} card {difficulty} score: <strong>{game.best.score}</strong></p><button type="button" onClick={() => game.newGame()} className="w-full rounded-2xl bg-lavender-500 px-5 py-4 font-bold transition hover:bg-lavender-400">Play again</button><button type="button" onClick={() => setShowSetup(true)} className="mt-3 w-full rounded-2xl px-5 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/5">Change challenge</button></section></div>}</>}</div></main>;
}
export default App;