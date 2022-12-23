import request from '@/utils/request'

export function orgList(data) {
  return request({
    url: '/owlOrg/list',
    method: 'post',
    data
  })
}

export function orgTreeList(data) {
  return request({
    url: '/owlOrg/listTree',
    method: 'post',
    data
  })
}

export function listTreeExceptSelect(data) {
  return request({
    url: '/owlOrg/listTreeExceptSelect',
    method: 'post',
    data
  })
}

export function orgDelete(data) {
  return request({
    url: '/owlOrg/delete',
    method: 'post',
    data
  })
}

export function orgCreate(data) {
  return request({
    url: '/owlOrg/create',
    method: 'post',
    data
  })
}

export function orgUpdate(data) {
  return request({
    url: '/owlOrg/update',
    method: 'post',
    data
  })
}

export function signerTopOrgList() {
  return request({
    url: '/auth/signerTopOrgList',
    method: 'post',
    data:{}
  })
}


export function topOrgList(data) {
  return request({
    url: '/owlOrg/topOrgList',
    method: 'post',
    data
  })
}

export function topOrgListExceptJoin(data) {
  return request({
    url: '/owlOrg/topOrgListExceptJoin',
    method: 'post',
    data
  })
}

export function orgListByUser(data) {
  return request({
    url: '/owlOrg/listByUser',
    method: 'post',
    data
  })
}

export function orgBanOrLeave(data) {
  return request({
    url: '/owlOrg/banOrLeave',
    method: 'post',
    data
  })
}


export function addOrgUser(data) {
  return request({
    url: '/owlOrg/addUser',
    method: 'post',
    data
  })
}


export function removeOrgUser(data) {
  return request({
    url: '/owlOrg/removeUser',
    method: 'post',
    data
  })
}

export function updateUserList(data) {
  return request({
    url: '/owlOrg/updateUserList',
    method: 'post',
    data
  })
}
