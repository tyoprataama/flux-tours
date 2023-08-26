const { log } = require("console");
const express = require("express");
const fs = require('fs');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from midleware');
  next();
})
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/simple.json`));

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
    data: null
  })
}

//  SAME WAY TO DEFINE HTTP METHOD FROM ROUTE FUNCTION BELOW
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', postTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//  ALTERNATE
app.route('/api/v1/tours')
  .get(getAllTours)
  .post(postTour);

app.route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
})