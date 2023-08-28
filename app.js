const express = require("express");
const morgan = require("morgan");
const app = express();


const tourRoutes = require('./routes/toursRoutes')
const userRoutes = require('./routes/userRoutes');

//////////   MIDDLEWARE //////////
app.use(express.json());
app.use(morgan('dev'));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})


app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);



//////////   SERVER //////////
const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
})