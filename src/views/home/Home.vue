<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    
    <!-- Scroll.vue 中 props 是以驼峰命名，这里就以 - 分割，@scroll: 接收事件 -->
    
    <tab-control :titles="['流行','新款','精选']" 
                 @tabClick="tabClick" 
                 ref="tabControl1"
                 class="tab-control" v-show="isTabFixed"/>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll" 
            :pull-up-load="true"
            @pullingUp="loadMore">
      
      <home-swiper :banners= "banners" @swiperImageLoad="swiperImageLoad"/> 
      <recommend-view :recommends= "recommends"/>
      <feature-view/> 
      <tab-control :titles="['流行','新款','精选']" 
                   @tabClick="tabClick" 
                   ref="tabControl2"/>
      <good-list :goods="showGoods"/>
    </scroll>
    <!-- 在需要监听一个组件的原生事件时，必须给对应的事件加上 .native 修饰符 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  // 导入的文件按空格区分清楚，方便查找
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'

  // 如果没有用default导出，就必须用大括号导入，注册组件的顺序最好也保持一致
  import {getHomeMultidata, getHomeGoods} from "network/home"
  import {debouce} from "common/utils"
  import {itemListenerMixin, backTopMixin} from "common/mixin"
  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodList,
      Scroll
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    destroyed() {

    },
    activated() {
      this.$refs.scroll.scrollTo(0, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // 1.保存Y值
      this.saveY = this.$refs.scroll.getScrollY()

      // 2.取消全局事件的监听
      this.$bus.$off('itemImageLoad', this.itemImageListener)
    },
    // 组件一但创建好就需要发送网络请求，所以要实现一个生命周期函数
    // this在箭头函数中是往上找作用域，create中有this，create中的this就是当前的组件对象，所以箭头函数中找到的this就是create中的this

    created() {
      // 1.请求多个数据
      this.getHomeMultidata()

      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')    
      
    },
    mounted() {      
      // 1.图片加载完成的事件监听
      // 这个地方img标签确实被挂载，但是其中的图片还没有占据高度

      // this.$refs.scroll.refresh对这个函数进行防抖操作
      // const refresh = debouce(this.$refs.scroll.refresh, 200)
      
      // 对监听的事件进行保存
      // this.itemImageListener = () => {
      //   refresh()
      // }
      // this.$bus.$on('itemIamgeLoad', this.itemImageListener)
      

      // 2.获取tabControl的offsetTop
      // 所有组件都有一个属性$el: 用于获取组件中的元素
      // this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
      
      
    },
    methods: {
      /**
       * 事件监听相关的方法
       */
      
      tabClick(index) {
        switch(index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }        
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },  
      loadMore() {
        this.getHomeGoods(this.currentType)
      },   
      contentScroll(position) {
        // 1.判断BackTop是否显示
        this.isShowBackTop = (-position.y) > this.tabOffsetTop

        // 2.决定tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },     
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },

        // 只能加载一部分数据的原因：图片属于硬加载，在计算高度的时候图片还未加载出来，只有文字的高度，
        // 等图片加载出来后，高度改变，所以出现bug，所以需要在所有图片完成后再刷新一次
        
      

      /**
       * 网络请求相关的方法
       */      
      getHomeMultidata() {
        getHomeMultidata().then(res => {
        // this.result = res;
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
         
          
        })
      },

      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)  
          this.goods[type].page += 1  

          // 完成上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
  


</script>

<style scoped>
  #home {
    height: 100vh;
    /* padding-top: 44px; */
    position: relative;
  }
  .home-nav {
    background-color: pink;
    color: #fff;
    
    /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动 */
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }

  .content {
    /* height: 300px; */
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    background-color: #fff;
    z-index: 9;
  }


  /* .content {
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 51px;
  } */
</style>