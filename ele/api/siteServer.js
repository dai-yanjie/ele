const express = require('express');
const bodyParser = require('body-parser');
const db = require('./module/db');
const tools = require('./module/tools');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const app = express();
app.use(bodyParser.json());
/*设置静态资源*/
app.use(express.static(__dirname + '/upload'));
/*发送验证码*/
app.post('/sendCode', async (req, res) => {
    const {phoneCode} = req.body
    /*
    *  1、userCodeList短信集合
    _id:唯一标识
    code:验证码
    phoneCode:手机号
    sendTime:发送时间
*/
    /*查询userList列表中书否有注册的手机号*/
    const codeInfo = await db.findOne('userCodeList', {
        phoneCode
    })
    if (codeInfo) {
        /*如果有值*/
        const time = Date.now() - codeInfo.sendTime
        /*判断验证码是都到期*/
        if (time > 60 * 1000) {
            /*验证码过期*/

            /*生成的验证码*/
            const code = tools.getRandom(100000, 999999)
            /*更新userList，并重新发送*/
            await db.updateOne('userCodeList', {phoneCode}, {
                $set: {
                    code,
                    sendTime: Date.now()
                }
            });
            res.json({
                ok: 1,
                msg: '验证码发送成功',
                code
            })
        } else {
            /*验证码没有过期*/
            tools.json(res, -1,  parseInt((60*1000 - time)/1000))
        }
    } else {
        /*没有值，添加一条数据，并发送验证码*/
        /*生成验证码*/
        const code = tools.getRandom(100000, 999999)
        db.insertOne('userCodeList', {
            code,
            phoneCode,
            sendTime: Date.now()
        })
        res.json({
            ok: 1,
            msg: '验证码发送成功',
            code
        })
    }
})
/*登陆*/
app.post('/login',async (req,res)=>{
    /*2、userList用户集合
    _id:唯一标识
    phoneCode:手机号
    regTime:注册时间
    lastTime:最后登陆时间
    isDong:是否冻结 false :未冻结 true:冻结*/
   const  {phoneCode,code} =req.body
    /*接受到信息后查询该手机号下是否已有验证码信息*/
    const codeInfo = await db.findOne("userCodeList",{
        phoneCode,
        code:code/1
    })
    /*codeInfo有值*/
    if(codeInfo){
        /*判断是否过期*/
        /*过期的话，返回验证码失效*/
        if((Date.now()-codeInfo.sendTime)>5*1000){
            tools.json(res,-1,"验证码失效")
        }else {
            /*没有失效，查询userList集合下是否有该条数据*/
          const userInfo = await db.findOne("userList",{
                phoneCode
            });
          if(userInfo){
              /*如果有值，更新userList集合,将用户最后登陆的时间更新*/
              await db.updateOne('userList',{
                  phoneCode
              },{
                  $set: {
                      lastTime:Date.now()
                  }
              })
              res.json({
                  ok:1,
                  msg:"登陆成功",
                  token:tools.encode({
                      phoneCode
                  })
              })
          }else {
              /*如果没有值，在userList添加一个新的用户信息*/
              await db.insertOne('userList',{
                  phoneCode,
                  regTime:Date.now(),
                  lastTime: Date.now()
              })
              res.json({
                  ok:1,
                  msg:"登陆成功",
                  token:tools.encode({
                      phoneCode
                  })
              })
          }


        }
    }else {
        res.json({
            ok:-1,
            msg:"验证码错误"
        })
    }


})
/*根据搜索信息，获取相应的店铺信息*/
app.get('/shopList',async (req,res)=>{
    const keyword = req.query.keyword
    if (keyword.length){
        const shopList = await db.find('shopList',{
            whereObj:{
                shopName:new RegExp(keyword)
            }
        })
        res.json({
            ok:'1',
            msg:"查询成功",
            shopList
        })
    }else {
        res.json({
            ok:-1,
            shopList: []
,        })
    }
})
/*根据店铺id获取店铺详细信息*/
app.get('/shopInfo/:id',async (req,res)=>{
   const shopInfo = await  db.findOneByid('shopList',req.params.id)
   res.json({
       ok:1,
       shopInfo
   })
})
/*根据店铺id获取商品类别详情以及商品详情*/
app.get('/goodsTypeInfo',async (req,res)=>{
   const goodsTypeInfo = await db.find('goodsTypeList',{
        whereObj: {
            shopId: ObjectId(req.query.shpeId)
        }
    })
    res.json({
        ok:1,
        goodsTypeInfo
    })
})
/*根据商品类别Id获取商品信息*/
app.get('/goodsInfo',async (req,res)=>{
    const  goodsInfo = await db.find('goodsList',{
        whereObj:{
            goodsTypeId:ObjectId(req.query.goodsId)
    }
    })
    res.json({
        ok:1,
        goodsInfo
    })

})
/*获取店铺类别信息*/
app.get('/shopTypeList' ,async (req,res)=>{
    const shopTypeList = await db.find('shopTypeList',{
        sort: {
            addTime:-1
        },
        limit:30
    })
    res.json({
        ok:1,
        shopTypeList:tools.changeArr(shopTypeList,10)
    })
})
/*根据店铺类别获取店铺类别信息*/
app.get('/shopInfo',async (req,res)=>{
  const shopInfo= await db.find('shopList',{
      whereObj:{
          shopTypeId:ObjectId(req.query.shopTypeId)
      }
  })
    res.json({
        ok:1,
        shopInfo
    })

})
/*获取店铺详情页面*/
app.get("/homeList",async (req,res)=>{
    let pageIndex = req.query.pageIndex/1;
    const response = await db.page("shopList",{
        sort:{
            addTime:-1,
        },
        pageIndex,
        limit:6
    })
    res.json(response);
})
app.listen('8090',function () {
console.log('success')
})