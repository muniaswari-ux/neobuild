import { Clock3, Flame, Footprints, Trophy } from "lucide-react";

interface ScoreboardProps {
  score: number;
  moves: number;
  time: number;
  pairs: number;
  totalPairs: number;
  best?: number;
  moveLimit?: number;
}

const formatTime = (seconds: number): string =>
  `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

export { formatTime };

export default function Scoreboard({ score, moves, time, pairs, totalPairs, best = 0, moveLimit = 0 }: ScoreboardProps) {
  const stats = [
    { label: "Score", value: score.toString(), icon: Trophy, color: "text-lavender-300" },
    { label: "Best", value: best.toString(), icon: Trophy, color: "text-amber-300" },
    { label: "Moves", value: moveLimit ? `${moves}/${moveLimit}` : moves.toString(), icon: Footprints, color: "text-coral-400" },
    { label: "Time", value: formatTime(time), icon: Clock3, color: "text-mint-400" },
    { label: "Progress", value: `${pairs}/${totalPairs}`, icon: Flame, color: "text-amber-300" },
  ];

  return (
    <section aria-label="Game statistics" className="stat-row flex min-w-max gap-2 sm:grid sm:min-w-0 sm:grid-cols-5 sm:gap-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="stat-box w-[4.25rem] shrink-0 rounded-xl border border-white/10 bg-white/[.06] px-1.5 py-2 text-center shadow-lg backdrop-blur sm:w-auto sm:rounded-2xl sm:px-2.5 sm:py-2.5">
          <Icon className={`mx-auto mb-1 h-3.5 w-3.5 ${color}`} />
          <p className="text-[9px] font-bold uppercase tracking-[.1em] text-white/45 sm:text-[10px]">{label}</p>
          <p className="mt-0.5 text-xs font-extrabold tabular-nums sm:text-base">{value}</p>
        </div>
      ))}
    </section>
  );
}