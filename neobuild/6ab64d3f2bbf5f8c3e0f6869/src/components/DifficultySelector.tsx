import { Check, Lock, Sparkles } from "lucide-react";
import type { LevelDefinition, ProgressState } from "../types/progress";

interface DifficultySelectorProps {
  levels: LevelDefinition[];
  progress: ProgressState;
  selected: number;
  onChange: (level: LevelDefinition) => void;
}

export default function DifficultySelector({ levels, progress, selected, onChange }: DifficultySelectorProps) {
  const groups = levels.reduce<Record<number, LevelDefinition[]>>((byCount, level) => {
    (byCount[level.cardCount] ??= []).push(level);
    return byCount;
  }, {});

  return <div className="space-y-6">
    {Object.entries(groups).map(([cardCount, group]) => <section className="level-group" key={cardCount} aria-labelledby={`levels-${cardCount}`}>
      <h3 id={`levels-${cardCount}`} className="level-group-heading mb-2 text-[10px] font-black">{cardCount} cards</h3>
      <div className="grid gap-2 sm:grid-cols-5">{group.map(level => {
        const unlocked = progress.unlockedLevels.includes(level.index);
        const active = selected === level.index;
        return <button type="button" key={level.id} disabled={!unlocked} onClick={() => onChange(level)} aria-pressed={active} className={`relative rounded-2xl border p-3 text-left transition duration-200 ${active ? "border-lavender-400 bg-lavender-500/20 shadow-glow" : unlocked ? "border-white/10 bg-white/[.05] hover:-translate-y-1 hover:border-white/25" : "cursor-not-allowed border-white/5 bg-white/[.02] opacity-45"}`}>
          {active && <Check className="absolute right-2 top-2 h-4 w-4 text-lavender-300" />}
          {unlocked ? <Sparkles className="mb-2 h-4 w-4 text-lavender-300" /> : <Lock className="mb-2 h-4 w-4 text-white/40" />}
          <strong className="block">Level {level.index + 1}</strong><span className="mt-1 block text-xs capitalize text-white/45">{level.difficulty}</span>{active && <span className="mt-2 block text-[10px] font-bold uppercase tracking-wider text-lavender-300">Current level</span>}
        </button>;
      })}</div>
    </section>)}
  </div>;
}