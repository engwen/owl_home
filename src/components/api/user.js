import request from '../../utils/request'

export function signin(data) {
  return request({
    url: '/auth/signin',
    method: 'post',
    data
  })
}
export function signout(data) {
  return request({
    url: '/auth/signout',
    method: 'post',
    data
  })
}
export function getInfo(token) {
  return request({
    url: '/auth/heartSkip',
    method: 'post',
    data: {'token': token}
  })
}



export function userList(data) {
  return request({
    url: '/owlUser/list',
    method: 'post',
    data
  })
}

export function listByOrgUser(data) {
  return request({
    url: '/owlUser/listByOrgUser',
    method: 'post',
    data
  })
}
export function listByAddOrgUser(data) {
  return request({
    url: '/owlUser/listByAddOrgUser',
    method: 'post',
    data
  })
}



export function userBanOrLeave(data) {
  return request({
    url: '/owlUser/banOrLeave',
    method: 'post',
    data
  })
}


export function userDelete(data) {
  return request({
    url: '/owlUser/delete',
    method: 'post',
    data
  })
}

export function userCreate(data) {
  return request({
    url: '/owlUser/create',
    method: 'post',
    data
  })
}

export function userUpdate(data) {
  return request({
    url: '/owlUser/update',
    method: 'post',
    data
  })
}

export function signinerInfoUpdate(data) {
  return request({
    url: '/owlUser/signinerInfoUpdate',
    method: 'post',
    data
  })
}

export function signinerOrgLeave(data) {
  return request({
    url: '/owlUser/signinerOrgLeave',
    method: 'post',
    data
  })
}


export function userRoleAdd(data) {
  return request({
    url: '/owlUser/addRole',
    method: 'post',
    data
  })
}

export function userRoleRemove(data) {
  return request({
    url: '/owlUser/removeRole',
    method: 'post',
    data
  })
}
