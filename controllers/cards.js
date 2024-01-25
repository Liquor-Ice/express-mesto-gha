const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          return res.status(400).send({ message: err.message });
        default:
          return res.status(500).send({ message: err.message });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id).orFail(
    () => new Error('Данная карточка не найдена'),
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      switch (err.name) {
        case 'Error':
          return res.status(404).send({ message: err.message });
        default:
          return res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(
    () => new Error('Данная карточка не найдена'),
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      switch (err.name) {
        case 'Error':
          return res.status(404).send({ message: err.message });
        case 'ValidationError':
          return res.status(400).send({ message: 'Переданы некорректные данные' });
        default:
          return res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(
    () => new Error('Данная карточка не найдена'),
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      switch (err.name) {
        case 'Error':
          return res.status(404).send({ message: err.message });
        case 'ValidationError':
          return res.status(400).send({ message: 'Переданы некорректные данные' });
        default:
          return res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};
