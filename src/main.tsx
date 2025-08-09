import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TaskProvider } from './context/TaskContext.tsx'
import { CategoryProvider } from './context/CategoryContext.tsx'
import { CalendarEventProvider } from './context/CalendarEventContext.tsx'
import { TimeBlockProvider } from './context/TimeBlockContext';

import '@fullcalendar/core/index.css';
import '@fullcalendar/daygrid/index.css';
import '@fullcalendar/timegrid/index.css';

createRoot(document.getElementById("root")!).render(
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