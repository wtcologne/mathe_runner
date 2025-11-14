"use client";

import { useCallback, useEffect, useState } from "react";
import { StartScreen } from "@/components/StartScreen";
import { ModeSelection } from "@/components/ModeSelection";
import { GameCanvas } from "@/components/GameCanvas";
import { HUD } from "@/components/HUD";
import { GameOverScreen } from "@/components/GameOverScreen";
import { useGameState } from "@/hooks/useGameState";

export default function Home() {
  const {
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
    selectIntent,
    setRange,
    setOperation,
    moveLane,
    setLaneDirectly,
    startSession,
    backToStart,
    resolveCurrentTask,
    setStatus,
  } = useGameState();

  const [isPaused, setIsPaused] = useState(false);

  const handleCheckpoint = useCallback(() => {
    if (!isActive || isPaused) {
      return;
    }
    resolveCurrentTask(lane);
  }, [isActive, isPaused, lane, resolveCurrentTask]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const handleBackToStart = useCallback(() => {
    setIsPaused(false);
    backToStart();
  }, [backToStart]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (!(status === "playing" || status === "training")) {
        return;
      }
      if (["ArrowLeft", "a", "A"].includes(event.key)) {
        event.preventDefault();
        moveLane("left");
      }
      if (["ArrowRight", "d", "D"].includes(event.key)) {
        event.preventDefault();
        moveLane("right");
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [moveLane, status]);

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-b from-[#d3f3ff] via-[#eaf6ff] to-[#fff] px-2 sm:px-4 py-4 sm:py-8 lg:px-16 safe-area-inset">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:gap-8">
        {status === "title" && (
          <StartScreen
            onPlay={() => selectIntent("playing")}
            onTraining={() => selectIntent("training")}
            onOpenSettings={() => {}}
          />
        )}

        {status === "setup" && (
          <ModeSelection
            range={range}
            operation={operation}
            sessionType={sessionIntent}
            onRangeChange={setRange}
            onOperationChange={setOperation}
            onStart={startSession}
            onBack={backToStart}
          />
        )}

        {(status === "playing" || status === "training") && (
          <>
            <HUD
              score={score}
              stats={stats}
              task={task}
              isTraining={isTraining}
              solutionText={solutionText}
              feedback={feedback}
              onHome={handleBackToStart}
              onPause={togglePause}
              isPaused={isPaused}
            />
            <GameCanvas
              key={task?.id ?? "runner"}
              task={task}
              lane={lane}
              isActive={isActive && !isPaused}
              isTraining={isTraining}
              pulseKey={pulseKey}
              shakeKey={shakeKey}
              feedback={feedback}
              recentResult={recentResult}
              correctCount={stats.correct}
              onReachCheckpoint={handleCheckpoint}
              onLaneClick={setLaneDirectly}
            />
          </>
        )}

        {status === "gameOver" && (
          <GameOverScreen
            score={score}
            stats={stats}
            result={gameResult}
            onRetry={startSession}
            onBack={backToStart}
          />
        )}
      </div>
    </main>
  );
}
