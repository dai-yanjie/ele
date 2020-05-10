<template>
    <div>
        <EleHeader><h1 class="header-title" >商品类别详情</h1></EleHeader>
        <ul>
            <!--刷新时数据会丢失-->
            <li v-for=" item in goodsTypeInfo" :key="goodsTypeInfo._id" @click="$router.push({name:'goodsDetail',params:{goodsId:item._id}})">
                <div>店铺类别：{{item.shopTypeName}}</div>
                <div>商品类别：{{item.goodsTypeName}}</div>
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
        name: "GoodsTypeDetail",
        data(){
            return{
                goodsTypeInfo:[]
            }
        },
       async mounted() {
         const {goodsTypeInfo} = await  axios.get('/goodsTypeInfo',{
                params:{
                    shpeId:this.$route.query.id
                }
            })
           if (!goodsTypeInfo.length){
               Toast({
                   message: '没有找到对应的商品类别信息',
                   iconClass: 'iconfont iconSSS'
               });
           }else {
               this.goodsTypeInfo=goodsTypeInfo
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
</style>