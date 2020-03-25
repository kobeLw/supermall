import {
    ADD_COUNTER,
    ADD_TO_CART
} from './mutation-types'

export default {
    // mutations 是 state, actions 是 context
    addCart(context, payload) {
        // payload:新添加的商品
        // let oldProduct = null;
        // for(let item of state.cartList) {
        //   if(item.id === payload.iid) {
        //     oldProduct = item
        //   }
        // }
        return new Promise((resolve, reject) => {
            // 1.查找之前数组中是否有该商品
            // let product = state.cartList.find(function(item) {
            //   return item.iid === payload.iid
            // })
            let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

            // 2.判断oldPrduct
            if (oldProduct) {
                // 隐藏不可以跟踪
                // oldProduct.count += 1
                context.commit(ADD_COUNTER, oldProduct)
                resolve('当前的商品数量+1')
            } else {
                payload.count = 1
                    // context.state.cartList.push(payload)
                context.commit(ADD_TO_CART, payload)
                resolve('添加了新的商品')
            }
        })

    }
}