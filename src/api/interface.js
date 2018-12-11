/**
 * Created by Administrator on 2018/3/29.
 */
import request from '../utils/request'

export function interfacelist(token,currentPage) {
  return request({
    url: '/tools/selectAllinterface',
    method: 'post',
    params: { token,currentPage}
  })
}

export function addinterface(token,id,name,project,rank,values) {
  return request({
    url: '/tools/addinterface',
    method: 'post',
    params: { token,id,name,project,rank,values }
  })
}
export  function  delInterFace(token,name) {
  return request ({
    url: '/tools/delinterface',
    method: 'post',
    params: { token,name}
  })
}
export function createInterface(token,name) {
  return request ({
    url: '/tools/creatInterface',
    method: 'post',
    params: { token,name}
  })
}

export  function getListPro(token,currentPage) {
  return request ({
    url: '/tools/selectAllPro',
    method: 'post',
    params: { token,currentPage}
  })
}
export function addproject(token,name,des,type) {
  return request ({
    url: '/tools/addProject',
    method: 'post',
    params: { token,name,des,type}
  })
}

export function delproject(token,proname) {
  return request ({
    url: '/tools/deleProWithtoken',
    method: 'post',
    params: { token,proname}
  })
}
