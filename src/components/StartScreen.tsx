import { motion } from "framer-motion";

interface StartScreenProps {
  onPlay: () => void;
  onTraining: () => void;
  onOpenSettings: () => void;
}

export const StartScreen = ({
  onPlay,
  onTraining,
  onOpenSettings,
}: StartScreenProps) => (
  <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 rounded-[32px] bg-white/80 p-8 text-center soft-shadow">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <p className="text-sm uppercase tracking-[0.3rem] text-sky-500">
        Für Mathe-Held*innen
      </p>
      <h1 className="mt-3 text-4xl font-semibold text-slate-900 sm:text-5xl">
        Mathe-Runner
      </h1>
      <p className="mt-4 text-lg text-slate-600 sm:text-xl">
        Flitze mit deinem Mini-Raumschiff nach oben, sammle richtige Antworten
        und werde Kopfrechen-Profi!
      </p>
    </motion.div>

    <motion.div
      className="grid w-full gap-4 sm:grid-cols-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <button
        onClick={onPlay}
        className="rounded-2xl bg-gradient-to-b from-sky-400 to-sky-500 px-6 py-5 text-lg font-semibold text-white shadow-lg shadow-sky-200 transition hover:translate-y-0.5 hover:shadow-sky-300"
      >
        Spielen
      </button>
      <button
        onClick={onTraining}
        className="rounded-2xl border border-dashed border-sky-200 bg-white/70 px-6 py-5 text-lg font-semibold text-slate-700 transition hover:border-sky-400 hover:bg-sky-50"
      >
        Training
      </button>
      <button
        onClick={onOpenSettings}
        className="rounded-2xl bg-white px-6 py-5 text-lg font-semibold text-slate-700 shadow-inner shadow-slate-100 transition hover:bg-slate-50 hover:text-slate-900"
      >
        Einstellungen
      </button>
    </motion.div>
  </div>
);
