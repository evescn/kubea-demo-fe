<template>
    <div>
        <MainHead
            searchDescribe="请输入"
            @searchChange="getSearchValue"
            @dataList="getPvList"/>
        <!-- 表格数据 -->
        <a-card :bodyStyle="{padding: '10px'}">
            <a-table
                style="font-size: 12px;"
                :loading="appLoading"
                :columns="columns"
                :dataSource="pvList"
                :pagination="pagination"
                @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex == 'name'">
                        <span style="font-weight: bold">{{ record.metadata.name }}</span>
                    </template>
                    <template v-if="column.dataIndex === 'labels'">
                        <div v-for="val, key in record.metadata.labels" :key="key">
                            <a-popover title="Title">
                                <template #content>
                                    <span> {{ key + ": " + val }}</span>
                                </template>
                                <a-tag style="margin-bottom:3px; cursor:pointer;" color="blue">{{ ellipsis(key + ": " + val, 15) }}</a-tag>
                            </a-popover>
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <span :class="[record.status.phase === 'Bound' ? 'success-status' : 'error-status']">{{ record.status.phase }}</span>
                    </template>
                    <template v-if="column.dataIndex === 'storage'">
                        <a-tag color="orange">{{ record.spec.capacity.storage }}</a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'accessMode'">
                        <div v-for="val, key in record.spec.accessModes" :key="key">
                            <a-tag style="margin-bottom:5px; cursor:pointer;" color="cyan">{{ val }}</a-tag>
                        </div>                        
                        <!-- <span style="color: rgb(84, 138, 238);font-weight:bold;">{{ record.spec.accessModes[0] }}</span> -->
                    </template>
                    <template v-if="column.dataIndex === 'pvc'">
                        <span>{{ record.spec.claimRef.name }}</span>
                    </template>
                    <template v-if="column.dataIndex == 'creationTimestamp'">
                        <a-tag color="gray">{{ timeTrans(record.metadata.creationTimestamp) }}</a-tag>
                    </template>
                    <template v-if="column.key === 'action'">
                        <c-button class="pv-button" type="primary" icon="form-outlined" @click="getPvDetail(record)">YML</c-button>
                        <c-button style="margin-bottom:5px;" class="pv-button" type="error" icon="delete-outlined" @click="showConfirm('删除', record.metadata.name, delPv)">删除</c-button>
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
            @ok="updatePv">
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

        //列表数据
        const appLoading = ref(false)
        const columns = ref([
            {
                title: 'Pv名',
                dataIndex: 'name'
            },
            {
                title: '标签',
                dataIndex: 'labels'
            },
            {
                title: '状态',
                dataIndex: 'status'
            },
            {
                title: '容量',
                dataIndex: 'storage',
            },
            {
                title: '访问模式',
                dataIndex: 'accessMode',
            },
            {
                title: 'PVC',
                dataIndex: 'pvc',
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
        const pvList = ref()
        const pvListData = reactive({
            url: common.k8sPvList,
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
        const pvDetailData = reactive({
            url: common.k8sPvDetail,
            params: {
                ds_name: '',
                namespace: '',
                cluster: ''
            }
        })

        // 更新
        const updatePvData = reactive({
            url: common.k8sPvUpdate,
            params: {
                content: '',
                namespace: '',
                cluster: ''
            }
        })
        //删除
        const delPvData = reactive({
            url: common.k8sPvDel,
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
        //处理翻页，pageSize变化
        function handleTableChange(val) {
            pagination.current = val.current
            pagination.pageSize = val.pageSize
            getPvList()
        }
        //获取Pv列表
        function getPvList() {
            appLoading.value = true
            pvListData.params.filter_name = searchValue.value
            pvListData.params.cluster = localStorage.getItem('k8s_cluster')
            pvListData.params.page = pagination.current
            pvListData.params.limit = pagination.pageSize
            httpClient.get(pvListData.url, {params: pvListData.params})
            .then(res => {
                pvList.value = res.data.items
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
        function getPvDetail(e) {
            appLoading.value = true
            pvDetailData.params.pv_name = e.metadata.name
            pvDetailData.params.cluster = localStorage.getItem('k8s_cluster')
            httpClient.get(pvDetailData.url, {params: pvDetailData.params})
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
        function updatePv() {
            appLoading.value = true
            let content = JSON.stringify(transObj(contentYaml.value))
            updatePvData.params.content = content
            updatePvData.params.cluster = localStorage.getItem('k8s_cluster')
            httpClient.put(updatePvData.url, updatePvData.params)
            .then(res => {
                message.success(res.msg)
            })
            .catch(res => {
                message.error(res.msg)
            })
            .finally(() => {
                setTimeout(() => {
                    yamlModel.value = false
                    getPvList()
                    appLoading.value = false
                }, 1000)
            })
        }
        //删除pod
        function delPv(name) {
            appLoading.value = true
            delPvData.params.pv_name = name
            delPvData.params.cluster = localStorage.getItem('k8s_cluster')
            httpClient.delete(delPvData.url, {data: delPvData.params})
            .then(res => {
                message.success(res.msg)
            })
            .catch(res => {
                message.error(res.msg)
            })
            .finally(() => {
                setTimeout(() => {
                    getPvList()
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
            getPvList,
            appLoading,
            columns,
            pvList,
            pagination,
            handleTableChange,
            ellipsis,
            transObj,
            transYaml,
            timeTrans,
            getPvDetail,
            showConfirm,
            delPv,
            yamlModel,
            updatePv,
            contentYaml,
            cmOptions,
            onChange,
        }
    }
})
</script>


<style scoped>
    .pv-button {
        margin-right: 5px;
    }
    .ant-form-item {
        margin-bottom: 20px;
    }
    .success-status {
        color: rgb(27, 202, 21);
    }
    .warning-status {
        color: rgb(233, 200, 16);
    }
    .error-status {
        color: rgb(226, 23, 23);
    }
</style>