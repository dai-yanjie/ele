// 引入令牌插件
const jwt = require('jwt-simple');
const Key = '(8$%)(A)D)A'
module.exports = {
    getNowTime() {
        var date = new Date();
        return date.getFullYear() + "-" +
            ((date.getMonth() + 1)).toString().padStart(2, 0) + "-" +
            (date.getDate()).toString().padStart(2, 0) + " " +
            (date.getHours()).toString().padStart(2, 0) + ":" +
            (date.getMinutes()).toString().padStart(2, 0) + ":" +
            (date.getSeconds()).toString().padStart(2, 0);
    },
    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);

    }
    ,
    json(res, ok = -1, msg = "网络连接错误") {
        res.json({
            ok,
            msg
        })
    },
    // 创建token
    encode(payload) {
        return jwt.encode({
            ...payload,
            ...{
                createTime: Date.now()
            }
        }, Key);
    },
    // 解析tken
    decode(token) {
        try {
            const info = jwt.decode(token, Key);
            // 设置token一个小时后过期
            const times = 60 * 60 * 1000;
            if (Date.now() - info.createTime > times) {
                return {
                    ok: 2,
                    msg: 'token过期了'
                }
            } else {
                return {
                    ok: 3,
                    msg: 'token正常',
                    info
                }
            }
        } catch (e) {
            return {
                ok: 1,
                msg: 'token解析失败'
            }
        }
    },
    changeArr(arr,ten=10){
        const arr2=[]
        for (let i=0;i<arr.length;i+=ten){
            arr2.push(arr.slice(i,i+ten))
        }
        return arr2

    }


}