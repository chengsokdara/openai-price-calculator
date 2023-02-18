import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

const setPath = (arg: string) => path.resolve(__dirname, arg)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'package.json', replacement: setPath('./package.json') },
      { find: 'src', replacement: setPath('./src') },
      { find: '@ui', replacement: setPath('./src/components') },
    ],
  },
})
