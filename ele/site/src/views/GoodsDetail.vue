<template>
    <div>
        <header class="header">
            <!-- 左侧返回按钮 -->
            <div class="header-button is-left">
                <i class="iconfont iconfanhui"></i>
                <button @click="$router.go(-1)">返回</button>
            </div>
            <h1 class="header-title" >商品详情</h1>
            <div class="header-button is-right">
                <button @click="$router.push('/')">回到首页</button>
                <i class="iconfont iconfanhui"></i>
            </div>
            <!--        <h1 class="header-title">请选择收货地址</h1>-->
        </header>
        <ul>
            <!--刷新时数据会丢失-->
            <li v-for=" item in goodsInfo" :key="goodsInfo._id">
                <div>商品类别名称：{{item.goodsTypeName}}</div>
                <div>商品名称：{{item.goodsName}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
    import axios from 'axios'
    import MintUI from 'mint-ui'
    import 'mint-ui/lib/style.css'
    import Vue from 'vue'
    Vue.use(MintUI);
    import { Toast } from 'mint-ui';
    export default {
        name: "",
        data(){
            return{
                goodsInfo:[]
            }
        },
       async mounted() {
            console.log(this.$route.params.goodsId)
          const {goodsInfo} = await axios.get('/goodsInfo',{
                params:{
                    goodsId:this.$route.params.goodsId
                }
            })
           console.log(goodsInfo)
           if (!goodsInfo.length){
               Toast({
                   message: '没有找到对应的商品信息',
                   iconClass: 'iconfont iconSSS'
               });
           }else {
               this.goodsInfo = goodsInfo
           }
        }
    }
</script>

<style scoped>
    *{
        margin: 0;
        padding: 0;
    }
    ul{
        width: 100%;
        margin-top: 45px;
    }
    li{
        height: 45px;
        display: flex;
        justify-content: space-around;
        border: 1px solid #8c8c8c;
        font-size: 12px;
        line-height: 45px;
        margin-top: 5px;
    }
    /****************头部*******************************************/
    .header {
        align-items: center;
        background-color: #009eef;
        box-sizing: border-box;
        color: #fff;
        display: flex;
        font-size: 16px;
        height: 45px;
        line-height: 1;
        padding: 0 10px;
        position: relative;
        text-align: center;
        white-space: nowrap;
        position: fixed;
        width: 100%;
        top: 0;
        z-index: 99;
    }

    .header-button button {
        background-color: transparent;
        border: 0;
        box-shadow: none;
        color: inherit;
        display: inline-block;
        padding: 0;
        font-size: inherit;
        outline: none;
    }
    .header-title {
        flex: 1;
    }
    .is-left {
        text-align: left;
    }
    .is-right {
        text-align: right;
    }
</style>