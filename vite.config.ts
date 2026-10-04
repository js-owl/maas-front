import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { execSync } from 'child_process'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isVitest =
    mode === 'test' ||
    process.env.VITEST === 'true' ||
    process.argv.some((arg) => arg.includes('vitest'))
  console.log(env.VITE_BASE_PATH)
  
  // Get git information for build (with better error handling)
  let gitHash = 'unknown'
  let gitBranch = 'unknown'
  try {
    // Check if we're in a git repository before trying to execute git commands
    execSync('git rev-parse --is-inside-work-tree', { encoding: 'utf8', stdio: 'pipe' })
    gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
    gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()
  } catch (error) {
    // Silently use fallback values - git might not be available in container
    gitHash = process.env.GIT_HASH || 'unknown'
    gitBranch = process.env.GIT_BRANCH || 'unknown'
  }
  
  return {
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    // Vitest must use root base: a non-root base rewrites absolute /public
    // asset URLs into invalid file:// imports on Windows (e.g. /uslugiPages/*).
    base: isVitest
      ? '/'
      : mode === 'production'
        ? (env.VITE_BASE_PATH || '/')
        : (env.VITE_BASE_PATH || '/site-dev/'),
    define: {
      __VERSION__: JSON.stringify(process.env.npm_package_version || '3.0.0'),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
      __GIT_HASH__: JSON.stringify(gitHash),
      __GIT_BRANCH__: JSON.stringify(gitBranch),
      global: 'globalThis',
    },
    build: {
      // Increase chunk size warning threshold (current main bundle is ~1MB)
      chunkSizeWarningLimit: 1000,
      // Suppress module externalization warnings (expected behavior)
      logLevel: 'warn',
      rollupOptions: {
        external: ['/config.js'], // Mark config.js as external to prevent bundling
        output: {
          // Manual chunking for better caching and loading performance
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus', '@element-plus/icons-vue'],
            'three': ['three', 'three-stl-loader'],
            'occt-import-js': ['occt-import-js'],
          },
        },
        plugins: [
          {
            name: 'node-polyfills',
            resolveId(id) {
              if (['path', 'fs', 'crypto', 'util', 'os', 'stream'].includes(id)) {
                return { id: `node:${id}`, external: true }
              }
            }
          },
          {
            name: 'suppress-config-js-warning',
            generateBundle() {
              // This plugin exists to document that config.js warnings are expected
              // The actual warning suppression is handled by Vite's built-in mechanisms
            }
          }
        ]
      }
    },
    plugins: [
      vue({
        template: {
          // Keep absolute /public paths as URL strings (needed under non-root base
          // and for vitest on Windows, where file:///uslugiPages/* is invalid).
          transformAssetUrls: {
            includeAbsolute: false,
          },
        },
      }),
      AutoImport({
        resolvers: [ElementPlusResolver({ importStyle: 'css' })],
      }),
      Components({
        resolvers: [ElementPlusResolver({ importStyle: 'css' })],
      }),
    ],
    server: {
      watch: {
        // Windows often locks short-lived editor/temp files (EBUSY on watch)
        ignored: ['**/_tmp*', '**/~*', '**/*.tmp', '**/src/assets/**/*.png'],
      },
      proxy: {
        '/api/v3': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/v3/, '')
        }
      }
    },
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['src/**/*.{test,spec}.{ts,vue}'],
      setupFiles: ['src/test/setup.ts'],
      server: {
        deps: {
          // element-plus ships bare .css imports that Node cannot load natively
          inline: [/element-plus/],
        },
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json-summary', 'html'],
        reportsDirectory: 'coverage',
        reportOnFailure: true,
        include: ['src/**/*.{ts,vue}'],
        exclude: [
          'src/**/*.spec.ts',
          'src/**/*.test.ts',
          'src/**/*.d.ts',
          'src/main.ts',
          'src/icons/**',
          'src/test/**',
        ],
        // Ratchet set to the current measured floor: coverage can go up but
        // not down. Raise these as each phase of the coverage plan lands.
        thresholds: {
          statements: 31.0,
          branches: 31.0,
          functions: 29.0,
          lines: 31.5,
          'src/helpers/**': {
            statements: 97,
            branches: 90,
            functions: 95,
            lines: 98,
          },
          'src/composables/**': {
            statements: 96,
            branches: 90,
            functions: 100,
            lines: 95,
          },
          'src/seo/**': {
            statements: 98,
            branches: 85,
            functions: 100,
            lines: 97,
          },
          'src/config/**': {
            statements: 100,
            branches: 70,
            functions: 100,
            lines: 100,
          },
          'src/stores/**': {
            statements: 90,
            branches: 70,
            functions: 95,
            lines: 90,
          },
          'src/api.ts': {
            statements: 88,
            branches: 70,
            functions: 85,
            lines: 88,
          },
          'src/components/ui/**': {
            statements: 80,
            branches: 75,
            functions: 60,
            lines: 80,
          },
          'src/components/coefficients/**': {
            statements: 80,
            branches: 70,
            functions: 65,
            lines: 80,
          },
          'src/components/materials/**': {
            statements: 80,
            branches: 50,
            functions: 70,
            lines: 80,
          },
          'src/components/delivery/**': {
            statements: 95,
            branches: 85,
            functions: 90,
            lines: 95,
          },
          'src/App.vue': {
            statements: 90,
            branches: 80,
            functions: 90,
            lines: 90,
          },
          'src/components/dialog/**': {
            statements: 70,
            branches: 60,
            functions: 70,
            lines: 70,
          },
          'src/components/sections/**': {
            statements: 60,
            branches: 45,
            functions: 50,
            lines: 60,
          },
        },
      }
    }
  }
})
