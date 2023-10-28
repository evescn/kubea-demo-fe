<template>
    <a-layout>
        <!-- 固钉，以及头部 -->
        <a-affix>
            <!-- 布局头部 -->
            <a-layout-header>
                <!-- 平台信息 -->
                <!-- float:left居左的同时，会把其他元素也放在同一行 -->
                <div style="float: left">
                    <img style="height:40px; margin-bottom:10px;" :src="kubeLogo">
                    <span style="font-size: 25px; padding: 0 50px 0 20px; font-weight: bold; color: #fff;">
                        KubeA
                    </span>
                </div>
                <!-- 集群信息 -->
                <a-menu
                    style="float:left; width: 250px; line-height: 64px;"
                    v-model:selectedKeys="selectedKeys1"
                    theme="dark"
                    mode="horizontal">
                    <a-menu-item v-for="item in clusterList" :key="item" @click="clusterChange(item)">
                        {{ item }}
                    </a-menu-item>
                </a-menu>
                <!-- 用户信息 -->
                <div style="float: right;">
                    <img style="height: 40px; border-radius: 50px; margin-right: 10px;" :src="avator">
                    <a-dropdown :overlayStyle="{paddingTop: '20px'}">
                        <a>
                            <!-- Admin-->
                            {{ username }}
                            <down-outlined/>
                        </a>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item>
                                    <a @click="logout()">退出登陆</a>
                                </a-menu-item>
                                <a-menu-item>
                                    <a @click="changePassword()">修改密码</a>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
            </a-layout-header>
        </a-affix>
        <!-- 中部，高度永远是窗口最大高度减去68px，因为68是header的高度-->
        <a-layout style="height:calc(100vh - 68px)">
            <!-- 侧边栏，核心 -->
            <a-layout-sider width="240" v-model:collapsed="collapsed" collapsible>
                <!-- selectedKeys表示点击选中的栏目,用于a-menu-item -->
                <!-- openKeys表示展开的栏目，用于a-sub-menu -->
                <!-- openChange事件监听 SubMenu 展开/关闭的回调 -->
                <a-menu
                    :selectedKeys="selectedKeys2"
                    :openKeys="openKeys"
                    @openChange="onOpenChange"
                    mode="inline"
                    :style="{height:'100%', boderRight: 0}">
                    <!-- routers是router/index.js的路由信息 -->
                    <template v-for="menu in routers" :key="menu">
                        <!-- 处理无子路由的情况 -->
                        <!-- routeChange用于处理跳转和选中 -->
                        <a-menu-item
                            v-if="menu.children && menu.children.length === 1 && menu.name === menu.children[0].name"
                            :index="menu.path"
                            :key="menu.path"
                            @click="routeChange('item', menu.path)">
                            <template #icon>
                                <component :is="menu.children[0].icon"/>
                            </template>
                            <span>{{ menu.children[0].name }}</span>
                        </a-menu-item>

                        <!-- 处理有子路由的情况,也就是父栏目 -->
                        <a-sub-menu
                            v-else-if="menu.children && menu.children.length >= 1"
                            :index="menu.path"
                            :key="menu.path">
                            <template #icon>
                                <component :is="menu.icon"/>
                            </template>
                            <template #title>
                                <span>
                                    <span :class="[collapsed ? 'is-collapse' : '']">{{ menu.name }}</span>
                                </span>
                            </template>

                            <!-- 子栏目（子路由） -->
                            <!-- <a-menu-item
                                v-for="child in menu.children"
                                :key="child.path"
                                :index="child.path"
                                @click="routeChange('sub', child.path)">
                                <span>{{ child.name }}</span>
                            </a-menu-item> -->
                            <!-- 子栏目（子路由）的处理 -->
                            <template v-for="child in menu.children" :key="child.path">
                                <a-menu-item
                                    v-if="!child.children"
                                    :index="child.path"
                                    :key="child.path"
                                    @click="routeChange('sub', child.path)">
                                    <template #icon>
                                        <component :is="child.icon"/>
                                    </template>
                                    <span>{{ child.name }}</span>
                                </a-menu-item>
                                <a-sub-menu
                                    v-else
                                    :index="child.path"
                                    :key="child.path">
                                    <template #icon>
                                        <component :is="child.icon"/>
                                    </template>
                                    <template #title>
                                        <span>
                                            <span>{{ child.name }}</span>
                                        </span>
                                    </template>
                                    <a-menu-item
                                        v-for="subchild in child.children"
                                        :key="subchild.path"
                                        :index="subchild.path"
                                        @click="routeChange('subchild', subchild.path)">
                                        <span>{{ subchild.name }}</span>
                                    </a-menu-item>
                                </a-sub-menu>
                            </template>
                        </a-sub-menu>
                    </template>

                </a-menu>
            </a-layout-sider>
            <!-- 页面 -->
            <a-layout style="padding: 0 24px;">
                <!-- 面包屑 -->
                <a-breadcrumb style="margin: 10px 0">
                    <a-breadcrumb-item>工作台</a-breadcrumb-item>
                    <template v-for="(matched, index) in router.currentRoute.value.matched" :key="index">
                        <!-- <a-breadcrumb-item>{{ matched.name }}</a-breadcrumb-item> -->
                        <a-breadcrumb-item v-if="matched.name">
                            {{ matched.name }}
                        </a-breadcrumb-item>
                    </template>
                </a-breadcrumb>
                <!-- main的部分 -->
                <!-- overflowY表示默认高度超出后，显示滚轴 -->
                <a-layout-content
                    :style="{
                        background: 'rgb(31, 30, 30)',
                        margin: 10,
                        minHeight: '280px',
                        overflowY: 'auto'
                    }">
                    <!-- 路由占位符 -->
                    <router-view></router-view>
                    <!-- 编辑密码表单 -->
                    <a-drawer
                        v-model:visible="updateDrawer"
                        title="更新账号密码信息"
                        @close="onClose()">
                        <br>
                        <a-form
                            ref="updateRef"
                            :model="updateUser"
                            :labelCol="{style: {width: '30%'}}"
                            :rules="rules">
                            <a-form-item
                                label="旧密码"
                                name="oldPassword">
                                <a-input-password v-model:value="updateUser.oldPassword" placeholder="旧密码"></a-input-password>
                            </a-form-item>
                            <a-form-item
                                label="新密码"
                                name="newPassword">
                                <a-input-password v-model:value="updateUser.newPassword" placeholder="新密码"></a-input-password>
                            </a-form-item>
                            <a-form-item
                                label="再次确认"
                                name="newPasswordTo">
                                <a-input-password v-model:value="updateUser.newPasswordTo" placeholder="请再次输新密码"></a-input-password>
                            </a-form-item>
                        </a-form>
                        <template #footer>
                            <a-button style="margin-right: 8px" @click="onClose()">取消</a-button>
                            <a-button type="primary" @click="formSubmit()">更新</a-button>
                        </template>
                    </a-drawer>
                </a-layout-content>
                <!-- footer部分 -->
                <a-layout-footer style="text-align: center;">
                    ©2023 Created by Evescn Devops
                </a-layout-footer>
            </a-layout>
        </a-layout>
    </a-layout>
</template>

<script>
import {onMounted, ref, reactive, onBeforeMount, createVNode} from 'vue'
import kubeLogo from '@/assets/k8s-metrics.png'
import avator from '@/assets/avator.png'
import {useRouter} from 'vue-router'
import httpClient from '@/request';
import common from "@/config";
import {message, Modal} from 'ant-design-vue';
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import Cookies from 'js-cookie'

export default ({
    setup() {
        const appLoading = ref(false)
        const collapsed = ref(false)
        const selectedKeys1 = ref([])
        // username 信息
        let username = ref()
        username = localStorage.getItem('username')
        // 集群列表
        const clusterList = ref([])
        //发起请求用到的变量以Data结尾
        const clusterListData = reactive({
            url: common.k8sClusterList,
        })
        //侧边栏的属性
        //路由信息
        const routers = ref([])
        const selectedKeys2 = ref([])
        const openKeys = ref([])
        //通过useRouter方法获取路由配置以及当前页面的路由信息
        const router = useRouter()

        //更新
        const updateRef = ref()
        const updateDrawer = ref(false)
        const updateUser = reactive({
            oldPassword: '',
            newPassword: '',
            newPasswordTo: '',
        })
        const updateUserData = reactive({
            url: common.userUpdate,
            params: {
                username: '',
                oldPassword: '',
                newPassword: '',
            }
        })

        // 用户信息
        const userListData = reactive({
            url: common.userList,
            params: {
                username: '',
                page: 1,
                limit: 10
            }
        })

        // rules 规则
        let validateOldPass = async (_rule, value) => {
            if ( value.length < 6 ) {
                return Promise.reject('密码长度低于 6 位数');
            } else {
                return Promise.resolve();
            }
        };
        let validateNewPass = async (_rule, value) => {
            if ( value.length < 6 ) {
                return Promise.reject('密码长度低于 6 位数');
            } else {
                if (updateUser.newPasswordTo !== '') {
                    updateRef.value.validateFields('newPasswordTo');
                }
                return Promise.resolve();
            }
        };
        let validateNewPassTo = async (_rule, value) => {
            if (value !== updateUser.newPassword) {
                return Promise.reject("2 次输入密码不一致");
            } else {
                return Promise.resolve();
            }
        };

        const rules = {
            // required是否必填
            // trigger触发方式，change(有变化的时候做校验), blur(选中焦点取消时触发)
            // validator自定义验证的方法
            oldPassword: [{
                required: true,
                validator: validateOldPass,
                trigger: 'blur',
            }],
            newPassword: [{
                required: true,
                validator: validateNewPass,
                trigger: 'change',
            }],
            newPasswordTo: [{
                validator: validateNewPassTo,
                trigger: 'change',
            }],
        };

        //【这里开始是方法】
        // 获取集群列表
        async function getClusterList() {
            // await getUserList()
            appLoading.value = true
            await httpClient.get(clusterListData.url)
                .then(res => {
                    //响应成功，获取cluster的列表数据
                    clusterList.value = res.data
                    //集群数量放到localstorage中，方便其他地方使用
                    localStorage.setItem('cluster_num', clusterList.value.length)
                    //处理这个menu初始化的选择
                    if (!selectedKeys1.value.length) {
                        selectedKeys1.value[0] = clusterList.value[1]
                        localStorage.setItem('k8s_cluster', clusterList.value[1])
                    }
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    appLoading.value = false
                })
        }

        // 处理集群变更
        function clusterChange(val) {
            if (selectedKeys1.value[0] == val) {
                return
            } else {
                //处理集群切换
                selectedKeys1.value[0] = val
                localStorage.setItem('k8s_cluster', val)
                //设置集群默认名称空间
                if (localStorage.getItem('k8s_cluster') === 'DEV') {
                    localStorage.setItem("namespace", 'd1')
                } else if (localStorage.getItem('k8s_cluster') === 'TST') {
                    localStorage.setItem("namespace", 't1')
                }
                //刷新当前页面,目的是为了刷新数据
                location.replace(router.currentRoute.value.path)
            }
        }

        // 退出登陆
        const logout = () => {
            // 移除用户
            localStorage.removeItem('username')
            // 移除 token
            localStorage.removeItem('token')
            // 移除 roleId
            localStorage.removeItem('role')
            // 移除环境信息
            localStorage.removeItem('urlEnv')
            localStorage.removeItem('urlEnvID')
            // 移除 菜单
            localStorage.removeItem('menuList');
            // 跳转到 /login 页面
            router.push('/login')
        }

        // 修改密码
        function changePassword() {
            updateDrawer.value = true
        }

        //导航栏点击切换页面，以及处理选中的情况
        async function routeChange(type, path) {
            //获取用户 role id
            // await getUserList()

            //判断点击是否为sub栏目(也就是单独item)，如果不是，则关闭其他父栏目
            if (type == 'item') {
                openKeys.value = []
            } else if (type == 'sub') {
                openKeys.value = [openKeys.value[0]]
            }
            //选中当前path对应的栏目,单独item或者子item
            selectedKeys2.value = [path]
            //页面跳转
            //router.currentRoute.value.path用于获取当前的页面路径
            if (router.currentRoute.value.path !== path) {
                router.push(path)
            }
            // console.log("selectedKeys2.value: ", selectedKeys2.value)
        }

        //专门用于sub的打开和关闭
        function onOpenChange(val) {
            //匹配这个val（path）是否已经打开，如果没有，则打开他，关闭其他
            let latestOpenKey = val.find(key => openKeys.value.indexOf(key) === -1)
            let arr = []

            val.forEach((item) => {
                let a = item.split('/')
                arr.push(a[1])
            })
            let isAllEqual = arr.every((value, index, arr) => {
                return value === arr[0];
            })

            if (isAllEqual) {
                if (val.length > 2) {
                    openKeys.value = [openKeys.value[0], latestOpenKey]
                } else {
                    openKeys.value = val
                }
            } else {
                openKeys.value = [latestOpenKey]
            }
            //匹配这个val（path）是否已经打开，如果没有，则打开他，关闭其他
            // const latestOpenKey = val.find(key => openKeys.value.indexOf(key) == -1)
            // openKeys.value = latestOpenKey ? [latestOpenKey] : []
        }

        //
        function getRouter(val) {
            // console.log("getRouter", val)
            selectedKeys2.value = [val[1].path]
            openKeys.value = [val[0].path]
            // console.log(selectedKeys2.value)
        }

        //修改用户账号密码信息
        function updateUserFunc() {
            appLoading.value = true
            updateUserData.params.username = localStorage.getItem("username")
            updateUserData.params.oldPassword = updateUser.oldPassword
            updateUserData.params.newPassword = updateUser.newPassword
            httpClient.put(updateUserData.url, updateUserData.params)
                .then(res => {
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    //重置表单
                    updateRef.value.resetFields()
                    //关闭抽屉
                    updateDrawer.value = false
                })
        }

        // 刷新页面重新获取用户 role id 信息
        async function getUserList() {
            userListData.params.username = localStorage.getItem("username")
            await httpClient.get(userListData.url, {params: userListData.params})
                .then(res => {
                    // 重新设置用户 role id，防止用户修改数据，获取管理员权限
                    localStorage.setItem("role", res.data.items[0].role)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                })
        }

        //更新按钮
        async function formSubmit() {
            try {
                await updateRef.value.validateFields();
                updateUserFunc()
            } catch (errorInfo) {
                message.error("Failed: ", errorInfo)
            }
        }

        //关闭抽屉
        function onClose() {
            Modal.confirm({
                title: "是否确认关闭操作? ",
                icon: createVNode(ExclamationCircleOutlined),
                content: createVNode('div', {
                    style: 'color:red;',
                }),
                cancelText: '取消',
                okText: '确认',
                onOk() {
                    updateDrawer.value = false
                    updateRef.value.resetFields()
                },
                onCancel() {
                    updateDrawer.value = true
                }
            })
        }

        // 生命周期钩子
        onBeforeMount(() => {
            getClusterList()
            if (localStorage.getItem('k8s_cluster')) {
                selectedKeys1.value[0] = localStorage.getItem('k8s_cluster')
            }

        })

        onMounted(() => {
            routers.value = router.options.routes
            getRouter(router.currentRoute.value.matched)
        })
        return {
            collapsed,
            kubeLogo,
            username,
            avator,
            selectedKeys1,
            clusterList,
            logout,
            changePassword,
            routers,
            selectedKeys2,
            openKeys,
            router,
            routeChange,
            onOpenChange,
            clusterChange,
            updateDrawer,
            updateRef,
            updateUser,
            onClose,
            formSubmit,
            rules,
        }

    }

})
</script>

<style scoped>
/* 头部内边距 */
.ant-layout-header {
    padding: 0 30px !important;
}

/* main滚轴的宽度 */
.ant-layout-content::-webkit-scrollbar {
    width: 6px;
}

.ant-layout-content::-webkit-scrollbar-track {
    background-color: rgb(164, 162, 162);
}

.ant-layout-content::-webkit-scrollbar-thumb {
    background-color: #666;
}

.ant-layout-footer {
    padding: 5px 50px !important;
    color: rgb(239, 239, 239);
}

.is-collapse {
    display: none;
}

/* 侧边栏滚轴 */
.ant-layout-sider {
    background: #141414 !important;
    overflow-y: auto;
}

.ant-layout-sider::-webkit-scrollbar {
    display: none;
}

.ant-menu-item {
    margin: 0 !important;
}
</style>