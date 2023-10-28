<template>
    <MainHead
        v-if="role.id !== '1'"
        searchDescribe="请输入"
        @searchChange="getSearchValue"
        @dataList="getEnvList"
        @addFunc="handleOpenForm('create')"/>
    <MainHead
        v-if="role.id == '1'"
        searchDescribe="请输入"
        @searchChange="getSearchValue"
        @dataList="getEnvList"
        add
        @addFunc="handleOpenForm('create')"/>
    <!-- 表格数据 -->
    <a-card :bodyStyle="{padding: '10px'}">
        <a-table
            style="font-size: 12px"
            :loading="appLoading"
            :columns="columns"
            :dataSource="envList"
            :pagination="pagination"
            @change="handleTableChange">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'name'">
                    <span v-if="record.name === 'd1'" style="color: rgb(84, 138, 238);">{{ record.name }}</span>
                    <span v-else-if="record.name === 't1'" style="color: rgb(185,117,76);">{{ record.name }}</span>
                    <span v-else-if="record.name === 'uat'" style="color: rgb(168,104,204);">{{ record.name }}</span>
                </template>
                <template v-if="column.dataIndex === 'description'">
                    <a-tag color="orange">{{ record.description }}</a-tag>
                </template>
                <template v-if="column.dataIndex === 'CreatedAt'">
                    <a-tag color="gray">{{ timeTrans(record.CreatedAt) }}</a-tag>
                </template>
                <template v-if="column.key === 'action'">
                    <a-button v-if="role.id !== '1'" :disabled="true" size="small" type="link" @click="handleOpenForm('update', record)">编辑</a-button>
                    <a-button v-else-if="role.id == '1'" size="small" type="link" @click="handleOpenForm('update', record)">编辑</a-button>
                    <a-button v-if="role.id !== '1'" :disabled="true" size="small" type="link" @click="showConfirm('删除', record, delEnvFunc)">删除</a-button>
                    <a-button v-else-if="role.id == '1'" size="small" type="link" @click="showConfirm('删除', record, delEnvFunc)">删除</a-button>
                </template>
            </template>
        </a-table>
    </a-card>
    <!-- 编辑应用表单 -->
    <a-drawer
        v-model:visible="updateDrawer"
        title="编辑应用"
        :footer-style="{textAlign: 'right'}"
        @close="onClose('update')">
        <br>
        <a-form ref="updateRef" :model="updateEnv" :labelCol="{style: {width: '30%'}}">
            <a-form-item
                label="环境"
                name="env_name"
                :rules="[{ required: true, message: '请输入应用名'}]">
                <a-input v-model:value="updateEnv.env_name"></a-input>
            </a-form-item>
            <a-form-item
                label="描述"
                name="description"
                :rules="[{ required: true, message: '请输入应用描述' }]">
                <a-textarea show-count :maxlength="20" v-model:value="updateEnv.description"/>
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button style="margin-right: 8px" @click="onClose('update')">取消</a-button>
            <a-button type="primary" @click="formSubmit('update')">更新</a-button>
        </template>
    </a-drawer>
    <!-- 新增应用表单 -->
    <a-drawer
        v-model:visible="createDrawer"
        title="新增应用"
        :footer-style="{textAlign: 'right'}"
        @close="onClose('create')">
        <br>
        <a-form ref="createRef" :model="createEnv" :labelCol="{style: {width: '30%'}}">
            <a-form-item
                label="环境"
                name="env_name"
                :rules="[{ required: true, message: '请输入应用名'}]">
                <a-input v-model:value="createEnv.env_name"></a-input>
            </a-form-item>
            <a-form-item
                label="描述"
                name="description"
                :rules="[{ required: true, message: '请输入应用描述' }]">
                <a-textarea show-count :maxlength="20" v-model:value="createEnv.description"/>
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
        const role = reactive({
            id: 0,
        })
        role.id = localStorage.getItem('role')

        // 表格列
        const columns = ref([
            {
                title: 'ID',
                dataIndex: 'id'
            },
            {
                title: '环境名',
                dataIndex: 'name'
            },
            {
                title: '描述',
                dataIndex: 'description'
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
                width: 150
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
        const envList = ref([])
        const envListData = reactive({
            url: common.urlEnvList,
            params: {
                env_name: '',
                page: 1,
                limit: 10
            }
        })

        //更新
        const updateRef = ref()
        const updateDrawer = ref(false)
        const updateEnv = reactive({
            id: 0,
            name: '',
            description: ''
        })
        const updateEnvData = reactive({
            url: common.urlEnvUpdate,
            params: {}
        })

        //新增
        const createRef = ref()
        const createDrawer = ref(false)
        const createEnv = reactive({
            name: '',
            description: ''
        })
        const createEnvData = reactive({
            url: common.urlEnvAdd,
            params: {}
        })

        //删除
        const delEnvData = reactive({
            url: common.urlEnvDel,
            params: {
                id: '',
            }
        })

        // 方法
        function getSearchValue(val) {
            searchValue.value = val
            pagination.current = 1
        }

        //处理翻页， pageSize 变化
        function handleTableChange(val) {
            pagination.current = val.current
            pagination.pageSize = val.pageSize
            getEnvList()
        }

        //时间调整
        function timeTrans(timestamp) {
            let date = new Date(new Date(timestamp).getTime() + 8 * 3600 * 1000)
            date = date.toJSON();
            date = date.substring(0, 19).replace('T', ' ')
            return date
        }

        function getEnvList() {
            appLoading.value = true
            envListData.params.env_name = searchValue.value
            envListData.params.page = pagination.current
            envListData.params.limit = pagination.pageSize
            httpClient.get(envListData.url, {params: envListData.params})
                .then(res => {
                    //响应成功，获取env列表和total
                    envList.value = res.data.items
                    pagination.total = res.data.total
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    appLoading.value = false
                })
        }

        function handleOpenForm(val, row) {
            switch (val) {
                case "create":
                    createDrawer.value = true
                    break
                case "update":
                    updateEnv.id = row.id
                    updateEnv.env_name = row.name
                    updateEnv.description = row.description
                    updateDrawer.value = true
                    break
            }
        }

        function updateEnvFunc() {
            appLoading.value = true
            httpClient.put(updateEnvData.url, updateEnv)
                .then(res => {
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    //重置表单
                    resetForm('update')
                    getEnvList()
                    //关闭抽屉
                    updateDrawer.value = false
                })
        }

        //新增
        function createEnvFunc() {
            appLoading.value = true
            httpClient.post(createEnvData.url, createEnv)
                .then(res => {
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    //重置表单
                    resetForm('create')
                    getEnvList()
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
                        createEnvFunc()
                        break
                    case "update":
                        await updateRef.value.validateFields();
                        updateEnvFunc()
                        break
                }
            } catch (errorInfo) {
                console.log("Failed: ", errorInfo)
            }
        }

        //删除Deployment
        function delEnvFunc(row) {
            appLoading.value = true
            delEnvData.params.id = row.id
            httpClient.delete(delEnvData.url, {data: delEnvData.params})
                .then(res => {
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    getEnvList()
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
                    resetForm(val)
                },
                onCancel() {
                    switch (val) {
                        case "create":
                            createDrawer.value = true
                            updateDrawer.value = false
                            break
                        case "update":
                            createDrawer.value = false
                            updateDrawer.value = true
                            break
                    }
                }
            })
        }

        onMounted(() => {
            getEnvList()
        })

        return {
            appLoading,
            getSearchValue,
            getEnvList,
            pagination,
            handleTableChange,
            handleOpenForm,
            columns,
            envList,
            timeTrans,
            showConfirm,
            delEnvFunc,
            formSubmit,
            onClose,
            updateDrawer,
            updateRef,
            updateEnv,
            createDrawer,
            createRef,
            createEnv,
            role
        }
    }
})
</script>
