/*
 * @Author: Anixuil
 * @Date: 2024-09-30 09:00:51
 * @LastEditors: Anixuil
 * @LastEditTime: 2024-10-02 10:47:27
 * @Description: 项目入口文件
 */
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "@/router";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import 'virtual:uno.css'
import "@styles/index.scss";
import store from "@/store";
import AniComponents from "@/components"

import "@/utils";

// 主入口监听pwa注册事件
window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
});

const app = createApp(App);
app.use(router).use(ElementPlus, {
    locale: zhCn
}).use(AniComponents).use(store).mount("#app");
