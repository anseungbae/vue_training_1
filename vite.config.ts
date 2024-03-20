import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import babel from 'vite-plugin-babel'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }

  return {
    plugins: [
      vue(),
      babel({
        babelConfig: {}
      }),
      AutoImport({
        dts: false, // or a custom path
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],
    server: {
      port: Number(process.env.PORT),
      watch: {
        usePolling: true
      }
    },
    resolve: {
      extensions: ['.mjs', '.vue', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss', '.css', '.d.ts'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
