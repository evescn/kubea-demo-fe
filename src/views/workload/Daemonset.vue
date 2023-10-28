<template>
    <div>
        <MainHead
            searchDescribe="请输入"
            @searchChange="getSearchValue"
            namespace
            @namespaceChange="getNamespaceValue"
            @dataList="getDaemonSetList"/>
        <!-- 表格数据 -->
        <a-card :bodyStyle="{padding: '10px'}">
            <a-table
                style="font-size: 12px;"
                :loading="appLoading"
                :columns="columns"
                :dataSource="daemonSetList"
                :pagination="pagination"
                @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex == 'name'">
                        <span style="font-weight: bold">{{ record.metadata.name }}</span>
                    </template>
                    <template v-if="column.dataIndex === 'labels'">
                        <div v-for="val, key in record.metadata.labels" :key="key">
                            <a-popover>
                                <template #content>
                                    <span> {{ key + ": " + val }}</span>
                                </template>
                                <a-tag style="margin-bottom:3px; cursor:pointer;" color="blue">{{ ellipsis(key + ": " + val, 15) }}</a-tag>
                            </a-popover>
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'containers'">
                        <span style="font-weight:bold;">{{ record.status.numberAvailable > 0 ? record.status.numberAvailable: 0 }} / {{ record.status.desiredNumberScheduled > 0 ? record.status.desiredNumberScheduled: 0 }}</span>
                    </template>
                    <template v-if="column.dataIndex === 'image'">
                        <div v-for="val, key in record.spec.template.spec.containers" :key="key">
                            <a-popover>
                                <template #content>
                                    <span> {{ val.image }}</span>
                                </template>
                                <a-tag style="margin-bottom:3px; cursor:pointer;" color="geekblue">{{ ellipsis(val.image.split('/').pop() ? val.image.split('/').pop() : val.image, 100 ) }}</a-tag>
                            </a-popover>
                        </div>
                    </template>
                    <template v-if="column.dataIndex == 'creationTimestamp'">
                        <a-tag color="gray">{{ timeTrans(record.metadata.creationTimestamp) }}</a-tag>
                        <!-- <a-tag color="gray">{{ record.metadata.creationTimestamp }}</a-tag> -->
                    </template>
                    <template v-if="column.key === 'action'">
                        <c-button class="daemonset-button" type="primary" icon="form-outlined" @click="getDaemonSetDetail(record)">YML</c-button>
                        <c-button style="margin-bottom:5px;" class="daemonset-button" type="error" icon="delete-outlined" @click="showConfirm('删除', record.metadata.name, delDaemonSet)">删除</c-button>
                    </template>
                </template>
            </a-table>
        </a-card>
        <!-- 展示YAMLO信息的弹框 -->
        <a-modal
            v-model:visible="yamlModel"
            title="YAML信息"
            :confirm-loading="appLoading"
            width="945px"
            cancelText="取消"
            okText="更新"
            @ok="updateDaemonSet">
            <!-- codemirror 编辑器 -->
            <codemirror
                :value="contentYaml"
                border
                :options="cmOptions"
                height="800"
                width="900"
                style="font-size: 14px;"
                @change="onChange">
            </codemirror>
        </a-modal>
    </div>
</template>

<script>
import { ref, reactive, createVNode } from 'vue'
import common from '@/config'
import httpClient from '@/request'
import { message, Modal } from 'ant-design-vue'
import json2yaml from 'json2yaml'
import yaml2obj from 'js-yaml'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

export default ({
    setup() {
        const searchValue = ref('')
        const namespaceValue = ref('')

        //列表数据
        const appLoading = ref(false)
        const columns = ref([
            {
                title: 'DaemonSet名',
                dataIndex: 'name'
            },
            {
                title: '标签',
                dataIndex: 'labels'
            },
            {
                title: '容器组',
                dataIndex: 'containers',
            },
            {
                title: '镜像',
                dataIndex: 'image'
            },
            {
                title: '创建时间',
                dataIndex: 'creationTimestamp'
            },
            {
                title: '操作',
                key: 'action',
                fixed: 'right',
                width: 200
            }
        ])

        //分页
        const pagination = reactive({
            showSizeChanger: true,
            showQuickJumper: true,
            total: 0,
            current: 1,
            pageSize: 10,
            pageSizeOptions: ['10','20','50','100'],
            showTotal: total => `共 ${total} 条`
        })

        //列表属性
        const daemonSetList = ref()
        const daemonSetListData = reactive({
            url: common.k8sDaemonSetList,
            params: {
                filter_name: '',
                namespace: '',
                cluster: '',
                page: 1,
                limit: 10
            }
        })

        //YAML详情
        const contentYaml = ref('')
        const yamlModel = ref(false)
        const cmOptions = common.cmOptions
        const daemonSetDetailData = reactive({
            url: common.k8sDaemonSetDetail,
            params: {
                ds_name: '',
                namespace: '',
                cluster: ''
            }
        })

        // 更新
        const updateDaemonSetData = reactive({
            url: common.k8sDaemonSetUpdate,
            params: {
                content: '',
                namespace: '',
                cluster: ''
            }
        })
        //删除
        const delDaemonSetData = reactive({
            url: common.k8sDaemonSetDel,
            params: {
                ds_name: '',
                namespace: '',
                cluster: ''
            }
        })


        //【方法】
        function getSearchValue(val) {
            searchValue.value = val
            pagination.current = 1
        }
        function getNamespaceValue(val) {
            namespaceValue.value = val
            pagination.current = 1
        }
        //处理翻页，pageSize变化
        function handleTableChange(val) {
            pagination.current = val.current
            pagination.pageSize = val.pageSize
            getDaemonSetList()
        }
        //获取DaemonSet列表
        function getDaemonSetList() {
            appLoading.value = true
            daemonSetListData.params.filter_name = searchValue.value
            daemonSetListData.params.namespace = namespaceValue.value
            daemonSetListData.params.cluster = localStorage.getItem('k8s_cluster')
            daemonSetListData.params.page = pagination.current
            daemonSetListData.params.limit = pagination.pageSize
            httpClient.get(daemonSetListData.url, {params: daemonSetListData.params})
            .then(res => {
                daemonSetList.value = res.data.items
                pagination.total = res.data.total
            })
            .catch(res => {
                message.error(res.msg)
            })
            .finally(() => {
                appLoading.value = false
            })
        }
        // json 转 yaml
        function transYaml(content) {
            return json2yaml.stringify(content)
        }
        //yaml 转对象
        function transObj(content) {
            return yaml2obj.load(content)
        }
        //容器时间调整
        function timeTrans(timestamp) {
            let date = new Date(new Date(timestamp).getTime() + 8 * 3600 * 1000)
            date = date.toJSON();
            date = date.substring(0, 19).replace('T', ' ')
            return date 
        }
        //截取标签名称
        function ellipsis (val, len) {
            return val.length > len ? val.substring(0,len) + '...' : val
        }
        //编辑器内容变化时触发的方法，用于将更新的内容复制到变量中
        function onChange(val) {
            contentYaml.value = val
        }
        //获取pod列表详情
        function getDaemonSetDetail(e) {
            appLoading.value = true
            daemonSetDetailData.params.ds_name = e.metadata.name
            daemonSetDetailData.params.namespace = namespaceValue.value
            daemonSetDetailData.params.cluster = localStorage.getItem('k8s_cluster')
            httpClient.get(daemonSetDetailData.url, {params: daemonSetDetailData.params})
            .then(res => {
                contentYaml.value = transYaml(res.data)
                yamlModel.value = true
            })
            .catch(res => {
                message.error(res.msg)
            })
            .finally(() => {
                appLoading.value = false
            })
        }
        //更新pod
        function updateDaemonSet() {
            appLoading.value = true
            let content = JSON.stringify(transObj(contentYaml.value))
            updateDaemonSetData.params.content = content
            updateDaemonSetData.params.namespace = namespaceValue.value
            updateDaemonSetData.params.cluster = localStorage.getItem('k8s_cluster')
            httpClient.put(updateDaemonSetData.url, updateDaemonSetData.params)
            .then(res => {
                message.success(res.msg)
            })
            .catch(res => {
                message.error(res.msg)
            })
            .finally(() => {
                setTimeout(() => {
                    yamlModel.value = false
                    getDaemonSetList()
                    appLoading.value = false
                }, 1000)
            })
        }
        //删除pod
        function delDaemonSet(name) {
            appLoading.value = true
            delDaemonSetData.params.ds_name = name
            delDaemonSetData.params.namespace = namespaceValue.value
            delDaemonSetData.params.cluster = localStorage.getItem('k8s_cluster')
            httpClient.delete(delDaemonSetData.url, {data: delDaemonSetData.params})
            .then(res => {
                message.success(res.msg)
            })
            .catch(res => {
                message.error(res.msg)
            })
            .finally(() => {
                setTimeout(() => {
                    getDaemonSetList()
                    appLoading.value = false
                }, 1000)
                // getPodList()
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

        return {
            getSearchValue,
            getNamespaceValue,
            getDaemonSetList,
            appLoading,
            columns,
            daemonSetList,
            pagination,
            handleTableChange,
            ellipsis,
            transObj,
            transYaml,
            timeTrans,
            getDaemonSetDetail,
            showConfirm,
            delDaemonSet,
            yamlModel,
            updateDaemonSet,
            contentYaml,
            cmOptions,
            onChange,
        }
    }
})
</script>


<style scoped>
    .daemonset-button {
        margin-right: 5px;
    }
    .ant-form-item {
        margin-bottom: 20px;
    }
</style>