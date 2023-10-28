<template>
    <MainHead
        searchDescribe="请输入"
        @searchChange="getSearchValue"
        @dataList="getDeployList"
        en
        @envChange="getEnValue"
        repo
        @groupChange="getRepoValue"
        add
        @addFunc="handleOpenForm('create')"/>
    <!-- 表格数据 -->
    <a-card :bodyStyle="{padding: '10px'}">
        <a-table
            style="font-size: 12px;"
            :loading="appLoading"
            :columns="columns"
            :dataSource="deployList"
            :pagination="pagination"
            @change="handleTableChange">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'app_name'">
                    <span style="font-weight: bold; color: rgb(89,194,141);">{{ record.app_name }}</span>
                </template>
                <template v-if="column.dataIndex === 'repo_name'">
                    <span v-if="record.repo_name === 'bhbl'" style="color: rgb(84, 138, 238);">{{ record.repo_name }}</span>
                    <span v-else-if="record.repo_name === 'inf'" style="color: rgb(185,117,76);">{{ record.repo_name }}</span>
                    <span v-else-if="record.repo_name === 'fe'" style="color: rgb(168,104,204);">{{ record.repo_name }}</span>
                </template>
                <template v-if="column.dataIndex === 'en'">
                    <a-tag v-if="record.en == 't1'" color="blue">{{ record.en }}</a-tag>
                    <a-tag v-else-if="record.en == 't3'" color="cyan">{{ record.en }}</a-tag>
                    <a-tag v-else-if="record.en == 'd1'" color="yellow">{{ record.en }}</a-tag>
                    <a-tag v-else color="orange">{{ record.en }}</a-tag>
                </template>
                <template v-if="column.dataIndex === 'branch'">
                    <span style="color: rgb(84, 138, 238);">{{ record.branch }}</span>
                </template>
                <template v-if="column.dataIndex === 'tag'">
                    <a-space :size="0">
                        <a-progress v-if=" (record.tag === 1)" :percent="100" size="small"
                                    status="success"/>
                        <!--<a-progress v-else-if="record.build_status === 0" :percent="0" size="small"/>-->
                    </a-space>
                </template>
                <template v-if="column.dataIndex === 'status'">
                    <a-progress v-if="record.status === 4" :percent="100" :steps="5" status="exception" size="small"
                                stroke-color="#a61d24"/>
                    <a-progress v-else-if="record.status === 3" :percent="100" :steps="5" size="small"
                                stroke-color="#52c41a"/>
                    <a-progress v-else-if="record.status === 2" :percent="50" :steps="5" size="small"
                                stroke-color="#52c41a"/>
                    <a-progress v-else-if="record.status === 1" :percent="10" :steps="5" size="small"
                                stroke-color="#52c41a"/>
                    <a-progress v-else-if="record.status === 0" :percent="0" size="small" :steps="5"/>
                    <a-progress v-else :percent="50" size="small" :steps="5"/>
                </template>
                <template v-if="column.dataIndex === 'start_time'">
                    <a-tag v-if="record.start_time">{{ record.start_time }}</a-tag>
                </template>
                <template v-if="column.dataIndex === 'duration'">
                    <a-tag v-if="record.duration">{{ record.duration }}</a-tag>
                </template>
                <template v-if="column.dataIndex === 'code_check'">
                    <a-space :size="0">
                        <a-progress v-if="record.code_check === 2" :percent="100" size="small"
                                    status="exception"/>
                        <a-progress v-else-if="record.code_check === 1" :percent="100" size="small"
                                    status="success"/>
                        <!--<a-progress v-else-if="record.build_status === 0" :percent="0" size="small"/>-->
                    </a-space>
                </template>
                <template v-if="column.dataIndex === 'build_status'">
                    <a-space :size="0">
                        <a-progress v-if="record.build_status === 2" :percent="100" size="small"
                                    status="exception"/>
                        <a-progress v-else-if="record.build_status === 1" :percent="100" size="small"
                                    status="success"/>
                        <!--<a-progress v-else-if="record.build_status === 0" :percent="0" size="small"/>-->
                    </a-space>
                </template>
                <template v-if="column.dataIndex === 'deploy_status'">
                    <a-space :size="0">
                        <a-progress v-if="record.deploy_status === 2" :percent="100" size="small"
                                    status="exception"/>
                        <a-progress v-else-if="record.deploy_status === 1" :percent="100" size="small"
                                    status="success"/>
                        <!--<a-progress v-else-if="record.deploy_status === 0" :percent="0" size="small"/>-->
                    </a-space>
                </template>
                <template v-if="column.dataIndex === 'CreatedAt'">
                    <a-tag color="gray">{{ timeTrans(record.CreatedAt) }}</a-tag>
                </template>
                <template v-if="column.key === 'action'">
                    <a-button :disabled="record.status !== 0" size="small" type="link" @click="appDeploy(record)">构建
                    </a-button>
                    <a-button :disabled="record.status === 0" size="small" type="link" @click="gotoJenkins(record)">详情
                    </a-button>
                    <a-button :disabled="record.status !== 0" size="small" type="link"
                              @click="handleOpenForm('update', record)">编辑
                    </a-button>
                    <a-button :disabled="record.status !== 0" size="small" type="link"
                              @click="showConfirm('删除', record, delDeployFunc)">删除
                    </a-button>
                </template>
            </template>
        </a-table>
    </a-card>
    <!-- 编辑发布表单 -->
    <a-drawer
        v-model:visible="updateDrawer"
        title="编辑发布信息"
        @close="onClose('update')">
        <br>
        <a-form ref="updateRef" :model="updateDeploy" :labelCol="{style: {width: '30%'}}">
            <a-form-item
                label="仓库"
                name="repo_name"
                :rules="[{ required: true, message: '请选择仓库'}]">
                <a-select @change="getAppList" show-search style="width:140px;margin-right:20px;" size="small"
                          v-model:value="updateDeploy.repo_name" placeholder="请选择">
                    <a-select-option
                        v-for="(item, index) in repoList"
                        :key="index"
                        :value="item">
                        {{ item }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                label="应用名"
                name="app_id"
                :rules="[{ required: true, message: '请选择应用'}]">
                <a-select show-search style="width:140px;margin-right:20px;" size="small"
                          v-model:value="updateDeploy.app_id" placeholder="请选择">
                    <a-select-option
                        v-for="(item, index) in appList"
                        :key="index"
                        :value="item.id">
                        {{ item.app_name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                label="环境"
                name="en"
                :rules="[{ required: true, message: '请选择环境'}]">
                <a-select show-search style="width: 140px" v-model:value="updateDeploy.en" placeholder="请选择">
                    <a-select-option
                        v-for="(item, index) in enList"
                        :key="index"
                        :value="item">
                        {{ item }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                label="版本分支"
                name="branch"
                :rules="[{ required: true, message: '请输入版本分支'}]">
                <a-input v-model:value="updateDeploy.branch"></a-input>
            </a-form-item>
            <a-form-item
                label="打TAG"
                name="tag">
                <a-switch v-model:checked="updateDeploy.tag" />
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
        <a-form ref="createRef" :model="createDeploy" :labelCol="{style: {width: '30%'}}">
            <a-form-item
                label="仓库"
                name="repo_name"
                :rules="[{ required: true, message: '请选择仓库'}]">
                <a-select @change="getAppList" show-search style="width:140px;margin-right:20px;" size="small"
                          v-model:value="createDeploy.repo_name" placeholder="请选择">
                    <a-select-option
                        v-for="(item, index) in repoList"
                        :key="index"
                        :value="item">
                        {{ item }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                label="应用名"
                name="app_id"
                :rules="[{ required: true, message: '请选择应用'}]">
                <a-select show-search style="width:140px;margin-right:20px;" size="small"
                          v-model:value="createDeploy.app_id" placeholder="请选择">
                    <a-select-option
                        v-for="(item, index) in appList"
                        :key="index"
                        :value="item.id">
                        {{ item.app_name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                label="环境"
                name="en"
                :rules="[{ required: true, message: '请选择环境'}]">
                <a-select show-search style="width: 140px" v-model:value="createDeploy.en" placeholder="请选择">
                    <a-select-option
                        v-for="(item, index) in enList"
                        :key="index"
                        :value="item">
                        {{ item }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                label="版本分支"
                name="branch"
                :rules="[{ required: true, message: '请输入版本分支'}]">
                <a-input v-model:value="createDeploy.branch"></a-input>
            </a-form-item>
            <a-form-item
                label="打TAG"
                name="tag">
                <a-switch v-model:checked="createDeploy.tag" />
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
        const enValue = ref('')
        const repoValue = ref('')
        const appLoading = ref(false)

        // 定时器
        let timer = null

        // 表格列
        const columns = ref([
            {
                title: 'ID',
                dataIndex: 'id'
            },
            {
                title: '应用名',
                dataIndex: 'app_name'
            },
            {
                title: '仓库',
                dataIndex: 'repo_name'
            },
            {
                title: '环境',
                dataIndex: 'en'
            },
            {
                title: '版本分支',
                dataIndex: 'branch',
            },
            {
                title: 'TAG',
                dataIndex: 'tag',
            },
            {
                title: '状态',
                dataIndex: 'status',
            },
            {
                title: '开始时间',
                dataIndex: 'start_time',
            },
            {
                title: '发布时长',
                dataIndex: 'duration'
            },
            {
                title: '代码检查',
                dataIndex: 'code_check',
            },
            {
                title: '编译状态',
                dataIndex: 'build_status'
            },
            {
                title: '部署状态',
                dataIndex: 'deploy_status'
            },
            {
                title: '发布者',
                dataIndex: 'builder',
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
                width: 220
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
        const deployList = ref([])
        const deployListData = reactive({
            url: common.deployList,
            params: {
                en: '',
                app_name: '',
                repo_name: '',
                page: 1,
                limit: 10
            }
        })

        //多选框列表选项
        const repoList = common.repoList
        const enList = common.enList
        const appList = ref([])
        const appListData = reactive({
            url: common.appGetApp,
            params: {
                repo_name: ''
            }
        })
        const appInfo = ref([])
        const appInfoData = reactive({
            url: common.appGet,
            params: {
                repo_name: '',
                app_name: ''
            }
        })

        //更新
        const updateRef = ref()
        const updateDrawer = ref(false)
        const updateDeploy = reactive({
            repo_name: '',
            app_id: '',
            en: '',
            branch: '',
            tag: '',
        })
        const updateDeployData = reactive({
            url: common.deployUpdate,
            params: {
                app_id: '',
                en: '',
                branch: '',
                tag: '',
            }
        })

        //新增
        const createRef = ref()
        const createDrawer = ref(false)
        const createDeploy = reactive({
            repo_name: '',
            app_id: '',
            en: '',
            branch: '',
            tag: '',
        })
        const createDeployData = reactive({
            url: common.deployAdd,
            params: {
                app_id: '',
                en: '',
                branch: '',
                tag: '',
            }
        })

        //删除
        const delDeployData = reactive({
            url: common.deployDel,
            params: {
                id: '',
            }
        })

        // 构建
        const appDeployData = reactive({
            url: common.cicdDeploy,
            params: {
                id: '',
                start_time: '',
                builder: ''
            }
        })

        // 方法
        function getSearchValue(val) {
            searchValue.value = val
            pagination.current = 1
        }

        function getRepoValue(val) {
            repoValue.value = val
            pagination.current = 1
        }

        function getEnValue(val) {
            enValue.value = val
            pagination.current = 1
        }

        //处理翻页， pageSize 变化
        function handleTableChange(val) {
            pagination.current = val.current
            pagination.pageSize = val.pageSize
            getDeployList()
        }

        //时间调整
        function timeTrans(timestamp) {
            let date = new Date(new Date(timestamp).getTime() + 8 * 3600 * 1000)
            date = date.toJSON();
            date = date.substring(0, 19).replace('T', ' ')
            return date
        }

        function getDeployList() {
            appLoading.value = true
            deployListData.params.en = enValue.value
            deployListData.params.app_name = searchValue.value
            deployListData.params.repo_name = repoValue.value
            deployListData.params.page = pagination.current
            deployListData.params.limit = pagination.pageSize
            httpClient.get(deployListData.url, {params: deployListData.params})
                .then(res => {
                    //响应成功，获取deploy列表和total
                    deployList.value = res.data.items
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
                    try {
                        await getAppInfo(row.repo_name, row.app_name)
                        // await getAppList(appInfo.value.repo_name)
                        await getAppList(row.repo_name)

                        updateDeploy.id = row.id
                        updateDeploy.repo_name = appInfo.value.repo_name
                        // updateDeploy.repo_name = row.repo_name
                        // updateDeploy.app_id = row.app_id
                        updateDeploy.app_id = appInfo.value.id
                        updateDeploy.en = row.en
                        updateDeploy.branch = row.branch
                        // updateDeploy.tag = row.tag
                        updateDeploy.tag = integerToBool(row.tag)
                        updateDrawer.value = true
                    } catch (error) {
                        // 处理错误，例如显示错误信息
                        message.success("Error in getAppInfo:", error)
                    }
                    break
            }
        }

        // function handleOpenForm(val, row) {
        //     // console.log(row)
        //     switch (val) {
        //         case "create":
        //             createDrawer.value = true
        //             break
        //         case "update":
        //             getAppInfo(row.app_id)
        //             updateDeploy.id = row.id
        //             updateDeploy.repo_name = appInfo.value.repo_name
        //             updateDeploy.app_id = row.app_id
        //             updateDeploy.en = row.en
        //             updateDeploy.branch = row.branch
        //             updateDrawer.value = true
        //             console.log("handleOpenForm: ", updateDeploy)
        //             break
        //     }
        // }

        let javaTag = ref(0)
        function boolToInteger(val) {
            javaTag = val ? 1 : 2;
            return javaTag
        }

        let webTag = ref(false)
        function integerToBool(val) {
            if (val === 2 ){
                webTag = false
            } else if (val === 1 ){
                webTag = true
            }
            return webTag
        }
        //编辑
        function updateDeployFunc() {
            appLoading.value = true
            updateDeployData.params = updateDeploy
            updateDeployData.params.tag = boolToInteger(updateDeploy.tag)
            httpClient.put(updateDeployData.url, updateDeployData.params)
                .then(res => {
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    //重置表单
                    resetForm('update')
                    getDeployList()
                    //关闭抽屉
                    updateDrawer.value = false
                })
        }

        //新增
        function createDeployFunc() {
            appLoading.value = true
            createDeployData.params = createDeploy
            createDeployData.params.tag = boolToInteger(createDeployData.params.tag)
            httpClient.post(createDeployData.url, createDeployData.params)
                .then(res => {
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    //重置表单
                    resetForm('create')
                    getDeployList()
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
                        createDeployFunc()
                        break
                    case "update":
                        await updateRef.value.validateFields();
                        updateDeployFunc()
                        break
                }
            } catch (errorInfo) {
                message.error("Failed: ", errorInfo)
            }
        }

        //删除Deployment
        function delDeployFunc(row) {
            appLoading.value = true
            delDeployData.params.id = row.id
            httpClient.delete(delDeployData.url, {data: delDeployData.params})
                .then(res => {
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    getDeployList()
                    //关闭抽屉
                    appLoading.value = false
                })
        }

        //确认框
        //action操作的动作 res操作的资源 fn具体操作的方法
        function showConfirm(action, res, fn) {
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
        function onClose(val) {

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
                            break
                        case "update":
                            updateDrawer.value = true
                            break
                    }
                }
            })
        }

        async function getAppList(val) {
            appLoading.value = true
            appListData.params.repo_name = val
            await httpClient.get(appListData.url, {params: appListData.params})
                .then(res => {
                    //响应成功，获取应用列表
                    appList.value = res.data
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    appLoading.value = false
                })
        }

        async function getAppInfo(repo_name, app_name ) {
            appLoading.value = true
            appInfoData.params.repo_name = repo_name
            appInfoData.params.app_name = app_name
            await httpClient.get(appInfoData.url, {params: appInfoData.params})
                .then(res => {
                    //响应成功，获取应用列表
                    appInfo.value = res.data
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    appLoading.value = false
                })
        }

        function appDeploy(record) {
            appLoading.value = true
            const datetimeStr = timeTrans(new Date())
            appDeployData.params.id = record.id
            appDeployData.params.start_time = datetimeStr
            appDeployData.params.builder = localStorage.getItem('username')
            httpClient.post(appDeployData.url, appDeployData.params)
                .then(res => {
                    //响应成功
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    // 重新获取列表
                    getDeployList()
                    appLoading.value = false
                })
        }

        function gotoJenkins(record) {
            window.open(record.build_url, '_blanik')
        }

        // 生命周期钩子
        // onMounted(() => {
        //     //定时器、每100毫秒轮训一次
        //     timer = setInterval(() => {
        //         //如果有这两个值，则继续走下面的逻辑
        //         getDeployList()
        //     }, 30000)
        // })

        // 数据返回
        return {
            appLoading,
            getSearchValue,
            getRepoValue,
            getEnValue,
            handleTableChange,
            getDeployList,
            timeTrans,
            columns,
            deployList,
            pagination,
            handleOpenForm,
            updateRef,
            updateDrawer,
            updateDeploy,
            updateDeployFunc,
            createRef,
            createDrawer,
            createDeploy,
            createDeployFunc,
            formSubmit,
            delDeployFunc,
            showConfirm,
            onClose,
            repoList,
            enList,
            appList,
            getAppList,
            appDeploy,
            gotoJenkins,

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