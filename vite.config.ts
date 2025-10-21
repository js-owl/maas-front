import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { execSync } from 'child_process'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log(env.VITE_BASE_PATH)
  
  // Get git information for build (with better error handling)
  let gitHash = 'unknown'
  let gitBranch = 'unknown'
  try {
    gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
    gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()
  } catch (error) {
    // Silently use fallback values - git might not be available in container
    gitHash = process.env.GIT_HASH || 'unknown'
    gitBranch = process.env.GIT_BRANCH || 'unknown'
  }
  
  return {
    base: mode === 'production' ? (env.VITE_BASE_PATH || '/') : (env.VITE_BASE_PATH || '/site-dev/'),
    define: {
      __VERSION__: JSON.stringify(process.env.npm_package_version || '3.0.0'),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
      __GIT_HASH__: JSON.stringify(gitHash),
      __GIT_BRANCH__: JSON.stringify(gitBranch),
      global: 'globalThis',
    },
    build: {
      rollupOptions: {
        plugins: [
          {
            name: 'node-polyfills',
            resolveId(id) {
              if (['path', 'fs', 'crypto', 'util', 'os', 'stream'].includes(id)) {
                return { id: `node:${id}`, external: true }
              }
            }
          }
        ]
      }
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    server: {
      proxy: {
        '/api/v3': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/v3/, '')
        }
      }
    }
  }
})
