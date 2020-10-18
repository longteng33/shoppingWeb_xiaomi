<template>
  <div>
    <div class="miniheader">
      <div class="container">
        <div class="miniheader-logo">
          <a href="/">小米官网</a>
        </div>
        <div class="miniheader-title">
          <h2>支付订单</h2>
          <p>温馨提示：产品是否购买成功，以最终下单为准哦，请尽快结算</p>
        </div>
        <div class="miniheader-info">
          <a href="#" class="user-name">
            <span></span>
          </a>
          <span class="sep">|</span>
          <router-link :to="{ name: 'cart' }" class="info-order">
            购物车
          </router-link>
        </div>
      </div>
    </div>

    <div class="confirm">
      <div class="container">
       
          <div class="confirm-order confirm-section clearfix" v-if="confirmOrder.length!=0">
            <i class="iconfont">&#x221a;</i>
            <div class="box-order ">
              <div class="order-info">
                <h2 class="info-title">订单提交成功！去付款咯～</h2>
              </div>
            </div>

            <div class="order-detail">
              <div
                v-for="(item, index) in confirmOrder"
                :key="`order_${index}`"
                class="clearfix"
              >
                <div class="info-time">
                  <p v-if="item.timeLeft != -1">
                    请在<span>{{ item.timeLeft }}</span
                    >内完成支付, 超时后将取消订单！
                  </p>
                  <p v-else class="warning">支付超时，已取消订单</p>
                </div>
                <ul>
                  <li class="clearfix">
                    <div class="label">下单时间</div>
                    <div class="content order-no">
                      {{item.orderTime}}
                    </div>
                  </li>
                  <li class="clearfix">
                    <div class="label">收货信息：</div>
                    <div class="content address">
                      <span>{{
                        item.address.area + item.address.address
                      }}</span>
                      <span class="name">{{ item.address.name }}</span>
                      <span class="phone">电话：{{ item.address.phone }}</span>
                    </div>
                  </li>
                  <li class="clearfix">
                    <div class="label">商品名称：</div>
                    <div class="content items goods_name">
                      <p
                        v-for="(goods, index) in item.goods_list"
                        :key="`goods_${index}`"
                      >
                        {{ `${goods.goods_name} × ${goods.num}` }}
                      </p>
                    </div>
                  </li>
                </ul>
                <div class="order-total clearfix">
                  <p>
                    应付总额：
                    <span>
                      <em class="money">{{ item.sumMoney }}</em
                      >元
                    </span>
                  </p>
                  <!-- <a href="javascript:;">订单详细</a> -->
                </div>
                <div class="confirm-payment clearfix">
                  <div class="payment-title">选择以下支付方式付款</div>
                  <div class="payment-list">
                    <ul class="clearfix">
                      <li id="pay" @click="pay(item, index)">
                        <img :src="require('../../public/weixinpay.png')" alt />
                      </li>
                      <li id="pay" @click="pay(item, index)">
                        <img
                          :src="require('../../public/zhifubao.jpg')"
                          alt
                          style="margin-top: -14px"
                        />
                      </li>
                      <li id="pay" @click="pay(item, index)">
                        <img :src="require('../../public/unionpay.png')" alt />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="confirm-order confirm-section clearfix">
             <i class="iconfont icon-icon22fuzhi"></i>
            <div class="box-order ">
              <div class="order-info">
                <h2 class="info-title">暂无订单～</h2>
              </div>
            </div>
          </div>
        
      </div>

      <div
        class="confirm-qrcode"
        v-show="isShow_pay"
        @click="isShow_pay = false"
      >
        <div id="qrcode" @click.stop="">
          <img :src="payURL" alt />
          <div class="btn-group">
            <span class="btn" @click="confirmPay">确认支付</span>
            <span class="btn" @click="isShow_pay = false">取消</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../utils/api";
import setStorage from "../utils/setStorage";
export default {
  created() {
    document.title = "支付订单";
    this.getInfo();
    // this.setTime();
    // this.timer=setInterval(this.setTime,1000);
  },

  data() {
    return {
      userInfo: {},
      confirmOrder: [],
      // order_no: this.$route.query.order_no,
      // address: JSON.parse(this.$route.query.address),
      // orderGoods: JSON.parse(this.$route.query.orderGoods),
      // totalOrderGoodsPrice: this.$route.query.totalOrderGoodsPrice,
      isShow_pay: false,
      payURL:
        "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1602909697850&di=6e2576f69e314687cd59df3437dbff34&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F01%2F52%2F02%2F165745e3b25de4a.jpg",
      timeLength: 0.4 * 60 * 1000,
      currentPayIndex: null, //正在支付的订单项
    };
  },
  watch: {},
  computed: {
    // receiveInfo() {
    //   return (
    //     this.address.recipient +
    //     " " +
    //     this.address.phone +
    //     " " +
    //     this.address.area +
    //     " " +
    //     this.address.address
    //   );
    // }
  },
  methods: {
    getInfo() {
      var that=this;
      this.userInfo = setStorage("get", "userInfo");
      if (this.userInfo.isLoggedIn) {
        this.confirmOrder = this.userInfo.confirmOrder;
        if (this.confirmOrder.length != 0) {
          this.confirmOrder.forEach((item, index) => {
            if(item.timeLeft==-1){
              return
            }
             item.endTime = item.time + this.timeLength; //是一个数值
            // 下单时间
            let orderTime=new Date(item.time);
            item.orderTime=`${orderTime.getFullYear()}年${orderTime.getMonth()}月${orderTime.getDate()}日${orderTime.getHours()}时${orderTime.getMinutes()}分`;
            this.setTime(item);
            item.timer = setInterval(that.setTime, 1000, item);
            
          });
        }
        setStorage('set','userInfo',this.userInfo);
      }
    },
    // 倒计时
    setTime(item) {
      let confirmOrder = this.confirmOrder.concat();
      //confirmOrder等于了新的confirmOrder,页面才会监听到数组变化了，从而更新页面
      this.confirmOrder = confirmOrder;
      let now = new Date();
      let timeLeft = item.endTime - now.getTime();//实时剩余时间数
      item.timeLeft = this.timeTransform(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(item.timer);
        item.timer = null;
        item.timeLeft = -1;
        setStorage('set','userInfo',this.userInfo)//重要
      }
      
    },
    timeTransform(time) {
      let d = 1000 * 60 * 60 * 24;
      let h = 1000 * 60 * 60;
      let m = 1000 * 60;
      let s = 1000;

      let day = Math.floor(time / d);
      time = time % d;
      let hour = Math.floor(time / h);
      time = time % h;
      let min = Math.floor(time / m);
      time = time % m;
      let sec = Math.floor(time / s);
      time = time % s;
      if (day == 0) {
        return hour + "时" + min + "分" + sec + "秒";
      } else {
        return day + "天" + hour + "时" + min + "分" + sec + "秒";
      }
    },
    pay(orderItem, index) {
      // api.post("/user/pay", { order_no: this.order_no }).then((data) => {
      //   this.payURL = data;
      // });
      let confirmOrder=setStorage('get','userInfo').confirmOrder;
      let endTime=confirmOrder[index].endTime;
      if(this.confirmOrder[index].endTime!==endTime){
        this.$message({
          message: '订单不存在',
          type: 'warning'
        });
        this.confirmOrder=confirmOrder;//使页面重新渲染
        return;
      }
      if (orderItem.timeLeft == -1) {
        this.$message({
          message: '订单已超时，已被取消',
          type: 'warning'
        });
        this.confirmOrder.splice(index, 1);
         this.userInfo.confirmOrder=this.confirmOrder;
         setStorage("set", "userInfo", this.userInfo);
        return;
      }
      this.currentPayIndex = index;
      this.isShow_pay = true;
    },
    confirmPay() {
      let payOrderItem = this.confirmOrder[this.currentPayIndex];
      // 执行支付逻辑
      let payTime = new Date().getTime();
      payOrderItem.payTime = payTime;

      clearInterval(payOrderItem.timer);
      payOrderItem.timer=null;

      this.userInfo.payOrder.push(payOrderItem);
      this.confirmOrder.splice(this.currentPayIndex, 1);

       this.userInfo.confirmOrder=this.confirmOrder;//confirmOrder等于了新的confirmOrder，所以需重新赋值
      setStorage("set", "userInfo", this.userInfo);
      
      this.isShow_pay = false;
      this.$message({
          message: '支付成功',
          type: 'success'
        });
      this.currentPayIndex=null
     
    },

    closePay() {
      this.isShow_pay = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import url(../css/iconfont/iconfont.css);
@import url(../css/style.css);
@import url(../css/confirm.css);
.confirm {
  padding: 38px 0;
  background: #f5f5f5;
}

.confirm .confirm-order {
  padding-left: 183px;
  position: relative;
}
</style>