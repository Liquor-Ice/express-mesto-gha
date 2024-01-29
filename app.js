const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const {
  login, createUser,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/(https?:\/\/)(w{3}\.)?(\S+)#?/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  return res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT);
