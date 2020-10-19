<template>
  <div>
    <div class="logo">
      <div class="container">
        <a href="/"></a>
      </div>
    </div>

    <div class="panel">
      <div class="container">
        <div class="panel-layout">
          <div class="panel-tabs">
            <a
              href="javascript:void(0);"
              class="tabs-link"
              :class="{select:isLogin}"
              @click="tabChange(true)"
              data-tab="login"
            >账号登录</a>
            <span class="line"></span>
            <a
              href="javascript:void(0);"
              class="tabs-link"
              :class="{select:!isLogin}"
              @click="tabChange(false)"
              data-tab="register"
            >账号注册</a>
          </div>
          <div class="panel-account">
            <div action="javascript:;" method="POST" id="form">
              <label class="account-label" for="username">
                <input
                  class="account-item"
                  autocomplete="off"
                  type="text"
                  name="name"
                  placeholder="账号"
                  v-model="loginForm.name"
                  v-validate="'required'"
                  data-vv-as="用户名"
                />
              </label>
              <div class="errors">{{errors.first("name")}}</div>
              <label class="account-label" for="pwd">
                <input
                  class="account-item"
                  type="password"
                  placeholder="密码"
                  autocomplete="off"
                  name="password"
                  v-model="loginForm.password"
                  v-validate="'required'"
                  data-vv-as="密码"
                  ref="password"
                />
              </label>
              <div class="errors">{{errors.first("password")}}</div>
              <label v-if="!isLogin" class="account-label password2" for="pwd2">
                <input
                  class="account-item"
                  type="password"
                  placeholder="重复密码"
                  autocomplete="off"
                  name="password2"
                  v-model="loginForm.confirmPassword"
                  
                  v-validate="'required|confirmed:password'"
                  data-vv-as="重复密码"
                />
                <!-- confirmed:password中password不是name值，而是dom节点 -->
              </label>
              <!-- <div class="errors">{{errors.first("password2")}}</div> -->
              <div class="errors" v-if="errors.has('password2')">请输入相同的密码</div>
              <button class="btn"  @click="submit" >{{isLogin?'登录':'注册'}}</button>
            </div>
            <p>接口地址服务器失效，假登录</p>
            <p>用户名long，密码1</p>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import api from "../utils/api";
import setStorage from "../utils/setStorage";
import { mapState,mapActions } from "vuex";
// import { set } from 'vue/types/umd';

export default {
  created(){
    document.title = "登录/注册";
    // console.log(this.isLogin)
  },
  data() {
    return {
      
      loginForm: {
        name: "long",
        password: "1",
        confirmPassword: ""
      },
    };
  },

  computed: {
    ...mapState("user",["isLogin"]),
  },

  methods: {
    // 获取vuex中的方法，所以放在methods中
    ...mapActions("user", ["login"]),
    //   tabChange切换登录或者注册时的回调
    tabChange(val) {
      // this.isLogin = val;
      this.$store.commit("user/changeIsLogin",val);
      this.loginForm.name = "";
      this.loginForm.password = "";
      this.loginForm.confirmPassword = "";
      // reset方法 验证重置
      this.$validator.reset();
    },
    //   submit点击登录或者注册按钮的回调
    submit() {
      //   在发送数据进行请求之前先进行验证
      // validateAll方法，返回Promise对象
      this.$validator.validateAll().then(valid => {
        // valid是布尔值，验证有没有通过
        if (valid) {
          if (this.isLogin) {
            // 登录
            // 这是先用辅助函数mapActions获取vuex中的user中的login方法，再调用这个login方法，
            // this.login(this.loginForm).then(()=>{
            //   this.$router.push("/")
            // })
            // 这是直接调用$store中的dispatch方法，来使用vuex中的user中的login方法，
            // this.$store.dispatch("user/LOGIN", this.loginForm).then(() => {
            //   this.$router.push("/");
            // });
            // 无登录接口，做一个假登录，将用户信息存储到本地
            if(this.loginForm.name=='long'&&this.loginForm.password==1){  
              let userInfo={
                name:this.loginForm.name,
                isLoggedIn:true,
                cartOrder:[],
                checkOrder:[],
                confirmOrder:[],
                payOrder:[],
              };
              // this.$store.commit('user/login',userInfo)
              setStorage('set','userInfo',userInfo);
              // localStorage.setItem('userInfo',JSON.stringify(userInfo));
              this.$router.push("/");
            }else{
               this.$message.error('用户名或密码错误');
            }
          } else {
            // 接口失效，无法注册
            // this.$store.dispatch("user/REGISTER", this.loginForm).then(() => {
            //   this.$router.push("/");
            // });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
body,
a {
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
}
.container {
  width: 1130px;
  margin: 0 auto;
}
.container::before,
.container::after,
.clearfix::before,
.clearfix::after {
  content: "";
  display: table;
}
.container::after,
.clearfix::after {
  clear: both;
}
.logo a {
  display: block;
  background: url(../img/mistore_logo.png) no-repeat;
  width: 200px;
  height: 98px;
}
.panel {
  background: url(../img/loginbg.jpg) no-repeat top center;
  height: 588px;
}
.panel-layout {
  width: 410px;
  min-height: 524px;
  background: white;
  margin-top: 32px;
  float: right;
}

.panel-tabs {
  padding: 27px 0 24px;
  text-align: center;
  font-size: 24px;
  color: #e0e0e0;
}
.panel-tabs .select {
  color: #f56600;
}
.panel-tabs .line {
  width: 1px;
  height: 24px;
  margin: 0 35px 0 42px;
  border: 1px solid #e0e0e0;
}
.tabs-link {
  padding: 27px 0 24px;
  text-align: center;
  font-size: 24px;
  color: #666;
}

.panel-account {
  width: 348px;
  margin: 0 auto;
  margin-top: 10px;
}
.account-item {
  width: 306px;
  height: 22px;
  line-height: 22px;
  padding: 13px 16px 13px 14px;
  display: block;
  outline: 0;
  border: 0 none;
  color: #333;
}
.account-label {
  margin-bottom: 14px;
  border: 1px solid #e0e0e0;
  outline: 0 none;
  display: -webkit-box;
}
.panel-account .btn {
  background-color: #ef5b00;
  width: 100%;
  height: 50px;
  line-height: 50px;
  display: block;
  margin-bottom: 14px;
  text-align: center;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  border: 0;
  outline: 0;
}
.errors {
  color: #ef5b00;
  margin: 10px 0;
}
</style>