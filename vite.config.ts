import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

// 解决 __dirname 在 ESM 模块下的兼容性问题
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // --- 关键修改：添加 base 路径 ---
      // 这里的路径必须和你 GitHub 仓库名一致，前后都要有斜杠
      base: '/Palniverse/', 
      
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // 将 @ 指向根目录或 src 目录
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
