import { useCallback } from "react";

export type NumberRange = "10" | "20" | "100";
export type OperationMode = "plus" | "minus" | "mixed";
export type Lane = "left" | "center" | "right";

export interface AnswerOption {
  id: string;
  value: number;
  lane: Lane;
  isCorrect: boolean;
}

export interface MathTask {
  id: string;
  a: number;
  b: number;
  operator: "+" | "-";
  solution: number;
  question: string;
  options: AnswerOption[];
}

const lanes: Lane[] = ["left", "center", "right"];

const maxByRange: Record<NumberRange, number> = {
  "10": 10,
  "20": 20,
  "100": 100,
};

const randomId = () => crypto.randomUUID?.() ?? `${Math.random()}`;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const useTaskGenerator = () => {
  const generateOperands = useCallback(
    (range: NumberRange, op: "+" | "-") => {
      const max = maxByRange[range];
      if (op === "+") {
        const result = Math.floor(Math.random() * (max + 1));
        const a = Math.floor(Math.random() * (result + 1));
        const b = result - a;
        return { a, b, solution: result, operator: "+" as const };
      }
      const a = Math.floor(Math.random() * (max + 1));
      const b = Math.floor(Math.random() * (a + 1));
      return { a, b, solution: a - b, operator: "-" as const };
    },
    [],
  );

  const pickOperator = useCallback((mode: OperationMode) => {
    if (mode === "mixed") {
      return Math.random() > 0.5 ? "+" : "-";
    }
    return mode === "plus" ? "+" : "-";
  }, []);

  const createOptions = useCallback(
    (solution: number, range: NumberRange) => {
      const max = maxByRange[range];
      const values = new Set<number>([solution]);
      while (values.size < 3) {
        const direction = Math.random() > 0.5 ? 1 : -1;
        const delta = clamp(Math.floor(Math.random() * 5) + 1, 1, 5);
        let candidate = clamp(solution + direction * delta, 0, max);
        if (candidate === solution) {
          candidate = clamp(candidate + 1, 0, max);
        }
        if (candidate === solution) {
          candidate = clamp(solution - 1, 0, max);
        }
        values.add(candidate);
      }

      const shuffledLanes = [...lanes].sort(() => Math.random() - 0.5);
      const optionValues = Array.from(values).sort(() => Math.random() - 0.5);

      return optionValues.map((value, index) => ({
        id: randomId(),
        value,
        lane: shuffledLanes[index] ?? "center",
        isCorrect: value === solution,
      }));
    },
    [],
  );

  return useCallback(
    (range: NumberRange, mode: OperationMode): MathTask => {
      let op: "+" | "-";
      let operands;

      do {
        op = pickOperator(mode);
        operands = generateOperands(range, op);
      } while (
        operands.solution < 0 ||
        operands.solution > maxByRange[range]
      );

      const question = `${operands.a} ${operands.operator} ${operands.b} = ?`;

      return {
        id: randomId(),
        ...operands,
        question,
        options: createOptions(operands.solution, range),
      };
    },
    [createOptions, generateOperands, pickOperator],
  );
};
