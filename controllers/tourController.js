const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../data/simple.json`));

////////  MIDDLEWARE ////////
exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'data not found'
    })
  }
  next();
}
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'name and price is required'
    })
  }
  next();
}

////////  HANDLERS ////////
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    length: tours.length,
    data: {
      tours
    },
  })
}

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour
    }
  })
}

exports.postTour = (req, res) => {
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

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour: '<Updated data>'
    }
  })
}

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: null
  })
}