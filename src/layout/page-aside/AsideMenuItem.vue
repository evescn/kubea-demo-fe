<template>
    <div class="menu-wrapper">
        <template v-for="item in routes">
            <template v-if="item.children?.length && item.hidden === 0">
                <a-sub-menu :key="item.name" :index="item.name">
                    <template #title>{{ item.meta.title }}</template>
                    <template #icon>
                        <component :is="item.meta.icon" />
                    </template>
                    <AsideMenuItem :routes="item.children" />
                </a-sub-menu>
            </template>
            <template v-else>
                <a-menu-item
                    v-if="item.hidden === 0"
                    :key="item.name"
                    @click="jumpTo(item.realPath)"
                >
                    <!--{{ item.meta.title  }}-->
                    {{ item.meta.title }}
                </a-menu-item>
            </template>
        </template>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
    routes: {}
})
// defineProps<{
//     routes
// }>()

const router = useRouter()
const jumpTo = (path) => {
    router.push({
        path
    })
    console.log(props.routes)
}
</script>
