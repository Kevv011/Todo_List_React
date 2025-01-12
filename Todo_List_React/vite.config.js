import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: '/KODIGO-Todo-List-firebase/Todo_List_React/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, 
  }
})