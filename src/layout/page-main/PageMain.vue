<template>
  <a-layout-content class="page-content">
    <MainBreadcrumb />
    <MainContent />
  </a-layout-content>
</template>

<script setup>
import MainBreadcrumb from './MainBreadcrumb.vue'
import MainContent from './MainContent.vue'
</script>

<style lang="less" scoped>
.page-content {
  height: calc(100vh - 48px);
  // overflow-y: hidden;
  background-color: var(--color-fill-2);
  transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
  // padding-top: 20px;
}
</style>
