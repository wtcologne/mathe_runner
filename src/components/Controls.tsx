interface ControlsProps {
  onLeft: () => void;
  onRight: () => void;
  disabled?: boolean;
}

export const Controls = ({ onLeft, onRight, disabled }: ControlsProps) => (
  <div className="flex justify-center gap-6 rounded-3xl bg-white/70 p-6 soft-shadow">
    <button
      onClick={onLeft}
      disabled={disabled}
      className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-300 to-sky-500 p-4 shadow-lg shadow-sky-200 transition hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
    >
      <img src="/images/left.png" alt="Links" className="h-14 w-14 object-contain" />
    </button>
    <button
      onClick={onRight}
      disabled={disabled}
      className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-300 to-pink-500 p-4 shadow-lg shadow-pink-200 transition hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
    >
      <img src="/images/right.png" alt="Rechts" className="h-14 w-14 object-contain" />
    </button>
  </div>
);
