import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// relative base so the build works from any path (GitHub Pages serves it under /TrapTagger/)
export default defineConfig({
  base: "./",
  plugins: [react()],
});
