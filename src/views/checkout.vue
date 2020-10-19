<template>
  <div>
    <div class="miniheader">
      <div class="container">
        <div class="miniheader-logo">
          <a href="/">小米官网</a>
        </div>
        <div class="miniheader-title">
          <h2>确认订单</h2>
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

    <div class="checkout">
      <div class="container">
        <div class="checkout-box">
          <div class="checkout-address clearfix">
            <p class="address-header">收货地址</p>
            <div class="address-body">
              <!-- 有select时候才会修改字样 -->
              <div
                class="address-item"
                v-for="(address, index) in address"
                :key="`address_${index}`"
                :class="{ select: selectedIndex == index }"
                @click="handleSelected(index)"
              >
                <dl>
                  <dt class="recipient">{{ address.name }}</dt>
                  <dd class="phone">{{ address.phone }}</dd>
                  <dd class="area">{{ address.area }}</dd>
                  <dd class="address">{{ address.address }}</dd>
                </dl>
                <div class="actions">
                  <a href="javascript:;" @click.stop="modifyAddress(address,index)">修改</a>
                  <a href="javascript:;" @click.stop="removeAddress(address,index)">移除</a>
                </div>
              </div>

              <div class="address-item address-new" @click="add_Address">
                <i class="iconfont icon-jiahao"></i>
                添加新地址
              </div>
            </div>
          </div>
          <div class="checkout-goods">
            <p class="goods-header">商品</p>
            <div class="goods-body">
              <ul
                class="goods-list clearfix"
                v-for="(goods, index) in checkOrder"
                :key="`goods_${index}`"
              >
                <li class="clearfix">
                  <div class="goods-img">
                    <img :src="goods.goods_small_logo" alt />
                  </div>
                  <div class="goods-name">
                    <router-link
                      :to="{
                        name: 'product',
                        query: { goods_id: goods.goods_id },
                      }"
                      target="_blank"
                      >{{ goods.goods_name }}</router-link
                    >
                    <!-- <a href="#">{{goods.name}}</a> -->
                  </div>
                  <div class="goods-price">
                    {{ `${goods.goods_price}元 × ${goods.num}` }}
                  </div>
                  <div class="goods-total">
                    {{ goods.goods_price * goods.num }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="checkout-count clearfix">
            <div class="count-box">
              <ul>
                <li>
                  <label>商品件数：</label>
                  <span>
                    <span class="total-quantity">{{ totalNum }}</span
                    >件
                  </span>
                </li>
                <li>
                  <label>商品总价：</label>
                  <span class="total-price">
                    <span class="price">{{ totalPrice }}</span
                    >元
                  </span>
                </li>
                <li>
                  <label>活动优惠：</label>
                  <span>-0元</span>
                </li>
                <li>
                  <label>优惠券抵扣：</label>
                  <span>-0元</span>
                </li>
                <li>
                  <label>运费：</label>
                  <span>{{ shipping }}元</span>
                </li>
                <li class="total-price">
                  <label>应付总额：</label>
                  <span>
                    <em class="price">{{ sumMoney }}</em
                    >元
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div class="checkout-bar clearfix">
            <div class="bar-btn">
              <!-- <router-link id="checkout" :to="{name:'confirm',query:{order_no:order_no}}" @click="checkout_pay" target="_blank">去结算</router-link> -->
              <a href="javascript:;" id="checkout" @click="checkout_pay"
                >去结算</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="edit-bg"
      v-show="isShow_editAddress"
      @click="cancelDia"
    ></div>
    <div class="edit-address" v-show="isShow_editAddress">
      <div class="edit-header">
        <span class="title">添加收货地址</span>
        <a
          href="javascript:;"
          class="close"
          @click="cancelDia"
        >
          <i class="iconfont icon-chahao"></i>
        </a>
      </div>
      <div class="edit-body">
        <form class="body-form clearfix">
          <input type="hidden" name="address_id" />
          <div class="form-section form-name">
            <!-- <label>收件人</label> -->
            <input
              type="text"
              name="recipient"
              class="input-text name-input"
              v-model="address_form.name"
              placeholder="收货人姓名"
            />
          </div>
          <div class="form-section form-phone">
            <!-- <label>手机号</label> -->
            <input
              type="text"
              name="phone"
              class="input-text phone-input"
              v-model="address_form.phone"
              placeholder="手机号"
            />
          </div>
          <div class="form-section form-area">
            <input
              type="text"
              name="area"
              class="input-text area-input"
              v-model="address_form.area"
              placeholder="选择省 / 市 / 区 / 街道"
            />
          </div>
          <div class="form-section form-detail">
            <!-- <label>详细地址</label> -->
            <textarea
              type="textarea"
              name="address"
              class="input-text detail-input"
              placeholder="详细地址，路名或街道名称，门牌号"
              v-model="address_form.address"
            ></textarea>
          </div>
        </form>

        <!--             <div class="form-select">
                <span class="select-close">x</span>
                <div class="select-box clearfix">
                    <div class="select-item" data-init-txt="选择省份/自治区">选择省份/自治区</div>
                    <div class="select-item " data-init-txt="选择城市/地区">选择城市/地区</div>
                    <div class="select-item hidden" data-init-txt="选择区县">选择区县</div>
                    <div class="select-item hidden" data-init-txt="选择配送区域">选择配送区域</div>
                </div>
                <div class="option-box">
                    <ul class="option-list clearfix">
                        <li date-value="2" data-txt="北京">北京</li>
                        <li date-value="3" data-txt="上海">上海</li>
                    </ul>
                    <ul class="option-list clearfix hidden">
                        <li date-value="108" data-txt="上海市">上海市</li>
                    </ul>
                    <ul class="option-list clearfix hidden">
                        <li date-value="2" data-txt="黄浦区">黄浦区</li>
                        <li date-value="3" data-txt="虹口区">虹口区</li>
                        <li date-value="2" data-txt="黄浦区">黄浦区</li>
                        <li date-value="3" data-txt="虹口区">虹口区</li>
                        <li date-value="2" data-txt="黄浦区">黄浦区</li>
                        <li date-value="3" data-txt="虹口区">虹口区</li>
                        <li date-value="2" data-txt="黄浦区">黄浦区</li>
                        <li date-value="3" data-txt="虹口区">虹口区</li>
                        <li date-value="2" data-txt="黄浦区">黄浦区</li>
                        <li date-value="3" data-txt="虹口区">虹口区</li>
                    </ul>
                    <ul class="option-list clearfix hidden">
                        <li date-value="2" data-txt="白鹤镇">白鹤镇</li>
                        <li date-value="3" data-txt="康桥镇">康桥镇</li>
                        <li date-value="2" data-txt="白鹤镇">白鹤镇</li>
                        <li date-value="3" data-txt="康桥镇">康桥镇</li>
                        <li date-value="2" data-txt="白鹤镇">白鹤镇</li>
                        <li date-value="3" data-txt="康桥镇">康桥镇</li>
                    </ul>
                </div>
            </div>
        -->
      </div>
      <div class="edit-footer">
        <a
          href="javascript:;"
          class="btn btn-primary confirm"
          @click="submit_address"
          >保存</a
        >
        <a
          href="javascript:;"
          class="btn btn-gray close"
          @click="cancelDia"
          >取消</a
        >
      </div>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import api from "../utils/api";
import setStorage from "../utils/setStorage";
import { mapState, mapGetters } from "vuex";
import confirmVue from './confirm.vue';

export default {
  created() {
    document.title = "确认订单";
    this.getInfo();
  },
  //   元素挂载之后请求购物车数据
  // async函数
  async mounted() {
    await this.$store.dispatch("address/CHANGEaddressList");
    await this.$store.dispatch("cart/CHANGEcartGoodsList");
  },

  data() {
    return {
      userInfo:{},
      totalNum: 0, //商品件数
      totalPrice: 0, //商品总价
      checkOrder: [], //订单商品数组
      orderGoods: [],
      orderGoods_id: [],
      isShow_editAddress: false, //是否显示编辑地址窗口
      address_form: {
        name: "龙腾",
        phone: "13912345678",
        area: "广东省广州市",
        address: "", //详细地址
        checked:false,
      }, //地址表单
      address: [], //地址列表
      selectedIndex:0,
      modifyIndex: -1, //修改的地址是哪一个
    };
  },

  computed: {
    // ...mapState("cart", ["cartGoodsList"]),
    // ...mapState("address", ["addressList"]),
    //选择了第几个地址项
    // selectedIndex(){
    //   return this.address.findIndex(item=>{
    //     return item.checked;
    //   })
    // },
    // 运费
    shipping() {
      if(this.totalNum==0){
        return 0;
      }
      var num=10 + this.totalNum * 2;
      return num||0;
    },
    // 应付总额
    sumMoney() {
      var num=this.totalPrice + this.shipping;
      return num||0;
    },

  },
  watch:{
  },

  methods: {
    getInfo() {
      this.userInfo = setStorage("get", "userInfo");
      if (this.userInfo.isLoggedIn) {
        this.checkOrder = this.userInfo.checkOrder;
        let totalNum = 0;
        let totalPrice = 0;
        for (let i = 0; i < this.checkOrder.length; i++) {
          totalNum += this.checkOrder[i].num;
          totalPrice += this.checkOrder[i].num * this.checkOrder[i].goods_price;
        }
        this.totalNum = totalNum;
        this.totalPrice = totalPrice;

        if (!this.userInfo.address) {
          this.userInfo.address = [];
        }
        this.address = this.userInfo.address;
        this.setData();
      }
    },
    setData(){
        this.selectedIndex=this.address.findIndex(item=>{
          return item.checked;
        })
    },
    //点击地址栏,选择此地址
    handleSelected(index){
      
      if(index==this.selectedIndex) return;
      this.address.forEach((item,i)=>{
         item.checked=false;
        if(index==i){
          item.checked=true;
        }
      })
       this.setData();
      setStorage('set',"userInfo",this.userInfo)
    },

    // add_Address点击“添加新地址”
    add_Address() {
      this.isShow_editAddress = true;
    },

    // 点击地址修改
    modifyAddress(address,index) {
      this.isShow_editAddress = true;
      this.address_form = address;
      this.modifyIndex=index;
    },

    removeAddress(address,index){
      this.address.splice(index,1);
      setStorage("set", "userInfo", this.userInfo);
      this.$message({
          message: '已移除',
          type: 'warning'
        });
    },

    // submit_address点击地址保存
    submit_address() {
      // this.$store
      //   .dispatch("address/CHANGEaddressList_update", this.address_form)
      //   .then((data) => {
      //   });
      //
      // 判断是新增还是修改
      if (this.modifyIndex==-1){
        //增加时
        var flag = true; //判断表单是否填完整
        Object.values(this.address_form).forEach((item) => {
          if(typeof(item)!=='string'){
            return
          }
          if (item.trim() == "") {
            flag = false;
          }
        });
        if (!flag) {
          this.$message({
          message: '信息不完整',
          type: 'warning'
        });
          return;
        }
        
        // 深拷贝一份，再推入数组，否则给的是同一份
        let address_form = JSON.parse(JSON.stringify(this.address_form));
        this.address.unshift(address_form);
        if(this.address.length==1){
          this.address[0].checked=true;
        }
        this.$message({
          message: '添加成功',
          type: 'success'
        });
      }else{
        //修改时
        this.address[this.modifyIndex]=JSON.parse(JSON.stringify(this.address_form));
        this.$message({
          message: '修改成功',
          type: 'success'
        });
      }
       this.setData();
      setStorage("set", "userInfo", this.userInfo);
      this.closeDia();
      
    },

    // 关闭对话框
    closeDia(){
      this.modifyIndex=-1;
      this.isShow_editAddress = false;
      //清空表单操作
      this.address_form.address='';
    },

    // 取消对话框
    cancelDia(){
      if(this.modifyIndex!==-1){
       //修改了又取消
       let address_form=setStorage('get','userInfo').address[this.modifyIndex];
       this.address[this.modifyIndex]=address_form;
      }
      this.closeDia();
    },

 

    // 验证内容不为空方法
    notEmp(val) {
      if (val.trim() == "") {
        return false;
      } else {
        return true;
      }
    },
    // checkout_pay点击结算按钮
    checkout_pay() {
      // api
      //   .post("/user/checkout", {
      //     ids: this.orderGoods_id.toString(","),
      //     address_id: this.addressList_reverser[this.selectedIndex]
      //       .address_id,
      //   })
      //   .then((data) => {
      //     this.$router.push({
      //       name: "confirm",
      //       query: {
      //         order_no: data,
      //         address: JSON.stringify(
      //           this.addressList_reverser[this.selectedIndex]
      //         ),
      //         orderGoods: JSON.stringify(this.orderGoods),
      //         totalOrderGoodsPrice: this.totalOrderGoodsPrice,
      //       },
      //     });
      //   });
      if(this.totalNum==0){
        this.$message({
          message: "请先提交购物车商品",
          type: "warning",
        });
        return ;
      }
      if(this.address.length==0){
   this.$message({
          message: "请先添加地址",
          type: "warning",
        });
        return;
      }
      
      let confirmOrder=this.userInfo.confirmOrder;
      // JSON不能存储Date对象
      let date=new Date().getTime();

      let orderItem={
        address:this.address[this.selectedIndex],
        goods_list:this.checkOrder,
        sumMoney:this.sumMoney,
        time:date,
      };

      confirmOrder.unshift(orderItem);
      this.userInfo.confirmOrder=confirmOrder;
      this.userInfo.checkOrder=[];
      setStorage('set','userInfo',this.userInfo)
      this.$router.push({
            name: "confirm",
            })
    },

  },
};
</script>

<style lang="scss" scoped>
@import url(../css/iconfont/iconfont.css);
@import url(../css/style.css);
@import url(../css/checkout.css);
</style>