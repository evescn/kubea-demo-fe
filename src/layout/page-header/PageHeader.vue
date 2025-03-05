<script setup>
import HeaderLeftSide from './HeaderLeftSide.vue'
import HeaderRightSide from './HeaderRightSide.vue'
</script>

<template>
    <div class="page-header">
        <HeaderLeftSide />
        <HeaderRightSide />
    </div>
</template>

<style scoped>
.page-header {
    display: flex;
    justify-content: space-between;
    height: 64px;
    padding: 0 20px;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
}
</style>
