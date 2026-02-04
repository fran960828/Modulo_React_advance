// vite.config.ts
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    // Permite usar 'describe', 'expect', etc. sin importarlos en cada test
    globals: true,
    // Indica que usaremos jsdom para simular el navegador
    environment: 'jsdom',
    // Archivo que se ejecutará antes de cada test para configurar el entorno
    setupFiles: './src/setupTests.ts',
  },
})
