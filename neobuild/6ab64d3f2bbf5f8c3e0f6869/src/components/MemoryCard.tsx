import { Circle, Cloud, Crown, Diamond, Gem, Heart, Leaf, Moon, Music, Star, Sun, Zap } from "lucide-react";
interface MemoryCardProps { symbol: string; flipped: boolean; matched: boolean; disabled: boolean; onClick: () => void; index: number }
const icons = { circle: Circle, cloud: Cloud, crown: Crown, diamond: Diamond, gem: Gem, heart: Heart, leaf: Leaf, moon: Moon, music: Music, star: Star, sun: Sun, zap: Zap } as const;
const colorNames = ["violet", "blue", "cyan", "teal", "green", "amber", "rose", "pink"] as const;

export default function MemoryCard({ symbol, flipped, matched, disabled, onClick, index }: MemoryCardProps) {
  const Icon = icons[symbol as keyof typeof icons] || Star;
  const visible = flipped || matched;
  const locked = matched;
  const unavailable = disabled || locked;
  const colorClass = `card-color-${colorNames[index % colorNames.length]}`;
  const stateClass = locked ? "card-is-matched" : "";
  const handleClick = () => { if (!unavailable) onClick(); };
  return <div className={`card-perspective aspect-square ${colorClass} ${stateClass}`}><button type='button' aria-label={locked ? `Matched card ${index + 1}, ${symbol}` : visible ? `Card ${index + 1}, ${symbol}` : `Reveal card ${index + 1}`} aria-pressed={visible} aria-disabled={unavailable} disabled={unavailable} onClick={handleClick} className={`h-full w-full rounded-2xl text-left ${unavailable ? "cursor-not-allowed" : "cursor-pointer"}`}><div className={`card-inner relative h-full w-full ${visible ? "is-flipped" : ""}`}><div className='card-face card-front absolute inset-0 grid place-items-center overflow-hidden rounded-2xl border shadow-xl transition hover:brightness-110'><span className='absolute -right-3 -top-3 h-14 w-14 rounded-full bg-white/10' /><span aria-hidden='true' className='text-2xl font-black text-white/80'>?</span></div><div className={`card-face card-back absolute inset-0 grid place-items-center rounded-2xl border ${locked ? "card-matched" : "card-back-unmatched"} shadow-xl`}><Icon className={`h-8 w-8 sm:h-10 sm:w-10 ${locked ? "text-ink-950" : "card-icon"}`} strokeWidth={1.7} /></div></div></button></div>;}