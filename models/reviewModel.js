const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Reviews must have a character']
  },
  ratings: {
    type: Number,
    min: [1, 'Ratings must above 1'],
    max: [5, 'Ratings must below 5']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour']
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
