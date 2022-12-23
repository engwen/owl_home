import request from '@/utils/request'

export function myApplyOrgList(data) {
  return request({
    url: '/owlApply/myApplyOrgList',
    method: 'post',
    data
  })
}

export function applyOrgList(data) {
  return request({
    url: '/owlApply/applyOrgList',
    method: 'post',
    data
  })
}

export function applyDelete(data) {
  return request({
    url: '/owlApply/delete',
    method: 'post',
    data
  })
}

export function applyJoinOrg(data) {
  return request({
    url: '/owlApply/applyJoinOrg',
    method: 'post',
    data
  })
}

export function applyJoinOrgPass(data) {
  return request({
    url: '/owlApply/applyJoinOrgPass',
    method: 'post',
    data
  })
}


export function applyJoinOrgDefiled(data) {
  return request({
    url: '/owlApply/applyJoinOrgDefiled',
    method: 'post',
    data
  })
}

