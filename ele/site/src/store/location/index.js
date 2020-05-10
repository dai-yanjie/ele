const state = {
    // 初始值
    formattedAddress:sessionStorage.formattedAddress || "",
    tips:[]// 查找出来的结果
}
const mutations = {
    CHANGE_ADDRESS(state,address){
        state.formattedAddress = sessionStorage.formattedAddress = address;
    },
    CHANGE_TIPS(state,tips){
        state.tips = tips;
    }
}
const actions = {
    // 获得定位
    getFormattedAddress({commit}){
        if(!sessionStorage.formattedAddress){
            commit("CHANGE_ADDRESS","定位中……");
            AMap.plugin('AMap.Geolocation', function() {
                var geolocation = new AMap.Geolocation({
                    // 是否使用高精度定位，默认：true
                    enableHighAccuracy: true,
                    // 设置定位超时时间，默认：无穷大
                    timeout: 10000
                })

                geolocation.getCurrentPosition();
                AMap.event.addListener(geolocation, 'complete', onComplete)
                AMap.event.addListener(geolocation, 'error', onError)

                function onComplete (data) {
                    // data是具体的定位信息
                   console.log(this,data);
                    commit("CHANGE_ADDRESS",data.formattedAddress);
                    // _this.formattedAddress = data.formattedAddress;
                }

                function onError (data) {
                    // 定位出错
                }
            })
        }

    },
    autocomplete({commit},keyword){
        AMap.plugin('AMap.Autocomplete', function(){
            // 实例化Autocomplete
            var autoOptions = {
                //city 限定城市，默认全国
                city: '全国'
            }
            var autoComplete= (keyword, function(status, result) {
                // 搜索成功new AMap.Autocomplete(autoOptions);
                //             autoComplete.search时，result即是对应的匹配数据
                console.log(result.tips);
                commit("CHANGE_TIPS",result.tips)
            })
        })
    }
}
export default {
    state,
    mutations,
    actions
}