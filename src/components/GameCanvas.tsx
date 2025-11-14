import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import type { Lane, MathTask } from "@/hooks/useTaskGenerator";
import type { ScoreFeedback } from "@/hooks/useGameState";

const laneOrder: Lane[] = ["left", "center", "right"];

interface GameCanvasProps {
  task: MathTask | null;
  lane: Lane;
  isActive: boolean;
  isTraining: boolean;
  pulseKey: number;
  shakeKey: number;
  feedback: ScoreFeedback | null;
  recentResult: "correct" | "wrong" | null;
  correctCount: number;
  onReachCheckpoint: () => void;
  onLaneClick: (lane: Lane) => void;
}

export const GameCanvas = ({
  task,
  lane,
  isActive,
  isTraining,
  pulseKey,
  shakeKey,
  feedback,
  recentResult,
  correctCount,
  onReachCheckpoint,
  onLaneClick,
}: GameCanvasProps) => {
  const [progress, setProgress] = useState(0);
  const frame = useRef<number | null>(null);
  const lastTime = useRef<number | null>(null);
  const progressRef = useRef(0);
  const shakeControls = useAnimationControls();

  const baseSpeed = isTraining ? 0.14 : 0.26;
  const speedBoost = Math.min(correctCount * 0.008, isTraining ? 0.05 : 0.15);
  const currentSpeed = (isActive ? 1 : 0) * Math.min(baseSpeed + speedBoost, 0.55);

  useEffect(() => {
    if (!shakeKey) {
      shakeControls.set({ x: 0 });
      return;
    }
    const sequence = async () => {
      await shakeControls.start({
        x: [0, -10, 10, -5, 5, 0],
        transition: { duration: 0.45 },
      });
      shakeControls.set({ x: 0 });
    };
    sequence();
  }, [shakeControls, shakeKey]);

  // Reset progress when task changes
  useEffect(() => {
    if (task) {
      setProgress(0);
      progressRef.current = 0;
    }
  }, [task?.id]);

  useEffect(() => {
    if (!isActive || !task) {
      return;
    }

    const loop = (time: number) => {
      if (lastTime.current === null) {
        lastTime.current = time;
      }
      const previous = lastTime.current ?? time;
      const delta = (time - previous) / 1000;
      lastTime.current = time;

      // Update progress using ref
      const next = progressRef.current + delta * currentSpeed;
      
      if (next >= 1) {
        // Checkpoint reached
        progressRef.current = 0;
        setProgress(0);
        onReachCheckpoint();
      } else {
        progressRef.current = next;
        setProgress(next);
      }

      frame.current = requestAnimationFrame(loop);
    };

    frame.current = requestAnimationFrame(loop);

    return () => {
      if (frame.current) {
        cancelAnimationFrame(frame.current);
        frame.current = null;
      }
      lastTime.current = null;
    };
  }, [currentSpeed, isActive, onReachCheckpoint, task]);

  const handleLaneClick = (clickedLane: Lane) => {
    if (isActive && clickedLane !== lane) {
      onLaneClick(clickedLane);
    }
  };

  const backgroundOffset = useMemo(() => progress * -60, [progress]);

  return (
    <motion.div
      animate={shakeControls}
      className="relative w-full overflow-hidden rounded-[36px] bg-gradient-to-b from-[#ccf2ff] via-[#ddebff] to-[#f9f0ff] p-4 soft-shadow"
    >
      <div
        className="floating-stars absolute inset-0 opacity-50"
        style={{ backgroundPositionY: `${backgroundOffset}px` }}
      />
      <AnimatePresence>
        {feedback && (
          <motion.div
            key={feedback.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className={`pointer-events-none absolute inset-0 rounded-[36px] ${
              feedback.type === "plus"
                ? "bg-gradient-to-b from-emerald-200 via-transparent to-transparent"
                : "bg-gradient-to-b from-rose-200 via-transparent to-transparent"
            }`}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 h-[520px] w-full">
        <div className="grid h-full grid-cols-3 gap-3">
          {laneOrder.map((laneName, index) => (
            <button
              key={laneName}
              onClick={() => handleLaneClick(laneName)}
              disabled={!isActive}
              className={`lane-background relative rounded-[28px] border border-white/40 bg-white/20 transition-all ${
                isActive
                  ? "cursor-pointer hover:bg-white/30 hover:border-white/60"
                  : "cursor-default"
              } ${lane === laneName ? "ring-4 ring-purple-400 ring-opacity-50" : ""}`}
              style={{
                backgroundPositionY: `${backgroundOffset * (1.2 + index * 0.1)}px`,
              }}
            >
              <div className="absolute inset-x-0 bottom-3 flex justify-center text-xs font-semibold text-slate-500 pointer-events-none">
                {laneName === "left"
                  ? "Links"
                  : laneName === "center"
                    ? "Mitte"
                    : "Rechts"}
              </div>
            </button>
          ))}
        </div>

        {task?.options.map((option) => {
          const columnIndex = laneOrder.indexOf(option.lane);
          const laneWidth = 100 / laneOrder.length;
          const laneCenter = columnIndex * laneWidth + laneWidth / 2;
          const tileOffset = -25 + progress * 115;
          return (
            <motion.div
              key={`${task.id}-${option.id}`}
              className="absolute z-20 w-[90px] -translate-x-1/2 rounded-2xl border-2 border-white/70 bg-white/80 px-3 py-2 text-center text-xl font-semibold text-slate-700"
              style={{
                left: `${laneCenter}%`,
                top: `${tileOffset}%`,
              }}
            >
              {option.value}
            </motion.div>
          );
        })}

        <div className="absolute inset-x-6 bottom-14 border-t-4 border-dashed border-white/70 text-center text-xs font-semibold uppercase tracking-[0.6em] text-slate-600">
          Check-Linie
        </div>

        <div className="pointer-events-none absolute inset-x-6 bottom-3">
          <div className="grid grid-cols-3 gap-3">
            {laneOrder.map((laneName) => (
              <div key={laneName} className="flex justify-center">
                {lane === laneName && (
                  <motion.div
                    layoutId="runner"
                    className="pointer-events-none relative h-28 w-28"
                    transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  >
                    <img
                      src="/images/robot.png"
                      alt="Robot"
                      className="h-full w-full object-contain drop-shadow-2xl"
                    />
                    <AnimatePresence>
                      {pulseKey > 0 && (
                        <motion.span
                          key={pulseKey}
                          className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 text-3xl"
                          initial={{ opacity: 0, scale: 0.3 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          ✨
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {!isTraining && (
          <AnimatePresence>
            {feedback && (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: -10 }}
                exit={{ opacity: 0, y: -30 }}
                className={`pointer-events-none absolute bottom-32 left-1/2 -translate-x-1/2 text-3xl font-bold ${
                  feedback.type === "plus" ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {feedback.value > 0 ? `+${feedback.value}` : feedback.value}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Explosion effects - shown for both training and playing modes */}
        <AnimatePresence mode="wait">
          {recentResult === "correct" && (
            <motion.div
              key="explosion-correct"
              className="pointer-events-none absolute bottom-14 left-1/2 z-50 -translate-x-1/2"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2.5, opacity: [1, 1, 0] }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-4 w-4 rounded-full bg-emerald-400 shadow-lg"
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{
                    x: Math.cos((i * 22.5 * Math.PI) / 180) * 100,
                    y: Math.sin((i * 22.5 * Math.PI) / 180) * 100,
                    scale: 0,
                    opacity: [1, 0.8, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.01,
                    ease: "easeOut",
                  }}
                />
              ))}
              <motion.div
                className="absolute -left-12 -top-12 h-24 w-24 rounded-full bg-emerald-300/50 shadow-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 2.5, 3], opacity: [0.8, 0.4, 0] }}
                transition={{ duration: 0.8 }}
              />
            </motion.div>
          )}
          {recentResult === "wrong" && (
            <motion.div
              key="explosion-wrong"
              className="pointer-events-none absolute bottom-14 left-1/2 z-50 -translate-x-1/2"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2.5, opacity: [1, 1, 0] }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-4 w-4 rounded-full bg-rose-400 shadow-lg"
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{
                    x: Math.cos((i * 22.5 * Math.PI) / 180) * 100,
                    y: Math.sin((i * 22.5 * Math.PI) / 180) * 100,
                    scale: 0,
                    opacity: [1, 0.8, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.01,
                    ease: "easeOut",
                  }}
                />
              ))}
              <motion.div
                className="absolute -left-12 -top-12 h-24 w-24 rounded-full bg-rose-300/50 shadow-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 2.5, 3], opacity: [0.8, 0.4, 0] }}
                transition={{ duration: 0.8 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isTraining && recentResult && (
          <motion.div
            key={recentResult}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -6 }}
            className={`pointer-events-none absolute bottom-32 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 text-lg font-semibold ${
              recentResult === "correct"
                ? "bg-emerald-100 text-emerald-600"
                : "bg-rose-100 text-rose-600"
            }`}
          >
            {recentResult === "correct" ? "Richtig!" : "Fast!"}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
