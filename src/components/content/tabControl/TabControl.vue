<template>
  <div class="tab-control">
    <div v-for="(item,index) in titles" :item="item" :key="index" 
      class="tab-control-item" 
      :class="{active: index === currentIndex}" 
      @click="itemClick(index)">
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TabControl",
    props: {
      titles: {
        type: Array,
        default() {
          return []
        }
      }
    },
    // 记录当前谁被选中
    data() {
      return {
        currentIndex: 0
      }
    },
    methods: {
      itemClick(index) {
        this.currentIndex = index;
        // 子传父内部往外部传出数据
        this.$emit('tabClick', index)
      }
    }
  }
</script>

<style>
  .tab-control {
    display: flex;
    text-align: center;
    font-size: 16px; 
    width: 100%;
    height: 40px;
    line-height: 40px;
  }

  .tab-control-item {
    flex: 1;
  }

  .tab-control-item span {
    padding: 5px;
  }

  .active {
    color: var(--color-high-text);    
  }
  .active span {
    border-bottom: 3px solid var(--color-tint);
  }
</style>