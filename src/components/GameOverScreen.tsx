import { motion } from "framer-motion";
import type { GameResult } from "@/hooks/useGameState";

interface GameOverScreenProps {
  score: number;
  stats: { correct: number; wrong: number };
  result: GameResult;
  onRetry: () => void;
  onBack: () => void;
}

export const GameOverScreen = ({
  score,
  stats,
  result,
  onRetry,
  onBack,
}: GameOverScreenProps) => {
  const isWon = result === "won";
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-[32px] bg-white/95 p-8 text-center soft-shadow"
    >
      <p className="text-sm uppercase tracking-[0.3rem] text-slate-500">
        {isWon ? "Gewonnen!" : "Game Over"}
      </p>
      <h2 className="text-4xl font-semibold text-slate-900">
        {isWon ? "🎉 Fantastisch! Du hast gewonnen! 🎉" : "😔 Schade! Versuch es nochmal!"}
      </h2>
      <p className="text-lg text-slate-600">
        {isWon 
          ? `Du hast ${score} Punkte erreicht und ${stats.correct} Aufgaben richtig gelöst!`
          : `Du hast ${stats.correct} Aufgaben richtig gelöst und ${stats.wrong} falsch beantwortet.`
        }
      </p>
      <div className="grid grid-cols-2 gap-4 text-left">
        <div className={`rounded-2xl p-4 ${isWon ? "bg-emerald-50" : "bg-rose-50"}`}>
          <p className="text-sm text-slate-500">Punkte</p>
          <p className="text-3xl font-semibold text-slate-900">{score}</p>
        </div>
        <div className="rounded-2xl bg-sky-50 p-4">
          <p className="text-sm text-slate-500">Richtige Antworten</p>
          <p className="text-3xl font-semibold text-slate-900">{stats.correct}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onRetry}
          className={`flex-1 rounded-2xl px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:translate-y-0.5 ${
            isWon 
              ? "bg-gradient-to-r from-emerald-400 to-green-500 shadow-emerald-200" 
              : "bg-gradient-to-r from-sky-400 to-purple-400 shadow-sky-200"
          }`}
        >
          Nochmal spielen
        </button>
        <button
          onClick={onBack}
          className="rounded-2xl border border-slate-200 px-6 py-4 font-semibold text-slate-500 transition hover:bg-slate-50"
        >
          Zurück zum Start
        </button>
      </div>
    </motion.div>
  );
};
