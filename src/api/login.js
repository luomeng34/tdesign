import request from "../utils/request";

// 登录方法
export function login(userName, userPass) {
  const data = {
    userName,
    userPass,
  }
  return request({
    url: '/manage/user/userLogin',
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/manage/user/outLogin',
    method: 'get'
  })
}
