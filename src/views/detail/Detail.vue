<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll"> 

      <!-- <ul>
        <li v-for="item in $store.state.cartList" :key="item.item">
          {{item}}
        </li>
      </ul> -->

      <!-- 属性：topImages  传入值：top-images  标签不区分大小写 -->
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goodsInfo"/>
      <detail-shop-info :shop="shopInfo"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-item-params ref="params" :item-params="itemParams"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <!-- <toast :message="message" :show="show"/> -->
  </div>
  
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailItemParams from './childComps/DetailItemParams'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'
  // import Toast from 'components/common/toast/Toast'

  import {getDetail,getRecommend, Goods, Shop, Params} from 'network/detail';
  import {debouce} from "common/utils";
  import {itemListenerMixin, backTopMixin} from "common/mixin";

  import {mapActions} from 'vuex'
 
  
  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailItemParams,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
      // Toast
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goodsInfo: {},
        shopInfo: {},
        detailInfo: {},
        itemParams: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        // message: '',
        // show: false
      }
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 2.1.获取顶部的图片轮播数据
        // console.log(res);
        
        const data = res.result
        this.topImages = data.itemInfo.topImages

        // 2.2.获取商品信息
        this.goodsInfo = new Goods(data.itemInfo, data.columns,data.shopInfo.services)
        
        // 2.3.创建店铺信息的对象
        this.shopInfo = new Shop(data.shopInfo)

        // 2.4.保存商品详情数据
        this.detailInfo = data.detailInfo;

        // 2.5.获取参数信息
        this.itemParams = new Params(data.itemParams.info, data.itemParams.rule)
        
        
        // 2.6.取出评论的信息
        if(data.rate.Crate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
        /*
        // 1.第一次获取，值不对
        // 值不对原因：this.$refs.params.$el 没有渲染
        this.themeTopYs = []
          
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

        console.log(this.themeTopYs);
        
        this.$nextTick(() => {
          // 等DOM渲染完会回调一次这个函数，但是图片依然没有加载完（目前获取到的offsetTop不包括图片）
          // 2.第二次获取，值不对，图片没有计算在内
          this.themeTopYs = []
          
          this.themeTopYs.push(0);
          this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

          console.log(this.themeTopYs);
        })
        */
      }),
       // 3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })
      // 4.给getThemeTopY赋值（对给this.getThemeTopY赋值的操作进行防抖）
      // 防抖：提高性能，不让某一个操作频繁的去做 等一会一起去做 100:delay 延迟时间
      // 防止被回调的函数不会调用很多次
      this.getThemeTopY = debouce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)

        console.log(this.themeTopYs); 
      }, 100)
    },
    mounted() {   
      
      
    },
    dstroyed() {
      this.$bus.$on('itemImageLoad', this.itemImageListener)
    },
    methods: {
      // 映射函数
      // ...mapActions(['addCart']),
      ...mapActions({
        add: 'addCart'
      }),
      imageLoad() {
        this.$refs.scroll.refresh()   
        this.getThemeTopY()   
      },
      titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentScroll(position) {
        // 1.获取y值
        const positionY = -position.y
        // 2.positionY和主题中的值进行对比
        // [0, 7938, 9120, 9452, Number.MAX_VALUE]
        // positionY 在 0 和 7938 之间， index = 0
        // positionY 在 =7938 和 9120 之间， index = 1
        // positionY 在 9120 和 9452 之间， index = 2
        // positionY 在 9120 和 非常大的值之间， index = 3 
        let length = this.themeTopYs.length
        for(let i = 0; i < length-1; i++) {
          // if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) 
          // || (i === length -1 && positionY >= this.themeTopYs[i]))) {
          //   this.currentIndex = i;
            // console.log(i);
            // this.$refs.nav.currentIndex = this.currentIndex
            if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
              this.currentIndex = i;
              this.$refs.nav.currentIndex = this.currentIndex
            }
        }

        // 3.是否显示回到顶部
        this.isShowBackTop = (-position.y) > 1000
      },
      addToCart() {
        // 1.获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages
        product.title = this.goodsInfo.title;
        product.desc = this.goodsInfo.desc;
        product.price = this.goodsInfo.realPrice;
        product.iid = this.iid;

        // 2.将商品添加到购物车
        // 最好不要这样写
        // this.$store.cartlist.push(product)

        // mutations 的调用方法
        // this.$store.commit('addCart', product)

        // actions 的调用方法
        this.$store.dispatch('addCart', product).then(res => {
          // console.log(res); 
          // this.show = true;
          // this.message = res;  
          // setTimeout(() => {
          //   this.show = false;
          //   this.message = ''
          // },1500)    
          this.$toast.show(res, 2000) 
          console.log(this.$toast);
           
        })
        // 1.Actions 可以返回一个Promise 2.mapActions映射关系
        // this.addCart(product).then(res => {
        //   console.log(res);         
        // })

      }
    }
  }
  
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  } 

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
    height: calc(100% - 44px - 49px);
  }
</style>