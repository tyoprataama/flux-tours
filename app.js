const express = require("express");
const fs = require('fs');
const app = express();
app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/simple.json`));
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    length: tours.length,
    data: {
      tours
    },
  })
})

app.post('/api/v1/tours', (req, res) => {
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
})

app.get('/api/v1/tours/:id', (req, res) => {
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
})
const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
})