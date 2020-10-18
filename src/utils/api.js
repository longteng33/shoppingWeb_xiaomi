// 这是axios的文件

import axios from "axios"
const api=axios.create({
    // 要放到GitHub上的要是https的
    // baseURL:"https://vip.chanke.xyz/mi",
    baseURL:"https://api-hmugo-web.itheima.net/api/public/v1"
})
// 响应的拦截器
api.interceptors.response.use(res=>{
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