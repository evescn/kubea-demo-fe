<template>
    <!-- 表格数据 -->
    <a-card :bodyStyle="{padding: '10px'}">
        <a-table
            style="font-size: 12px"
            :loading="appLoading"
            :columns="columns"
            :dataSource="roleList"
            :pagination="pagination"
            :row-selection="{ onChange: onSelectChange, type: 'radio' }"
            @change="handleTableChange">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'role_name'">
                    <span v-if="record.role_name === `超级管理员`" style="color: rgb(84, 138, 238);">{{ record.role_name }}</span>
                    <!--                    <span :disabled="record.role_name == `超级管理员`"  style="color: rgb(84, 138, 238);">{{ record.role_name }}</span>-->
                    <span v-if="record.role_name === `开发用户`" style="color: rgb(185,117,76);">{{ record.role_name }}</span>
                    <span v-else-if="record.role_name === `测试用户`" style="color: rgb(168,104,204);">{{ record.role_name }}</span>
                    <span v-else-if="record.role_name === `运维用户`" style="color: rgb(102,166,92);">{{ record.role_name }}</span>
                </template>
                <template v-if="column.dataIndex === 'description'">
                    <span style="font-weight: bold; color: rgb(98,199,191);">{{ record.description }}</span>
                </template>
                <template v-if="column.dataIndex === 'CreatedAt'">
                    <a-tag color="gray">{{ timeTrans(record.CreatedAt) }}</a-tag>
                </template>
            </template>
        </a-table>
    </a-card>
    <!-- 页面权限 -->
    <a-tree
        style="margin: 50px 0 0 0"
        v-model:selectedKeys="selectedKeys"
        v-model:checkedKeys="checkedKeys"
        checkable
        v-if="roleMenuList.length"
        defaultExpandAll
        :tree-data="roleMenuList">
        <template #title="{ name, key }">
            <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ name }}</span>
            <template v-else>{{ name }}</template>
        </template>

    </a-tree>
    <div>
        <a-button :disabled="roleID.length === 0" style="margin: 30px 0 0 30px" type="primary"  size="small"  @click="updateRoleMenuList()">更新</a-button>
    </div>
</template>

<script>
import {ref, watch, reactive, createVNode, onMounted} from 'vue'
import common from '@/config'
import httpClient from '@/request'
import {message, Modal} from 'ant-design-vue'
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';

export default ({
    setup() {
        //常用项
        const appLoading = ref(false)

        // 表格列
        const columns = ref([
            {
                title: 'ID',
                dataIndex: 'id'
            },
            {
                title: '角色',
                dataIndex: 'role_name'
            },
            {
                title: '描述',
                dataIndex: 'description'
            },
            {
                title: '创建时间',
                dataIndex: 'CreatedAt'
            },
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
        const roleList = ref([])
        const roleListData = reactive({
            url: common.roleList,
            params: {
                role_name: '',
                page: 1,
                limit: 10
            }
        })

        //菜单权限属性
        const selectedKeys = ref([]);
        const checkedKeys = ref([])
        const roleMenuList = ref([])
        const roleMenuListData = reactive({
            url: common.roleMenuGetAll,
        })

        //角色权限属性
        const rolePermissionsListData = reactive({
            url: common.roleMenuGetPermissions,
            params: {
                role_id: 0,
            }
        })

        //更新
        const roleID = ref('')
        const updateRoleMenuDataList = reactive({
            url: common.roleMenuUpdate,
            params: {
                role_id: 0,
                new_role_menu_relation: '',
                old_role_menu_relation: '',
            }
        })

        //【方法】
        //处理翻页，pageSize变化
        function handleTableChange(val) {
            pagination.current = val.current
            pagination.pageSize = val.pageSize
            getRoleList()
        }

        //时间调整
        function timeTrans(timestamp) {
            let date = new Date(new Date(timestamp).getTime() + 8 * 3600 * 1000)
            date = date.toJSON();
            date = date.substring(0, 19).replace('T', ' ')
            return date
        }

        function getRoleList() {
            appLoading.value = true
            roleListData.params.page = pagination.current
            roleListData.params.limit = pagination.pageSize
            httpClient.get(roleListData.url, {params: roleListData.params})
                .then(res => {
                    roleList.value = res.data.items
                    pagination.total = res.data.total
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    appLoading.value = false
                })
        }

        function getRoleMenuList() {
            appLoading.value = true
            httpClient.get(roleMenuListData.url)
                .then(res => {
                    message.success(res.msg)
                    roleMenuList.value = res.data
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    appLoading.value = false
                })
        }

        function updateRoleMenuList() {
            appLoading.value = true
            updateRoleMenuDataList.params.role_id = roleID.value
            // console.log("updateRoleMenuDataList: ", updateRoleMenuDataList.params)
            httpClient.put(updateRoleMenuDataList.url, updateRoleMenuDataList.params )
                .then(res => {
                    message.success(res.msg)
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    // 重新获取权限
                    getRoleMenuList()
                    appLoading.value = false
                })
        }

        watch(selectedKeys, () => {
            // console.log('selectedKeys', selectedKeys);
        });

        watch(checkedKeys, () => {
            updateRoleMenuDataList.params.new_role_menu_relation = checkedKeys.value
        });

        const onSelectChange = selectedRowKeys => {
            appLoading.value = true
            roleID.value = selectedRowKeys[0]
            rolePermissionsListData.params.role_id = selectedRowKeys[0]
            httpClient.get(rolePermissionsListData.url, {params: rolePermissionsListData.params})
                .then(res => {
                    selectedKeys.value = res.data
                    checkedKeys.value = res.data
                    // 保存老数据信息
                    updateRoleMenuDataList.params.old_role_menu_relation = res.data
                })
                .catch(res => {
                    message.error(res.msg)
                })
                .finally(() => {
                    appLoading.value = false
                })

        }


        onMounted(() => {
            getRoleList()
            getRoleMenuList()
        });

        // 返回数据
        return {
            appLoading,
            selectedKeys,
            checkedKeys,
            roleMenuList,
            columns,
            roleList,
            pagination,
            timeTrans,
            handleTableChange,
            onSelectChange,
            updateRoleMenuList,
            roleID,
        }
    }
})
</script>
