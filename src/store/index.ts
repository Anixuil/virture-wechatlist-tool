/*
 * @Author: Anixuil
 * @Date: 2024-07-29 20:45:39
 * @LastEditors: Anixuil
 * @LastEditTime: 2024-09-30 09:26:42
 * @Description: 状态管理
 */
import { createPinia } from "pinia";
import persistedstate from "pinia-plugin-persistedstate";

const store = createPinia()

// 注册插件
store.use(persistedstate)

export default store