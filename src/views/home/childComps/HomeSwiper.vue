<template>
  <div>
    <swiper>
      <swiper-item v-for="item in banners" :key="item.item">
        <!-- 用变量中的某个属性必须加冒号，直接用字符串不用加 -->
        <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad">
        </a>
      </swiper-item>
    </swiper>
  </div>
  
</template>

<script>

import {Swiper,SwiperItem} from 'components/common/swiper'

export default {
  name :"HomeSwiper",
  props: {
    banners: {
      type: Array,
      // 给的默认值必须是函数类型
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isLoad: false
    }
  },
  components: {
    Swiper,
    SwiperItem
  },
  methods: {
    imageLoad() {
      if (!this.isLoad)
      this.$emit('swiperImageLoad')
      this.isLoad = true
    }
  }
}
</script>

<style>
  .swiper-item {
    width: 100%;
  }
</style>




