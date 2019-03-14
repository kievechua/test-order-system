const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../app.js');
require('sinon-mongoose');

const Order = require('../models/Order');

describe('POST /api/order', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .post('/api/order')
      .expect(200, done)
      .expect((res) => {
        if (!('_id' in res.body)) throw new Error('No _id');
      });
  });
});

describe('GET /api/order/:id', () => {
  it('should return 200 OK', (done) => {
    const orderMock = sinon.mock(Order);
    const expectedUser = {
      _id: '5700a128bd97c1341d8fb365',
      status: 'confirmed'
    };

    orderMock
      .expects('findById')
      .withArgs('5700a128bd97c1341d8fb365')
      .chain('exec')
      .resolves(expectedUser);


    request(app)
      .get('/api/order/5700a128bd97c1341d8fb365')
      .expect(200, done)
      .expect(expectedUser);
  });
});

describe('GET /api/orders', () => {
  it('should return 200 OK', (done) => {
    const orderMock = sinon.mock(Order);
    const expectedUser = [{
      _id: '5700a128bd97c1341d8fb365',
      status: 'confirmed'
    }, {
      _id: '5700a128bd97c1341d8fb364',
      status: 'canceled'
    }];

    orderMock
      .expects('find')
      .chain('exec')
      .resolves(expectedUser);


    request(app)
      .get('/api/orders')
      .expect(200, done)
      .expect(expectedUser);
  });
});

describe('DELETE /api/order/:id', () => {
  it('should return 200 OK', (done) => {
    const orderMock = sinon.mock(Order);
    const expectedUser = {
      _id: '5700a128bd97c1341d8fb364',
      status: 'canceled'
    };

    orderMock
      .expects('findOneAndUpdate')
      .chain('exec')
      .resolves(expectedUser);

    request(app)
      .delete('/api/order/5700a128bd97c1341d8fb364')
      .expect(200, done)
      .expect(expectedUser);
  });
});
