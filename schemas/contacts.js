const Joi = require("joi");
const addSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': `Missing required name field`,
  }),
  email: Joi.string().required().messages({
    'any.required': `Missing required email field`,
    'string.email': 'Email must be a valid email'
  }),
  phone: Joi.string().required().messages({
    'any.required': `Missing required phone field`,
  }),
});

module.exports={
  addSchema,
};