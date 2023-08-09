const {HttpError} = require('../helpers');

const validateBody = (schema, message) => {
  const func = (req, res, next) => {
    const checkAllFields = Object.keys(req.body).length;
    if (checkAllFields) {
      const { error } = schema.validate(req.body);
      if (error) {
        next(HttpError(400, error.message));
      }
      next();
    } else {
      next(HttpError(400, message));
    }
  };
  return func;
};

module.exports = validateBody;