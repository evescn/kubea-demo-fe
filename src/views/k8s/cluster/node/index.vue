<script setup></script>

<template>
    <MainHead searchDescribe="请输入" @dataList="getNodeList" @searchChange="getSearchValue" />
    <a-card :bodyStyle="{ padding: '10px' }">
        <a-table :columns="columns" :dataSource="nodeList" :loading="appLoading" :pagination="pagination" style="font-size: 12px" @change="handleTableChange">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'name'">
                    <span style="font-weight: bold">{{ record.metadata.name }}</span>
                    <br />
                    <span style="color: rgb(84, 138, 238)">{{ record.status.addresses[0].address }}</span>
                </template>
                <template v-if="column.dataIndex === 'standard'">
                    <span>{{ record.status.capacity.cpu }}核{{ specTrans(record.status.capacity.memory) }}G</span>
                </template>
                <template v-if="column.dataIndex === 'podCidr'">
                    <a-tag color="geekblue">{{ record.spec.podCIDR }}</a-tag>
                </template>
                <template v-if="column.dataIndex === 'version'">
                    <span style="color: rgb(13, 173, 231)">{{ record.status.nodeInfo.kubeletVersion }} </span>
                </template>
                <template v-if="column.dataIndex === 'creationTimestamp'">
                    <a-tag color="gray">{{ timeTrans(record.metadata.creationTimestamp) }}</a-tag>
                </template>
            </template>
        </a-table>
    </a-card>
</template>
