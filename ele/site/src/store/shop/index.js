import axios from "axios";
import { Toast } from 'mint-ui';
export default {
    state:{
        searchShopList:[],// 根据店铺名字搜索的店铺列表
    },
    mutations:{
        CHANGE_SEARCH_SHOP_LIST(state,shopList){
            state.searchShopList = shopList;
        }
    },
    actions:{
        async search({commit},keyword){
            if(keyword.length>0){
                const {shopList} = await axios.get("/shopList",{
                    params:{
                        keyword
                    }
                })
                commit("CHANGE_SEARCH_SHOP_LIST",shopList)
            }else{
                Toast({
                    message: '请输入店铺',
                    iconClass: 'iconfont iconSSS'
                });
            }

        }
    }
}