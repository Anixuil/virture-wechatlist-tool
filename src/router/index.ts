/*
 * @Author: Anixuil
 * @Date: 2024-07-27 13:15:20
 * @LastEditors: Anixuil
 * @LastEditTime: 2024-10-02 10:33:06
 * @Description: 路由配置
 */
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import baseModules from "@router/modules/base";
import useCommonStore from "@/store/modules/common";

const routes: Array<RouteRecordRaw> = [...baseModules];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((_to, _from) => {    
    // 设置全局主题
    const { setGlobalTheme, setGlobalThemeColor } = useCommonStore();
    // 先存颜色，再存主题
    setGlobalThemeColor(window.globalThemeColor);
    setGlobalTheme(window.globalTheme);

})

router.afterEach((_to, _from) => {

})

export default router;
