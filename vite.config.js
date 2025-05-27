import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'process'

// https://vite.dev/config/
export default ({mode}) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd()),
  }

  var allowedHosts = process.env.VITE_PREVIEW_ALLOWEDHOSTS
  allowedHosts = allowedHosts.split(',').map(item => item.trim()).filter(item => item !== '')

  return defineConfig({
    server: {
      proxy: {
        '/api': process.env.VITE_API_HOST,
      }
    },
    plugins: [react()],
    preview: {
      allowedHosts: allowedHosts
    }
  })
}


 