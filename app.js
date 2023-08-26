const express = require("express");
const fs = require('fs');
const app = express();
app.use(express.json());

const tour = JSON.parse(fs.readFileSync(`${__dirname}/data/simple.json`));
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    length: tour.length,
    data: {
      tour
    },
  })
})
app.post('/api/v1/tours', (req, res) => {
  const newId = tour[tour.length - 1].id + 1;
  const newTour = Object.assign({id: newId}, req.body);
  tour.push(newTour);
  fs.writeFile(`${__dirname}/data/simple.json`, JSON.stringify(tour), err => {
    res.status(201).json({
      status: 'created',
      data: newTour
    })
  })

})
const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
})