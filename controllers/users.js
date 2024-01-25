const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId).orFail(
    () => new Error('Пользователь по данному ID не найден'),
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      switch (err.name) {
        case 'Error':
          return res.status(404).send({ message: err.message });
        default:
          return res.status(500).send({ message: err.message });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          return res.status(400).send({ message: 'Переданы не валидные данные' });
        default:
          return res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true },
  ).orFail(
    () => new Error('Пользователь по данному ID не найден'),
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      switch (err.name) {
        case 'Error':
          return res.status(404).send({ message: err.message });
        case 'ValidationError':
          return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        default:
          return res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true },
  ).orFail(
    () => new Error('Пользователь по данному ID не найден'),
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      switch (err.name) {
        case 'Error':
          return res.status(404).send({ message: err.message });
        case 'ValidationError':
          return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        default:
          return res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};
