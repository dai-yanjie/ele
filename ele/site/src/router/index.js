import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        // 有地址导航的，都作为该路由的子路由
        name: "index",
        path: "/",
        component: () => import("@/views/Index"),
        children: [
            {
                path: "/",
                name: "home",
                component: () => import("@/views/Home")
            }, {
                path:"/order",
                name:"order",
                component:()=>import("@/views/Order"),
                meta:{
                    // 当该值为true时，验证你是否登陆。
                    isAuthorization:true
                }
            }, {
                path:"/my",
                name:"my",
                component:()=>import("@/views/My"),
                meta:{
                    // 当该值为true时，验证你是否登陆。
                    isAuthorization:true
                }
            }
        ]
    },{
        path:"/login",
        name:"login",
        component:()=>import("@/views/Login")
    },
    {
        path: '/address',
        name: 'adress',
        component:()=>import('@/views/Address')

    },
    {
        path:'*',
        name: 'error',
        component:()=>import('@/views/Error')
    },
    {
        path: "/search",
        name: 'search',
        component:()=>import('@/views/Search')
    },
    {
        path:"/shopDetail/:shopId.html",
        name:"shopDetail",
        component:()=>import("@/views/ShopDetail")
    },
    {
        path:"/goodsTypeDetail",
        name: 'goodsTypeDetail',
        component:()=>import('@/views/GoodsTypeDetail')
    },
    {
        path: '/goodsDetail',
        name: 'goodsDetail',
        component:()=>import('@/views/GoodsDetail')
    },
    {
        path: '/shopList',
        name: 'shopList',
        component:()=>import('@/views/ShopList')
    }

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
router.beforeEach((to,from,next)=>{
    console.log()
    if(to.meta.isAuthorization){
        if(sessionStorage.token){
            next()
        }else {
            next('/login')
        }

    }
    next()
})
export default router
