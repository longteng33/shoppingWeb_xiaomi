// 这是axios的文件

import axios from "axios"
import NProgress from "nprogress"


const api=axios.create({
    // 要放到GitHub上的要是https的
    // baseURL:"https://vip.chanke.xyz/mi",
    baseURL:"https://api-hmugo-web.itheima.net/api/public/v1"
})

// 在请求拦截器中展示进度条
axios.interceptors.request.use(config=>{
    NProgress.start();
    return config;
  })

//  在响应拦截器中隐藏进度条;
api.interceptors.response.use(res=>{
    NProgress.done();
    // 不需要返回res，只需要res中的data.data
    return res.data;
},err=>{
    const config=err.config;
    const response=err.response;
    if(config._slient==true){
        alert(response.data.errorMessage)
    }
})

export default api;