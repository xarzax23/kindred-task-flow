import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TaskProvider } from './context/TaskContext.tsx'
import { CategoryProvider } from './context/CategoryContext.tsx'
import { CalendarEventProvider } from './context/CalendarEventContext.tsx'

import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';

createRoot(document.getElementById("root")!).render(
  <TaskProvider>
    <CategoryProvider>
      <CalendarEventProvider>
        <App />
      </CalendarEventProvider>
    </CategoryProvider>
  </TaskProvider>
);