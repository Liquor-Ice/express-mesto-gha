// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const SOLT_ROUND = 10;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неверный email или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неверный email или пароль'));
          }

          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'strong-secret', { expiresIn: '7d' });

          return res.status(200).cookie('token', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          }).send({
            token,
          });
        });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId).orFail(
    () => new NotFoundError('Пользователь по данному ID не найден'),
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id).orFail(
    () => new NotFoundError('Пользователь по данному ID не найден'),
  )
    .then((user) => {
      const {
        name, about, avatar, email,
      } = user;
      res.status(200).send({
        name, about, avatar, email,
      });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, SOLT_ROUND)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
    }))
    .catch((err) => {
      // eslint-disable-next-line no-constant-condition, no-cond-assign, no-param-reassign
      if (err.code = 11000) {
        next(new ConflictError('Пользователь с данным email уже существует'));
        return;
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  ).orFail(
    () => new NotFoundError('Пользователь по данному ID не найден'),
  )
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  ).orFail(
    () => new NotFoundError('Пользователь по данному ID не найден'),
  )
    .then((user) => res.send({ data: user }))
    .catch(next);
};
