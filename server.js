const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION 😤. Shutting down the server ...');
  process.exit(1);
});
dotenv.config({
  path: './init.env'
});
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
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  server.close(() => {
    console.log('UNHANDLED REJECTION 😤. Shutting down the server ...');
    process.exit(1);
  });
});
