const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking harus mempunyai Tour!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking harus mempunyai User!']
  },
  price: {
    type: Number,
    require: [true, 'Booking harus mempunyai harga!']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: String,
    value: ['success', 'pending', 'error'],
    default: 'pending'
  }
});

bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name'
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
