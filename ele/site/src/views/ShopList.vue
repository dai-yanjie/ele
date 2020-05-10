<template>
    <div>
    <EleHeader><h1 class="header-title">店铺类别信息</h1></EleHeader>
        <ul>
            <li v-for=" item in shopInfo" :key="shopInfo._id"@click="$router.push('/shopDetail/'+item._id+'.html')">
                <div>商品类别名称：{{item.shopTypeName}}</div>
                <div>商品名称：{{item.shopName}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
    import MintUI from 'mint-ui'
    import 'mint-ui/lib/style.css'
    import Vue from 'vue'
    Vue.use(MintUI);
    import { Toast } from 'mint-ui';
    import axios from 'axios'
    import EleHeader from "../components/common/EleHeader";
    export default {
        name: "",
        components: {EleHeader},
        data(){
            return{
                shopInfo:[]
            }
        },
        async mounted() {
            const {shopInfo} = await axios.get('/shopInfo',{
                params:{
                    shopTypeId:this.$route.query.shopTypeId
                }
            })
            if(!shopInfo.length){
                Toast({
                    message: '没有找到对应的店铺信息',
                    iconClass: 'iconfont iconSSS'
                });
            }else {
                this.shopInfo=shopInfo
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