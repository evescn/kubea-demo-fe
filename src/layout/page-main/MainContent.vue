<template>
  <div class="main-content">
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.fullPath" />
    </router-view>
  </div>
</template>
<script lang="ts" setup>
// const tabBarStore = { getCacheList() { } };

// const tabBarStore = { getCacheList() { } };
// const cacheList = computed(() => tabBarStore.getCacheList);
import { useRoute } from 'vue-router'

const route = useRoute()
console.log('route: ', route)
</script>

<style lang="less" scoped>
.main-content {
  padding: 0 20px 20px;
}
</style>
