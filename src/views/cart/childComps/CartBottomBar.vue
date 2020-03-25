<template>
  <div class="bottom-bar">
    <div class="checkAll">
      <check-button :is-checked="isSelectAll" 
                     class="check-button"
                     @click.native="checkClick"/>
      <span>全选</span>
    </div>

    <div class="total-price">
      合计: {{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      结算({{checkLength}})
    </div>
  </div>
  
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton'
  import {mapGetters} from 'vuex'
  export default {
    name: "CartBottomBar",
    components: {
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice() {
        return '￥' + this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count
        }, 0).toFixed(2)
      },
      checkLength() {
        return this.cartList.filter(item => item.checked).length
      },
      isSelectAll() {   
        if(this.cartList.length === 0) return false
        
        // 1.使用filter
        // return !(this.cartList.filter(item => !item.checked).length)
        
        // 2.使用find函数
        return !this.cartList.find(item => !item.checked)

        // 3.普通遍历
        // for(let item of this.cartList) {
        //   if(!item.checked) {
        //     return false
        //   }
        // }
        // return true
      }
    },
    methods: {
      checkClick() {
        if(this.isSelectAll) {  //全部选中
          this.cartList.forEach(item => item.checked = false)
        } else {  //部分或全部不选中
          this.cartList.forEach(item => item.checked = true)
        }
      },
      calcClick() {
        if(!this.isSelectAll) {
          this.$toast.show('请选择购买的商品', 2000)  
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    position: relative;
    display: flex;
    height: 40px;
    line-height: 40px;
    background-color: #eee;   
    font-size: 14px;
  }

  .checkAll {
    width: 60px;
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }

  .total-price {
    margin-left: 20px;
    flex: 1;
  }

  .calculate {
    width: 90px;
    color: #fff;
    background-color: orange;
    text-align: center;
  }
</style>