/*
 * @Author: Anixuil
 * @Date: 2024-09-08 15:44:43
 * @LastEditors: Anixuil
 * @LastEditTime: 2024-10-02 10:34:31
 * @Description: 通用状态管理
 */
import { defineStore } from "pinia";

const useCommonStore = defineStore("common", {
    state: () => ({
        globalThemeColor: '',
        globalTheme: '',
        screenInfo: {}
    }),
    getters: {
        getGlobalThemeColor(): string {
            return this.globalThemeColor
        },
        getGlobalTheme(): string {
            return this.globalTheme
        }
    },
    actions: {
        // 设置全局主题颜色
        setGlobalThemeColor(color: string) {
            window.setGlobalThemeColor(color)
            this.globalThemeColor = color || window.globalThemeColor
        },
        // 设置全局主题
        setGlobalTheme(theme: string) {
            window.setGlobalTheme(theme)
            this.globalTheme = theme || window.globalTheme
        },
        // 设置屏幕信息
        setScreenInfo(info: Record<string, any>) {
            this.screenInfo = info
        }
    },
    // 持久化
    persist: {
        // 持久化存储的key
        key: 'ac-common',
        // 持久化存储的路径
        storage: localStorage,
        // state的字段
        pick: ['globalThemeColor', 'globalTheme', 'screenInfo']
    },

})

export default useCommonStore