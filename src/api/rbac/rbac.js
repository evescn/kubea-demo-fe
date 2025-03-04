import request from '@/utils/request'

// 用户登录权限接口
export function getPermission(params) {
  return request.get(`/api/menu/list`, { params: params })
}

// 页面权限接口
export function userLogin(params) {
  return request.post(`/api/login`, params)
}
