// 这是store的js文件
import Vue from 'vue'
import Vuex from 'vuex'
import user from "./modules/user"
import cart from "./modules/cart"
import address from "./modules/address"
import api from "../utils/api"



//引入自动缓存插件vuex-persistedstate
import createPersistedState from "vuex-persistedstate";


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user,
    cart,
    address,
  },
  //plugins用于配置vuex的插件
  // 写成函数执行的方式
  // plugins: [createPersistedState({
  //   //key为存储持久状态的密钥
  //   key: "xiaomi",
  //   //path为可以部分保留状态的所有路径的数组。 如果没有给出路径，则完整状态将保留。 必须使用点符号指定路径。 
  //   //如果使用模块，请包含模块名称，下面的user为模块名称
  //   // 会自动把user中的值存到localStorage中去
  //   paths: ["user"],
  //   // subscriber,插件的钩子函数,初始化的时候执行，
  //   // 在初始化的时候，调用user中的checkedLogin函数，检查有没有过期
  //   // 参数store是当前vuex的实例
  //   subscriber(store) {
  //     if(store.state.user.user.token){
  //       api.defaults.headers.common["Token"]=store.state.user.user.token;
  //     }
      
  //     return function (handler) {
  //       return store.subscribe(handler)
  //     }
  //   },
  // }),
  // ]
})
