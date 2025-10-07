import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig({
  base: "/site-dev/",
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  optimizeDeps: {
    include: ["three", "occt-import-js"],
  },
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      "occt-import-js": "occt-import-js/dist/occt-import-js.js",
    },
  },
  assetsInclude: ["**/*.wasm"],
});
