<template>
  <div id="product">
    <app-header></app-header>
    <div class="product">
      <!-- v-for="(options,index) in productOptions" :key="`options_${index}`" -->
      <div class="container">
        <div class="pro-view">
          <div class="view-list">
            <img
              v-for="(img, index) in goodsInfo.pics"
              :key="`img_${index}`"
              :src="img.pics_mid"
              :alt="goodsInfo.goods_name"
              v-show="index == showImgIndex"
            />
          </div>
          <div class="view-control">
            <div class="control-lr">
              <a
                href="javascript:"
                class="control-prev"
                @click="
                  showImgIndex == 0
                    ? (showImgIndex = goodsInfo.pics.length - 1)
                    : showImgIndex--
                "
                >上一张</a
              >
              <a
                href="javascript:"
                class="control-next"
                @click="
                  showImgIndex == goodsInfo.pics.length - 1
                    ? (showImgIndex = 0)
                    : showImgIndex++
                "
                >下一张</a
              >
            </div>
            <div class="control-page">
              <a
                v-for="(img, index) in goodsInfo.pics"
                :key="`img_${index}`"
                @click="showImgIndex = index"
                >{{ index + 1 }}</a
              >
            </div>
          </div>
        </div>
        <div class="pro-info">
          <h1 class="pro-title">{{ goodsInfo.goods_name }}</h1>
          <p class="pro-desc">{{ goodsInfo.desc }}</p>
          <div class="pro-price">
            <span>
              <label class="price">{{ goodsInfo.goods_price }}</label> 元
            </span>
            <span>
              仅剩<label class="price">{{ goodsInfo.goods_number }}</label> 件
            </span>
          </div>
          <!-- <div class="pro-choose">
            <div class="choose1">
              <p class="choose-title">
                选择
                <span class="prop-name">{{goodsInfo.prop1_name}}</span>
              </p>
              <ul class="choose-list clearfix">
                <li
                  :class="{active:index==indexActive1}"
                  @click="indexActive1=index,indexActive2=0"
                  v-for="(options,index) in productOptions"
                  :key="`options_${index}`"
                >
                  <a href="javascript:;">
                    <span class="list-name">{{options.prop1_value}}</span>
                    <span class="list-price">
                      <label class="price">{{options.price}}</label>元
                    </span>
                  </a>
                </li>
                
              </ul>
            </div>
            
            <div class="choose2">
              <p class="choose-title">
                选择
                <span class="prop-name"></span>
              </p>
              <ul class="choose-list clearfix">
                <li
                  v-for="(list,index) in optionsList"
                  :key="`list_${index}`"
                  :class="{active:index==indexActive2}"
                  @click="indexActive2=index"
                >
                  <a href="javascript:;">
                    <span class="list-name">{{list.prop2_value}}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div> -->
          <div class="pro-btn">
            <a href="javascript:;" id="addCart" @click="joinCart">加入购物车</a>
          </div>
        </div>
      </div>
    </div>
   
    <div class="introduce">
      <div class="container" v-html="goodsInfo.goods_introduce"></div>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
// import header from "../components/header";
import api from "../utils/api";
import setStorage from "../utils/setStorage";
import { mapState, mapMutations } from "vuex";

export default {
  created() {
    this.getGoodsInfo();
    this.getUserInfo();

    // api.get(`/goodsInfo?pid=${this.$route.query.pid}`).then(
    //   data => {
    //     document.title = data.name;
    //     this.goodsInfo = data;
    //     this.productOptions = data.options;
    //     this.imgs=this.productOptions[this.indexActive1].list[this.indexActive2].imgs;
    //   },
    //   err => {}
    // );
  },

  updated() {
    //  console.log(this.sku_id)
  },
  data() {
    return {
      userInfo: {},
      goodsInfo: {}, //商品信息
      productOptions: [],
      // optionsList:[],
      // price:'',
      imgs: [],
      // indexActive1是选择的版本
      indexActive1: 0,
      // indexActive2是选择的手机颜色
      indexActive2: 0,
      // 图片展示索引
      showImgIndex: 0,

    };
  },

  computed: {
    // ...mapState("user", ["isLoggedIn",'userInfo']),
    optionsList() {
      // 如果productOptions是一个空数组，就会报错没有list这个属性
      return this.productOptions.length != 0
        ? this.productOptions[this.indexActive1].list
        : [];
    },
    price() {
      return this.productOptions.length != 0
        ? this.productOptions[this.indexActive1].list[this.indexActive2].price
        : "";
    },
    sku_id() {
      return this.productOptions.length != 0
        ? this.productOptions[this.indexActive1].list[this.indexActive2].sku_id
        : "";
    },
  },

  methods: {
    ...mapMutations("user", ["changeTotalCartGoods"]),
    getUserInfo() {
      var userInfo = setStorage("get", "userInfo");
      if (userInfo) {
        this.userInfo = userInfo;
      }
    },
    // 获取商品信息
    getGoodsInfo() {
      var goods_id = this.$route.query.goods_id;
      api.get("goods/detail?goods_id=" + goods_id).then((data) => {
        if (data.meta.status == 200) {
          this.goodsInfo = data.message;
          document.title = data.message.goods_name;
        }
      });
    },
    // joinCart点击加入购物车的回调
    joinCart() {
      if (this.userInfo.isLoggedIn) {
        // // 调用添加购物车接口
        // api.post("/user/addCart",{sku_id:this.sku_id}).then(data=>{
        //   // 更新总商品数量
        //   this.$store.dispatch("cart/CHANGEcartGoodsList");
        //   alert("添加成功！")
        // });

        if (!this.goodsInfo.goods_id) {
          return; // 数据还未回来之前无法点击添加按钮
        }

        let cartOrder = this.userInfo.cartOrder;
        let index = cartOrder.findIndex(
          (v) => v.goods_id == this.goodsInfo.goods_id
        );
        if (index == -1) {
          this.goodsInfo.num = 1;
          cartOrder.push(this.goodsInfo);
        } else {
          cartOrder[index].num += 1;
        }
        this.$message({
          message: '添加成功',
          type: 'success'
        });
        let totalCartGoods = this.userInfo.cartOrder.reduce((total, item) => {
          return total + item.num;
        }, 0);
        this.changeTotalCartGoods(totalCartGoods);

        setStorage("set", "userInfo", this.userInfo);
      } else {
        this.$message({
          message: '请先登录！',
          type: 'warning'
        });
      }
    },
  },
  watch: {},

  components: {
    // "app-header": header
  },
};
</script>

<style scoped lang="scss">
@import url(../css/iconfont/iconfont.css);
@import url(../css/style.css);
@import url(../css/product.css);
</style>