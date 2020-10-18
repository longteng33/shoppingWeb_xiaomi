import api from "../../utils/api"

export default {
    namespaced: true,
    state: {
        cartGoodsList: [],//购物车商品的数组
    },
    getters:{
        // 购物车中商品一共有多少件
        totalCartGoods(state){
            // console.log(state.cartGoodsList)
            return state.cartGoodsList.reduce((sum, item) => {
                return (sum += Number(item.quantity));
              }, 0);
        },
    },
    mutations: {
        changeCartGoodsList(state, data) {
            state.cartGoodsList = data;
        },
    },
    actions: {
        CHANGEcartGoodsList(context) {
            // 获取购物车商品
            return api.get("/user/cart").then(data => {
                context.commit("changeCartGoodsList", data);
            });
        },
    },

}