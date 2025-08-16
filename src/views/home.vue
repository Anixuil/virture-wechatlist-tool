<!--
 * @Author: Anixuil
 * @Date: 2024-07-27 13:17:28
 * @LastEditors: Anixuil
 * @LastEditTime: 2024-10-02 10:38:59
 * @Description: 首页
-->
<template>
    <div class="home-container">
        <h1>Hello, welcome to AniCli !</h1>
        <div class="action-buttons">
            <button class="btn btn-primary" @click="goToBill">
                账单配置器
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToBill = () => {
    router.push('/bill')
}
</script>

<style scoped lang="scss">
.home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
    text-align: center;
}

.action-buttons {
    margin-top: 30px;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.btn-primary {
        background: #007aff;
        color: white;
        
        &:hover {
            background: #0056cc;
            transform: translateY(-2px);
        }
    }
    

}
</style>