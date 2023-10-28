<template>
    <MainHead
        searchDescribe="请输入"
        @searchChange="getSearchValue"
        @dataList="getUserList"
        add
        @addFunc="handleOpenForm('create')" />
    <!-- 表格数据 -->
    <a-card :bodyStyle="{padding: '10px'}">
        <a-table
            style="font-size: 12px"
            :loading="appLoading"
            :columns="columns"
            :dataSource="userList"
            :pagination="pagination"
            @change="handleTableChange">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'username'">
                    <span style="font-weight: bold; color: rgb(98,199,191);">{{ record.username }}</span>
                </template>
                <template v-if="column.dataIndex === 'role'">
                    <span v-for="(item, _) in roleList">
                        <span v-if="record.role === item.id">
                            <span v-if="item.role_name === `超级管理员`" style="color: rgb(84, 138, 238);">{{ item.role_name }}</span>
                            <span v-else-if="item.role_name === `开发用户`" style="color: rgb(185,117,76);">{{ item.role_name }}</span>
                            <span v-else-if="item.role_name === `测试用户`" style="color: rgb(168,104,204);">{{ item.role_name }}</span>
                            <span v-else-if="item.role_name === `运维用户`" style="color: rgb(168,104,204);">{{ item.role_name }}</span>
                        </span>
                    </span>
                </template>
                <template v-if="column.dataIndex === 'CreatedAt'">
                    <a-tag color="gray">{{ timeTrans(record.CreatedAt) }}</a-tag>
                </template>
                <template v-if="column.key === 'action'">
                    <a-button size="small" type="link" @click="handleOpenForm('update', record)">编辑信息</a-button>
                    <a-button size="small" type="link" @click="handleOpenForm('updatePWD', record)">修改密码</a-button>
                    <a-button size="small" type="link" @click="showConfirm('删除', record, delUserFunc)">删除</a-button>
                </template>
            </template>
        </a-table>
    </a-card>
    <!-- 编辑用户信息表单 -->
    <a-drawer
        v-model:visible="updateDrawer"
        title="编辑用户信息"
        :footer-style="{textAlign: 'right'}"
        @close="onClose('update')">
        <br>
        <a-form ref="updateRef" :model="updateUser" :labelCol="{style: {width: '30%'}}">
            <a-form-item
                label="用户名"
                name="username"
                :rules="[{ required: true, message: '请输入用户名'}]">
                <a-input v-model:value="updateUser.username"></a-input>
            </a-form-item>
            <a-form-item
                label="用户角色"
                name="role"
                :rules="[{ required: true, message: '请选择角色'}]">
                <a-select show-search style="width:140px;margin-right:20px;" size="small"
                          v-model:value="updateUser.role" placeholder="请选择">
                    <a-select-option
                        v-for="(item, index) in roleList"
                        :key="index"
                        :value="item.id">
                        {{ item.role_name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button style="margin-right: 8px" @click="onClose('update')">取消</a-button>
            <a-button type="primary" @click="formSubmit('update')">更新</a-button>
        </template>
    </a-drawer>
    <!-- 编辑密码表单 -->
    <a-drawer
        v-model:visible="updateDrawerPWD"
        title="更新账号密码信息"
        @close="onClose('updatePWD')">
        <br>
        <a-form
            ref="updateRefPWD"
            :model="updatePWD"
            :labelCol="{style: {width: '30%'}}"
            :rules="rules">
<!--            <a-form-item-->
<!--                label="旧密码"-->
<!--                name="oldPassword">-->
<!--                <a-input-password v-model:value="updatePWD.oldPassword" placeholder="旧密码"></a-input-password>-->
<!--            </a-form-item>-->
            <a-form-item
                label="新密码"
                name="newPassword">
                <a-input-password v-model:value="updatePWD.newPassword" placeholder="新密码"></a-input-password>
            </a-form-item>
            <a-form-item
                label="再次确认"
                name="newPasswordTo">
                <a-input-password v-model:value="updatePWD.newPasswordTo" placeholder="请再次输新密码"></a-input-password>
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button style="margin-right: 8px" @click="onClose('updatePWD')">取消</a-button>
            <a-button type="primary" @click="formSubmit('updatePWD')">更新</a-button>
        </template>
    </a-drawer>
    <!-- 新增应用表单 -->
    <a-drawer
        v-model:visible="createDrawer"
        title="新增应用"
        :footer-style="{textAlign: 'right'}"
        @close="onClose('create')">
        <br>
        <a-form ref="createRef" :model="createUser" :labelCol="{style: {width: '30%'}}">
            <a-form-item
                label="用户名"
                name="username"
                :rules="[{ required: true, message: '请输入用户名'}]">
                <a-input v-model:value="createUser.username"></a-input>
            </a-form-item>
            <a-form-item
                label="密码"
                name="password"
                :rules="[{ required: true, message: '请输入用户密码'}]">
                <a-input-password v-model:value="createUser.password" placeholder="密码"></a-input-password>
            </a-form-item>
            <a-form-item
                label="用户角色"
                name="role"
                :rules="[{ required: true, message: '请选择角色'}]">
                <a-select show-search style="width:140px;margin-right:20px;" size="small"
                          v-model:value="createUser.role" placeholder="请选择">
                    <a-select-option
                        v-for="(item, index) in roleList"
                        :key="index"
                        :value="item.id">
                        {{ item.role_name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button style="margin-right: 8px" @click="onClose('create')">取消</a-button>
            <a-button type="primary" @click="formSubmit('create')">新增</a-button>
        </template>
    </a-drawer>
</template>

<script>
import {ref, reactive, createVNode, onMounted} from 'vue'
import common from '@/config'
import httpClient from '@/request'
import {message, Modal} from 'ant-design-vue'
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';

export default ({
    setup() {
        //常用项
        const searchValue = ref('')
        const appLoading = ref(false)

        // 表格列
        const columns = ref([
            // {
            //     title: 'ID',
            //     dataIndex: 'id'
            // },
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '密码',
                dataIndex: 'password'
            },
            {
                title: '角色',
                dataIndex: 'role',
            },
            {
                title: '创建时间',
                dataIndex: 'CreatedAt'
            },
            {
                title: '操作',
                key: 'action',
                fixed: 'right',
                align: 'center',
                width: 250
            }
        ])
        //分页
        const pagination = reactive({
            showSizeChanger: true,
            showQuickJumper: true,
            total: 0,
            current: 1,
            pageSize: 10,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: total => `共 ${total} 条`
        })
        //列表属性
        const userList = ref([])
        const userListData = reactive({
            url: common.userList,
            params: {
                username: '',
                page: 1,
                limit: 10
            }
        })

        //多选框列表选项
        const roleList = ref([])
        const roleListData = reactive({
            url: common.roleGetAll,
            params: {
            }
        })
        const roleListData = reactive({
            url: common.roleList,
            params: {
                role_name: '',
                page: 1,
                limit: 10
            }
        })

        //更新角色
        const updateRef = ref()
        const updateDrawer = ref(false)
        const updateUser = reactive({
            id: 0,
            username: '',
            role: '',
        })
        const updateUserData = reactive({
            url: common.userUpdateRole,
            params: {}
        })

        //更新密码
        const updateRefPWD = ref()
        const updateDrawerPWD = ref(false)
        const updatePWD = reactive({
            id: 0,
            username: '',
            // oldPassword: '',
            newPassword: '',
            newPasswordTo: '',
        })
        const updatePWDData = reactive({
            url: common.userUpdateAdmin,
            params: {
                id: 0,
                username: '',
                oldPassword: '',
                newPassword: '',
            }
        })

        //新增
        const createRef = ref()
        const createDrawer = ref(false)
        const createUser = reactive({
            user_name: '',
            repo_name: '',
            lang: '',
            type: '',
            owner: '',
            description: ''
        })
        const createUserData = reactive({
            url: common.userAdd,
            params: {}
        })

        //删除
        const delUserData = reactive({
            url: common.userDel,
            params: {
                id: '',
            }
        })

        // rules 规则
        // let validateOldPass = async (_rule, value) => {
        //     if ( value.length < 6 ) {
        //         return Promise.reject('密码长度低于 6 位数');
        //     } else {
        //         return Promise.resolve();
        //     }
        // };
        let validateNewPass = async (_rule, value) => {
            if ( value.length < 6 ) {
                return Promise.reject('密码长度低于 6 位数');
            } else {
                if (updatePWD.newPasswordTo !== '') {
                    updateRefPWD.value.validateFields('newPasswordTo');
                }
                return Promise.resolve();
            }
        };
        let validateNewPassTo = async (_rule, value) => {
            if (value !== updatePWD.newPassword) {
                return Promise.reject("2 次输入密码不一致");
            } else {
                return Promise.resolve();
            }
        };

        const rules = {
            // required是否必填
            // trigger触发方式，change(有变化的时候做校验), blur(选中焦点取消时触发)
            // validator自定义验证的方法
            // oldPassword: [{
            //     required: true,
            //     validator: validateOldPass,
            //     trigger: 'blur',
            // }],
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

        //【方法】
        function getSearchValue(val) {
            searchValue.value = val
            pagination.current = 1
        }

        //处理翻页，pageSize变化
        function handleTableChange(val) {
            pagination.current = val.current
            pagination.pageSize = val.pageSize
            getUserList()
        }

        //时间调整
        function timeTrans(timestamp) {
            let date = new Date(new Date(timestamp).getTime() + 8 * 3600 * 1000)
            date = date.toJSON();
            date = date.substring(0, 19).replace('T', ' ')
            return date
        }

        function getUserList() {
            appLoading.value = true
            userListData.params.username = searchValue.value
            userListData.params.page = pagination.current
            userListData.params.limit = pagination.pageSize
            httpClient.get(userListData.url, {params: userListData.params})
                .then(res => {
                    userList.value = res.data.items
                    pagination.total = res.data.total
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    appLoading.value = false
                })
        }

        async function handleOpenForm(val, row) {
            switch (val) {
                case "create":
                    createDrawer.value = true
                    break
                case "updatePWD":
                    updatePWD.id = row.id
                    updatePWD.username = row.username
                    updateDrawerPWD.value = true
                    break
                case "update":
                    await getRoleList()
                    updateUser.id = row.id
                    updateUser.username = row.username
                    updateUser.role = row.role
                    updateDrawer.value = true
                    break
            }
        }

        async function getRoleList() {
            appLoading.value = true
            await httpClient.get(roleListData.url, )
                .then(res => {
                    //响应成功，获取应用列表
                    roleList.value = res.data
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    appLoading.value = false
                })
        }

        //更新用户密码信息
        function updatePWDFunc() {
            appLoading.value = true
            updatePWDData.params.id = updatePWD.id
            updatePWDData.params.username = updatePWD.username
            // updatePWDData.params.oldPassword = updatePWD.oldPassword
            updatePWDData.params.newPassword = updatePWD.newPassword
            httpClient.put(updatePWDData.url, updatePWDData.params)
                .then(res => {
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    //重置表单
                    resetForm('updatePWD')
                    getUserList()
                    //关闭抽屉
                    appLoading.value = false
                })
        }

        //编辑
        function updateUserFunc() {
            appLoading.value = true
            httpClient.put(updateUserData.url, updateUser)
                .then(res => {
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    //重置表单
                    resetForm('update')
                    getUserList()
                    //关闭抽屉
                    updateDrawer.value = false
                })
        }

        //新增
        function createUserFunc() {
            appLoading.value = true
            httpClient.post(createUserData.url, createUser)
                .then(res => {
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    //重置表单
                    resetForm('create')
                    getUserList()
                    //关闭抽屉
                    createDrawer.value = false
                })
        }

        //更新按钮
        async function formSubmit(val) {
            try {
                switch (val) {
                    case "create":
                        await createRef.value.validateFields();
                        createUserFunc()
                        break
                    case "updatePWD":
                        await updateRefPWD.value.validateFields();
                        updatePWDFunc()
                        break
                    case "update":
                        await updateRef.value.validateFields();
                        updateUserFunc()
                        break
                }
            } catch (errorInfo) {
                console.log("Failed: ", errorInfo)
            }
        }

        //删除Deployment
        function delUserFunc(row) {
            appLoading.value = true
            delUserData.params.id = row.id
            httpClient.delete(delUserData.url, {data: delUserData.params})
                .then(res => {
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    getUserList()
                    //关闭抽屉
                    appLoading.value = false
                })
        }
        //确认框
        //action操作的动作 res操作的资源 fn具体操作的方法
        function showConfirm(action, res, fn){
            Modal.confirm({
                title: '是否继续 ' + action + ' 操作？操作对象：',
                icon: createVNode(ExclamationCircleOutlined),
                content: createVNode('div', {}, res),
                cancelText: '取消',
                okText: '确认',
                onOk() {
                    fn(res)
                },
            })
        }
        function resetForm(val) {
            switch (val) {
                case "create":
                    createRef.value.resetFields()
                    break
                case "updatePWD":
                    updateRefPWD.value.resetFields()
                    break
                case "update":
                    updateRef.value.resetFields()
                    break
            }
        }
        //关闭抽屉
        function onClose (val) {
            Modal.confirm({
                title: "是否确认关闭操作? ",
                icon: createVNode(ExclamationCircleOutlined),
                content: createVNode('div', {
                    style: 'color:red;',
                }),
                cancelText: '取消',
                okText: '确认',
                onOk() {
                    createDrawer.value = false
                    updateDrawer.value = false
                    updateDrawerPWD.value = false
                    resetForm(val)
                },
                onCancel() {
                    switch (val) {
                        case "create":
                            createDrawer.value = true
                            updateDrawer.value = false
                            break
                        case "updatePWD":
                            updateDrawerPWD.value = true
                            break
                        case "update":
                            createDrawer.value = false
                            updateDrawer.value = true
                            break
                    }
                }
            })
        }

        // 生命周期钩子
        onMounted(() => {
            getRoleList()
        })

        // 返回数据
        return {
            appLoading,
            columns,
            getSearchValue,
            handleTableChange,
            userList,
            getUserList,
            timeTrans,
            pagination,
            handleOpenForm,
            showConfirm,
            updateRef,
            updateDrawer,
            updateUser,
            formSubmit,
            onClose,
            delUserFunc,
            createRef,
            createDrawer,
            createUser,
            rules,
            roleList,
            getRoleList,
            updateRefPWD,
            updateDrawerPWD,
            updatePWD,
        }
    }
})
</script>