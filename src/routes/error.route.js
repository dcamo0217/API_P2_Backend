const error = (error, req, res, next) => {
  console.log('###E An error occurred');

  const err_code = error.code || -1;

  switch (err_code) {
    case 1:
      return res.status(400).json({
        message: `User or password incorrect`,
      });

    case 11000:
      const field = Object.keys(error.keyValue);
      return res.status(400).json({
        message: `Field '${field}' with value '${error.keyValue[field]}' already exists`,
      });

    default:
      return res.status(500).json({
        message: `There was an error`,
        error,
      });
  }
};

export default error;
