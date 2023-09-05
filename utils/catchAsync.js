module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // OR DOING THIS = .catch(err => next(err))
  };
};
