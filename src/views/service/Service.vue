<template>
    <MainHead
        v-if="role.id !== '1'"
        searchDescribe="请输入"
        @searchChange="getSearchValue"
        @dataList="getSvcList"
        urlEnv
        @urlEnvChange="getUrlEnvValue"
        @addFunc="handleOpenForm('create')"/>
    <MainHead
        v-else-if="role.id == '1'"
        searchDescribe="请输入"
        @searchChange="getSearchValue"
        @dataList="getSvcList"
        urlEnv
        @urlEnvChange="getUrlEnvValue"
        add
        @addFunc="handleOpenForm('create')"/>
    <!-- 表格数据 -->

    <a-card :bodyStyle="{padding: '10px'}">
        <a-table
            style="font-size: 12px"
            :loading="appLoading"
            :columns="columns"
            :dataSource="svcList"
            :pagination="pagination"
            @change="handleTableChange">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'svc_name'">
                    <span v-if="record.svc_name === 'd1'" style="color: rgb(84, 138, 238);">{{ record.svc_name }}</span>
                    <span v-else-if="record.svc_name === 't1'" style="color: rgb(185,117,76);">{{ record.svc_name }}</span>
                    <span v-else-if="record.svc_name === 'uat'" style="color: rgb(168,104,204);">{{ record.svc_name }}</span>
                </template>
                <template v-if="column.dataIndex === 'url'">
                    <a v-bind:href="getFullUrl(record.url)" target="_blank" rel="noreferrer">
                        <a-tag color="pink">
                            {{ record.url }}
                        </a-tag>
                    </a>
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
                    <a-button v-if="role.id !== '1'" :disabled="true" size="small" type="link" @click="showConfirm('删除', record, delSvcFunc)">删除</a-button>
                    <a-button v-else-if="role.id == '1'" size="small" type="link" @click="showConfirm('删除', record, delSvcFunc)">删除</a-button>
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
        <a-form ref="updateRef" :model="updateSvc" :labelCol="{style: {width: '30%'}}">
            <a-form-item
                label="服务"
                name="svc_name"
                :rules="[{ required: true, message: '请输入服务名'}]">
                <a-input v-model:value="updateSvc.svc_name"></a-input>
            </a-form-item>
            <a-form-item
                label="URL地址"
                name="url"
                :rules="[{ required: true, message: '请输入服务URL地址'}]">
                <a-input v-model:value="updateSvc.url"></a-input>
            </a-form-item>
            <a-form-item
                label="用户名"
                name="p_name"
                :rules="[{ required: true, message: '请输入URL地址账号'}]">
                <a-input v-model:value="updateSvc.p_name"></a-input>
            </a-form-item>
            <a-form-item
                label="密码"
                name="p_password"
                :rules="[{ required: true, message: '请输入URL地址密码'}]">
                <a-input v-model:value="updateSvc.p_password"></a-input>
            </a-form-item>
            <a-form-item
                label="描述"
                name="description"
                :rules="[{ required: true, message: '请输入应用描述' }]">
                <a-textarea show-count :maxlength="20" v-model:value="updateSvc.description"/>
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
        <a-form ref="createRef" :model="createSvc" :labelCol="{style: {width: '30%'}}">
            <a-form-item
                label="服务"
                name="svc_name"
                :rules="[{ required: true, message: '请输入服务名'}]">
                <a-input v-model:value="createSvc.svc_name"></a-input>
            </a-form-item>
            <a-form-item
                label="URL地址"
                name="url"
                :rules="[{ required: true, message: '请输入服务URL地址'}]">
                <a-input v-model:value="createSvc.url"></a-input>
            </a-form-item>
            <a-form-item
                label="用户名"
                name="p_name"
                :rules="[{ required: true, message: '请输入URL地址账号'}]">
                <a-input v-model:value="createSvc.p_name"></a-input>
            </a-form-item>
            <a-form-item
                label="密码"
                name="p_password"
                :rules="[{ required: true, message: '请输入URL地址密码'}]">
                <a-input v-model:value="createSvc.p_password"></a-input>
            </a-form-item>
            <a-form-item
                label="描述"
                name="description"
                :rules="[{ required: true, message: '请输入应用描述' }]">
                <a-textarea show-count :maxlength="20" v-model:value="createSvc.description"/>
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button style="margin-right: 8px" @click="onClose('create')">取消</a-button>
            <a-button type="primary" @click="formSubmit('create')">新增</a-button>
        </template>
    </a-drawer>
</template>
<script>
import {ref, reactive, createVNode, onMounted,} from 'vue'
import common from '@/config'
import httpClient from '@/request'
import {message, Modal} from 'ant-design-vue'
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';

export default ({
    setup() {
        //常用项
        const searchValue = ref('')
        const urlEnvValue = ref('')
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
                title: '服务名',
                dataIndex: 'svc_name'
            },
            {
                title: 'URL地址',
                dataIndex: 'url'
            },
            {
                title: '账号',
                dataIndex: 'p_name'
            },
            {
                title: '密码',
                dataIndex: 'p_password'
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
        const svcList = ref([])
        const svcListData = reactive({
            url: common.urlSvcList,
            params: {
                username: '',
                role: '',
                svc_name: '',
                eid: '',
                page: 1,
                limit: 10
            }
        })

        //更新
        const updateRef = ref()
        const updateDrawer = ref(false)
        const updateSvc = reactive({
            id: 0,
            svc_name: '',
            url: '',
            pid: 0,
            p_name: '',
            p_password: '',
            description: ''
        })
        const updateSvcData = reactive({
            url: common.urlSvcUpdate,
            params: {}
        })

        //新增
        const createRef = ref()
        const createDrawer = ref(false)
        const createSvc = reactive({
            svc_name: '',
            url: '',
            eid: 0,
            p_name: '',
            p_password: '',
            description: ''
        })
        const createSvcData = reactive({
            url: common.urlSvcAdd,
            params: {}
        })

        //删除
        const delSvcData = reactive({
            url: common.urlSvcDel,
            params: {
                id: '',
                pid: ''
            }
        })

        // 方法
        function getSearchValue(val) {
            searchValue.value = val
            pagination.current = 1
        }
        function getUrlEnvValue(val) {
            urlEnvValue.value = val
            pagination.current = 1
        }

        //处理翻页， pageSize 变化
        function handleTableChange(val) {
            pagination.current = val.current
            pagination.pageSize = val.pageSize
            getSvcList()
        }

        //时间调整
        function timeTrans(timestamp) {
            let date = new Date(new Date(timestamp).getTime() + 8 * 3600 * 1000)
            date = date.toJSON();
            date = date.substring(0, 19).replace('T', ' ')
            return date
        }

        function getSvcList() {
            appLoading.value = true
            svcListData.params.username = localStorage.getItem('username')
            svcListData.params.role = localStorage.getItem('role')
            svcListData.params.svc_name = searchValue.value
            svcListData.params.eid = localStorage.getItem('urlEnvID')
            svcListData.params.page = pagination.current
            svcListData.params.limit = pagination.pageSize
            httpClient.get(svcListData.url, {params: svcListData.params})
                .then(res => {
                    //响应成功，获取svc列表和total
                    svcList.value = res.data.items
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
                case "update":
                    updateSvc.id = row.id
                    updateSvc.svc_name = row.svc_name
                    updateSvc.url = row.url
                    updateSvc.pid = row.pid
                    updateSvc.p_name = row.p_name
                    updateSvc.p_password = row.p_password
                    updateSvc.description = row.description
                    updateDrawer.value = true
                    break
            }
        }

        function updateSvcFunc() {
            appLoading.value = true
            httpClient.put(updateSvcData.url, updateSvc)
                .then(res => {
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    //重置表单
                    resetForm('update')
                    getSvcList()
                    //关闭抽屉
                    updateDrawer.value = false
                })
        }

        //新增
        function createSvcFunc() {
            appLoading.value = true
            createSvc.eid = Number(localStorage.getItem('urlEnvID'))
            httpClient.post(createSvcData.url, createSvc)
                .then(res => {
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    //重置表单
                    resetForm('create')
                    getSvcList()
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
                        createSvcFunc()
                        break
                    case "update":
                        await updateRef.value.validateFields();
                        updateSvcFunc()
                        break
                }
            } catch (errorInfo) {
                console.log("Failed: ", errorInfo)
            }
        }

        //删除Deployment
        function delSvcFunc(row) {
            appLoading.value = true
            delSvcData.params.id = row.id
            delSvcData.params.pid = row.pid
            httpClient.delete(delSvcData.url, {data: delSvcData.params})
                .then(res => {
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    getSvcList()
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

        function getFullUrl(url) {
            // 如果 URL 已经以 "http://" 或 "https://" 开头，直接返回
            if (url.startsWith('http://') || url.startsWith('https://')) {
                return url;
            }

            // 否则，拼接成 "http://" + 原始 URL
            return 'http://' + url;
        }

        return {
            appLoading,
            getSearchValue,
            getSvcList,
            getUrlEnvValue,
            pagination,
            handleTableChange,
            handleOpenForm,
            columns,
            svcList,
            timeTrans,
            showConfirm,
            delSvcFunc,
            formSubmit,
            onClose,
            updateDrawer,
            updateRef,
            updateSvc,
            createDrawer,
            createRef,
            createSvc,
            getFullUrl,
            role,
        }
    }
})
</script>

<style scoped>
.pod-button {
    margin-right: 5px;
}

.ant-btn {
    border-radius: 1px;
}
</style>