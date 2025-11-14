import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type Lane,
  type MathTask,
  type NumberRange,
  type OperationMode,
  useTaskGenerator,
} from "./useTaskGenerator";

export type GameStatus = "title" | "setup" | "playing" | "training" | "gameOver";
export type GameResult = "won" | "lost" | null;

export interface ScoreFeedback {
  id: string;
  type: "plus" | "minus";
  value: number;
}

const INITIAL_SCORE = 50;
const lanesOrder: Lane[] = ["left", "center", "right"];

export const useGameState = () => {
  const generateTask = useTaskGenerator();

  const [status, setStatus] = useState<GameStatus>("title");
  const [sessionIntent, setSessionIntent] = useState<"playing" | "training">(
    "playing",
  );
  const [range, setRange] = useState<NumberRange>("20");
  const [operation, setOperation] = useState<OperationMode>("mixed");
  const [score, setScore] = useState(INITIAL_SCORE);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [task, setTask] = useState<MathTask | null>(null);
  const [lane, setLane] = useState<Lane>("center");
  const [feedback, setFeedback] = useState<ScoreFeedback | null>(null);
  const [solutionText, setSolutionText] = useState<string | null>(null);
  const [recentResult, setRecentResult] = useState<"correct" | "wrong" | null>(
    null,
  );
  const [pulseKey, setPulseKey] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const pulseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isTraining = status === "training";

  const selectIntent = useCallback((mode: "playing" | "training") => {
    setSessionIntent(mode);
    setStatus("setup");
  }, []);

  const resetForNewRun = useCallback(() => {
    setScore(INITIAL_SCORE);
    setStats({ correct: 0, wrong: 0 });
    setLane("center");
    setRecentResult(null);
    setFeedback(null);
    setSolutionText(null);
    setPulseKey(0);
    setShakeKey(0);
    setGameResult(null);
  }, []);

  const startSession = useCallback(() => {
    resetForNewRun();
    setTask(generateTask(range, operation));
    setStatus(sessionIntent === "playing" ? "playing" : "training");
  }, [generateTask, operation, range, resetForNewRun, sessionIntent]);

  const restart = useCallback(() => {
    if (status === "title") {
      return;
    }
    resetForNewRun();
    setTask(generateTask(range, operation));
    setStatus(sessionIntent === "playing" ? "playing" : "training");
  }, [generateTask, operation, range, resetForNewRun, sessionIntent, status]);

  const backToStart = useCallback(() => {
    setStatus("title");
    setTask(null);
    resetForNewRun();
  }, [resetForNewRun]);

  const moveLane = useCallback((direction: "left" | "right") => {
    setLane((current) => {
      const index = lanesOrder.indexOf(current);
      if (direction === "left") {
        return lanesOrder[Math.max(0, index - 1)];
      }
      return lanesOrder[Math.min(lanesOrder.length - 1, index + 1)];
    });
  }, []);

  const setLaneDirectly = useCallback((target: Lane) => {
    setLane(target);
  }, []);

  const resolveCurrentTask = useCallback(
    (laneToCheck: Lane) => {
      if (!task) {
        return;
      }
      const option = task.options.find((answer) => answer.lane === laneToCheck);
      const isCorrect = option?.isCorrect ?? false;
      setStats((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        wrong: prev.wrong + (isCorrect ? 0 : 1),
      }));
      setRecentResult(isCorrect ? "correct" : "wrong");

      let willEnd = false;
      let endResult: GameResult = null;

      if (!isTraining) {
        const delta = isCorrect ? 10 : -5;
        setScore((prev) => {
          const updated = Math.max(0, prev + delta);
          if (updated === 0) {
            willEnd = true;
            endResult = "lost";
          } else if (updated >= 100) {
            willEnd = true;
            endResult = "won";
          }
          return updated;
        });
        setFeedback({
          id: crypto.randomUUID?.() ?? `${Date.now()}`,
          type: isCorrect ? "plus" : "minus",
          value: delta,
        });
      }

      if (!isCorrect) {
        const solution = `${task.a} ${task.operator} ${task.b} = ${task.solution}`;
        setSolutionText(`Richtig ist: ${solution}`);
        setShakeKey(Date.now());
      } else {
        setPulseKey(Date.now());
        if (pulseTimeout.current) {
          clearTimeout(pulseTimeout.current);
        }
        pulseTimeout.current = setTimeout(() => setPulseKey(0), 400);
      }

      if (willEnd) {
        setGameResult(endResult);
        setStatus("gameOver");
        setTask(null);
        return;
      }

      setTask(generateTask(range, operation));
    },
    [generateTask, isTraining, operation, range, task],
  );

  useEffect(() => {
    if (!solutionText) {
      return;
    }
    const timeout = setTimeout(() => setSolutionText(null), 1500);
    return () => clearTimeout(timeout);
  }, [solutionText]);

  useEffect(() => {
    if (!feedback) {
      return;
    }
    const timeout = setTimeout(() => setFeedback(null), 1200);
    return () => clearTimeout(timeout);
  }, [feedback]);

  useEffect(() => {
    if (!recentResult) {
      return;
    }
    const timeout = setTimeout(() => setRecentResult(null), 2000);
    return () => clearTimeout(timeout);
  }, [recentResult]);

  useEffect(() => {
    return () => {
      if (pulseTimeout.current) {
        clearTimeout(pulseTimeout.current);
      }
    };
  }, []);

  const isActive = status === "playing" || status === "training";
  const sessionLabel = useMemo(
    () => (status === "training" ? "training" : sessionIntent),
    [sessionIntent, status],
  );

  return {
    status,
    sessionIntent,
    range,
    operation,
    score,
    stats,
    task,
    lane,
    feedback,
    solutionText,
    recentResult,
    pulseKey,
    shakeKey,
    gameResult,
    isTraining,
    isActive,
    sessionLabel,
    selectIntent,
    setRange,
    setOperation,
    moveLane,
    setLaneDirectly,
    startSession,
    restart,
    backToStart,
    resolveCurrentTask,
    setStatus,
  };
};

export type UseGameState = ReturnType<typeof useGameState>;
