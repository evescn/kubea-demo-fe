<script setup>
// 获取列表
async function fetchTableList(searchParams = {}) {
    const { page, size } = query.value || {}
    let params = {
        page,
        size,
        ...searchParams
    }
    loaddingTable.value = true
    const res = await apiGetContractList(params)
    tableData.value = res?.data?.items || []
    tableData.value.forEach((item) => {
        // 如果 hasSubContract 为 false，则新增 isLeaf 字段
        if (item.hasSubContract !== true) {
            item.isLeaf = true
        }
    })
    loaddingTable.value = false
}

// 搜索
function handleSearch(params: any) {
    query.value.page = 1
    fetchTableList(params)
}

onMounted(() => {
    fetchTableList()
})

// 翻页
const onPageChange = ({ page, size }: { page: number, size: number }) => {
    Object.assign(query.value, { size, page })
    fetchTableList()
}
</script>

<template>
    <a-card :bodyStyle="{ padding: '10px' }">
        <a-table :columns="columns" :data-source="eventList" :loading="appLoading" :pagination="pagination" style="font-size: 12px" @change="handleTableChange">
            <!-- 自定义表格内容的样式,列的维度 -->
            <!-- column取的是自定义的表格格式内容columns，record取得是当前列的数据 -->
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex == 'name'">
                    <a style="color: rgb(84, 138, 238); font-weight: bold">{{ record.name }}</a>
                </template>
                <template v-if="column.dataIndex == 'event_time'">
                    <span> {{ timeTrans(record.event_time) }}</span>
                </template>
            </template>
        </a-table>
    </a-card>
</template>

<style lang="less" scoped></style>
