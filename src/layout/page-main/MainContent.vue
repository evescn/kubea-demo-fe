<template>
    <div class="main-content">
        <router-view v-slot="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
        </router-view>
    </div>
</template>

<style lang="less" scoped>
.main-content {
    padding: 0 20px 20px;
}
</style>
