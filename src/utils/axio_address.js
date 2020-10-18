import axios from "axios"
const api=axios.create({
    // 要放到GitHub上的要是https的
    baseURL:"https://vip.chanke.xyz/mi",
})
// 响应的拦截器
api.interceptors.response.use(res=>{
    // 不需要返回res，只需要res中的data.data
    return res;
},err=>{
    const config=err.config;
    const response=err.response;
    if(config._slient==true){
        alert(response.errorMessage)
    }else{
        console.warn();
    }
})

export default api;