const {
  Publish
} = require('../models/enum_status');
const {
  publishModel,
} = require('../schema/index');
const {
  Util,
} = require('../utils/util');

const moment = require('moment');

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
      '$gt': -2
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
      statistic[2].value = published;
      statistic[3].value = streamed;
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

const DateType = ['month', 'quarter', 'year', 'preMonth', 'preQuarter', 'preYear'];
let MData = [
  ['product', '2023-05-17'],
  ['已取消', 0],
  ['未发布', 0],
  ['已发布', 0],
  ['已流拍', 0],
  ['已售出', 0],
  ['已收货', 0],
  ['已退货', 0],
  ['已付款', 0],
]

let QData = [
  ['product', '2023-01', '2023-02', '2023-03'],
  ['已取消', 0, 0, 0],
  ['未发布', 0, 0, 0],
  ['已发布', 0, 0, 0],
  ['已流拍', 0, 0, 0],
  ['已售出', 0, 0, 0],
  ['已收货', 0, 0, 0],
  ['已退货', 0, 0, 0],
  ['已付款', 0, 0, 0],
]

let YData = [
  ['product', '第一季度', '第二季度', '第三季度', '第四季度'],
  ['已取消', 0, 0, 0, 0],
  ['未发布', 0, 0, 0, 0],
  ['已发布', 0, 0, 0, 0],
  ['已流拍', 0, 0, 0, 0],
  ['已售出', 0, 0, 0, 0],
  ['已收货', 0, 0, 0, 0],
  ['已退货', 0, 0, 0, 0],
  ['已付款', 0, 0, 0, 0],
]
exports.getPeriodData = async (req, res) => {
  let { startTime, endTime, dateType } = req.body;
  let result = [];
  if (dateType === 'month') {
    MData[0][1] = moment(new Date(endTime)).format('YYYY-MM')
    for (let i = 1; i < 9; i++) {
      MData[i][1] = await getCount(i - 2, startTime, endTime, dateType);
    }
    result = MData;
  } else if (dateType === 'quarter') {
    const y = moment(new Date(startTime)).year()
    const s = moment(new Date(startTime)).month();
    const e = moment(new Date(endTime)).month();
    for (let i = s; i <= e; i++) {
      const index = i % 3 + 1;
      QData[0][index] = y + '-' + i;
      for (let j = 1; j < 9; j++) {
        QData[j][index] = await getCount(j - 2, moment(new Date(startTime)).add(index - 1, 'M'), endTime, dateType);
      }
    }
    result = QData;
  } else if (dateType === 'year') {
    const y = moment(new Date()).year();
    for (let i = 1; i <= 4; i++) {
      for (let j = 1; j < 9; j++) {
        YData[j][i] = await getCount(j - 2, moment(new Date(startTime)).add(i-1, 'Q'), endTime, dateType);
      }
    }
    result = YData;
  }
  res.send({
    Code: 200,
    Message: '',
    Data: result,
  });
}

async function getCount(status, startTime, endTime, dateType) {
  const count = await new Promise((resolve) => {
    publishModel.find({
      Status: {
        $eq: status
      },
      StartTime: {
        $gte: moment(new Date(startTime)).startOf(dateType).format('YYYY-MM-DD HH:mm:ss')
      },
      EndTime: {
        $lte: moment(new Date(endTime)).endOf(dateType).format('YYYY-MM-DD HH:mm:ss')
      }
    }).count().exec((err, result) => {
      resolve(result);
    });
  })
  return count;
}
