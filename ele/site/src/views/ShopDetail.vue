<template>
    <div>
        <EleHeader><h1 class="header-title" >店铺详情的详情</h1></EleHeader>
        <section class="index-container">
            <!--刷新时数据不会丢失-->
            <div class="index-shopInfo" @click="$router.push({path:'/goodsTypeDetail',query:{id:shopInfo._id}})">
                <div class="logo_container">
                    <img :src="'/ele/'+shopInfo.shopPic" v-if="shopInfo.shopPic">
                </div>
                <div class="index_main">
                    <div class="index_shopname">
                        <span>店铺名称：{{shopInfo.shopName}}</span>
                        <span style="margin-left: 10px;">店铺类别名称：{{shopInfo.shopTypeName}}</span>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "ShopDetail",
        data(){
            return {
                shopInfo:{},
                goodsTypeInfo:{}
            }
        },
      async mounted(){
            const {shopInfo} = await axios.get("/shopInfo/"+this.$route.params.shopId);
            this.shopInfo = shopInfo;
        }
    }
</script>

<style scoped>
    /* 商家列表 */
    .index-container {
        background: #fff;
        color: #666;
        padding: 4vw 0;
        border-bottom: 0.133333vw solid #eee;
        margin-top: 45px;
    }
    .index-shopInfo {
        display: flex;
        justify-content: flex-start;
        padding: 0 2.666667vw;
        align-items: stretch;
    }
    .logo_container {
        width: 17.333333vw;
        height: 17.333333vw;
    }
    .logo_container img {
        display: block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border: 0.133333vw solid rgba(0, 0, 0, 0.08);
        border-radius: 0.533333vw;
    }
    .index_main {
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        flex-direction: column;
        padding-left: 2.666667vw;
        font-size: 0.2rem;
        flex-grow: 1;
    }
    .index_shopname {
        align-items: center;
        color: #333;
        font-weight: 700;
        font-size: 0.9rem;
    }
    .index_shopname i {
        background: #ffe800;
        margin-right: 1.333333vw;
        padding: 0.266667vw 0.666667vw;
        text-align: center;
        white-space: nowrap;
        font-size: 0.6rem;
    }
    .index_shopname span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .index-rateWrap {
        display: flex;
        align-items: center;
        overflow: hidden;
        justify-content: space-between;
    }

    .index-rateWrap .rate {
        margin-right: 1.066667vw;
    }
    .index-moneylimit {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .index-moneylimit .index-distanceWrap {
        color: #999;
    }
    .delivery {
        display: flex;
        align-items: center;
        font-size: 0.6rem;
        margin-left: 1.066667vw;
    }
    .delivery .icon-hollow {
        color: #fff;
        background-color: #2395ff;
        padding: 2px;
        box-sizing: border-box;
    }
</style>