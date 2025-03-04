<template>
  <!-- 平台信息 -->
  <!-- float:left居左的同时，会把其他元素也放在同一行 -->
  <div class="header-left">
    <img :src="kubeLogo" style="height: 40px; margin-bottom: 10px" />
    <span style="font-size: 25px; padding: 0 50px 0 20px; font-weight: bold; color: burlywood">
      KubeA
    </span>
    <!-- 集群信息 -->
    <a-menu mode="horizontal" style="float: left; width: 250px; line-height: 64px" theme="dark">
      <a-menu-item></a-menu-item>
    </a-menu>
  </div>
</template>

<script setup>
import kubeLogo from '@/assets/k8s-metrics.png'
</script>

<style lang="less" scoped>
.header-left {
  display: flex;
  align-items: center;
}

.logo-box {
  display: flex;
  align-items: center;
  font-size: 18px;
  line-height: 1.4;
  color: var(--color-text-1);

  &:active {
    color: var(--color-text-1);
  }
}

.logo-img {
  display: block;
  width: 33px;
  height: 33px;
  margin-right: 12px;
}
</style>
