const {Schema, model} = require('mongoose');
const Joi = require("joi");

const { handleMongooseError } = require('../helpers');

const emailRegexp =
/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


const userSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    minlength: 6,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    match: emailRegexp,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: '',
  },
  
} , {versionKey:false, timestamps:true});

userSchema.post('save', handleMongooseError);

const registerSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required()
  .messages({ "any.required": `missing required email field` }),
  password: Joi.string().min(6).required().
  messages({ "any.required": `missing required phone field` }),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required()
  .messages({ "any.required": `missing required email field` }),
  password: Joi.string().min(6).required().
  messages({ "any.required": `missing required phone field` }),
  
});

const schemas = {
  registerSchema,
  loginSchema,
}

const User = model("user", userSchema)

module.exports = {User, schemas};

