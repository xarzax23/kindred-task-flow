import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { CalendarEvent } from "@/types";

interface CalendarEventContextType {
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateCalendarEvent: (event: CalendarEvent) => void;
  deleteCalendarEvent: (id: string) => void;
}

const CalendarEventContext = createContext<CalendarEventContextType | undefined>(undefined);

export const useCalendarEvents = () => {
  const context = useContext(CalendarEventContext);
  if (!context) {
    throw new Error("useCalendarEvents must be used within a CalendarEventProvider");
  }
  return context;
};

interface CalendarEventProviderProps {
  children: ReactNode;
}

export const CalendarEventProvider = ({ children }: CalendarEventProviderProps) => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    try {
      const item = window.localStorage.getItem('calendarEvents');
      const parsed = item ? JSON.parse(item) : [];
      return parsed.map((e: any) => ({...e, startTime: new Date(e.startTime), endTime: new Date(e.endTime)}));
    } catch (error) {
      console.error("Error reading calendarEvents from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
    } catch (error) {
      console.error("Error saving calendarEvents to localStorage", error);
    }
  }, [calendarEvents]);

  const addCalendarEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
    };
    setCalendarEvents((prev) => [...prev, newEvent]);
  };

  const updateCalendarEvent = (updatedEvent: CalendarEvent) => {
    setCalendarEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <CalendarEventContext.Provider value={{ calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent }}>
      {children}
    </CalendarEventContext.Provider>
  );
};