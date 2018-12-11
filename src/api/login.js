/**
 * Created by Administrator on 2018/3/15.
 */
import request from '../utils/request'

export function login(username, password,cityid) {
  return request({
    url: '/user/login',
    method: 'post',
    params: {
      username,
      password,
      cityid
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/Info',
    method: 'get',
    params: {
      token
    }
  })
}



export function logout(token) {
  return request({
    url: '/user/logout',
    method: 'post',
    params:{
      token
    }
  })
}
