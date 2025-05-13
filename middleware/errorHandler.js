const errorHandler = (req, res, next) => {
  if (req.accepts('html')) {
    res.status(404).send('<h1>404 Not Found</h1>');
  } else {
    res.status(404).json({ error: '404 Not Found' });
  }
};

module.exports = errorHandler;
