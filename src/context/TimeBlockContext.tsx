import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { TimeBlock } from "@/types";

/**
 * Context used to manage recurring time blocks for categories. A time
 * block defines a start and end time for a specific category.  When
 * creating new tasks, the AddTaskForm will look up the time block for
 * the selected category and prefill the task’s start and end times.
 */
interface TimeBlockContextType {
  /** All defined time blocks */
  timeBlocks: TimeBlock[];
  /** Create a new time block */
  addTimeBlock: (tb: Omit<TimeBlock, "id">) => void;
  /** Update an existing time block */
  updateTimeBlock: (tb: TimeBlock) => void;
  /** Delete a time block by id */
  deleteTimeBlock: (id: string) => void;
  /** Retrieve time blocks for a given category */
  getTimeBlocksForCategory: (categoryId: string) => TimeBlock[];
}

const TimeBlockContext = createContext<TimeBlockContextType | undefined>(undefined);

export const useTimeBlocks = (): TimeBlockContextType => {
  const context = useContext(TimeBlockContext);
  if (!context) {
    throw new Error("useTimeBlocks must be used within a TimeBlockProvider");
  }
  return context;
};

interface TimeBlockProviderProps {
  children: ReactNode;
}

/**
 * Provides the TimeBlockContext to its children.  Uses localStorage to
 * persist the defined time blocks across sessions.  See TimeBlock
 * interface in src/types for more details.
 */
export const TimeBlockProvider = ({ children }: TimeBlockProviderProps) => {
  // Load initial time blocks from localStorage.  Parse times as simple
  // strings; no date conversion necessary because these values only
  // represent a time of day.
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(() => {
    try {
      const item = window.localStorage.getItem("timeBlocks");
      return item ? (JSON.parse(item) as TimeBlock[]) : [];
    } catch (error) {
      console.error("Error reading timeBlocks from localStorage", error);
      return [];
    }
  });

  // Persist to localStorage whenever timeBlocks changes
  useEffect(() => {
    try {
      window.localStorage.setItem("timeBlocks", JSON.stringify(timeBlocks));
    } catch (error) {
      console.error("Error saving timeBlocks to localStorage", error);
    }
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
    <TimeBlockContext.Provider
      value={{
        timeBlocks,
        addTimeBlock,
        updateTimeBlock,
        deleteTimeBlock,
        getTimeBlocksForCategory,
      }}
    >
      {children}
    </TimeBlockContext.Provider>
  );
};