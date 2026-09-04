import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { esmExternalRequirePlugin } from "vite"; // 直接从 vite 导入
import { resolve } from "node:path";

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
      // ⚠️ 移除这里的 external 配置
      plugins: [
        esmExternalRequirePlugin({
          external: [
            "react",
            "react-dom",
            "react/jsx-runtime",  // 别忘了这个
            "antd",
            "@ant-design/icons",
            "@puckeditor/core",
          ],
        }),
      ],
    },
  }
});