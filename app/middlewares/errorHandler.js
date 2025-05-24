export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    
    if (err.isOperational) {
      const response = {
        status: err.status,
        message: err.message
      };

      if (err.errors && typeof err.errors === 'object') {
        response.errors = err.errors;
      }

      return res.status(err.statusCode).json(response);
    }

    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Algo salió mal'
    });
  }
};
