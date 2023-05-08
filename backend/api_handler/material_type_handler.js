const {materialTypeModel,idsModel} = require('../schema/index');
const { Util } = require('../utils/util');

exports.save = async (req, res) => {
    const materialTypeInfo = req.body;
    if (Util.isUndefinedOrNullOrWhiteSpace(materialTypeInfo.Id)) {
        materialTypeModel.find({
            'Name': materialTypeInfo.Name
        }, (err, results) => {

            if (err) {
                return res.send({ status: 400, message: err.message });
            }
            // 用户名被占用
            if (results.length > 0) {
                return res.send({ status: 400, message: '当前种类已存在！' });
            }
        })
        // 实现Id的自增
        const ids = await idsModel.findOneAndUpdate({ "Name": "MaterialCategory" }, { $inc: { 'Id': 1 } })
        materialTypeInfo.Id = ids.Id;
        if (Util.isUndefinedOrNullOrWhiteSpace(materialTypeInfo.Actived)) {
            materialTypeInfo.Actived = false;
        }
        materialTypeModel.create(materialTypeInfo, function (err, results) {
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
        materialTypeModel.updateOne({ Id: materialTypeInfo.Id }, { $set: materialTypeInfo }, function (err, results) {
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
    const id = req.query.id;
    console.log(id);
    if (Util.isUndefinedOrNullOrWhiteSpace(id)) {
        return res.send({ status: 400, message: '当前种类不存在！' });
    }

    materialTypeModel.deleteOne({ Id: id }, (err, results) => {
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
    const id = req.query.id;
    materialTypeModel.findOne({ Id: id }, (err, results) => {
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
    const page = req.body;
    const curPage = page.curPage;
    const pageSize = page.pageSize;
    const skipData = (curPage - 1) * pageSize;
    const filterValue = page.filters;
    const requestData = page.requestData;
    let queryItem = {}
    if (!Util.isUndefinedOrNullOrWhiteSpace(filterValue)) {
        // 模糊搜索${filterValue}
        // 正则表达式只能为 {Account:  /Admin/i }或$regex:Admin
        queryItem = {
            Account: { $regex: eval(`/${filterValue}/i`) }
        }
    }
    if (!Util.isUndefinedOrNullOrWhiteSpace(requestData?.parentId)) {
        queryItem = Object.assign({}, queryItem, { ParentId: requestData.parentId })
    }
    const totalDataLength = await materialTypeModel.find(queryItem).count();
    materialTypeModel.find(queryItem, (err, results) => {
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
