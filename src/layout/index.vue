<!-- Layout.vue -->
<script setup>
import PageHeader from '@/layout/page-header/PageHeader.vue'
</script>

<template>
  <a-layout>
    <PageHeader />
    <a-layout-content>Content</a-layout-content>
    <a-layout-footer>Footer</a-layout-footer>
  </a-layout>
</template>

<!--<template>-->
<!--  <a-layout class="layout">-->
<!--    <PageHeader />-->
<!--    <a-layout>-->
<!--      <PageAside />-->
<!--      <PageMain />-->
<!--    </a-layout>-->
<!--  </a-layout>-->
<!--</template>-->

<!--<script setup>-->
<!--import PageHeader from './page-header/PageHeader.vue'-->
<!--import PageMain from './page-main/PageMain.vue'-->
<!--import PageAside from './page-aside/PageAside.vue'-->
<!--import { provideMenu } from './hooks/useMenu'-->

<!--provideMenu()-->
<!--</script>-->

<style lang="less" scoped>
@nav-size-height: 60px;
@layout-max-width: 1100px;

.layout {
  width: 100%;
  height: 100%;
}

.layout-navbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: @nav-size-height;
}

.arco-layout-has-sider {
  overflow-y: hidden;
}

.layout-sider {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  height: 100%;
  transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);

  &::after {
    position: absolute;
    top: 0;
    right: -1px;
    display: block;
    width: 1px;
    height: 100%;
    background-color: var(--color-border);
    content: '';
  }

  > :deep(.arco-layout-sider-children) {
    overflow-y: hidden;
  }
}

.layout-content {
  min-height: 100vh;
  overflow-y: hidden;
  background-color: var(--color-fill-2);
  transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
}
</style>
