import React from "react";

export function Categories() {
  const categories = [
    "JAZZ",
    "HIP-HOP",
    "ROCK",
    "ELECTRONIC",
    "AMBIENT",
    "INDIE",
    "CLASSICAL",
    "EXPERIMENTAL",
    "POP",
  ];

  return (
    <div className="mb-8">
      <div className="bg-[#FF3B3B] rounded-[4px] border-4 border-black p-4 overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {categories.map((category, index) => (
            <button
              key={index}
              className="text-white text-sm font-bold whitespace-nowrap opacity-80 hover:opacity-100 hover:translate-y-[-2px] transition"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
