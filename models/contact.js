
const {Schema, model} = require('mongoose');
const Joi = require("joi");

const { handleMongooseError } = require('../helpers');


const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
}, { versionKey: false, timestamps: true });

contactSchema.post('save', handleMongooseError);

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

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    'any.required': 'missing field favorite',
  }),
});

const Contact = model('contact', contactSchema);

const schemas= {
  addSchema,
  updateFavoriteSchema,
}

module.exports ={Contact, schemas };
