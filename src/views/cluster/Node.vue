<template>
    <div>
        <MainHead
            searchDescribe="请输入"
            @searchChange="getSearchValue"
            @dataList="getNodeList"/>
        <!-- 表格数据 -->
        <a-card :bodyStyle="{padding: '10px'}">
            <a-table
                style="font-size: 12px;"
                :loading="appLoading"
                :columns="columns"
                :dataSource="nodeList"
                :pagination="pagination"
                @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'name'">
                        <span style="font-weight: bold;">{{ record.metadata.name }}</span>
                        <br>
                        <span style="color: rgb(84, 138, 238);">{{ record.status.addresses[0].address }}</span>
                    </template>
                    <template v-if="column.dataIndex === 'standard'">
                        <span>{{ record.status.capacity.cpu }}核{{ specTrans(record.status.capacity.memory) }}G</span>
                    </template>
                    <template v-if="column.dataIndex === 'podCidr'">
                        <a-tag color="geekblue">{{ record.spec.podCIDR }}</a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'version'">
                        <span style="color:rgb(13, 173, 231);">{{ record.status.nodeInfo.kubeletVersion }} </span>
                    </template>
                    <template v-if="column.dataIndex === 'creationTimestamp'">
                        <a-tag color="gray">{{ timeTrans(record.metadata.creationTimestamp) }}</a-tag>
                    </template>
<!--                    <template v-if="column.key === 'action'">-->
<!--                        <c-button style="margin-bottom:5px;" class="node-button" type="primary" icon="form-outlined" @click="getNodeDetail(record)">YML</c-button>-->
<!--                    </template>-->
                </template>
            </a-table>
        </a-card>
        <!-- 展示YAML信息的弹框 -->
        <a-modal
            v-model:visible="yamlModel"
            title="YAML信息"
            :confirm-loading="appLoading"
            width="945px"
            cancelText="取消"
            okText="更新"
            @ok="updateNode">
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
import { ref, reactive } from 'vue'
import common from '@/config'
import httpClient from '@/request'
import { message, Modal } from 'ant-design-vue'
import json2yaml from 'json2yaml'
import yaml2obj from 'js-yaml'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

export default ({
    setup() {
        const searchValue = ref('')

        //列表数据
        const appLoading = ref(false)
        const columns = ref([
            {
                title: 'Node名',
                dataIndex: 'name'
            },
            {
                title: '规格',
                dataIndex: 'standard'
            },
            {
                title: 'POD-CIDR',
                dataIndex: 'podCidr',
            },
            {
                title: '版本',
                dataIndex: 'version',
            },
            {
                title: '创建时间',
                dataIndex: 'creationTimestamp'
            },
            // {
            //     title: '操作',
            //     key: 'action',
            //     fixed: 'right',
            //     width: 100
            // }
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
        const nodeList = ref()
        const nodeListData = reactive({
            url: common.k8sNodeList,
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
        const nodeDetailData = reactive({
            url: common.k8sNodeDetail,
            params: {
                node_name: '',
                namespace: '',
                cluster: ''
            }
        })

        // 更新
        const updateNodeData = reactive({
            url: common.k8sNodeUpdate,
            params: {
                content: '',
                namespace: '',
                cluster: ''
            }
        })


        //【方法】
        function getSearchValue(val) {
            searchValue.value = val
            pagination.current = 1
        }
        //处理翻页，pageSize变化
        function handleTableChange(val) {
            pagination.current = val.current
            pagination.pageSize = val.pageSize
            getNodeList()
        }
        //获取Node列表
        function getNodeList() {
            appLoading.value = true
            nodeListData.params.filter_name = searchValue.value
            nodeListData.params.cluster = localStorage.getItem('k8s_cluster')
            nodeListData.params.page = pagination.current
            nodeListData.params.limit = pagination.pageSize
            httpClient.get(nodeListData.url, {params: nodeListData.params})
            .then(res => {
                nodeList.value = res.data.items
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
        //技术内存
        function specTrans(str) {
            if ( str.indexOf('Ki') == -1 ) {
                return str
            }
            let num = str.slice(0,-2) / 1000 / 1000
            return num.toFixed(0)
        }
        //编辑器内容变化时触发的方法，用于将更新的内容复制到变量中
        function onChange(val) {
            contentYaml.value = val
        }
        //获取pod列表详情
        function getNodeDetail(e) {
            appLoading.value = true
            nodeDetailData.params.node_name = e.metadata.name
            nodeDetailData.params.cluster = localStorage.getItem('k8s_cluster')
            httpClient.get(nodeDetailData.url, {params: nodeDetailData.params})
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
        function updateNode() {
            appLoading.value = true
            let content = JSON.stringify(transObj(contentYaml.value))
            updateNodeData.params.content = content
            updateNodeData.params.cluster = localStorage.getItem('k8s_cluster')
            httpClient.put(updateNodeData.url, updateNodeData.params)
            .then(res => {
                message.success(res.msg)
            })
            .catch(res => {
                message.error(res.msg)
            })
            .finally(() => {
                setTimeout(() => {
                    yamlModel.value = false
                    getNodeList()
                    appLoading.value = false
                }, 1000)
            })
        }

        return {
            getSearchValue,
            getNodeList,
            appLoading,
            columns,
            nodeList,
            pagination,
            handleTableChange,
            specTrans,
            transObj,
            transYaml,
            timeTrans,
            getNodeDetail,
            yamlModel,
            updateNode,
            contentYaml,
            cmOptions,
            onChange,
        }
    }
})
</script>


<style scoped>
    .node-button  {
        margin-right: 5px;
    }
    .ant-form-item {
        margin-bottom: 20px;
        color: rgb(13, 173, 231);
    }
</style>