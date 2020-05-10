const express = require('express');
const bodyParser = require('body-parser');
const db = require('./module/db');
const md5 = require('md5');
const tools = require('./module/tools')
const upPic = require('./module/upPic')
const fs = require('fs')
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const {
    json,
    encode
} = require('./module/tools');
const app = express();
app.use(bodyParser.json());
// 将upload设置为静态资源
app.use(express.static(__dirname + "/upload"))
// 登陆
app.post('/login', async (req, res) => {
    try {
        // 接收前端发送过来的管理员账号密码
        const {
            adminName,
            passWord
        } = req.body
        const info = await db.findOne('adminList', {
            adminName,
            /*防止用户设置的密码过于简单，对密码进行了md5加密*/
            passWord: md5(passWord + 'ele.com')
        })
        // 不管登陆还是成功都记录下来(登陆日志)
        await db.insertOne('adminLog', {
            adminName,
            logType: (info ? 1 : 2),
            detail: '登陆信息:' + (info ? "成功" : "失败"),
            addTime: Date.now()
        })
        if (info) {
            // 登陆成功后更新管理员最后登陆的时间
            await db.updateOne('adminList', {
                _id: info._id
            }, {
                $set: {
                    loginTime: Date.now()
                }
            })
            // 向前端接口返回数据
            res.json({
                ok: 1,
                mag: '登陆成功',
                // 登陆成功后将令牌传给前端
                token: encode(adminName)
            })
        } else {
            json(res, -1, '账号密码错误')
        }
    } catch (e) {
        json(res)
    }
});
/*对以下所有的接口都进行了token的判断*/
app.all("*", (req, res, next) => {
    const token = req.headers.authorization
    // 解析token
    const {ok, msg, info} = tools.decode(token)
    // console.log(info)
    if (ok === 3) next();
    else {
        tools.json(res, 2, msg)
    }
})
// 管理员日志数据接口
app.get('/adminLog', async (req, res) => {
    let pageIndex = req.query.pageIndex / 1;
    const response = await db.page('adminLog', {
        sort: {
            addTime: -1
        },
        limit: 10,
        pageIndex
    })
    res.json(response)
})
// 删除数据adminLog的数据
app.delete('/adminLog', async (req, res) => {
    let id = req.query.id;
    // console.log(req.query)
    const info = await db.deleteOneById('adminLog', id)
    // console.log(info)
    if (info) {
        res.json({
            ok: 1,
            msg: '删除数据成功'
        })
    } else {
        json(res)
    }
})
// 获取管理员列表数据
app.get('/adminList', async (req, res) => {
    let pageIndex = req.query.pageIndex / 1;
    const response = await db.page('adminList', {
        sort: {
            loginTime: -1
        },
        limit: 1,
        pageIndex
    })
    res.json(response)
})
// 修改管理员数据接口
app.put('/adminList/:id/:adminName/:passWord', async (req, res) => {
    let passWord = md5(req.params.passWord + 'ele.com')
    const id = req.params.id
    const adminName = req.params.adminName
    const data = await db.upDateOneById('adminList', id, {
        $set: {
            adminName,
            passWord
        }
    })
})
// 删除管理员数据接口
app.delete('/adminList', async (req, res) => {
    let id = req.query.id;
    // console.log(req.query)
    const info = await db.deleteOneById('adminList', id)
    // console.log(info)
    if (info) {
        res.json({
            ok: 1,
            msg: '删除数据成功'
        })
    } else {
        json(res)
    }
})
/*************************************店铺类别*********************************************************/
// 添加店铺类别接口
app.post('/shopTypeList', (req, res) => {
    upPic(req, 'shopTypePic', async function ({ok, msg, params}) {
        if (ok === 1) {
            await db.insertOne('shopTypeList', {
                shopTypeName: params.shopTypeName,
                shopTypePic: params.newPicName,
                addTime: Date.now()
            })
            res.json({
                ok: 1,
                msg: '上传成功'
            })
        } else {
            tools.json(res)
        }
    })
})
// 获取店铺类别数据的接口
app.get('/shopTypeList', async (req, res) => {
    let pageIndex = req.query.pageIndex / 1;
    let keyWord = req.query.keyWord
    const whereObj = {}
    if (keyWord.length)
        whereObj.shopTypeName = new RegExp(keyWord)
    const response = await db.page('shopTypeList', {
        sort: {
            addTime: -1
        },
        whereObj,
        limit: 5,
        pageIndex
    })
    res.json(response)
})
// 删除店铺类别接口
app.delete('/shopTypeList', async (req, res) => {
    let id = req.query.id;
    // console.log(req.query)
    const info = await db.deleteOneById('shopTypeList', id)
    // console.log(info)
    if (info) {
        res.json({
            ok: 1,
            msg: '删除数据成功'
        })
    } else {
        json(res)
    }
})
/*获得所有店铺类别信息的接口*/
app.get('/AllShopType', async (req, res) => {
    const AllTypeList = await db.find('shopTypeList', {
        sort: {
            addTime: -1
        }
    })
    res.json({
        ok: 1,
        AllTypeList
    })
})
/*修改店铺类别的接口*/
app.put('/shopTypeList', async (req, res) => {
    upPic(req, 'shopTypePic', async function ({ok, msg, params}) {
        /*console.log(params)*/
        if (ok === 3) {
            tools.json(res, -1, msg)
        } else {
            let upObj = {
                $set: {
                    shopTypeName: params.shopTypeName
                }
            }
            /*当ok为1时 证明修改了图片*/
            if (ok === 1) {
                upObj.$set.shopTypePic = params.newPicName
                /*当传了新的图片时 删除之前的图片*/
                const result = await db.findOneByid('shopTypeList', params.shopTypeId)

                /*console.log(result)*/
                fs.unlink(__dirname + "/upload/" + result.shopTypePic, async function () {
                    const data = await db.upDateOneById('shopTypeList', params.shopTypeId, upObj)
                    /*    console.log(data)*/
                    tools.json(res, 1, '修改数据成功')
                })
            } else {
                const data = await db.upDateOneById('shopTypeList', params.shopTypeId, upObj)
                tools.json(res, 1, '修改数据成功')
            }

        }
    })
})
/**************************************店铺****************************************/
/*添加店铺的接口*/
app.post('/shopList', (req, res) => {
    upPic(req, 'shopPic', async function ({ok, msg, params}) {
        if (ok === 1) {
            const shopTypeInfo = await db.findOneByid("shopTypeList", params.shopTypeId);
            await db.insertOne('shopList', {
                shopName: params.shopName,
                shopPic: params.newPicName,
                /*将店铺类别的唯一标识保存下来，为多表联动做准备*/
                shopTypeName: shopTypeInfo.shopTypeName,
                shopTypeId: shopTypeInfo._id,
                addTime: Date.now()
            })
            res.json({
                ok: 1,
                msg: '上传成功'
            })
        } else {
            tools.json(res)
        }
    })
})
/*获取店铺的接口*/
app.get('/shopList', async (req, res) => {
    let pageIndex = req.query.pageIndex / 1;
    let keyWord = req.query.keyWord
    const whereObj = {}
    if (keyWord.length)
        whereObj.shopName = new RegExp(keyWord)
    const response = await db.page('shopList', {
        sort: {
            addTime: -1
        },
        whereObj,
        limit: 2,
        pageIndex
    })
    res.json(response)
})
/*删除店铺的接口*/
app.delete('/shopList', async (req, res) => {
    let id = req.query.id;
    // console.log(req.query)
    const info = await db.deleteOneById('shopList', id)
    // console.log(info)
    if (info) {
        res.json({
            ok: 1,
            msg: '删除数据成功'
        })
    } else {
        json(res)
    }
})
/*修改店铺的接口*/
app.put('/shopList', async (req, res) => {
    /*
    {
  shopName: '垃圾',
  shopTypeId: '5e8ca48b875a120d0c11cacd',
  shopId: '5e8e06b66ea659174c9ad1cb',
  shopTypeName: '尼玛',
  newPicName: '1586439630389.jpg'
}
*/
    upPic(req, 'shopPic', async function ({ok, msg, params}) {
        /*    console.log(params)*/
        if (ok === 3) {
            tools.json(res, -1, msg)
        } else {
            let upObj = {
                $set: {
                    shopName: params.shopName,
                    shopTypeId: ObjectId(params.shopTypeId)
                }
            }
            const result = await db.findOneByid('shopTypeList', params.shopTypeId)
            upObj.$set.shopTypeName = result.shopTypeName
            /*当ok为1时 证明修改了图片*/
            if (ok === 1) {
                upObj.$set.shopPic = params.newPicName
                /*当传了新的图片时 删除之前的图片*/
                const result = await db.findOneByid('shopList', params.shopId)

                /*  console.log(result)*/
                fs.unlink(__dirname + "/upload/" + result.shopTypePic, async function () {
                    const data = await db.upDateOneById('shopList', params.shopId, upObj)
                    /*    console.log(data)*/
                    tools.json(res, 1, '修改数据成功')
                })
            } else {
                const data = await db.upDateOneById('shopTypeList', params.shopId, upObj)
                tools.json(res, 1, '修改数据成功')
            }

        }
    })
})
/*根据店铺类别id获取对应的店铺数据*/
app.get("/getshopList", async (req, res) => {
    const shopTypeId = req.query.shopTypeId
    const shopListByTypeId = await db.find('shopList', {
        whereObj: {
            shopTypeId: ObjectId(shopTypeId)
        }
    })
    res.json({
        ok: 1,
        shopListByTypeId
    })
})
/******************************************商品类别************************************************/
/*添加商品类别信息*/
app.post('/goodsTypeList', async (req, res) => {
    const shopInfo = await db.findOneByid('shopList', req.body.shopId)
    const data = db.insertOne('goodsTypeList', {
        goodsTypeName: req.body.goodsTypeName,
        shopId: shopInfo._id,
        shopName: shopInfo.shopName,
        shopTypeId: shopInfo.shopTypeId,
        shopTypeName: shopInfo.shopTypeName,
        addTime: Date.now()
    })
    res.json({
        ok: 1,
        msg: '插入数据成功'
    })
})
//获取商品类别的接口
app.get('/goodsTypeList', async (req, res) => {
    let pageIndex = req.query.pageIndex / 1;
    let keyWord = req.query.keyWord
    const whereObj = {}
    if (keyWord.length)
        whereObj.goodsTypeName = new RegExp(keyWord)
    const response = await db.page('goodsTypeList', {
        sort: {
            addTime: -1
        },
        whereObj,
        limit: 3,
        pageIndex
    })
    res.json(response)
})
/*删除商品类别的接口*/
app.delete('/goodsTypeList', async (req, res) => {
    let id = req.query.id;
    /*console.log(id)*/
    const info = await db.deleteOneById('goodsTypeList', id)
    // console.log(info)
    if (info) {
        res.json({
            ok: 1,
            msg: '删除数据成功'
        })
    } else {
        json(res)
    }
})
/*修改商品类别的接口*/
app.put('/goodsTypeList/:data', async (req, res) => {
    /*goodsTypeInfo 是前端传过来的信息*/
    const goodsTypeInfo = JSON.parse(req.params.data)
    /* console.log(goodsTypeInfo)*/
    /*根据店铺id获取店铺信息*/
    const shopInfo = await db.findOneByid('shopList', goodsTypeInfo.shopId)
    /*console.log(shopInfo)*/
    const upObj = {
        $set: {
            shopTypeId: shopInfo.shopTypeId,
            shopId: shopInfo._id,
            shopName: shopInfo.shopName,
            shopTypeName: shopInfo.shopTypeName,
            goodsTypeName: goodsTypeInfo.goodsTypeName
        }
    }
    const data = await db.upDateOneById('goodsTypeList', goodsTypeInfo.goodsId, upObj)
    res.json({
        ok: 1,
        msg: '更新成功'
    })
})
/******************************************商品列表***************************************************/
app.get('/getGoodsTypeList', async (req, res) => {
    const {shopTypeId, shopId} = req.query
    const goodsByshopIdList = await db.find('goodsTypeList', {
        whereObj: {
            shopTypeId: ObjectId(shopTypeId),
            shopId: ObjectId(shopId)
        }
    })
    res.json({
        ok: 1,
        goodsByshopIdList
    })
})
/*添加商品数据的接口*/
app.post('/goodsList', async (req, res) => {
    console.log(req.body)
    const {shopTypeId, shopId, goodsTypeId, goodsName} = req.body
    const goodsTypeList = await db.findOneByid('goodsTypeList', goodsTypeId)
    console.log(goodsTypeList)
    const data = await db.insertOne('goodsList', {
        goodsName: goodsName,
        shopTypeName: goodsTypeList.shopTypeName,
        shopTypeId: goodsTypeList.shopTypeId,
        shopName: goodsTypeList.shopName,
        shopId: goodsTypeList.shopId,
        goodsTypeId: goodsTypeList._id,
        goodsTypeName: goodsTypeList.goodsTypeName,
        addTime: Date.now()
    })
    res.json({
        ok: 1,
        msg: '插入数据成功'
    })
})
/*获取商品数据的接口*/
app.get('/goodsList', async (req, res) => {
    let pageIndex = req.query.pageIndex / 1;
    let keyWord = req.query.keyWord
    const whereObj = {}
    if (keyWord.length)
        whereObj.goodsName = new RegExp(keyWord)
    const response = await db.page('goodsList', {
        sort: {
            addTime: -1
        },
        whereObj,
        limit: 2,
        pageIndex
    })
    res.json(response)
})
/*删除商品数据的接口*/
app.delete('/goodsList', async (req, res) => {
    let id = req.query.id;
    const info = await db.deleteOneById('goodsList', id)
    if (info) {
        res.json({
            ok: 1,
            msg: '删除数据成功'
        })
    } else {
        json(res)
    }
})
/*修改商品数据的接口*/
app.put('/goodsList/:data', async (req, res) => {
    /*goodsTypeInfo 是前端传过来的信息*/
    const goodsInfo = JSON.parse(req.params.data)
    console.log(goodsInfo)
    /*根据商品类别信息获取商品类别信息*/
    const goodsTypeInfo = await db.findOneByid('goodsTypeList', goodsInfo.goodsTypeId)
    const upObj = {
        $set: {
            goodsName: goodsInfo.goodsName,
            goodsTypeName: goodsTypeInfo.goodsTypeName,
            goodsTypeId: goodsTypeInfo._id,
            shopTypeName: goodsTypeInfo.shopTypeName,
            shopTypeId: goodsTypeInfo.shopTypeId,
            shopName: goodsTypeInfo.shopName,
            shopId: goodsTypeInfo.shopId
        }
    }
    const data = await db.upDateOneById('goodsList', goodsInfo.goodsId, upObj)
    res.json({
        ok: 1,
        msg: '更新成功'
    })
})
app.listen(8082, function () {
    console.log("success");
})