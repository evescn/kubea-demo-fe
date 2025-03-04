<template>
    <div class="container-breadcrumb--right mb-10 mt-10">
        <a-breadcrumb v-if="list.length" class="container-breadcrumb">
            <a-breadcrumb-item>
                <icon-apps />
            </a-breadcrumb-item>

            <template v-for="item in list">
                <a-breadcrumb-item v-if="item" :key="item">
                    {{ item }}
                </a-breadcrumb-item>
            </template>
        </a-breadcrumb>
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const breadcrumbs = route.meta.breadcrumbs as string[];
const titleList = computed(() => {
    return route.matched.filter((route) => route.meta.title).map((route) => route.meta.title);
});
const list: string[] = breadcrumbs || titleList;
</script>

<style scoped lang="less">
.container-breadcrumb {
    padding: 10px;
}

.container-breadcrumb--right {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
