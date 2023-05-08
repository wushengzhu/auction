const {dictModel,idsModel, dictSchema} = require('../schema/index');
const { Util } = require('../utils/util');

/**
 * 字典数据api
 */

exports.save = async (req, res) => {
    const dictInfo = req.body;
    if (Util.isUndefinedOrNullOrWhiteSpace(dictInfo.Id)) {
        dictModel.find({
            'Value': dictInfo.DictName
        }, (err, results) => {

            if (err) {
                return res.send({ status: 400, message: err.message });
            }
            // 用户名被占用
            if (results.length > 0) {
                return res.send({ status: 400, message: '当前字典已存在！' });
            }
        })
        // 实现Id的自增
        const ids = await idsModel.findOneAndUpdate({ "Name": "Dictionary" }, { $inc: { 'Id': 1 } })
        dictInfo.Id = ids.Id
        if(!dictInfo.ParentId){
            dictInfo.ParentId = 0;
        }
        dictInfo.CreateTime = new Date()
        dictModel.create(dictInfo, function (err, results) {
            if (err) {
                console.log('添加失败!');
            }
            res.send({
                Code: 200,
                Message: '添加成功！',
                Data: results,
            });
        })
    } else {
        dictModel.updateOne({ Id: dictInfo.Id }, { $set: dictInfo }, function (err, results) {
            if (err) {
                console.log('更新失败!');
            }
            res.send({
                Code: 200,
                Message: '更新成功！',
                Data: results,
            });
        })
    }
}

exports.delete = (req, res) => {
    const dictId = req.query.id;
    if (Util.isUndefinedOrNullOrWhiteSpace(dictId)) {
        return res.send({ status: 400, message: '当前字典不存在！' });
    }

    dictModel.deleteOne({ Id: id }, (err, results) => {
        if (err) {
            console.log('删除失败！');
        }
        if (results.deletedCount === 1) {
            res.send({
                Code: 200,
                Message: '删除成功！',
                Data: true,
            })
        }
    })
}

exports.getById = (req, res) => {
    const dictId = req.query.id;
    dictModel.findOne({ Id: dictId }, (err, results) => {
        if (err) {
            console.log('查询失败！');
        } else {
            res.send({
                Code: 200,
                Message: '查询成功！',
                Data: results,
            })
        }
    })
}

// 少量数据使用skip、limit问题不大，如果是大量数据的话就要优化了
exports.getList = async (req, res) => {
    const {curPage,pageSize,filters} = req.body;
    const skipData = (curPage - 1) * pageSize;
    let queryItem = {};
    if (!Util.IsNullOrEmpty(filters)) {
        // 模糊搜索${filterValue}
        // 正则表达式只能为 {Account:  /Admin/i }或$regex:Admin
        for(let key of Object.keys(dictSchema.obj)){
            if(key!=='Id'){
                queryItem[key]
            }
        }

        for(let key of Object.keys(queryItem)){
            const objx = queryItem[key];
            if(!objx){
                delete objx;
            }
        }
        filters.forEach((item)=>{
            if(item.op==='$regex'){
                queryItem[item.field]={$regex:eval(`/${item.value}+/i`)}
            }else if(item.op==='$eq'){
                queryItem[item.field]={$eq:item.value}
            }
            
        })
    }
    const totalDataLength = await dictModel.find(queryItem).count();
    dictModel.find(queryItem, (err, results) => {
        if (err) {
            console.log('获取列表失败！');
        } else {
            res.send({
                Code: 200,
                Message: '获取列表成功！',
                Data: {
                    Data: results,
                    Total: totalDataLength
                },
            })
        }
    }).skip(skipData).limit(pageSize)
}