// DropIndicator.tsx
import { DropIndicatorProps } from "@/types";

const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="drop-indicator my-0.5 h-0.5 w-full bg-violet-400 opacity-0 transition-opacity"
    />
  );
};

export default DropIndicator;
