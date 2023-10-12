const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    options: { select: 'name photo' }
  });
  next();
});

reviewSchema.statics.calculateReviewAvg = async function(tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$ratings' }
      }
    }
  ]);

  if (stats.length > 0) {
    //  Synchronize the ratingsAvg and ratingsQuantity based on real user reviews
    await Tour.findByIdAndUpdate(tourId, {
      //  Because stats return array we using stats[0] and specified the field
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating
    });
  } else {
    //  If there is no review reset the ratings to 4.5
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0
    });
  }
};

reviewSchema.post('save', function() {
  //  This point the current reviews
  //  Cannot use Review.calculateReviewAvg so using this.constructor instead
  this.constructor.calculateReviewAvg(this.tour);
});

reviewSchema.post(/^findOneAnd/, async function(doc) {
  await doc.constructor.calculateReviewAvg(doc.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
