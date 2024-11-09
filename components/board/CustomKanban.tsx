// CustomKanban.tsx
"use client";

import React from "react";
import Board from "./Board";

const CustomKanban = ({ boardId }: { boardId: string }) => {
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Remova o Header local */}
      <main className="flex-1 overflow-hidden bg-gray-50">
        <div className="h-full max-w-[1800px] mx-auto px-6">
          <Board boardId={boardId} />
        </div>
      </main>
    </div>
  );
};

export default CustomKanban;
