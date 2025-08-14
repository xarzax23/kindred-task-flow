import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TaskProvider } from './context/TaskContext.tsx';
import { CategoryProvider } from './context/CategoryContext.tsx';
import { CalendarEventProvider } from './context/CalendarEventContext.tsx';
import { TimeBlockProvider } from './context/TimeBlockContext';

// No importamos CSS de FullCalendar aquí; si los necesitas, enlázalos desde un CDN en tu index.html.

createRoot(document.getElementById('root')!).render(
  <TaskProvider>
    <CategoryProvider>
      <TimeBlockProvider>
        <CalendarEventProvider>
          <App />
        </CalendarEventProvider>
      </TimeBlockProvider>
    </CategoryProvider>
  </TaskProvider>
);
