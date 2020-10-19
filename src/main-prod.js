import header from "./components/header"
import footer from "./components/footer"
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/filter'


// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);




// 定义成全局组件，在所有组件内都能使用
Vue.component("app-header", header);
Vue.component("app-footer", footer);



// 引入表单验证插件 vee-validate
// vee-validate插件3版本引入后有问题(坑)，请下载如下版本
// npm i vee-validate@2.2.15 --save

//引入验证表单的第三方库
import VeeValidate from 'vee-validate';
//引入中文语言包
import zh_CN from 'vee-validate/dist/locale/zh_CN';
Vue.use(VeeValidate);
// 执行Vue.use(VeeValidate)，Vue的原型中将会有$validator变量
VeeValidate.Validator.localize('zhzh_CN', zh_CN);




Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
