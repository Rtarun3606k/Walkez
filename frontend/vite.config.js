import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Ensure this matches your deployment output directory
    assetsDir: "assets", // Ensure this matches your assets directory
  },
  base: "/", // Ensure this matches your base path
});
