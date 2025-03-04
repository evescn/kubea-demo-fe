<!--<template>-->
<!--  <router-view></router-view>-->
<!--</template>-->

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

function test3() {
  userStore.removeToken()
  router.push('/login')
}
</script>

<template>
  <router-view></router-view>
  <!--  <div>-->
  <!--    &lt;!&ndash; App.vue只需要留一个路由出口 router-view即可 &ndash;&gt;-->

  <!--    <p>{{ userStore.token }}</p>-->
  <!--    <a-button>登录</a-button>-->
  <!--    <a-button type="primary" @click="userStore.removeToken()">推出</a-button>-->
  <!--    &lt;!&ndash;    <p>{{ store.permission }}</p>&ndash;&gt;-->
  <!--  </div>-->
  <a-button type="primary" @click="test3">推出</a-button>
  <br />
  <br />
  <a-button type="primary" @click="test">按钮</a-button>
  <br />
  <br />
  <a-button type="primary" @click="test2">返回</a-button>
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
