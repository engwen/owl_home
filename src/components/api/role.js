import request from '@/utils/request'

export function roleList(data) {
  return request({
    url: '/owlRole/list',
    method: 'post',
    data
  })
}


export function roleDelete(data) {
  return request({
    url: '/owlRole/deleteRe',
    method: 'post',
    data
  })
}

export function roleCreate(data) {
  return request({
    url: '/owlRole/create',
    method: 'post',
    data
  })
}

export function roleUpdate(data) {
  return request({
    url: '/owlRole/update',
    method: 'post',
    data
  })
}


export function roleListByUserId(data) {
  return request({
    url: '/owlRole/listByUserId',
    method: 'post',
    data
  })
}

export function roleAddMenuList(data) {
  return request({
    url: '/owlRole/updateMenuList',
    method: 'post',
    data
  })
}


export function roleAddPermissionList(data) {
  return request({
    url: '/owlRole/updatePermission',
    method: 'post',
    data
  })
}
