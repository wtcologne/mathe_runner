import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md rounded-3xl bg-white p-8 text-slate-800 shadow-2xl"
          >
            <h3 className="text-2xl font-semibold text-slate-900">
              Einstellungen
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Hier kannst du später Sounds oder Effekte anpassen.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <label className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Sound</p>
                  <p className="text-xs text-slate-500">
                    Fröhliche Effekte beim richtigen Ergebnis.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  className="h-5 w-5 accent-sky-500"
                  onChange={() => setSoundEnabled((prev) => !prev)}
                />
              </label>
              <label className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Vibration</p>
                  <p className="text-xs text-slate-500">
                    Kleines Feedback bei Fehlern (für mobile Geräte).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={vibrationEnabled}
                  className="h-5 w-5 accent-pink-500"
                  onChange={() => setVibrationEnabled((prev) => !prev)}
                />
              </label>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full rounded-2xl bg-sky-500 py-3 text-white"
            >
              Zurück
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
