import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { TimeBlock } from "@/types";

interface TimeBlockContextType {
  timeBlocks: TimeBlock[];
  addTimeBlock: (tb: Omit<TimeBlock, "id">) => void;
  updateTimeBlock: (tb: TimeBlock) => void;
  deleteTimeBlock: (id: string) => void;
  getTimeBlocksForCategory: (categoryId: string) => TimeBlock[];
}

const TimeBlockContext = createContext<TimeBlockContextType | undefined>(undefined);

export const useTimeBlocks = (): TimeBlockContextType => {
  const ctx = useContext(TimeBlockContext);
  if (!ctx) throw new Error("useTimeBlocks must be used within a TimeBlockProvider");
  return ctx;
};

interface ProviderProps {
  children: ReactNode;
}

export const TimeBlockProvider = ({ children }: ProviderProps) => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(() => {
    try {
      const item = window.localStorage.getItem("timeBlocks");
      return item ? (JSON.parse(item) as TimeBlock[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem("timeBlocks", JSON.stringify(timeBlocks));
  }, [timeBlocks]);

  const addTimeBlock = (tb: Omit<TimeBlock, "id">) => {
    const newBlock: TimeBlock = { ...tb, id: Date.now().toString() };
    setTimeBlocks((prev) => [...prev, newBlock]);
  };

  const updateTimeBlock = (updated: TimeBlock) => {
    setTimeBlocks((prev) => prev.map((tb) => (tb.id === updated.id ? updated : tb)));
  };

  const deleteTimeBlock = (id: string) => {
    setTimeBlocks((prev) => prev.filter((tb) => tb.id !== id));
  };

  const getTimeBlocksForCategory = (categoryId: string) => {
    return timeBlocks.filter((tb) => tb.categoryId === categoryId);
  };

  return (
    <TimeBlockContext.Provider value={{ timeBlocks, addTimeBlock, updateTimeBlock, deleteTimeBlock, getTimeBlocksForCategory }}>
      {children}
    </TimeBlockContext.Provider>
  );
};
