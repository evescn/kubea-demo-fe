<template>
  <ul class="header-right">
    <!-- 用户信息 -->
    <div>
      <a-dropdown-button style="padding-top: 10px">
        <!-- Admin-->
        <img :src="avator" style="height: 40px; border-radius: 50px; margin-right: 5px" />
        {{ username }}
        <template #icon>
          <icon-down />
        </template>
        <ProfileNav />
      </a-dropdown-button>
    </div>
  </ul>
</template>

<script lang="ts" setup>
import ProfileNav from './ProfileNav.vue'
import avator from '@/assets/avator.png'
import { useUserStore } from '@/stores'

const useStore = useUserStore()

// username 信息
const username = useStore.user.username
</script>

<style scoped>
.header-right {
  display: flex;
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.nav-btn {
  border-color: rgb(var(--gray-2));
  color: rgb(var(--gray-8));
  font-size: 16px;
}
</style>
