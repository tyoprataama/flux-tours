const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './init.env' });
const app = require('./app');

const DB = process.env.DB.replace('<PASSWORD>', process.env.PASSWORD_DB);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB connection success!');
  });
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'Tour must have a price']
  }
});
const Tour = mongoose.model('Tour', tourSchema);
const newTour = new Tour({
  name: 'Your tour name',
  rating: 4.9, // optional
  price: 800
});
newTour
  .save()
  .then(doc => {
    console.log(doc);
  })
  .catch(err => {
    console.log('Error 👺', err);
  });
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
