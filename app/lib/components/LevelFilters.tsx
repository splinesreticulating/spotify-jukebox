"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const allLevels = ["1000", "2000", "3000", "4000", "5000"];

export function LevelFilters({ levels }: { levels: string }) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const initialLevels = levels ? levels.split(",").filter(Boolean) : allLevels;
  const [selectedLevels, setSelectedLevels] = useState<string[]>(initialLevels);

  useEffect(() => {
    const levelsQuery = selectedLevels.join(",");
    const newSearchParams = new URLSearchParams(
      Object.fromEntries(currentSearchParams.entries()),
    );
    newSearchParams.set("levels", levelsQuery);
    router.replace(`?${newSearchParams.toString()}`);
  }, [selectedLevels]);

  const handleCheckboxChange = (level: string) => {
    setSelectedLevels((prevLevels) =>
      prevLevels.includes(level)
        ? prevLevels.filter((l) => l !== level)
        : [...prevLevels, level],
    );
  };

  return (
    <div className="mb-4 flex justify-end gap-1">
      {allLevels.map((level) => (
        <label key={level} className="flex items-center">
          <input
            type="checkbox"
            name="levels"
            value={level}
            onChange={() => handleCheckboxChange(level)}
            checked={selectedLevels.includes(level)}
            className="hidden"
          />
          <span
            className={`hw-1 cursor-pointer rounded px-2 ${
              selectedLevels.includes(level)
                ? "border-teal-600 bg-teal-600 text-white"
                : "border-teal-600 bg-white text-teal-600"
            }`}
          >
            {level[0]}
          </span>
        </label>
      ))}
    </div>
  );
}
