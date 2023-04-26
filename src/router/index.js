//导入 router 的路由模式
import { createRouter, createWebHistory } from "vue-router"
// 导入进度条组件
import NProgress from "nprogress"
import 'nprogress/nprogress.css'
// 导入整体布局 Layout
import Layout from "@/layout/Layout"

// 路由规则
const routes = [
    {
        path: "/",
        redirect: "/home" // 重定向
    },
    {
        path: "/home",
        // 引入布局组件
        component: Layout,
        children: [
            {
                path: "/home",
                name: "概览",
                icon: "fund-outlined",
                mate: {title: "概览"},
                // 真正的页面内容，会显示在布局的 main 部分
                component: () => import('@/views/home/Home.vue')
            },
        ]
    },
    {
        path: "/cluster",
        name: "集群",
        component: Layout,
        icon: "cloud-server-outlined",
        children: [
            {
                path: "/cluster/node",
                name: "Node",
                mate: {title: "Node", requireAuth: true},
                component: () => import('@/views/cluster/Node.vue')
            },
            {
                path: "/cluster/namespace",
                name: "Namespace",
                mate: {title: "Namespace", requireAuth: true},
                component: () => import('@/views/cluster/Namespace.vue')
            },
            {
                path: "/cluster/pv",
                name: "PV",
                mate: {title: "PV", requireAuth: true},
                component: () => import('@/views/cluster/PV.vue')
            },
        ]
    },
    {
        path: "/workload",
        name: "工作负载",
        component: Layout,
        icon: "block-outlined",
        children: [
            {
                path: "/workload/pod",
                name: "Pod",
                mate: {title: "Pod", requireAuth: true},
                component: () => import('@/views/workload/Pod.vue')
            },
            {
                path: "/workload/deployment",
                name: "Deployment",
                mate: {title: "Deployment", requireAuth: true},
                component: () => import('@/views/workload/Deployment.vue')
            },
            {
                path: "/workload/daemonset",
                name: "DaemonSet",
                mate: {title: "DaemonSet", requireAuth: true},
                component: () => import('@/views/workload/DaemonSet.vue')
            },
            {
                path: "/workload/statefulset",
                name: "StatefulSet",
                mate: {title: "StatefulSet", requireAuth: true},
                component: () => import('@/views/workload/StatefulSet.vue')
            },
        ]
    },
]

// createRouter 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes
})

// 定义进度条
NProgress.inc(100)
// 进度条配置
// easing 动画字符串
// speed 动画速度
// showSpinner 进度环显示隐藏
NProgress.configure({ easing: 'ease', speed: 600, showSpinner: false })

// 结合路由守卫，去开启和关闭进度条
router.beforeEach((to, from, next) => {
    // 启动进度条
    NProgress.start()

    // 设置头部 title
    if (to.meta.title) {
        document.title = to.meta.title
    } else {
        document.title = "KubeA"
    }

    // 放行
    next()
})

router.afterEach(() => {
    // 关闭进度条
    NProgress.done()
})

export default router