import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TaskProvider } from './context/TaskContext.tsx';
import { CategoryProvider } from './context/CategoryContext.tsx';
import { CalendarEventProvider } from './context/CalendarEventContext.tsx';
import { TimeBlockProvider } from './context/TimeBlockContext.tsx';

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
