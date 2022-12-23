import request from '@/utils/request'

export function menuList(data) {
  return request({
    url: '/owlMenu/list',
    method: 'post',
    data
  })
}

export function menuTreeList(data) {
  return request({
    url: '/owlMenu/listTree',
    method: 'post',
    data
  })
}

export function menuListTreeBySigner(data) {
  return request({
    url: '/owlMenu/listTreeBySigner',
    method: 'post',
    data
  })
}

export function listTreeExceptSelect(data) {
  return request({
    url: '/owlMenu/listTreeExceptSelect',
    method: 'post',
    data
  })
}

export function menuDelete(data) {
  return request({
    url: '/owlMenu/deleteRe',
    method: 'post',
    data
  })
}

export function menuCreate(data) {
  return request({
    url: '/owlMenu/create',
    method: 'post',
    data
  })
}

export function menuUpdate(data) {
  return request({
    url: '/owlMenu/update',
    method: 'post',
    data
  })
}

export function idListByRole(data) {
  return request({
    url: '/owlMenu/idListByRole',
    method: 'post',
    data
  })
}

export function menuListByUser(data) {
  return request({
    url: '/auth/listByUser',
    method: 'post',
    data
  })
}
export function menuBanOrLeave(data) {
  return request({
    url: '/owlMenu/banOrLeave',
    method: 'post',
    data
  })
}
