<template>
  <a-layout-sider v-if="!isSmallScreen" breakpoint="xl" collapsible>
    <!-- <AsideLogo /> -->
    <AsideMenu />
    <template #trigger="{ collapsed }">
      <icon-menu-unfold v-if="collapsed" />
      <icon-menu-fold v-else />
    </template>
  </a-layout-sider>

  <a-drawer
    :closable="false"
    :footer="false"
    :visible="isMenuVisiable"
    mask-closable
    placement="left"
    @cancel="drawerCancel"
  >
    <AsideMenu />
  </a-drawer>
</template>

<script setup>
import AsideMenu from './AsideMenu.vue'
import { injectMenu } from '../hooks/useMenu'
import useScreenSize from '../hooks/useScreenSize'

const { isSmallScreen } = useScreenSize()

const { isMenuVisiable } = injectMenu()
const drawerCancel = () => {
  isMenuVisiable.value = false
}
</script>
