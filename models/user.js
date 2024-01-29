const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      // eslint-disable-next-line no-useless-escape
      validator: (v) => /https?:\/\/[\w\-\.~:\/\?#\[\]@!$&'\(\)\*\+,;=]*\b#?/.test(v),
      message: 'Некорректный URL',
    },
  },
  email: {
    type: String,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный Email',
    },
    required: [true, 'Поле "email" является обязательным'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Поле "password" является обязательным'],
    select: false,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
