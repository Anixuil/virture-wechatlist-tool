<!--
 * @Author: Anixuil
 * @Date: 2024-07-20 00:01:30
 * @LastEditors: Anixuil
 * @LastEditTime: 2024-10-02 10:40:03
 * @Description: app.vue
-->
<template>
    <div class="views-common-wrapper">
        <!-- <div>
            <el-button @click="handleClickGoto('/home')">Home</el-button>
            <el-button @click="handleClickGoto('/login')">Login Page</el-button>
        </div> -->
        <router-view v-slot="{ Component, route }">
            <Transition :name="route.meta.transition as string" mode="out-in">
                <component :is="Component" />
            </Transition>
        </router-view>
    </div>
</template>

<script setup lang="ts">
import { getScreenInfo } from '@utils/index';
import useCommonStore from '@store/modules/common';

const { setScreenInfo } = useCommonStore();

// 初始化
onMounted(() => {
    nextTick(() => {
        handleResize()
        type ResizeTimer = ReturnType<typeof setTimeout>
        let resizeTimer: ResizeTimer | null = null
        window.addEventListener('resize', () => {
            if (resizeTimer) clearTimeout(resizeTimer)
            resizeTimer = setTimeout(() => {
                handleResize()
            }, 50)
        })
    })
})

// 全局窗口变化处理
const handleResize = () => {
    setScreenInfo(getScreenInfo())
}


</script>

<style scoped lang="scss">
.views-common-wrapper {
    margin: 0;
    position: relative;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    min-height: 100vh;
}
</style>