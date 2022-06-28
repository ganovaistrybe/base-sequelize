const express = require('express');
const { AppError } = require('../errors/AppError');
const router = require('../routes');

const app = express();
app.use(express.json());

app.get('/', (request, response) => {
  response.send({ message: 'Hello World!' });
});

app.use(router);

app.use((err, req, res, _) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: `Internal server error - ${err.message}`,
  });
});

module.exports = app;
