import request from '@/utils/request'

// 用户权限接口
export function apiGetK8sAllRes(params) {
    return request.get(`/api/k8s/allres`, { params: params })
}

//
export function apiGetK8sEvents(params) {
    return request.get(`/api/k8s/events`, { params: params })
}
