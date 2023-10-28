//导入 router 的路由模式
import { createRouter, createWebHistory } from "vue-router"
// 导入进度条组件
import NProgress from "nprogress"
import 'nprogress/nprogress.css'
// 导入整体布局 Layout
import Layout from "@/layout/Layout"
//导入jwt token组件
import jwt from "jsonwebtoken"
import {ref} from "vue";

// 路由规则
const routes = [
    {
        path: "/",
        redirect: "/application" // 重定向
    },
    {
        path: '/login',
        component: () => import('@/views/common/Login.vue'),
        meta: {title: "登录"},
    },

    // {
    //     path: "/application",
    //     component: Layout,
    //     name: "应用管理",
    //     icon: "calendar-outlined",
    //     children: [
    //         {
    //             path: "/application",
    //             name: "应用管理",
    //             icon: "calendar-outlined",
    //             meta: {title: "应用管理", requireAuth: true},
    //             component: () => import('@/views/application/Application.vue'),
    //         }
    //     ]
    // },
    // {
    //     path: "/deploy",
    //     name: "服务部署",
    //     icon: "deployment-unit-outlined",
    //     component: Layout,
    //     children: [
    //         {
    //             path: "/deploy",
    //             name: "服务部署",
    //             icon: "deployment-unit-outlined",
    //             meta: {title: "服务部署", requireAuth: true},
    //             component: () => import('@/views/deploy/Deploy.vue'),
    //         }
    //     ]
    // },
    // {
    //     path: "/k8s",
    //     name: "容器服务",
    //     component: Layout,
    //     icon: "cloud-server-outlined",
    //     children: [
    //         {
    //             path: "/k8s/home",
    //             name: "概览",
    //             icon: "fund-outlined",
    //             meta: {title: "概览"},
    //             // 真正的页面内容，会显示在布局的 main 部分
    //             component: () => import('@/views/home/Home.vue'),
    //         },
    //         {
    //             path: "/k8s/cluster",
    //             name: "集群",
    //             icon: "cloud-server-outlined",
    //             children: [
    //                 {
    //                     path: "/k8s/cluster/node",
    //                     name: "Node",
    //                     meta: {title: "Node", requireAuth: true},
    //                     component: () => import('@/views/cluster/Node.vue'),
    //                 },
    //                 {
    //                     path: "/k8s/cluster/namespace",
    //                     name: "Namespace",
    //                     meta: {title: "Namespace", requireAuth: true},
    //                     component: () => import('@/views/cluster/Namespace.vue'),
    //                 },
    //                 {
    //                     path: "/k8s/cluster/pv",
    //                     name: "PV",
    //                     meta: {title: "PV", requireAuth: true},
    //                     component: () => import('@/views/cluster/PV.vue'),
    //                 }
    //             ]
    //         },
    //         {
    //             path: "/k8s/workload",
    //             name: "工作负载",
    //             icon: "block-outlined",
    //             children: [
    //                 {
    //                     path: "/k8s/workload/pod",
    //                     name: "Pod",
    //                     meta: {title: "Pod", requireAuth: true},
    //                     component: () => import('@/views/workload/Pod.vue'),
    //                 },
    //                 {
    //                     path: "/k8s/workload/deployment",
    //                     name: "Deployment",
    //                     meta: {title: "Deployment", requireAuth: true},
    //                     component: () => import('@/views/workload/Deployment.vue'),
    //                 },
    //                 {
    //                     path: "/k8s/workload/daemonset",
    //                     name: "DaemonSet",
    //                     meta: {title: "DaemonSet", requireAuth: true},
    //                     component: () => import('@/views/workload/DaemonSet.vue'),
    //                 },
    //                 {
    //                     path: "/k8s/workload/statefulset",
    //                     name: "StatefulSet",
    //                     meta: {title: "StatefulSet", requireAuth: true},
    //                     component: () => import('@/views/workload/StatefulSet.vue'),
    //                 },
    //             ]
    //         },
    //         {
    //             path: "/k8s/loadbalance",
    //             name: "负载均衡",
    //             icon: "partition-outlined",
    //             children: [
    //                 {
    //                     path: "/k8s/loadbalance/ingress",
    //                     name: "Ingress",
    //                     meta: {title: "Ingress", requireAuth: true},
    //                     component: () => import('@/views/loadbalance/Ingress.vue'),
    //                 },
    //                 {
    //                     path: "/k8s/loadbalance/service",
    //                     name: "Service",
    //                     meta: {title: "Service", requireAuth: true},
    //                     component: () => import('@/views/loadbalance/Service.vue'),
    //                 }
    //             ]
    //         },
    //         {
    //             path: "/k8s/storage",
    //             name: "存储配置",
    //             icon: "book-outlined",
    //             children: [
    //                 {
    //                     path: "/k8s/storage/configmap",
    //                     name: "Configmap",
    //                     meta: {title: "Configmap", requireAuth: true},
    //                     component: () => import('@/views/storage/Configmap.vue'),
    //                 },
    //                 {
    //                     path: "/k8s/storage/secret",
    //                     name: "Secret",
    //                     meta: {title: "Secret", requireAuth: true},
    //                     component: () => import('@/views/storage/Secret.vue'),
    //                 },
    //                 {
    //                     path: "/k8s/storage/pvc",
    //                     name: "PVC",
    //                     meta: {title: "PVC", requireAuth: true},
    //                     component: () => import('@/views/storage/PVC.vue'),
    //                 }
    //             ]
    //         },
    //         {
    //             path: '/k8s/helmstore',
    //             name: "Helm应用",
    //             icon: "appstore-outlined",
    //             children: [
    //                 {
    //                     path: "/k8s/helmstore/release",
    //                     name: "Release",
    //                     meta: {title: "Release", requireAuth: true},
    //                     component: () => import('@/views/helmstore/Release.vue'),
    //                 },
    //                 {
    //                     path: "/k8s/helmstore/chartrepo",
    //                     name: "Chart仓库",
    //                     meta: {title: "Chart仓库", requireAuth: true},
    //                     component: () => import('@/views/helmstore/ChartRepo.vue'),
    //                 }
    //             ]
    //         },
    //     ],
    // },
    {
        path: '/workload/pod/terminal',  //url路径
        component: () => import('@/views/workload/PodTerminal.vue'),  //视图组件
        meta: {title: "终端", requireAuth: false},  //meta元信息
    },
    {
        path: '/workload/pod/log',  //url路径
        component: () => import('@/views/workload/PodLog.vue'),  //视图组件
        meta: {title: "日志", requireAuth: false},  //meta元信息
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

let registerRouteFresh = true // 定义标识，记录路由是否添加

const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    jwt.verify(localStorage.getItem('token'), 'evescn', async function (err) {
        if ( to.path === '/login') {
            next()
        } else if (err) {
            next('/login')
        } else if (registerRouteFresh) {
            const list = JSON.parse(localStorage.getItem('menuList')) // 获取到的 Cookies 里的路由列表信息进行格式化
            await list.forEach(item => { // 循环遍历列表
                var seft = { // 循环遍历一级菜单
                    path: '/' + item.path,
                    name: item.name,
                    component: Layout,
                    icon: item.icon,
                    children: []
                }

                item.children.forEach((items) => { // 循环遍历二级菜单
                    let path = ref("")
                    path = capitalizeFirstLetter(items.path)
                    if (items.children) {
                        var subitem = { // 循环遍历三级菜单
                            path: '/' + item.path + '/' + items.path,
                            name: items.name,
                            icon: items.icon,
                            children: []
                        }
                        items.children.forEach((child) => { // 循环遍历三级菜单
                            let path = ref("")
                            path = capitalizeFirstLetter(child.path)
                            subitem.children.push({
                                // router.addRoute({
                                path: '/' + item.path + '/' + items.path + '/' + child.path,
                                name: child.name,
                                component: () => import(`@/views/${items.path}/${path}.vue`), // 使用模板，否则找不到路由地址
                                meta: {title: child.meta.title, requireAuth: child.meta.requireAuth}
                            })
                        })
                        // 插入路由
                        seft.children.push(subitem)
                    } else {
                        if (item.path === items.path) {
                            seft.children.push({
                                // router.addRoute({
                                path: '/' + items.path,
                                name: items.name,
                                component: () => import(`@/views/${items.path}/${path}.vue`), // 使用模板，否则找不到路由地址
                                icon: items.icon,
                                meta: {title: items.meta.title, requireAuth: items.meta.requireAuth}
                            })
                        } else {
                            seft.children.push({
                                // router.addRoute({
                                path: '/' + item.path + '/' + items.path,
                                name: items.name,
                                component: () => import(`@/views/${items.path}/${path}.vue`), // 使用模板，否则找不到路由地址
                                icon: items.icon,
                                meta: {title: items.meta.title, requireAuth: items.meta.requireAuth}
                            })
                        }
                    }
                })
                // router.addRoute(seft) // 将遍历好的路由信息载入静态路由中
                routes.push(seft) // 将遍历好的路由信息载入静态路由中
                router.addRoute(seft)
            })

            // console.log(router.getRoutes(), '查看现有路由')
            registerRouteFresh = false // 添加路由后更改标识为true
            next({ ...to, replace: true })     //路由进行重定向放行
        } else {
            // console.log(router.getRoutes(), '查看现有路由')
            next()
        }
    })
});

router.afterEach(() => {
    // 关闭进度条
    NProgress.done()
})

export default router