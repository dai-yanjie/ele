const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;

function _connect() {
    return new Promise((resolve, reject) => {
        mongoClient.connect("mongodb://127.0.0.1:27017", {
            useUnifiedTopology: true
        }, (err, client) => {
            if (err)
                reject('数据库连接失败')
            else
                resolve(client.db("ele"));
        })
    })
}

module.exports = {
    // 插入一条数据
    async insertOne(collName, insertObj) {
        const db = await _connect();
        return new Promise((resolve, reject) => {
            db.collection(collName).insertOne(insertObj, (err, results) => {
                if (err) reject('插入数据失败')
                else resolve('插入数据成功')
            })
        })

    },
    // 查询一条记录
    async findOne(collName, whereObj) {
        const db = await _connect()
        return new Promise((resolve, results) => {
            db.collection(collName).findOne(whereObj, (err, results) => {
                if (err) reject('查询数据失败')
                else {
                    resolve(results)
                }
            })
        })
    },
    // 查询多条数据
    async find(collName, obj = {}) {
        const {
            skip = 0, limit = 0, sort = {}, whereObj = {}
        } = obj;
        const db = await _connect();
        return new Promise((resolve, reject) => {
            db.collection(collName).find(whereObj).limit(limit).skip(skip).sort(sort).toArray((err, results) => {
                if (err) reject('查询多条数据失败')
                else {
                    resolve(results)
                }
            })
        })
    },
    // 获取文档数量
    async count(collName, whereObj) {
        const db = await _connect();
        return new Promise((resolve, reject) => {
            db.collection(collName).countDocuments(whereObj).then(count => {
                resolve(count);
            })
        })
    },
    // 更新一条数据
    async updateOne(collName, whereObj, upObj) {
        const db = await _connect();
        return new Promise((resolve, reject) => {
            db.collection(collName).updateOne(whereObj, upObj, (err, results) => {
                if (err) reject('更新数据失败')
                else {
                    resolve('更新成功')
                }
            })
        })
    },
    // 根据id删除数据
    async deleteOneById(collName, id) {
        const db = await _connect();
        return new Promise((resolve, reject) => {
            db.collection(collName).deleteOne({
                _id: ObjectId(id)
            }, (err, results) => {
                if (err) reject('删除失败')
                else resolve(results)
            })
        })
    },
    async page(collName,{whereObj={},pageIndex=1,sort={},limit=5}={}){
        // console.log(this);
        // console.log(limit);
        let pageSum = 1;
        const count = await this.count(collName,whereObj);// 总条数
        pageSum = Math.ceil(count/limit);
        if(pageSum<1) pageSum = 1;
        if(pageIndex<1) pageIndex = 1;
        if(pageIndex>pageSum) pageIndex = pageSum;
        const result = await this.find(collName,{
            whereObj,
            sort,
            limit,
            skip:(pageIndex-1)*limit
        })
        return {
            ok:1,
            [collName]:result,
            pageIndex,
            pageSum
        }

    },
    // 根据id更新一条数据
   async upDateOneById(collName,id,upObj){
    const db = await _connect();
    return new Promise((resolve, reject) => {
        db.collection(collName).updateOne({
            _id:ObjectId(id)
        },upObj,(err,results)=>{
            if(err) reject('更新失败')
            else resolve('更新成功')
        })
    })
    },
    /*根据id查询一条数据*/
    async findOneByid(collName, id, upObj) {
        const db = await _connect();
        return new Promise((resolve, reject) => {
            db.collection(collName).findOne({
                _id:ObjectId(id)
            },(err, results) => {
                if (err) reject('查询失败')
                else {
                    resolve(results)
                }
            })
        })
    }

}