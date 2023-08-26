const { log } = require("console");
const express = require("express");
const fs = require('fs');
const morgan = require("morgan");
const app = express();

//////////  1) MIDDLEWARE //////////
app.use(express.json());
app.use(morgan('dev'));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})


//////////  2) ROUTES HANDLERS  //////////
const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/simple.json`));
//////////  A) TOURS  //////////
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    length: tours.length,
    data: {
      tours
    },
  })
}

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);
  // if (id > tours.length) 
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'data not found'
    })
  }
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour
    }
  })
}

const postTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({
    id: newId
  }, req.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/data/simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'created',
      requestedAt: req.requestTime,
      data: newTour
    })
  })
}

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'data not found'
    })
  }
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour: '<Updated data>'
    }
  })
}

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'data not found'
    })
  }
  res.status(204).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: null
  })
}

//////////  B) USERS  //////////
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'fail',
    requestedAt: req.requestTime,
    message: 'This function is not defined yet'
  })
}
const getUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    requestedAt: req.requestTime,
    message: 'This function is not defined yet'
  })
}
const postUsers = (req, res) => {
  res.status(500).json({
    status: 'fail',
    requestedAt: req.requestTime,
    message: 'This function is not defined yet'
  })
}
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    requestedAt: req.requestTime,
    message: 'This function is not defined yet'
  })
}
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    requestedAt: req.requestTime,
    message: 'This function is not defined yet'
  })
}

////////// 3) ROUTES  //////////
////////// A) TOUR  //////////
const toursRoute = express.Router();
app.use('/api/v1/tours', toursRoute);

toursRoute.route('/')
  .get(getAllTours)
  .post(postTour);

toursRoute.route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

////////// B) USERS  //////////
const usersRoute = express.Router();
app.use('/api/v1/users', usersRoute)
usersRoute.route('/')
  .get(getAllUsers)
  .post(postUsers);

usersRoute.route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

//////////  4) SERVER //////////
const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
})