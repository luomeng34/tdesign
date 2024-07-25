import request from "../utils/request";

// 获取banner
export function getBannerList(data) {
  return request({
    url: '/manage/banner/getBannerList',
    method: 'get',
    params:data
  })
}

// 新增
export function addOrUpdateBanner(data) {
  return request({
    url: '/manage/banner/addOrUpdateBanner',
    method: 'post',
    data: data
  })
}

// 修改状态
export function updateBannerStatus(data) {
  return request({
    url: '/manage/banner/updateBannerStatus',
    method: 'post',
    data: data
  })
}

// 删除
export function delBanner(data) {
  return request({
    url: '/manage/banner/delBanner',
    method: 'post',
    data: data
  })
}
