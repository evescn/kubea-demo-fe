<template>
    <MainHead
        v-if="role.id !== '1'"
        searchDescribe="请输入"
        @searchChange="getSearchValue"
        @dataList="getAppList"
        repo
        @groupChange="getRepoValue"
        @addFunc="handleOpenForm('create')" />
    <MainHead
        v-if="role.id == '1'"
        searchDescribe="请输入"
        @searchChange="getSearchValue"
        @dataList="getAppList"
        repo
        @groupChange="getRepoValue"
        add
        @addFunc="handleOpenForm('create')" />
    <!-- 表格数据 -->
    <a-card :bodyStyle="{padding: '10px'}">
        <a-table
            style="font-size: 12px"
            :loading="appLoading"
            :columns="columns"
            :dataSource="appList"
            :pagination="pagination"
            @change="handleTableChange">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'app_name'">
                    <span style="font-weight: bold; color: rgb(98,199,191);">{{ record.app_name }}</span>
                </template>
                <template v-if="column.dataIndex === 'repo_name'">
                    <span v-if="record.repo_name === 'bhbl'" style="color: rgb(84, 138, 238);">{{ record.repo_name }}</span>
                    <span v-else-if="record.repo_name === 'inf'" style="color: rgb(185,117,76);">{{ record.repo_name }}</span>
                    <span v-else-if="record.repo_name === 'fe'" style="color: rgb(168,104,204);">{{ record.repo_name }}</span>
                </template>
                <template v-if="column.dataIndex === 'lang'">
                    <a-tag v-if="record.lang === 'Java'" color="blue">{{ record.lang }}</a-tag>
                    <a-tag v-else-if="record.lang === 'Web'" color="cyan">{{ record.lang }}</a-tag>
                    <a-tag v-else color="orange">{{ record.lang }}</a-tag>
                </template>
                <template v-if="column.dataIndex === 'type'">
                    <a-tag v-if="record.type === 'Api'" color="blue">{{ record.type }}</a-tag>
                    <a-tag v-else-if="record.type === 'Admin'" color="cyan">{{ record.type }}</a-tag>
                    <a-tag v-else color="orange">{{ record.type }}</a-tag>
                </template>
                <template v-if="column.dataIndex === 'CreatedAt'">
                    <a-tag color="gray">{{ timeTrans(record.CreatedAt) }}</a-tag>
                </template>
                <template v-if="column.key === 'action'">
                    <a-button v-if="role.id !== '1'" :disabled="true" size="small" type="link" @click="handleOpenForm('update', record)">编辑</a-button>
                    <a-button v-else-if="role.id == '1'" size="small" type="link" @click="handleOpenForm('update', record)">编辑</a-button>
                    <a-button v-if="role.id !== '1'" :disabled="true" size="small" type="link" @click="showConfirm('删除', record, delAppFunc)">删除</a-button>
                    <a-button v-else-if="role.id == '1'" size="small" type="link" @click="showConfirm('删除', record, delAppFunc)">删除</a-button>
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
        <a-form ref="updateRef" :model="updateApp" :labelCol="{style: {width: '30%'}}">
            <a-form-item
                label="应用名"
                name="app_name"
                :rules="[{ required: true, message: '请输入应用名'}]">
                <a-input v-model:value="updateApp.app_name"></a-input>
            </a-form-item>
            <a-form-item
                label="仓库"
                name="repo_name"
                :rules="[{ required: true, message: '请输入仓库名'}]">
                <a-select show-search style="width:140px;margin-right:20px;" size="small" v-model:value="updateApp.repo_name"
                          placeholder="请选择">
                    <a-select-option
                        v-for="(item, index) in repoList"
                        :key="index"
                        :value="item">
                        {{ item }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                label="开发语言"
                name="lang"
                :rules="[{ required: true, message: '请选择开发语言'}]">
                <a-select show-search style="width: 140px" v-model:value="updateApp.lang" placeholder="请选择">
                    <a-select-option
                        v-for="(item, index) in appLangList"
                        :key="index"
                        :value="item">
                        {{ item }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                label="类型"
                name="type"
                :rules="[{ required: true, message: '请选择应用类型'}]">
                <a-select show-search style="width: 140px" v-model:value="updateApp.type" placeholder="请选择">
                    <a-select-option
                        v-for="(item, index) in appTypeList"
                        :key="index"
                        :value="item">
                        {{ item }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                label="Owner"
                name="owner"
                :rules="[{ required: true, message: '请输入owner'}]">
                <a-input v-model:value="updateApp.owner"></a-input>
            </a-form-item>
            <a-form-item
                label="描述"
                name="description"
                :rules="[{ required: true, message: '请输入应用描述' }]">
                <a-textarea show-count :maxlength="20" v-model:value="updateApp.description"/>
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
        <a-form ref="createRef" :model="createApp" :labelCol="{style: {width: '30%'}}">
            <a-form-item
                label="应用名"
                name="app_name"
                :rules="[{ required: true, message: '请输入应用名'}]">
                <a-input v-model:value="createApp.app_name"></a-input>
            </a-form-item>
            <a-form-item
                label="仓库"
                name="repo_name"
                :rules="[{ required: true, message: '请输入仓库名'}]">
                <a-select show-search style="width:140px;margin-right:20px;" size="small" v-model:value="createApp.repo_name"
                          placeholder="请选择">
                    <a-select-option
                        v-for="(item, index) in repoList"
                        :key="index"
                        :value="item">
                        {{ item }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                label="开发语言"
                name="lang"
                :rules="[{ required: true, message: '请选择开发语言'}]">
                <a-select show-search style="width: 140px" v-model:value="createApp.lang" placeholder="请选择">
                    <a-select-option
                        v-for="(item, index) in appLangList"
                        :key="index"
                        :value="item">
                        {{ item }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                label="类型"
                name="type"
                :rules="[{ required: true, message: '请选择应用类型'}]">
                <a-select show-search style="width: 140px" v-model:value="createApp.type" placeholder="请选择">
                    <a-select-option
                        v-for="(item, index) in appTypeList"
                        :key="index"
                        :value="item">
                        {{ item }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                label="Owner"
                name="owner"
                :rules="[{ required: true, message: '请输入owner'}]">
                <a-input v-model:value="createApp.owner"></a-input>
            </a-form-item>
            <a-form-item
                label="描述"
                name="description"
                :rules="[{ required: true, message: '请输入应用描述' }]">
                <a-textarea show-count :maxlength="20" v-model:value="createApp.description"/>
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button style="margin-right: 8px" @click="onClose('create')">取消</a-button>
            <a-button type="primary" @click="formSubmit('create')">新增</a-button>
        </template>
    </a-drawer>
</template>

<script>
import {ref, reactive, createVNode} from 'vue'
import common from '@/config'
import httpClient from '@/request'
import {message, Modal} from 'ant-design-vue'
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';

export default ({
    setup() {
        //常用项
        const searchValue = ref('')
        const repoValue = ref('')
        const appLoading = ref(false)
        const role = reactive({
            id: 0,
        })
        role.id = localStorage.getItem('role')


        // 表格列
        const columns = ref([
            // {
            //     title: 'ID',
            //     dataIndex: 'id'
            // },
            {
                title: '应用名',
                dataIndex: 'app_name'
            },
            {
                title: '仓库组',
                dataIndex: 'repo_name'
            },
            {
                title: '语言',
                dataIndex: 'lang',
            },
            {
                title: '类型',
                dataIndex: 'type',
            },
            {
                title: 'Owner',
                dataIndex: 'owner'
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
        const appList = ref([])
        const appListData = reactive({
            url: common.appList,
            params: {
                app_name: '',
                repo_name: '',
                page: 1,
                limit: 10
            }
        })
        // 访问后端数据
        const appLangList = common.appLangList
        const appTypeList = common.appTypeList
        const repoList = common.repoList
        //更新
        const updateRef = ref()
        const updateDrawer = ref(false)
        const updateApp = reactive({
            id: 0,
            app_name: '',
            repo_name: '',
            lang: '',
            type: '',
            owner: '',
            description: ''
        })
        const updateAppData = reactive({
            url: common.appUpdate,
            params: {}
        })

        //新增
        const createRef = ref()
        const createDrawer = ref(false)
        const createApp = reactive({
            app_name: '',
            repo_name: '',
            lang: '',
            type: '',
            owner: '',
            description: ''
        })
        const createAppData = reactive({
            url: common.appAdd,
            params: {}
        })

        //删除
        const delAppData = reactive({
            url: common.appDel,
            params: {
                id: '',
            }
        })

        //【方法】
        function getSearchValue(val) {
            searchValue.value = val
            pagination.current = 1
        }

        function getRepoValue(val) {
            repoValue.value = val
            pagination.current = 1
        }

        //处理翻页，pageSize变化
        function handleTableChange(val) {
            pagination.current = val.current
            pagination.pageSize = val.pageSize
            getAppList()
        }

        //时间调整
        function timeTrans(timestamp) {
            let date = new Date(new Date(timestamp).getTime() + 8 * 3600 * 1000)
            date = date.toJSON();
            date = date.substring(0, 19).replace('T', ' ')
            return date
        }

        function getAppList() {
            appLoading.value = true
            appListData.params.app_name = searchValue.value
            appListData.params.repo_name = repoValue.value
            appListData.params.page = pagination.current
            appListData.params.limit = pagination.pageSize
            httpClient.get(appListData.url, {params: appListData.params})
                .then(res => {
                    appList.value = res.data.items
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
                    updateApp.id = row.id
                    updateApp.app_name = row.app_name
                    updateApp.repo_name = row.repo_name
                    updateApp.lang = row.lang
                    updateApp.type = row.type
                    updateApp.owner = row.owner
                    updateApp.description = row.description
                    updateDrawer.value = true
                    break
            }
        }

        //编辑
        function updateAppFunc() {
            appLoading.value = true
            httpClient.put(updateAppData.url, updateApp)
                .then(res => {
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    //重置表单
                    resetForm('update')
                    getAppList()
                    //关闭抽屉
                    updateDrawer.value = false
                })
        }

        //新增
        function createAppFunc() {
            appLoading.value = true
            httpClient.post(createAppData.url, createApp)
                .then(res => {
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    //重置表单
                    resetForm('create')
                    getAppList()
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
                        createAppFunc()
                        break
                    case "update":
                        await updateRef.value.validateFields();
                        updateAppFunc()
                        break
                }
            } catch (errorInfo) {
                console.log("Failed: ", errorInfo)
            }
        }

        //删除Deployment
        function delAppFunc(row) {
            appLoading.value = true
            delAppData.params.id = row.id
            httpClient.delete(delAppData.url, {data: delAppData.params})
                .then(res => {
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    getAppList()
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

        // 返回数据
        return {
            appLoading,
            columns,
            getSearchValue,
            getRepoValue,
            handleTableChange,
            getAppList,
            timeTrans,
            appList,
            repoList,
            pagination,
            handleOpenForm,
            showConfirm,
            appLangList,
            appTypeList,
            updateRef,
            updateDrawer,
            updateApp,
            formSubmit,
            onClose,
            delAppFunc,
            createRef,
            createDrawer,
            createApp,
            role,
        }
    }
})
</script>