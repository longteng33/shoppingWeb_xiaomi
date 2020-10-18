import api from "../../utils/api"

export default {
    // namespaced，给这个模块一个命名空间
    namespaced: true,
    state: {
        isLogin: true,//是点击登录还是点击注册
        // isLoggedIn: false,//是否登录
        userInfo: {},//用户信息
        totalCartGoods:0,//购物车商品总数据

        // isHomePage记录当前页是否是主页
        // isHomePage:false,
        // goodsQuantity:0,
    },
    getters:{
        // 商品总数量
        goodsQuantity(state){
            if(state.userInfo.isLoggedIn){   
                if(state.userInfo.cart.length==0){
                    return 0
                }else{
                    return state.userInfo.cart.reduce((total,item)=>{
                        return total+item.num;
                    },0);
                }
            }else{
                return 0;
            }
        }
    },
    mutations: {
        changeUserInfo(state){
           var userInfo= localStorage.getItem('userInfo');
           state.userInfo=userInfo?JSON.parse(userInfo):{};
        },
        changeIsLogin(state, val) {
            state.isLogin = val;
        },
        changeTotalCartGoods(state,val){
            state.totalCartGoods=val;
        },

        login(state, data) {
            // state.user = data;
            // state.isLoggedIn = true;
            // 登录的时候设置api的首部Token
            // api.defaults.headers.common["Token"] = data.token;
        },
        logout(state) {
            // state.isLoggedIn =false;
            state.userInfo ={};
            localStorage.removeItem('userInfo');
            // api.defaults.headers.common["Token"] = "";
        },
    },
    actions: {
        // 登录
        LOGIN(context, form) {
            return api.post("/login", form, { _slient: true }).then(res => {
                context.commit("login", res)
            })
        },
        // 注册
        REGISTER(context, form) {
            return api.post("/register", form, { _slient: true }).then(res => {
                // 注册成功后做的事情与登录后是一样的，所以调用LOGIN
                context.commit("login", res)

            }, err => { })
        },
        // 退出
        LOGOUT(context) {
            context.commit("logout")
        },
        
    },

}

// 为什么把登录请求写在user.js的actions中，而不写在login.vue中
// 这是因为数据user，isLoggedIn写在user.js中，在请求成功之后要去更改这些数据，不能直接去更改state中的数据，必须通过mutations中的方法去更改
// 而且发送请求是一个异步的方法，所以需要写在actions中
// 数据user，isLoggedIn为什么写在user.js中，是因为这些数据在多个组件中都有使用到
// 父传子数据可以通过自定义属性
// 子传父数据可以通过自定义事件
// 兄弟组件传值，使用vuex更方便
