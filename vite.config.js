import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // tudo que cair em /api será redirecionado para localhost:8080
      "/api": {
        target: "meu-backend-app-f0gjgrhkhsebe5g9.brazilsouth-01.azurewebsites.net",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
