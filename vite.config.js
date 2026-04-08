import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-html2canvas': ['html2canvas'],
        }
      }
    }
  },
  ssr: {
    // Bundle all dependencies into the SSR output to avoid CJS/ESM interop issues.
    // The SSR bundle is only used at build time for prerendering, not at runtime.
    noExternal: true,
  },
});
