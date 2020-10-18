import api from "../../utils/api"

export default {
    namespaced: true,
    state: {
        addressList:[],
    },
    mutations:{
        changeAddressList(state,data){
            state.addressList=data;
        }
    },
    actions:{
        // 获取用户地址
        CHANGEaddressList(context){
           return api.get("/user/addressList",{},{ _slient: true }).then((data)=>{
                context.commit("changeAddressList",data);
            })
        },
        // 添加/更新用户地址
        CHANGEaddressList_update(context,form){
            return api.post("/user/updateAddress",form,{ _slient: true }).then((data)=>{
                context.dispatch("CHANGEaddressList");
            })
        }
    }
}