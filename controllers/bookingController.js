const midtransClient = require('midtrans-client');
const { nanoid } = require('nanoid');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.bookingSessions = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  const tourName = tour.name;
  const tourId = tour.id;
  const user = req.user.id;
  const tourPrice = tour.price;
  //  Generate last tour name for order id
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
      order_id: `FLUX-${tourId}-${nanoid(8)}`,
      gross_amount: tourPrice
    },
    items_details: [
      {
        id: tourId,
        name: `${tour.name} Tour`,
        quantity: 1,
        price: tourPrice
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
    },
    custom_field1: tourId,
    custom_field2: user,
    custom_field3: tourPrice
  };
  snap
    .createTransaction(parameter)
    .then(async transaction => {
      // transaction token
      const transactionToken = transaction.token;

      // transaction redirect url
      const transactionRedirectUrl = transaction.redirect_url;
      const booking = await Booking.create({
        tour: tourId,
        user: user,
        price: tourPrice
      });

      res.status(200).json({
        status: 'success',
        transactionToken,
        transactionRedirectUrl,
        parameter,
        booking
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

exports.confirmPayment = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;
  const updatePaid = await Booking.findByIdAndUpdate(
    bookingId,
    {
      paid: 'success'
    },
    {
      new: true,
      runValidators: true
    }
  );
  if (!updatePaid) {
    return next(new AppError('Booking tidak ditemukan!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking: updatePaid
    }
  });
});
