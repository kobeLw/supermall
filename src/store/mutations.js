import {
    ADD_COUNTER,
    ADD_TO_CART
} from './mutation-types'

export default {
    [ADD_COUNTER](state, payload) {
        // 操作可以跟踪
        payload.count++
    },
    [ADD_TO_CART](state, payload) {
        payload.checked = true
        state.cartList.push(payload)
    }
}