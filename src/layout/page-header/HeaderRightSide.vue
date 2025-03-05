<template>
    <!-- 用户信息 -->
    <div class="header-right">
        <img
            :src="avator"
            style="height: 40px; border-radius: 50px; margin-right: 10px"
        />
        <a-dropdown-button>
            <!-- Admin-->
            <a>
                {{ username }}
            </a>

            <template #icon>
                <icon-down />
            </template>
            <template #content>
                <ProfileNav />
            </template>
        </a-dropdown-button>
    </div>
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
