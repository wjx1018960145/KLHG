/**
 * Created by Administrator on 2018/4/26.
 */
import request from '../utils/request'

export function getRollList(params) {
  return request({
    url: '/roll/GetAllRoll',
    method: 'post',
    params
  })
}

