import { createContext, useState, ReactNode, useContext } from "react";
import { TimeBlock } from "@/types";

interface TimeBlockContextType {
  timeBlocks: TimeBlock[];
  addTimeBlock: (timeBlock: Omit<TimeBlock, "id">) => void;
  updateTimeBlock: (timeBlock: TimeBlock) => void;
  deleteTimeBlock: (id: string) => void;
}

const TimeBlockContext = createContext<TimeBlockContextType | undefined>(undefined);

export const useTimeBlocks = () => {
  const context = useContext(TimeBlockContext);
  if (!context) {
    throw new Error("useTimeBlocks must be used within a TimeBlockProvider");
  }
  return context;
};

interface TimeBlockProviderProps {
  children: ReactNode;
}

const sampleTimeBlocks: TimeBlock[] = [
  {
    id: "tb1",
    label: "Work",
    startTime: new Date(new Date().setHours(9, 0, 0, 0)),
    endTime: new Date(new Date().setHours(17, 0, 0, 0)),
    color: "rgba(59, 130, 246, 0.3)",
  },
  {
    id: "tb2",
    label: "Personal",
    startTime: new Date(new Date().setHours(18, 0, 0, 0)),
    endTime: new Date(new Date().setHours(20, 0, 0, 0)),
    color: "rgba(168, 85, 247, 0.3)",
  },
];

export const TimeBlockProvider = ({ children }: TimeBlockProviderProps) => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(sampleTimeBlocks);

  const addTimeBlock = (timeBlock: Omit<TimeBlock, "id">) => {
    const newTimeBlock: TimeBlock = {
      ...timeBlock,
      id: Date.now().toString(),
    };
    setTimeBlocks((prev) => [...prev, newTimeBlock]);
  };

  const updateTimeBlock = (updatedTimeBlock: TimeBlock) => {
    setTimeBlocks((prev) =>
      prev.map((tb) => (tb.id === updatedTimeBlock.id ? updatedTimeBlock : tb))
    );
  };

  const deleteTimeBlock = (id: string) => {
    setTimeBlocks((prev) => prev.filter((tb) => tb.id !== id));
  };

  return (
    <TimeBlockContext.Provider value={{ timeBlocks, addTimeBlock, updateTimeBlock, deleteTimeBlock }}>
      {children}
    </TimeBlockContext.Provider>
  );
};