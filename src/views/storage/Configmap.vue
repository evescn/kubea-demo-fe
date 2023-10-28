<template>
    <div>
        <MainHead
            searchDescribe="请输入"
            @searchChange="getSearchValue"
            namespace
            @namespaceChange="getNamespaceValue"
            @dataList="getConfigmapList"/>
        <!-- 表格数据 -->
        <a-card :bodyStyle="{padding: '10px'}">
            <a-table
                style="font-size: 12px;"
                :loading="appLoading"
                :columns="columns"
                :dataSource="configmapList"
                :pagination="pagination"
                @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'name'">
                        <span style="font-weight: bold;">{{ record.metadata.name }}</span>
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
                    <template v-if="column.dataIndex === 'data'">
                        <!-- <a-tag color="cyan">{{ record.data }}</a-tag> -->
                        <a-popover
                            :overlayStyle="{width:'520px'}">
                            <template #content>
                                <div style="width:500px;height:300px;word-break:break-all;overflow-y:auto;">{{ record.data }}</div>
                            </template>
                            <file-text-outlined style="font-size: 15px;" />
                        </a-popover>
                    </template>
                    <template v-if="column.dataIndex == 'creationTimestamp'">
                        <a-tag color="gray">{{ timeTrans(record.metadata.creationTimestamp) }}</a-tag>
                    </template>
                    <template v-if="column.key === 'action'">
                        <c-button class="configmap-button" type="primary" icon="form-outlined" @click="getConfigmapDetail(record)">YML</c-button>
                        <c-button style="margin-bottom:5px;" class="configmap-button" type="error" icon="delete-outlined" @click="showConfirm('删除', record.metadata.name, delConfigmap)">删除</c-button>
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
            @ok="updateConfigmap">
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
import { createVNode, reactive, ref, toRefs } from 'vue';
import httpClient from '@/request';
import common from '@/config';
import { message, Modal } from 'ant-design-vue';
import yaml2obj from 'js-yaml';
import json2yaml from 'json2yaml';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
export default({
    setup() {
        //表结构
        const columns = ref([
            {
                title: 'Configmap名',
                dataIndex: 'name'
            },
            {
                title: '标签',
                dataIndex: 'labels'
            },
            {
                title: 'DATA',
                dataIndex: 'data',
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
        
        //常用项
        const appLoading = ref(false)
        const searchValue = ref('')
        const namespaceValue = ref('')

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
        
        //列表
        const configmapList = ref([])
        const configmapListData = reactive({
            url: common.k8sConfigmapList,
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
        const configmapData = reactive({
            url: common.k8sConfigmapDetail,
            params: {
                cm_name: '',
                namespace: '',
                cluster: ''
            }
        })
        //YAML更新
        const updateConfigmapData = reactive({
            url: common.k8sConfigmapUpdate,
            params: {
                content: '',
                namespace: '',
                cluster: ''
            }
        })
        //删除
        const delConfigmapData = reactive({
            url: common.k8sConfigmapDel,
            params: {
                cm_name: '',
                namespace: '',
                cluster: ''
            }
        })

        //【方法】
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
        //处理翻页，pageSize变化
        function handleTableChange(val) {
            pagination.current = val.current
            pagination.pageSize = val.pageSize
            getConfigmapList()
        }
        function getSearchValue(val) {
            searchValue.value = val
            pagination.current = 1
        }

        function getNamespaceValue(val) {
            namespaceValue.value = val
            pagination.current = 1
        }

       //编辑器内容变化时触发的方法，用于将更新的内容复制到变量中
       function onChange(val) {
            contentYaml.value = val
        }
        //获取pod列表
        function getConfigmapList() {
            appLoading.value = true
            configmapListData.params.filter_name = searchValue.value
            configmapListData.params.namespace = namespaceValue.value
            configmapListData.params.cluster = localStorage.getItem('k8s_cluster')
            configmapListData.params.page = pagination.current
            configmapListData.params.limit = pagination.pageSize
            httpClient.get(configmapListData.url, {params: configmapListData.params})
            .then(res => {
                configmapList.value = res.data.items
                pagination.total = res.data.total
            })
            .catch(res => {
                message.error(res.msg)
            })
            .finally(() => {
                appLoading.value = false
            })
        }
        //获取Configmap列表详情
        function getConfigmapDetail(e) {
            appLoading.value = true
            configmapData.params.cm_name = e.metadata.name
            configmapData.params.namespace = namespaceValue.value
            configmapData.params.cluster = localStorage.getItem('k8s_cluster')
            httpClient.get(configmapData.url, {params: configmapData.params})
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
        //更新Configmap
        function updateConfigmap() {
            appLoading.value = true
            let content = JSON.stringify(transObj(contentYaml.value))
            updateConfigmapData.params.content = content
            updateConfigmapData.params.namespace = namespaceValue.value
            updateConfigmapData.params.cluster = localStorage.getItem('k8s_cluster')
            httpClient.put(updateConfigmapData.url, updateConfigmapData.params)
            .then(res => {
                message.success(res.msg)
            })
            .catch(res => {
                message.error(res.msg)
            })
            .finally(() => {
                setTimeout(() => {
                    yamlModel.value = false
                    getConfigmapList()
                    appLoading.value = false
                }, 1000)
            })
        }
        //删除Configmap
        function delConfigmap(name) {
            appLoading.value = true
            delConfigmapData.params.cm_name = name
            delConfigmapData.params.namespace = namespaceValue.value
            delConfigmapData.params.cluster = localStorage.getItem('k8s_cluster')
            httpClient.delete(delConfigmapData.url, {data: delConfigmapData.params})
            .then(res => {
                message.success(res.msg)
            })
            .catch(res => {
                message.error(res.msg)
            })
            .finally(() => {
                setTimeout(() => {
                    getConfigmapList()
                    appLoading.value = false
                }, 1000)
                // getConfigmapList()
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
            appLoading,
            namespaceValue,
            getSearchValue,
            getNamespaceValue,
            configmapList,
            handleTableChange,
            getConfigmapList,
            columns,
            pagination,
            ellipsis,
            timeTrans,
            yamlModel,
            updateConfigmap,
            contentYaml,
            cmOptions,
            onChange,
            getConfigmapDetail,
            delConfigmap,
            showConfirm,
        }
    }
})
</script>

<style scoped>
    .configmap-button {
        margin-right: 5px;
    }
    .ant-form-item {
        margin-bottom: 20px;
    }
</style>
