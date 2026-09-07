import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/E-G-Resource-Allocation-Tool/",
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
