/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'

// Plugin to copy SQLite WASM files to public directory
function sqliteWasmPlugin() {
  return {
    name: 'sqlite-wasm-copy',
    buildStart() {
      // Ensure public directory exists
      if (!existsSync('public')) {
        mkdirSync('public', { recursive: true })
      }
      
      // Copy SQLite WASM files to public directory for production
      const wasmFiles = [
        'node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3.wasm',
        'node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3-worker1.js',
        'node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3-worker1-promiser.js',
        'node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3-opfs-async-proxy.js'
      ]
      
      wasmFiles.forEach(file => {
        if (existsSync(file)) {
          const fileName = file.split('/').pop()
          const destPath = resolve('public', fileName!)
          try {
            copyFileSync(file, destPath)
            console.log(`✓ Copied ${fileName} to public directory`)
          } catch (error) {
            console.warn(`⚠ Failed to copy ${fileName}:`, error)
          }
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Set base path for GitHub Pages deployment
  base: process.env.NODE_ENV === 'production' ? '/payments/' : '/',
  plugins: [react(), tailwindcss(), sqliteWasmPlugin()],
  optimizeDeps: {
    exclude: ['@sqlite.org/sqlite-wasm']
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    }
  },
  build: {
    rollupOptions: {
      output: {
        // Ensure SQLite WASM files are properly handled
        assetFileNames: (assetInfo) => {
          // Keep SQLite WASM files in their original names for proper loading
          if (assetInfo.name?.endsWith('.wasm')) {
            return 'assets/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    },
    // Increase chunk size warning limit for SQLite WASM
    chunkSizeWarningLimit: 1000,
    // Ensure proper handling of WASM files
    assetsInlineLimit: 0,
    // Target modern browsers that support WASM and SharedArrayBuffer
    target: 'es2020'
  },
  // Production headers for SQLite WASM (required for SharedArrayBuffer)
  preview: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    }
  },
  // @ts-ignore
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  }
})
