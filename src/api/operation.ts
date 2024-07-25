import request from "../utils/request";

// 获取用户详细信息
export function getNewsList(data) {
  return request({
    url: '/manage/news/getNewsList',
    method: 'get',
    params:data
  })
}

// 获取用户详细信息
export function getUserList(data) {
  return request({
    url: '/manage/user/getUserList',
    method: 'get',
    params:data
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/manage/user/addUser',
    method: 'post',
    data:data
  })
}

// 删除用户
export function delUser(data) {
  return request({
    url: '/manage/user/delUser',
    method: 'post',
    data:data
  })
}


// 用户权限变更
export function updateUser(data) {
  return request({
    url: '/manage/user/updateUser',
    method: 'post',
    data:data
  })
}


// 保存意向合作标题
export function saveIntentionTitle(data) {
  return request({
    url: '/manage/intention/saveIntentionTitle',
    method: 'post',
    data:data
  })
}


