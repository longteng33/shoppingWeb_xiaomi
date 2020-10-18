<template>
  <div>
    <div class="topbar">
      <div class="container">
        <div class="topbar-nav">
          <a href>小米商城</a>
          <span>|</span>
          <a href>MIUI</a>
          <span>|</span>
          <a href>IoT</a>
          <span>|</span>
          <a href>云服务</a>
          <span>|</span>
          <a href>金融</a>
          <span>|</span>
          <a href>有品</a>
          <span>|</span>
          <a href>小爱开放平台</a>
          <span>|</span>
          <a href>政企服务</a>
          <span>|</span>
          <a href>Select Region</a>
        </div>
        <div class="topbar-cart logined" v-if="userInfo.isLoggedIn">
          <!-- 点击购物车跳转到购物车页面 -->
          <router-link :to="{ name: 'cart' }">
            <i class="iconfont icon-icon22fuzhi"></i>购物车
            <span>
              （<label class="count">{{ totalCartGoods }}</label
              >）
            </span>
          </router-link>
        </div>
        <div class="topbar-info clearfix">
          <!-- 点击登录按钮，跳转到登录页面，切换路由，所以使用router-link -->
          <!-- to属性，要跳转的路由 -->
          <!-- click.native加上native修饰符，不然只会跳转而不会触发事件 -->
          <template v-if="!userInfo.isLoggedIn">
            <router-link
              to="/login"
              class="not-logined"
              @click.native="changeIsLogin(true)"
              >登录</router-link
            >
            <span class="not-logined">|</span>
            <router-link
              to="/login"
              class="not-logined"
              @click.native="changeIsLogin(false)"
              >注册</router-link
            >
            <span class="not-logined">|</span>
          </template>

          <template v-else>
            <a class="logined username">{{ userInfo.name }}</a>
            <span class="logined">|</span>
            <a class="sep">消息通知</a>
            <a
              href="#"
              class="sep logined logout"
              v-if="userInfo.isLoggedIn"
              @click="logout"
              >退出</a
            >
          </template>
        </div>
      </div>
    </div>

    <div class="header" v-show="routeName != 'cart'">
      <div class="container">
        <div class="header-logo">
          <router-link to="/" class="lr">小米官网</router-link>
        </div>
        <div class="header-nav">
          <ul class="nav-list clearfix">
            <li
              class="nav-category"
              :class="{ otherPage: routeName != 'Home' }"
            >
              <a href="javascript:;" :class="{ hidden: routeName == 'Home' }"
                >全部商品分类</a
              >
              <!-- 左侧导航 -->
              <div class="category-list">
                <ul>
                  <li
                    class="tpl-cat"
                    v-for="(left, index) in menuLeft"
                    :key="`left_${index}`"
                  >
                    <a class="title">
                      <span>{{ left.cat_name }}</span>
                      <i class="iconfont icon-xiayige"></i>
                    </a>
                    <div class="children clearfix" v-if="left.children">
                      <ul class="children-list">
                        <li
                          class="tpl-children"
                          v-for="(list, index) in left.children[0].children"
                          :key="`list_${index}`"
                        >
                          <a href="#">
                            <img :src="list.cat_icon" alt />
                            <span class="text">{{ list.cat_name }}</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </li>

            <li
              class="nav-item tpl-nav"
              v-for="(top, index) in menuTop"
              :key="`top_${index}`"
            >
              <a href="javascript:;">{{ top.cat_name }}</a>
            </li>
            <li class="nav-item tpl-nav">
              <a href="javascript:;">服务</a>
            </li>
            <li class="nav-item tpl-nav">
              <a href="javascript:;">社区</a>
            </li>
          </ul>
        </div>
        <div class="header-search">
          <form action class="search-form">
            <input type="search" name="keyword" class="search-text" />
            <button class="search-btn iconfont icon-fangdajing"></button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../utils/api";
import setStorage from "../utils/setStorage";
import { mapState,mapMutations, mapGetters } from "vuex";

export default {
  created() {
    var that = this;
    window.addEventListener("storage", function (e) {
      that.getTotalCartGoods();
    });

    // 在打开页面，或刷新页面的时候，会触发钩子函数,这时候发送请求，通过?发送请求参数,传top请求头部数据
    this.getCategories();
    this.getTotalCartGoods();

    // 获取商品总数量
    // this.$store.dispatch("cart/CHANGEcartGoodsList");
    // console.log(this.totalCartGoods)
  },

  async mounted() {
    // 如果登录就获取，如果没有登录就不获取
    // if (this.isLoggedIn) {
    //   // await等这个请求执行完
    //   await this.$store.dispatch("cart/CHANGEcartGoodsList");
    //   this.totalCartGoods = this.cartGoodsList.reduce((sum, item) => {
    //     return (sum += Number(item.quantity));
    //   }, 0);
    // }
  },

  data() {
    return {
      userInfo: {}, //用户信息
      menuTop: [], //导航栏商品类列
      menuLeft: [], //导航栏左侧商品类列
      // routeName当前所在页面的路由
      routeName: this.$route.name,
    };
  },

  computed: {
    ...mapState("user", ["totalCartGoods"]),
    // ...mapState("cart", ["cartGoodsList"]),
    // ...mapGetters('user',['goodsQuantity']),

    // totalCartGoods() {
    //   if (this.userInfo.isLoggedIn) {
    //     if (this.userInfo.cartOrder.length == 0) {
    //       return 0;
    //     } else {
    //       return this.userInfo.cartOrder.reduce((total, item) => {
    //         return total + item.num;
    //       }, 0);
    //     }
    //   } else {
    //     return 0;
    //   }
    // },
  },

  watch: {},

  methods: {
    ...mapMutations('user',['changeTotalCartGoods']),
    getUserInfo() {
      var userInfo = setStorage("get", "userInfo");
      if (userInfo) {
        this.userInfo = userInfo;
      }
    },
    getTotalCartGoods() {
       this.getUserInfo();
      let totalCartGoods;
     
      if (this.userInfo.isLoggedIn) {
        if (this.userInfo.cartOrder.length == 0) {
          totalCartGoods=0;
        } else {
          totalCartGoods= this.userInfo.cartOrder.reduce((total, item) => {
            return total + item.num;
          }, 0);
        }
      } 
      this.changeTotalCartGoods(totalCartGoods);
    },

    getCategories() {
      api.get("/categories").then(
        (data) => {
          if (data.meta.status == 200) {
            this.menuTop = data.message.slice(0, 7);
            this.menuLeft = data.message.slice(7, 17);
          }
        },
        (error) => {}
      );
    },
    logout() {
      // this.$store.commit("user/logout");
      this.userInfo = {};
      localStorage.removeItem("userInfo");
    },

    changeIsLogin(val) {
      this.$store.commit("user/changeIsLogin", val);
    },
  },
};
</script>

<style lang="scss" scoped>
// sass的语法，引入其它的样式文件
// 引入的文件名需要带后缀，如.css
@import url(../css/iconfont/iconfont.css);
@import url(../css/style.css);

// 在不是home页面的时候，就获得otherPage类
.otherPage .category-list > ul {
  background: #fff;
  border: 1px solid #ff6700;
}
.otherPage .category-list .title {
  color: #424242;
}
.otherPage .category-list .title i {
  color: #e0e0e0;
  position: absolute;
  top: 12px;
  right: 20px;
  font-size: 16px;
  line-height: 16px;
}
.otherPage .category-list {
  display: none;
}
.otherPage:hover .category-list {
  display: block;
}
</style>