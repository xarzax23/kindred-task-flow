import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TaskProvider } from './context/TaskContext.tsx'
import { TimeBlockProvider } from './context/TimeBlockContext.tsx'

createRoot(document.getElementById("root")!).render(
  <TaskProvider>
    <TimeBlockProvider>
      <App />
    </TimeBlockProvider>
  </TaskProvider>
);
