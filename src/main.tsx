import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TaskProvider } from './context/TaskContext.tsx';
import { CategoryProvider } from './context/CategoryContext.tsx';
import { CalendarEventProvider } from './context/CalendarEventContext.tsx';

// FullCalendar ya no distribuye sus hojas de estilo en npm,
// por lo que no importamos CSS aquí. Si quieres añadir estilo,
// puedes enlazar la hoja de estilos desde un CDN en index.html.

createRoot(document.getElementById('root')!).render(
  <TaskProvider>
    <CategoryProvider>
      <CalendarEventProvider>
        <App />
      </CalendarEventProvider>
    </CategoryProvider>
  </TaskProvider>
);
