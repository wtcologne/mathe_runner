import { motion } from "framer-motion";
import {
  type NumberRange,
  type OperationMode,
} from "@/hooks/useTaskGenerator";

interface ModeSelectionProps {
  range: NumberRange;
  operation: OperationMode;
  sessionType: "playing" | "training";
  onRangeChange: (value: NumberRange) => void;
  onOperationChange: (value: OperationMode) => void;
  onStart: () => void;
  onBack: () => void;
}

const rangeOptions: { value: NumberRange; label: string }[] = [
  { value: "10", label: "bis 10" },
  { value: "20", label: "bis 20" },
  { value: "100", label: "bis 100" },
];

const operationOptions: { value: OperationMode; label: string }[] = [
  { value: "plus", label: "Nur Plus" },
  { value: "minus", label: "Nur Minus" },
  { value: "mixed", label: "Plus & Minus" },
];

const PillButton = ({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
      selected
        ? "bg-sky-500 text-white shadow-lg"
        : "bg-white/70 text-slate-600 shadow-inner"
    }`}
  >
    {label}
  </button>
);

export const ModeSelection = ({
  range,
  operation,
  sessionType,
  onRangeChange,
  onOperationChange,
  onStart,
  onBack,
}: ModeSelectionProps) => {
  const hintText =
    sessionType === "training"
      ? "Training – hier kannst du ohne Zeitdruck üben. Punkte bleiben entspannt."
      : "Wähle deinen Zahlenraum und deine Lieblingsaufgaben.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-[32px] bg-white/90 p-8 soft-shadow"
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase text-sky-500">Modus wählen</p>
        <h2 className="text-3xl font-semibold text-slate-900">
          Deine Mathe-Reise
        </h2>
        <p className="text-slate-600">{hintText}</p>
      </div>

      <div className="space-y-4 rounded-3xl bg-gradient-to-br from-sky-50 to-pink-50 p-6">
        <p className="text-lg font-semibold text-slate-700">
          Zahlenraum auswählen
        </p>
        <div className="flex flex-wrap gap-3">
          {rangeOptions.map((option) => (
            <PillButton
              key={option.value}
              selected={range === option.value}
              label={option.label}
              onClick={() => onRangeChange(option.value)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-3xl bg-gradient-to-br from-lime-50 to-amber-50 p-6">
        <p className="text-lg font-semibold text-slate-700">Rechenart</p>
        <div className="flex flex-wrap gap-3">
          {operationOptions.map((option) => (
            <PillButton
              key={option.value}
              selected={operation === option.value}
              label={option.label}
              onClick={() => onOperationChange(option.value)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onBack}
          className="rounded-2xl border border-slate-200 px-6 py-4 font-semibold text-slate-500 transition hover:bg-slate-50"
        >
          Zurück
        </button>
        <button
          onClick={onStart}
          className="flex-1 rounded-2xl bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-pink-200 transition hover:translate-y-0.5"
        >
          Los geht&apos;s!
        </button>
      </div>
    </motion.div>
  );
};
