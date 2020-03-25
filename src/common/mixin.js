import { debouce } from "./utils";
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMixin = {
    data() {
        return {
            itemImageListener: null
        }
    },
    mounted() {
        const refresh = debouce(this.$refs.scroll.refresh, 200)
        this.itemImageListener = () => {
            refresh()
        }

        this.$bus.$on('itemImageLoad', this.itemImageListener)
            // console.log('我是混入的内容');

    }
}

export const backTopMixin = {
    components: {
        BackTop
    },
    data() {
        return {
            isShowBackTop: false,
        }
    },
    // methods只会合并函数，函数内部是不可以抽的，生命周期是可以的
    methods: {
        backClick() {
            // 在500ms内滚到位置
            this.$refs.scroll.scrollTo(0, 0, 300)
        },
    }
}