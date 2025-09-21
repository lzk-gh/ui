import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],

  resolve: {
    alias: {
      // 创建一个名为 @bootstrap-icons 的别名
      // 它指向 node_modules 中的 bootstrap-icons 文件夹
      // 这能让我们的 import 路径更清晰且不受文件层级影响
      '@bootstrap-icons': path.resolve(__dirname, 'node_modules/bootstrap-icons'),
    },
  },
});
