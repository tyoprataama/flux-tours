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
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
