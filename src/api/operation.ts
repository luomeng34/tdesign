import request from "../utils/request";

// 获取新闻列表
export function getNewsList(data) {
  return request({
    url: '/manage/news/getNewsList',
    method: 'get',
    params:data
  })
}

// 保存新闻信息
export function saveNews(data) {
  return request({
    url: '/manage/news/saveNews',
    method: 'post',
    data:data
  })
}

// 修改新闻状态
export function updateNewsStatus(data) {
  return request({
    url: '/manage/news/updateNewsStatus',
    method: 'post',
    data:data
  })
}

// 删除新闻
export function delNews(data) {
  return request({
    url: '/manage/news/delNews',
    method: 'post',
    data:data
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
// 用户密码
export function selectUserPass(data) {
  return request({
    url: '/manage/user/selectUserPass',
    method: 'get',
    params:data
  })
}

// 大会列表
export function getIntroduceList(data) {
  return request({
    url: '/manage/introduce/getIntroduceList',
    method: 'get',
    params:data
  })
}


// 保存大会
export function saveIntroduce(data) {
  return request({
    url: '/manage/introduce/saveIntroduce',
    method: 'post',
    data:data
  })
}

// 删除大会
export function delIntroduce(data) {
  return request({
    url: '/manage/introduce/delIntroduce',
    method: 'post',
    data:data
  })
}
// 修改大会状态
export function updateIntroduceStatus(data) {
  return request({
    url: '/manage/introduce/updateIntroduceStatus',
    method: 'post',
    data:data
  })
}

// 查询问卷问题列表
export function getQuestionnaireItemList(data) {
  return request({
    url: '/manage/questionnaire/getQuestionnaireItemList',
    method: 'get',
    params:data
  })
}
// 查询问卷
export function selectQuestionnaire(data) {
  return request({
    url: '/manage/questionnaire/selectQuestionnaire',
    method: 'get',
    params:data
  })
}
// 保存问卷
export function saveQuestionnaire(data) {
  return request({
    url: '/manage/questionnaire/saveQuestionnaire',
    method: 'post',
    data:data
  })
}
// 保存问卷问题
export function saveQuestionnaireItem(data) {
  return request({
    url: '/manage/questionnaire/saveQuestionnaireItem',
    method: 'post',
    data:data
  })
}

// 删除问卷问题
export function delQuestionnaireItem(data) {
  return request({
    url: '/manage/questionnaire/delQuestionnaireItem',
    method: 'post',
    data:data
  })
}
// 修改问卷状态
export function updateQuestionnaireStatus(data) {
  return request({
    url: '/manage/questionnaire/updateQuestionnaireStatus',
    method: 'post',
    data:data
  })
}

// 修改问卷问题状态
export function updateQuestionnaireItemStatus(data) {
  return request({
    url: '/manage/questionnaire/updateQuestionnaireItemStatus',
    method: 'post',
    data:data
  })
}

// 查询峰会预告
export function getPredictionList(data) {
  return request({
    url: '/manage/prediction/getPredictionList',
    method: 'get',
    params:data
  })
}
// 保存峰会预告
export function savePrediction(data) {
  return request({
    url: '/manage/prediction/savePrediction',
    method: 'post',
    data:data
  })
}

// 删除峰会预告
export function delPrediction(data) {
  return request({
    url: '/manage/prediction/delPrediction',
    method: 'post',
    data:data
  })
}
// 修改峰会预告状态
export function updatePredictionStatus(data) {
  return request({
    url: '/manage/prediction/updatePredictionStatus',
    method: 'post',
    data:data
  })
}

// 获取云储资料
export function getOssList(data) {
  return request({
    url: '/manage/oss/getOssList',
    method: 'get',
    params:data
  })
}

// 保存云储资料
export function saveOss(data) {
  return request({
    url: '/manage/oss/saveOss',
    method: 'post',
    data:data
  })
}

// 删除云储资料
export function delOss(data) {
  return request({
    url: '/manage/oss/delOss',
    method: 'post',
    data:data
  })
}

// 导出
export function exportIntentionExcel(data) {
  return request({
    url: '/manage/intention/exportIntentionExcel',
    method: 'get',
    headers:{
      'Content-Type': 'application/vnd.ms-excel',
    },
    responseType: "blob",
    params:data
  })
}

// 获取峰会回顾
export function getReviewList(data) {
  return request({
    url: '/manage/review/getReviewList',
    method: 'get',
    params:data
  })
}

// 保存峰会回顾
export function saveReview(data) {
  return request({
    url: '/manage/review/saveReview',
    method: 'post',
    data:data
  })
}

// 删除峰会回顾
export function delReview(data) {
  return request({
    url: '/manage/review/delReview',
    method: 'post',
    data:data
  })
}

// 修改峰会回顾状态
export function updateReviewStatus(data) {
  return request({
    url: '/manage/review/updateReviewStatus',
    method: 'post',
    data:data
  })
}

// 修改峰会回顾状态
export function getReviewInfo(data) {
  return request({
    url: '/manage/review/getReviewInfo',
    method: 'get',
    params:data
  })
}

// 查询意向合作
export function getIntentionInfo(data) {
  return request({
    url: '/manage/intention/getIntentionInfo',
    method: 'get',
    params:data
  })
}

// 保存意向合作
export function saveIntentionTitle(data) {
  return request({
    url: '/manage/intention/saveIntentionTitle',
    method: 'post',
    data:data
  })
}
