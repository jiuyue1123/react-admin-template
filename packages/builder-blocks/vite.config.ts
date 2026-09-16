import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { esmExternalRequirePlugin } from "vite"; // 直接从 vite 导入
import { resolve } from "node:path";

// https://vite.dev/config/
//
// 单入口构建：本包被两种运行时消费 —— 编辑器（admin，全客户端）与访客端
// （apps/site，React Server Components 服务端渲染）。
//
// ⚠️ 因此 src 下**不能出现客户端专有 API**（createContext / useContext /
// useState 等）。一旦引入，Next.js 会直接拒绝构建：
//   "You're importing a module that depends on `createContext` into a React
//    Server Component module."
// 守卫：pnpm --filter @jff/builder-blocks check:rsc
export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      outDirs: "dist",
      entryRoot: "src",
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      formats: ["es"],
      fileName: 'index'
    },
    rolldownOptions: {
      plugins: [
        esmExternalRequirePlugin({
          external: [
            "react",
            "react-dom",
            "react/jsx-runtime",  // 别忘了这个
            // 本包不含 UI 组件库 / 图标库依赖：区块全部为内联样式 + 内置 SVG 图标，
            // 以便在访客端（Next.js RSC）服务端直接渲染。
            "@puckeditor/core",
          ],
        }),
      ],
    },
  }
});
