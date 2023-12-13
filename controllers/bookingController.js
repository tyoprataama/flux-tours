const midtransClient = require('midtrans-client');
const { nanoid } = require('nanoid');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.bookingSessions = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  //  Generate last tour name for order id
  const tourName = tour.name;
  const orderName = tourName.includes(' ')
    ? tourName
        .split(' ')
        .pop()
        .toUpperCase()
    : tourName.toUpperCase();

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
  });

  const parameter = {
    transaction_details: {
      order_id: `FLUX-${nanoid(8)}-${orderName}`,
      gross_amount: tour.price
    },
    items_details: [
      {
        id: tour.id,
        name: `${tour.name} Tour`,
        quantity: 1,
        price: tour.price
      }
    ],
    customer_details: {
      first_name: req.user.name.split(' ')[0],
      last_name: req.user.name.split(' ')[1],
      email: req.user.email
    },
    enabled_payments: ['credit_card', 'bni_va', 'bca_va', 'other_va', 'gopay'],
    credit_card: {
      secure: true
    }
  };
  snap
    .createTransaction(parameter)
    .then(transaction => {
      // transaction token
      const transactionToken = transaction.token;

      // transaction redirect url
      const transactionRedirectUrl = transaction.redirect_url;

      res.status(200).json({
        status: 'success',
        transactionToken,
        transactionRedirectUrl,
        parameter
      });
    })
    .catch(e => {
      res.status(500).json({
        status: 'error',
        message: e.message
      });
      console.log('Error occured:', e.message);
    });
});
