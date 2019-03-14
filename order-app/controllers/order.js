const request = require('request-promise');
const jwt = require('jsonwebtoken');

const Order = require('../models/Order');

const token = jwt.sign({
  foo: 'bar'
}, 'secret');


/**
 * GET /
 * Home page.
 */
exports.index = async (req, res) => {
  res.json(await Order.find());
};

exports.view = async (req, res) => {
  res.json(await Order.findById(req.params.id));
};

exports.create = async (req, res) => {
  const createdOrder = await Order.create({ });

  let paymentResult;
  try {
    paymentResult = await request.post({
      method: 'post',
      uri: 'http://localhost:8082/api/payment',
      headers: { authorization: `bearer ${token}` },
      body: {
        orderId: createdOrder.id
      },
      json: true
    });
  } catch (error) {
    res.status(500);
    res.send('Payment failed');
  }

  if (paymentResult.status === 'confirmed') {
    createdOrder.status = 'confirmed';
  } else if (paymentResult.status === 'declined') {
    createdOrder.status = 'canceled';
  }

  const updatedOrder = await createdOrder.save();

  res.json(updatedOrder);
};

exports.destroy = async (req, res) => {
  res.json(await Order.findOneAndUpdate({
    _id: req.params.id
  }, {
    status: 'canceled'
  }, {
    new: true
  }));
};
