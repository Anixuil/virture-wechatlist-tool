/*
 * @Author: Anixuil
 * @Date: 2024-09-30 09:00:51
 * @LastEditors: Anixuil
 * @LastEditTime: 2024-10-02 10:46:29
 * @Description: 请填写简介
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from "vite-plugin-pwa"; // 引入 PWA 插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import UnoCSS from 'unocss/vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/, /\.[tj]sx?$/],
      imports: ['vue', 'vue-router', 'pinia'],
      dts: './auto-imports.d.ts',
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass'
        }),
        IconsResolver({
          enabledCollections: ['ep']
        })
      ],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      exclude: [/node_modules/]
    }),
    Icons({
      autoInstall: true
    }),
    VitePWA({ // 配置 PWA 插件
      registerType: "autoUpdate", // 如果此项设置为 'prompt', 则会在页面加载时询问用户是否要安装 PWA，如果设置为 'autoUpdate'，则会自动安装 PWA
      // includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: "Asset Cloud - 资产云", // 应用名称
        short_name: "Asset Cloud - 资产云", // 应用短名称
        description: "一款简洁的资产管理工具", // 应用描述
        theme_color: "#ffffff", // 主题颜色
        background_color: "#ffffff", // 背景颜色
        display: "standalone", // 显示模式
        display_override: ["standalone", "minimal-ui", "browser"], // 显示模式覆盖
        icons: [
          {
            src: "/logo.webp",
            sizes: "192x192",
            type: "image/webp",
          },
          {
            src: "/logo.webp",
            sizes: "512x512",
            type: "image/webp",
          },
          {
            src: "/logo.webp",
            sizes: "512x512",
            type: "image/webp",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,svg}"], // 匹配文件 缓存策略
      },
      devOptions: {
        enabled: true, // 开发环境是否启用
      },
    }),
  ],
  base: "/", // 基础路径
  mode: "development", // 模式
  publicDir: "public", // 静态资源文件夹
  server: {
    port: 8080, // 端口
    strictPort: true, // 端口严格模式
    open: true, // 自动打开浏览器
    // proxy: { // 代理
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   }
    // }
  },
  resolve: {
    alias: {
      // 路径别名 tsconfig.app.json也需要配置
      "@": "/src",
      "@types": "/src/types",
      "@router": "/src/router",
      "@views": "/src/views",
      "@components": "/src/components",
      "@utils": "/src/utils",
      "@assets": "/src/assets",
      "@store": "/src/store",
      "@api": "/src/api",
      "@config": "/src/config",
      "@styles": "/src/styles",
    },
  },
  // 构建配置
  build: {
    outDir: "dist", // 输出目录
    assetsDir: "assets", // 静态资源输出目录
    assetsInlineLimit: 4096, // 静态资源内联限制
    cssCodeSplit: true, // css 代码拆分
    sourcemap: false, // 是否构建源映射
    cssTarget: "chrome61", // css 兼容性
  },
})
