import { motion, AnimatePresence } from "framer-motion";
import type { MathTask } from "@/hooks/useTaskGenerator";
import type { ScoreFeedback } from "@/hooks/useGameState";

interface HUDProps {
  score: number;
  stats: { correct: number; wrong: number };
  task: MathTask | null;
  isTraining: boolean;
  solutionText: string | null;
  feedback: ScoreFeedback | null;
  onHome: () => void;
  onPause?: () => void;
  isPaused?: boolean;
}

export const HUD = ({
  score,
  stats,
  task,
  isTraining,
  solutionText,
  feedback,
  onHome,
  onPause,
  isPaused,
}: HUDProps) => {
  return (
    <div className="rounded-3xl bg-white/80 p-2 sm:p-3 soft-shadow">
      {/* Erste Zeile: Stats und Buttons - responsive für Mobile */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 mb-2 sm:mb-3">
        {/* Links: Kompakte Stats */}
        <div className="flex items-center gap-1 sm:gap-2">
          <motion.div
            key={feedback?.id ?? score}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl bg-sky-50 px-2 sm:px-3 py-1 sm:py-1.5 text-sky-700"
          >
            <span className="text-sm sm:text-lg">🪙</span>
            <span className="text-base sm:text-xl font-bold">
              {isTraining ? "∞" : score}
            </span>
          </motion.div>
          <div className="flex gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-semibold">
            <div className="rounded-md sm:rounded-lg bg-lime-50 px-1.5 sm:px-2 py-0.5 sm:py-1 text-lime-700">
              ✓ {stats.correct}
            </div>
            <div className="rounded-md sm:rounded-lg bg-rose-50 px-1.5 sm:px-2 py-0.5 sm:py-1 text-rose-700">
              ✗ {stats.wrong}
            </div>
          </div>
        </div>

        {/* Rechts: Kompakte Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onHome}
            className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl border-2 border-slate-200 bg-white text-xl sm:text-2xl transition hover:border-sky-400 active:scale-95 sm:hover:scale-110"
            title="Zum Start"
          >
            🏠
          </button>
          {onPause && (
            <button
              onClick={onPause}
              className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-lg sm:rounded-xl border-2 border-slate-200 bg-white transition hover:border-sky-400 active:scale-95 sm:hover:scale-110 shadow-sm"
              title={isPaused ? "Fortsetzen" : "Pause"}
            >
              <img
                src="/images/pause.png"
                alt={isPaused ? "Fortsetzen" : "Pause"}
                className="h-7 w-7 sm:h-9 sm:w-9 object-contain"
              />
            </button>
          )}
        </div>
      </div>

      {/* Zweite Zeile: Große Rechnung */}
      <div className="flex flex-col items-center gap-0.5 sm:gap-1 border-t border-slate-100 pt-2 sm:pt-3">
        {isTraining && (
          <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Training
          </span>
        )}
        <p className="text-2xl sm:text-4xl font-bold text-slate-900">
          {task ? task.question : "Bereit?"}
        </p>
        <AnimatePresence>
          {solutionText && (
            <motion.span
              key={solutionText}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="text-[10px] sm:text-xs font-medium text-rose-500"
            >
              {solutionText}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
