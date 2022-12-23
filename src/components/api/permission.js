import request from '@/utils/request'

export function permissionList(data) {
  return request({
    url: '/owlPermission/list',
    method: 'post',
    data
  })
}


export function permissionDelete(data) {
  return request({
    url: '/owlPermission/deleteRe',
    method: 'post',
    data
  })
}

export function permissionCreate(data) {
  return request({
    url: '/owlPermission/create',
    method: 'post',
    data
  })
}

export function permissionUpdate(data) {
  return request({
    url: '/owlPermission/update',
    method: 'post',
    data
  })
}


export function permissionListByRoleId(data) {
  return request({
    url: '/owlPermission/listByRoleId',
    method: 'post',
    data
  })
}
