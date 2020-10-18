<template>
  <div>
    <app-header></app-header>
    <div class="miniheader">
      <div class="container">
        <div class="miniheader-logo">
          <router-link to="/">小米官网</router-link>
        </div>
        <div class="miniheader-title">
          <h2>我的购物车</h2>
          <p>温馨提示：产品是否购买成功，以最终下单为准哦，请尽快结算</p>
        </div>
        <div class="miniheader-info">
          <i class="iconfont">&#x221a;</i>
          <a href="#" class="user-name">
            <span></span>
          </a>
          <span class="sep">|</span>
          <router-link :to="{ name: 'confirm' }" class="info-order">
            我的订单
          </router-link>
          <!-- <a href="/checkout" class="info-order">我的订单</a> -->
        </div>
      </div>
    </div>

    <div class="cartmain">
      <div class="container">
        <div class="cartmain-list">
          <div class="list-head clearfix">
            <div class="col col-check">
              <i
                class="iconfont icon-checkbox"
                :class="{ select: isSelectedAll }"
                @click="clickSelectedAll"
                >&#x221a;</i
              >
              全选
            </div>
            <div class="col col-img" style="height: 1px"></div>
            <div class="col col-name">商品名称</div>
            <div class="col col-price">单价</div>
            <div class="col col-num">数量</div>
            <div class="col col-total">小计</div>
            <div class="col col-action">操作</div>
          </div>
          <div class="list-body">
            <div
              class="item-box clearfix"
              v-for="(good, index) in cartOrder"
              :key="`good_${index}`"
            >
              <div class="col col-check">
                <i
                  class="iconfont icon-checkbox"
                  :class="{ select: good.checked }"
                  @click="selectedOne($event, good, index)"
                  :data-id="good.goods_id"
                  >&#x221a;</i
                >
              </div>
              <div class="col col-img">
                <a href="#">
                  <img :src="good.goods_small_logo" alt />
                </a>
              </div>
              <div class="col col-name">
                <span class="ellipsis-2">{{ good.goods_name }}</span>
              </div>
              <div class="col col-price">
                <label class="price">{{ good.goods_price }}</label
                >元
              </div>
              <div class="col col-num">
                <div class="change-num clearfix">
                  <!-- 减少 -->
                  <a
                    data-change="-1"
                    href="javascript:;"
                    @click="addNum(-1, good, index)"
                  >
                    <i class="iconfont">-</i>
                  </a>
                  <!-- 输入数量 -->
                  <input
                    type="text"
                    v-model="good.num"
                    @input="handleInput(good)"
                    @change="
                      inputChange(Number($event.target.value), good, index)
                    "
                  />
                  <!-- 增加 -->
                  <a
                    data-change="1"
                    href="javascript:;"
                    @click="addNum(1, good, index)"
                  >
                    <i class="iconfont">+</i>
                  </a>
                </div>
              </div>
              <div class="col col-total">
                <label class="price">{{ good.goods_price * good.num }}</label
                >元
              </div>
              <div class="col col-action">
                <!-- 点击删除此项商品,传当前数量的负数 -->
                <a href="javascript:;" @click="delGoods(good, index)">
                  <i class="iconfont icon-chahao"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="cartmain-bar clearfix">
          <div class="bar-info">
            <router-link to="/">继续购物</router-link>
            <span class="info-total">
              共
              <i class="total-num">{{ sumNum }}</i> 件商品，已选择
              <i class="total-num">{{ totalNum }}</i> 件
            </span>
          </div>
          <span class="total-price">
            合计：
            <em class="totalprice-num">{{ totalPrice }}</em
            >元
          </span>
          <form method="get" action="checkout.html" style="display: inline">
            <input type="hidden" name="ids" id="ids" />
            <a
              href="javascript:;"
              id="checkout"
              class="bar-btn btn-primary"
              @click="handlePay"
              >去结算</a
            >
          </form>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import api from "../utils/api";
import setStorage from "../utils/setStorage";
import { mapState, mapMutations } from "vuex";

export default {
  created() {
    document.title = "购物车";
    this.getInfo(); //获取信息
    this.setCart(this.cartOrder);

    // 获取购物车商品
    // this.$store.dispatch("cart/CHANGEcartGoodsList");
  },

  updated() {},
  data() {
    return {
      userInfo: {}, //用户信息
      cartOrder: [], //购物车商品数组
      isSelectedAll: false, //是否全选
      totalPrice: 0, //选中商品总价格
      totalNum: 0, //选中商品总数量
      sumNum: 0, //购物车商品总数量
      selectGoods_id: [],
    };
  },
  computed: {
    // ...mapState("cart", ["cartGoodsList"]),
    // ...mapGetters("cart", ["totalCartGoods"]),
  },
  watch: {},
  methods: {
    ...mapMutations("user", ["changeTotalCartGoods"]),
    getInfo() {
      var userInfo = setStorage("get", "userInfo");

      if (userInfo.isLoggedIn) {
        // 为cartOrder每项中添加checked用于判断有没有选中
        this.cartOrder = userInfo.cartOrder.map((item) => {
          if (!item.checked) {
            item.checked = false;
          }
          return item;
        });
        this.userInfo = userInfo;
        this.userInfo.cartOrder = this.cartOrder;
      }
      this.sumNum = this.cartOrder.reduce((total, item) => {
        return item.num + total;
      }, 0);
    },

    //   点击单个勾选
    selectedOne($event, good, index) {
      this.cartOrder[index].checked = !this.cartOrder[index].checked;
      this.setCart(this.cartOrder);
    },

    // 点击全选
    clickSelectedAll() {
      this.isSelectedAll = !this.isSelectedAll;
      this.cartOrder.forEach((item) => {
        item.checked = this.isSelectedAll;
      });

      this.setCart(this.cartOrder);
    },

    //购物车数据重置
    setCart(cart) {
      if (cart.length == 0) {
        this.isSelectedAll = false;
        this.totalNum = 0;
        this.totalPrice = 0;
        this.sumNum = 0;
        return;
      }
      let totalNum = 0;
      let totalPrice = 0;
      let sumNum = 0;
      this.isSelectedAll = true;
      cart.forEach((item) => {
        if (item.checked) {
          totalNum += item.num;
          totalPrice = totalPrice + item.num * item.goods_price;
        } else {
          this.isSelectedAll = false;
        }
        sumNum += item.num;
      });
      this.totalNum = totalNum;
      this.totalPrice = totalPrice;
      this.sumNum = sumNum;
      this.changeTotalCartGoods(sumNum);
      setStorage("set", "userInfo", this.userInfo);
    },

    // 点击加减按钮增减商品数量
    addNum(num, good, index) {
      this.getInfo(); //点击前先获取一次数据，刷新页面，看数据是否有在其它页面被更改
      let id = good.goods_id;
      // let index = this.cart.findIndex((item) => {
      //   return item.goods_id == id;
      // });
      if (this.cartOrder[index].num + num == 0) {
        this.delGoods(good);
      } else {
        this.cartOrder[index].num += num;
      }
      this.setCart(this.cartOrder);
    },
    // 输入框输入商品数量
    handleInput(good) {
      // this.originNum=good.num;
      good.num = good.num.replace(/\D/g, "");
      good.num = Number(good.num);
    },
    inputChange(n, good, index) {
      // console.log(num)
      if (n == 0) {
        this.delGoods(good, index);
      }
      this.setCart(this.cartOrder);
    },

    // 点击删除商品
    delGoods(good, index) {
      this.$confirm("是否删除?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.cartOrder.splice(index, 1);
          this.setCart(this.cartOrder);
          setStorage("set", "userInfo", this.userInfo);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          good.num = setStorage("get", "userInfo").cartOrder[index].num;
        });

      // if (confirm("是否删除")) {
      //   this.cartOrder.splice(index, 1);
      //   this.setCart(this.cartOrder);
      //   setStorage('set','userInfo',this.userInfo);
      // }else{
      //   // 如果不确定删除
      //   good.num=setStorage('get','userInfo').cartOrder[index].num;
      // }
    },
    // 点击结算
    handlePay() {
      this.getInfo();
      this.setCart(this.cartOrder);
      if (this.totalNum == 0) {
        this.$message({
          message: "您还没有选购商品",
          type: "warning",
        });
        return;
      }
      let checkOrder = [];

      for (var i = 0; i < this.cartOrder.length; ) {
        if (this.cartOrder[i].checked) {
          this.cartOrder[i].checked = false;
          checkOrder.push(this.cartOrder[i]);
          this.cartOrder.splice(i, 1);
        } else {
          i++;
        }
      }

      if (this.userInfo.checkOrder.length !== 0) {
        for (let i = 0; i < checkOrder.length; ) {
          let id = checkOrder[i].goods_id;
          let index = this.userInfo.checkOrder.findIndex(
            (item) => item.goods_id == id
          );

          if (index == -1) {
            i++;
          } else {
            let num = checkOrder[i].num;
            this.userInfo.checkOrder[index].num += num;
            checkOrder.splice(i, 1);
          }
        }
        this.userInfo.checkOrder = this.userInfo.checkOrder.concat(checkOrder);
      } else {
        this.userInfo.checkOrder = checkOrder;
      }

      this.setCart(this.cartOrder);
      setStorage("set", "userInfo", this.userInfo);
      this.$router.push({
        name: "checkout",
      });
    },
  },
};
// event.currentTarget指向事件所绑定的元素，而event.target始终指向事件发生时的元素。
</script>

<style lang="scss" scoped>
@import url(../css/iconfont/iconfont.css);
@import url(../css/style.css);
@import url(../css/cart.css);

</style>

