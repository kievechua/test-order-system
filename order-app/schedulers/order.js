const schedule = require('node-schedule');
const moment = require('moment');

const Order = require('../models/Order');

const j = schedule.scheduleJob('15 * * * * *', async () => {
  try {
    const orders = await Order.find({
      status: 'confirmed',
      createdAt: {
        $lte: moment().subtract('15 seconds').toISOString()
      }
    });
    const updatedOrders = await Order.updateMany({
      _id: {
        $in: orders.map(order => order._id)
      }
    }, {
      $set: {
        status: 'delivered'
      }
    });
    console.log(updatedOrders);
  } catch (error) {
    console.error(error);
  }
});
