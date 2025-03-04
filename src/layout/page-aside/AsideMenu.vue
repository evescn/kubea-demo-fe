<template>
    <a-menu class="aside-menu" auto-open-selected :selected-keys="selectedKey">
        <AsideMenuItem :routes="routes" />
    </a-menu>
</template>

<script lang="ts" setup>
import { ref, toRefs, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { usePermissionStore } from '@/store/permission';
import AsideMenuItem from './AsideMenuItem.vue';

const route = useRoute();
const { routes } = toRefs(usePermissionStore());

const selectedKey = ref<string[]>([]);

watchEffect(() => {
    selectedKey.value = [route.name as string];
});
</script>

<style scoped>
.aside-menu {
    height: 100%;
}
</style>
