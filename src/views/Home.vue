<template>
  <div class="home">
    <app-header></app-header>
    <div class="hero">
      <div class="container hero-container">
        <!-- 轮播图开始 -->
        <div class="hero-banner">
          <div class="banner-ui">
            <a
              v-for="(carousel, index) in menuCarousel"
              :key="`carsouel_${index}`"
              :class="{ show: index == showIndex }"
            >
              <!-- index等于showIndex时，才有show这个类(让图片显示) -->
              <!-- 所以改变showIndex的值，就会显示不同的图片 -->
              <img :src="carousel.image_src" alt />
            </a>
          </div>
          <div class="banner-control">
            <div class="control-page"></div>
            <div class="control-rl">
              <!-- 点击改变showIndex的值 -->
              <a
                href="javascript:"
                class="rl-prev"
                @click="
                  showIndex == 0
                    ? (showIndex = menuCarousel.length - 1)
                    : showIndex--
                "
                >上一张</a
              >
              <a
                href="javascript:"
                class="rl-next"
                @click="
                  showIndex == menuCarousel.length - 1
                    ? (showIndex = 0)
                    : showIndex++
                "
                >下一张</a
              >
            </div>
          </div>
        </div>
        <!-- 轮播图结束 -->
        <div class="hero-sub clearfix">
          <div class="sub-tool">
            <ul class="clearfix">
              <li>
                <a href="javascript:"> <i class="iconfont icon-app"></i>选购手机 </a>
              </li>
              <li>
                <a href="javascript:"> <i class="iconfont icon-zuanshi"></i>企业团购 </a>
              </li>
              <li>
                <a href="javascript:"> <i class="iconfont icon-navicon-dxtdwh"></i>F码通道 </a>
              </li>
              <li>
                <a href="javascript:"> <i class="iconfont icon-qia301"></i>米粉卡 </a>
              </li>
              <li>
                <a href="javascript:"> <i class="iconfont icon-jiu"></i>以旧换新 </a>
              </li>
              <li>
                <a href="javascript:"> <i class="iconfont icon-shenghuohuafeichongzhi"></i>话费充值 </a>
              </li>
            </ul>
          </div>
          <div class="sub-promo">
            <ul>
              <li class="first">
                <a href="#">
                  <!-- 用vue脚手架搭建的，本质是用webpack -->
                  <!-- 用webpack，写在src中的东西都会经过webpack的编译， -->
                  <!-- 将图片放在public文件夹下，直接用/ -->
                  <img :src="require('../../public/promo1.jpg')" alt />
                </a>
              </li>
              <li>
                <a href="#">
                  <img :src="require('../../public/promo2.jpg')" alt />
                </a>
              </li>
              <li>
                <a href="#">
                  <img :src="require('../../public/promo3.jpg')" alt />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 主体开始 -->
    <div class="main">
      <ul class="container">
        <li v-for="(goodsItem, index) in cidGoodsList" :key="`goods_${index}`">
          <div class="main-hd">
            <h2>{{ goodsItem.name }}</h2>
          </div>
          <div class="main-bd clearfix">
            <div class="bd-ad">
              <ul class="clearfix">
                <li class="jump">
                  <a href="#">
                    <img :src="require('../../public/goodsImg01.webp')" alt />
                  </a>
                </li>
              </ul>
            </div>
            <div class="bd-product clearfix">
              <ul class="clearfix">
                <li
                  class="tpl-body-item jump"
                  v-for="(list, index) in goodsItem.goods"
                  :key="`list_${index}`"
                >
                  <!-- 点击每个商品项，跳转到商品详情页 -->
                  <router-link
                    :to="{ name: 'product', query: { goods_id: list.goods_id } }"
                    target="_blank"
                  >
                    <div class="face">
                      <img
                        :src="
                          list.goods_small_logo
                            ? list.goods_small_logo
                            : 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1602518523965&di=eeba16369df5f92f5410ab1e8d6482da&imgtype=0&src=http%3A%2F%2Fsecretkeycrm.digifilm.com.cn%2Fupload%2F20180530%2Fe676f667c4cdfc7e074898adab2622f2.jpg'
                        "
                        alt
                      />
                    </div>
                    <h3 class="title ellipsis-2">
                      <a href="#">{{ list.goods_name }}</a>
                    </h3>
                    <p class="desc">{{ list.desc }}</p>
                    <p class="price">
                      <span class="num">{{ list.goods_price }}</span
                      >元
                      <!-- <del>
                        <span class="num">{{ list.market_price }}</span
                        >元
                      </del> -->
                    </p>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 主体结束 -->
    <app-footer></app-footer>
  </div>
</template>

<script>
import api from "../utils/api";

export default {
  name: "Home",
  components: {
    // "app-header": header
  },
  created() {

    api.get("/home/swiperdata").then(
      (data) => {
        if (data.meta.status == 200) {
          this.menuCarousel = data.message;
          console.log(data)
        }
      },
      (err) => {}
    );

    // 根据cid数组获取相应的cid商品数据
    this.oneByOne(this.cidList);
    // this.cidList.forEach((item,index)=>{
    //   const url = "/goods/search?cid=" + item.cid;
    //   api.get(url).then(data=>{
    //     var goodsItem={};
    //      goodsItem.name = item.name;
    //      goodsItem.goods = data.message.goods.slice(0, 8);
    //      this.cidGoodsList[index]=goodsItem;
    //      console.log(this.cidGoodsList)
    //   })
    // })

    // document.title = "小米商城";
    // 自动轮播
    // setInterval(this.carousel, 3000);
  },

  data() {
    return {
      menuCarousel: [],
      cidList: [
        { cid: 12, name: "小米电视" },
        // { cid: 5, name: "曲面电视" },
        { cid: 187, name: "荣耀手机" },
        // { cid: 1355, name: "智能手环" },
        // { cid: 486, name: "豆浆机" },
        { cid: 862, name: "衬衫" },
      ],
      cidGoodsList: [],
      menuIndex: [],
      showIndex: 0,
    };
  },

  methods: {
    getInfoByCid(item) {
      const url = "/goods/search?cid=" + item.cid;
      return new Promise((resolved, rejected) => {
        let goodsItem = {};
        api.get(url).then((data) => {
          if (data.meta.status == 200) {
            goodsItem.name = item.name;
            goodsItem.goods = data.message.goods.slice(0, 8);
            resolved(goodsItem);
          }
        },(err)=>{
          rejected(err)
        });
      });
    },

    oneByOne(arr) {
      var i = 0;
      var that = this;
      async function run(arr) {
        if (arr.length == i) return;
        var res=await that.getInfoByCid(arr[i]);
        that.cidGoodsList.push(res)
        i++;
        run(arr);
      }
      run(arr);
    },

    // 轮播方法
    carousel() {
      this.showIndex == this.menuCarousel.length - 1
        ? (this.showIndex = 0)
        : this.showIndex++;
    },
  },
};
</script>

<style lang="scss" scoped>
@import url(../css/iconfont/iconfont.css);
@import url(../css/style.css);
@import url(../css/index.css);
</style>
