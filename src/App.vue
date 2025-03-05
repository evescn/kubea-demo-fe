<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

function test() {
    console.log('route: ', route)
    router.push('/deploy/list')
}

function test2() {
    router.back()
}

document.body.setAttribute('arco-theme', 'dark')
</script>

<template>
    <router-view></router-view>

    <!--    <a-button type="primary" @click="test">按钮</a-button>-->
    <!--    <br />-->
    <!--    <br />-->
    <!--    <a-button type="primary" @click="test2">返回</a-button>-->
</template>

<style lang="less">
@import './styles/reset.less';

#app {
    height: 100%;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
