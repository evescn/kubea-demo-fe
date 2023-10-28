<template>
    <div>
        <MainHead
            v-if="role.id !== '1'"
            searchDescribe="请输入"
            @searchChange="getSearchValue"
            namespace
            @namespaceChange="getNamespaceValue"
            @namespaceList="getNamespaceList"
            @dataList="getSvcList"
            @addFunc="handleAdd" />
        <MainHead
            v-if="role.id == '1'"
            searchDescribe="请输入"
            @searchChange="getSearchValue"
            namespace
            @namespaceChange="getNamespaceValue"
            @namespaceList="getNamespaceList"
            @dataList="getSvcList"
            add
            @addFunc="handleAdd" />
        <!-- 表格数据 -->
        <a-card :bodyStyle="{padding: '10px'}">
            <a-table
                style="font-size: 12px;"
                :loading="appLoading"
                :columns="columns"
                :dataSource="svcList"
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
                    <template v-if="column.dataIndex === 'type'">
                        <a-tag color="cyan">{{ record.spec.type }}</a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'cluster-ip'">
                        <!-- <span>{{ record.spec.clusterIPs }}</span> -->
                        <div v-for="val, key in record.spec.clusterIPs" :key="key">
                            <a-tag color="pink">{{ val }}</a-tag>
                        </div>  
                    </template>
                    <template v-if="column.dataIndex === 'external-ip'">
                        <span>{{ record.status.loadBalancer.svc ? record.status.loadBalancer.svc[0].ip : '-' }} </span>
                    </template>
                    <template v-if="column.dataIndex === 'port'">
                        <div v-for="val, key in record.spec.ports" :key="key">
                            <a-tag style="margin-bottom:5px; cursor:pointer;" color="orange" v-if="!val.nodePort">{{ val.name + ": " + val.port }}/{{ val.protocol }}</a-tag>
                            <a-tag style="margin-bottom:5px; cursor:pointer;" color="orange" v-if="val.nodePort">{{ val.name + ": " + val.port }}:{{ val.nodePort }}/{{ val.protocol }}</a-tag>
                        </div>  
                    </template>
                    <template v-if="column.dataIndex == 'creationTimestamp'">
                        <a-tag color="gray">{{ timeTrans(record.metadata.creationTimestamp) }}</a-tag>
                    </template>
                    <template v-if="column.key === 'action'">
                        <c-button v-if="role.id !== '1'" :disabled="true" class="svc-button" type="primary" icon="form-outlined" @click="getSvcDetail(record)">YML</c-button>
                        <c-button v-else-if="role.id == '1'" class="svc-button" type="primary" icon="form-outlined" @click="getSvcDetail(record)">YML</c-button>
                        <c-button v-if="role.id !== '1'" :disabled="true"  style="margin-bottom:5px;" class="svc-button" type="error" icon="delete-outlined" @click="showConfirm('删除', record.metadata.name, delSvc)">删除</c-button>
                        <c-button v-else-if="role.id == '1'"  style="margin-bottom:5px;" class="svc-button" type="error" icon="delete-outlined" @click="showConfirm('删除', record.metadata.name, delSvc)">删除</c-button>
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
            @ok="updateSvc">
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
        <!-- 创建svc的抽屉弹框 -->
        <a-drawer
            v-model:visible="createDrawer"
            title="创建Svc"
            :footer-style="{ textAlign: 'right' }"
            @close="onClose">
            <br>
            <a-form ref="formRef" :model="createSvc" :labelCol="{style: {width: '30%'}}">
                <a-form-item
                    label="名称"
                    name="createName"
                    :rules="[{ required: true, message: '请输入Svc名称' }]">
                    <a-input v-model:value="createName" />
                </a-form-item>
                <a-form-item
                    label="命名空间"
                    name="createNamespace"
                    :rules="[{ required: true, message: '请选择命名空间' }]">
                    <a-select show-search style="width:140px;" v-model:value="createNamespace" placeholder="请选择">
                        <a-select-option
                            v-for="(item, index) in namespaceList"
                            :key="index"
                            :value="item.metadata.name">
                            {{ item.metadata.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    label="副本数"
                    name="createReplicas">
                    <a-input-number v-model:value="createReplicas" :min="1" :max="30"></a-input-number>
                    <a-popover>
                        <template #content>
                            <span>Svc副本数最小1，最大30</span>
                        </template>
                        <info-circle-outlined style="margin-left:10px;color:rgb(84, 138, 238);" />
                    </a-popover>
                </a-form-item>
                <a-form-item
                    label="镜像"
                    name="createImage"
                    :rules="[{ required: true, message: '请输入镜像名' }]">
                    <a-input v-model:value="createImage" />
                </a-form-item>
                <a-form-item
                    label="标签"
                    name="createLabelStr"
                    :rules="[{ required: true, message: '请输入标签' }]">
                    <a-input v-model:value="createLabelStr" placeholder="project=ms,app=gateway" />
                </a-form-item>
                <a-form-item
                    label="资源配额"
                    name="createResource"
                    :rules="[{ required: true, message: '请选择资源规格' }]">
                    <a-select show-search style="width:140px;" v-model:value="createResource" placeholder="请选择">
                        <a-select-option value="0.5/1">0.5核/1G</a-select-option>
                        <a-select-option value="1/2">1核/2G</a-select-option>
                        <a-select-option value="2/4">2核/4G</a-select-option>
                        <a-select-option value="4/8">4核/8G</a-select-option>
                        <a-select-option value="8/16">8核/16G</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    label="容器端口"
                    name="createContainerPort"
                    :rules="[{ required: true, message: '请输入端口号' }]">
                    <a-input v-model:value="createContainerPort" />
                </a-form-item>
                <a-form-item
                    label="健康检查"
                    name="createHealthCheck">
                    <a-switch v-model:checked="createHealthCheck" />
                </a-form-item>
                <a-form-item
                    v-if="createHealthCheck"
                    label="检测路径"
                    name="createHealthPath"
                    :rules="[{ required: true, message: '请输入健康检测路径' }]">
                    <a-input v-model:value="createHealthPath" />
                </a-form-item>
            </a-form>
            <template #footer>
                <a-button style="margin-right: 8px" @click="onClose()">取消</a-button>
                <a-button type="primary" @click="formSubmit()">创建</a-button>
            </template>
        </a-drawer>
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
                title: 'Svc名',
                dataIndex: 'name'
            },
            {
                title: '标签',
                dataIndex: 'labels'
            },
            {
                title: '类型',
                dataIndex: 'type',
            },
            {
                title: 'CLUSTER-IP',
                dataIndex: 'cluster-ip'
            },
            {
                title: 'EXTERNAL-IP',
                dataIndex: 'external-ip'
            },
            {
                title: '端口',
                dataIndex: 'port'
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
        const namespaceList = ref([])
        const role = reactive({
            id: 0,
        })
        role.id = localStorage.getItem('role')

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
        const svcList = ref([])
        const svcListData = reactive({
            url: common.k8sSvcList,
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
        const svcData = reactive({
            url: common.k8sSvcDetail,
            params: {
                svc_name: '',
                namespace: '',
                cluster: ''
            }
        })
        //YAML更新
        const updateSvcData = reactive({
            url: common.k8sSvcUpdate,
            params: {
                content: '',
                namespace: '',
                cluster: ''
            }
        })
        //删除
        const delSvcData = reactive({
            url: common.k8sSvcDel,
            params: {
                svc_name: '',
                namespace: '',
                cluster: ''
            }
        })
        //创建
        const formRef = ref()
        const createDrawer = ref(false)
        const createSvc = reactive({
            createName: '',
            createNamespace: '',
            createReplicas: 1,
            createImage: '',
            createResource: '',
            createHealthCheck: false,
            createHealthPath: '',
            createLabelStr: '',
            createContainerPort: ''
        })
        const createSvcData = reactive({
            url: common.k8sSvcCreate,
            params: {
                name: '',
                namespace: '',
                replicas: 1,
                image: '',
                cpu: '',
                memory: '',
                health_check: false,
                health_path: '',
                label: {},
                container_port: '',
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
            getSvcList()
        }
        function getSearchValue(val) {
            searchValue.value = val
            pagination.current = 1
        }

        function getNamespaceValue(val) {
            namespaceValue.value = val
            pagination.current = 1
        }

        function getNamespaceList(val) {
            namespaceList.value = val
        }
       //编辑器内容变化时触发的方法，用于将更新的内容复制到变量中
       function onChange(val) {
            contentYaml.value = val
        }
        //获取pod列表
        function getSvcList() {
            appLoading.value = true
            svcListData.params.filter_name = searchValue.value
            svcListData.params.namespace = namespaceValue.value
            svcListData.params.cluster = localStorage.getItem('k8s_cluster')
            svcListData.params.page = pagination.current
            svcListData.params.limit = pagination.pageSize
            httpClient.get(svcListData.url, {params: svcListData.params})
            .then(res => {
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
        //获取Svc列表详情
        function getSvcDetail(e) {
            appLoading.value = true
            svcData.params.svc_name = e.metadata.name
            svcData.params.namespace = namespaceValue.value
            svcData.params.cluster = localStorage.getItem('k8s_cluster')
            httpClient.get(svcData.url, {params: svcData.params})
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
        //更新Svc
        function updateSvc() {
            appLoading.value = true
            let content = JSON.stringify(transObj(contentYaml.value))
            updateSvcData.params.content = content
            updateSvcData.params.namespace = namespaceValue.value
            updateSvcData.params.cluster = localStorage.getItem('k8s_cluster')
            httpClient.put(updateSvcData.url, updateSvcData.params)
            .then(res => {
                message.success(res.msg)
            })
            .catch(res => {
                message.error(res.msg)
            })
            .finally(() => {
                setTimeout(() => {
                    yamlModel.value = false
                    getSvcList()
                    appLoading.value = false
                }, 1000)
            })
        }
        //删除Svc
        function delSvc(name) {
            appLoading.value = true
            delSvcData.params.Svc_name = name
            delSvcData.params.namespace = namespaceValue.value
            delSvcData.params.cluster = localStorage.getItem('k8s_cluster')
            httpClient.delete(delSvcData.url, {data: delSvcData.params})
            .then(res => {
                message.success(res.msg)
            })
            .catch(res => {
                message.error(res.msg)
            })
            .finally(() => {
                setTimeout(() => {
                    getSvcList()
                    appLoading.value = false
                }, 1000)
                // getSvcList()
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
        //处理新增
        function handleAdd() {
            createDrawer.value = true
        }
        //验证表单
        async function formSubmit() {
            try {
                await formRef.value.validateFields();
                console.log('Success:', createSvc);
                createSvcFunc()
            } catch (errorInfo) {
                console.log('Failed:', errorInfo);
            }
        }
        function resetForm() {
            formRef.value.resetFields();
        }
        //创建Svc
        function createSvcFunc() {
            //正则匹配，验证label的合法性
            let reg = new RegExp("(^[A-Za-z]+=[A-Za-z0-9]+).*")
            if (!reg.test(createSvc.createLabelStr)) {
                message.warning("标签填写异常，请确认后重新填写")
                return
            }
            //加载loading动画
            appLoading.value = true
            //定义label、cpu和memory变量
            let label = new Map()
            let cpu, memory
            //将label字符串转成数组
            let a = (createSvc.createLabelStr).split(",")
            //将数组转成map
            a.forEach(item => {
                let b = item.split("=")
                label[b[0]] = b[1]
            })
            //将Svc的规格转成cpu和memory
            let resourceList = createSvc.createResource.split("/")
            cpu = resourceList[0]
            memory = resourceList[1] + "Gi"
            //赋值
            createSvcData.params.label = label
            createSvcData.params.cpu = cpu
            createSvcData.params.memory = memory
            createSvcData.params.name = createSvc.createName
            createSvcData.params.namespace = createSvc.createNamespace
            createSvcData.params.replicas = createSvc.createReplicas
            createSvcData.params.image = createSvc.createImage
            createSvcData.params.health_check = createSvc.createHealthCheck
            createSvcData.params.health_path = createSvc.createHealthPath
            createSvcData.params.container_port = parseInt(createSvc.createContainerPort)
            createSvcData.params.cluster = localStorage.getItem('k8s_cluster')
            httpClient.post(createSvcData.url, createSvcData.params)
            .then(res => {
                message.success(res.msg)
            })
            .catch(res => {
                message.error(res.msg)
            })
            .finally(() => {
                //重置表单
                resetForm()
                getSvcList()
                //关闭抽屉
                createDrawer.value = false
            })
        }
        //关闭抽屉
        function onClose () {
            Modal.confirm({
                title: "是否确认关闭操作? ",
                icon: createVNode(ExclamationCircleOutlined),
                content: createVNode('div', {
                    //style: 'color:red;',
                }),
                cancelText: '取消',
                okText: '确认',
                onOk() {
                    createDrawer.value = false
                    resetForm()
                },
                onCancel() {
                    createDrawer.value = true
                }
            })
        }

        return {
            appLoading,
            namespaceValue,
            getSearchValue,
            getNamespaceValue,
            svcList,
            handleTableChange,
            getSvcList,
            columns,
            pagination,
            ellipsis,
            timeTrans,
            yamlModel,
            updateSvc,
            contentYaml,
            cmOptions,
            onChange,
            getSvcDetail,
            delSvc,
            showConfirm,
            createDrawer,
            onClose,
            createSvc,
            formSubmit,
            namespaceList,
            getNamespaceList,
            formRef,
            handleAdd,
            ...toRefs(createSvc),
            role,
        }
    }
})
</script>

<style scoped>
    .svc-button {
        margin-right: 5px;
    }
    .ant-form-item {
        margin-bottom: 20px;
    }
</style>