import request from '@/utils/request'

export function dictList(data) {
  return request({
    url: '/owlDict/list',
    method: 'post',
    data
  })
}


export function dictDelete(data) {
  return request({
    url: '/owlDict/deleteRe',
    method: 'post',
    data
  })
}

export function dictCreate(data) {
  return request({
    url: '/owlDict/create',
    method: 'post',
    data
  })
}

export function dictUpdate(data) {
  return request({
    url: '/owlDict/update',
    method: 'post',
    data
  })
}
