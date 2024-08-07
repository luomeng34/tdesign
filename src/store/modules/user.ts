import { TOKEN_NAME } from '@/config/global';
import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
const InitUserInfo = {
  roles: [],
};

// 定义的state初始值
const state = {
  token: localStorage.getItem(TOKEN_NAME), // 默认token不走权限
  userInfo: InitUserInfo,
};

const mutations = {
  SET_TOKEN(state, token) {
    localStorage.setItem(TOKEN_NAME, token);
    state.token = token;
  },
  removeToken(state) {
    localStorage.removeItem(TOKEN_NAME);
    state.token = '';
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
};

const getters = {
  token: (state) => state.token,
  roles: (state) => state.userInfo?.roles,
};

const actions = {
  async Login({ commit }, userInfo) {
    const userName = userInfo.userName
    const userPass = userInfo.password
    return new Promise((resolve, reject) => {
      login(userName, userPass).then(res => {
        setToken(res.data.token)
        commit('SET_TOKEN',res.data.token)
        commit("setUserInfo",{
          userName: res.data.userName,
          userCode: res.data.userCode,
          userType: res.data.userType,
        })
        localStorage.setItem("userName",res.data.userName)
        localStorage.setItem("userCode",res.data.userCode)
        localStorage.setItem("userType",res.data.userType)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  async getUserInfo({ commit, state }) {
    const mockRemoteUserInfo = async (state) => {
      const type = parseInt(localStorage.getItem("userType"))
      if (type === 1) { // 超管
        return {
          name: 'td_admin',
          roles: ['ALL_ROUTERS'],
        };
      }
      if (type === 2) { // 普通管理员
        return {
          name: 'td_dev',
          roles: ['UserIndex', 'DashboardBase', 'login', 'DashboardDetail','dataCloud'],
        };
      }
      // 运营
      return {
        name: 'td_dev',
        roles: [
          'UserIndex', 'DashboardBase',
          'login', 'DashboardDetail',
          'forum','bannerIndex',
          'cooperation','questionnaire',
          'conference','advance',
          'review', 'management',
          'dataCloud'
        ],
      };
    };

    const res = await mockRemoteUserInfo(state);

    commit('setUserInfo', res);
  },
  async logout({ commit }) {
    logout().then(() => {
      commit('SET_TOKEN', '')
      commit('removeToken');
      localStorage.removeItem("userName")
      localStorage.removeItem("userCode")
      localStorage.removeItem("userType")
      commit('setUserInfo', InitUserInfo);
    }).catch(error => {

    })

  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
