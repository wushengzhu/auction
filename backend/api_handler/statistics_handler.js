const {
  Publish
} = require('../models/enum_status');
const {
  publishModel,
} = require('../schema/index');
const {
  Util,
} = require('../utils/util');

function getStatusCount(result) {
  let canceled = 0,
    noPublish = 0,
    published = 0,
    streamed = 0,
    sold = 0,
    delivered = 0,
    returned = 0,
    paid = 0;
  result.forEach((item) => {
    switch (item.Status) {
      case Publish.Canceled:
        canceled++;
        break;
      case Publish.Unpublished:
        noPublish++;
        break;
      case Publish.Published:
        published++;
        break;
      case Publish.Streamed:
        streamed++;
        break;
      case Publish.Sold:
        sold++;
        break;
      case Publish.Delivered:
        delivered++;
        break;
      case Publish.Returned:
        returned++;
        break;
      case Publish.Paid:
        paid++;
        break;
    }
  })

  return {
    canceled: canceled,
    noPublish: noPublish,
    published: published,
    streamed: streamed,
    sold: sold,
    delivered: delivered,
    returned: returned,
    paid: paid
  }
}

exports.auction = async (req, res) => {
  let status;
  publishModel.find({
    Status: {
      status
    }
  }, (err, results) => {
    let statistic = [{
        value: 0,
        label: '已取消'
      },
      {
        value: 0,
        label: '未发布'
      },
      {
        value: 0,
        label: '已发布'
      },
      {
        value: 0,
        label: '已流拍'
      },
      {
        value: 0,
        label: '已售出'
      },
      {
        value: 0,
        label: '已收货'
      },
      {
        value: 0,
        label: '已退货'
      },
      {
        value: 0,
        label: '已付款'
      },
    ];
    if (Util.IsNullOrEmpty(results)) {
      res.send({
        Code: 200,
        Message: '',
        Data: statistic,
      });
    } else {
      const {
        canceled,
        noPublish,
        published,
        streamed,
        sold,
        delivered,
        returned,
        paid,
      } = getStatusCount(results);
      statistic[0].value = canceled;
      statistic[1].value = noPublish;
      statistic[2].value = streamed;
      statistic[3].value = published;
      statistic[4].value = sold;
      statistic[5].value = delivered;
      statistic[6].value = returned;
      statistic[7].value = paid;
      res.send({
        Code: 200,
        Message: '',
        Data: statistic,
      });
    }
  })
};

exports.getPeriodData = async (req,res)=>{
  let {startDate,EndDate} = req.body;
}