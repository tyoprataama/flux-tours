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
    ref: 'User'
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour'
  },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
