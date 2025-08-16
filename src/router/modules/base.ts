/*
 * @Author: Anixuil
 * @Date: 2024-07-29 20:45:39
 * @LastEditors: Anixuil
 * @LastEditTime: 2024-09-08 15:10:49
 * @Description: 基本路由配置
 */
export default [
    {
        path: "/",
        redirect: "/home",
    },
    {
        path: "/home",
        alias: "/index",
        name: "home",
        component: () => import("@views/home.vue"),
        meta: {
            title: "首页",
            transition: "common-fade",
        },
    },
    {
        path: "/login",
        alias: "/signIn",
        name: "login",
        component: () => import("@views/login.vue"),
        meta: {
            title: "登录",
            transition: "common-fade",
        },
    },
    {
        path: "/bill",
        name: "bill",
        component: () => import("@views/bill.vue"),
        meta: {
            title: "账单",
            transition: "common-fade",
        },
    },

];
