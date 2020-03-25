import { request } from './request'

// 获取首页的多个数据
export function getHomeMultidata() {
    // 函数return 把 函数request的返回值 返回了 函数request的返回值时promise
    return request({
        url: '/home/multidata'
    })
}

export function getHomeGoods(type, page) {
    return request({
        url: '/home/data',
        params: {
            type,
            page
        }
    })
}

// 函数调用 -> 压入函数栈（保存函数调用过程中所有变量）
// 函数调用结束 -> 弹出函数栈（释放函数所有的变量）
// function test() {
//   const names = ['why','aaa']
// }
// test()

// test() 重新调用会重新创建