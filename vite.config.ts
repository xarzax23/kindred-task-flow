import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@fullcalendar/core/main.css": path.resolve(__dirname, "./node_modules/@fullcalendar/core/main.css"),
      "@fullcalendar/daygrid/main.css": path.resolve(__dirname, "./node_modules/@fullcalendar/daygrid/main.css"),
      "@fullcalendar/timegrid/main.css": path.resolve(__dirname, "./node_modules/@fullcalendar/timegrid/main.css"),
    },
  },
}));