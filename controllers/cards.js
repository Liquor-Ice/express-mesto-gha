const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId).orFail(
    () => new NotFoundError('Данная карточка не найдена'),
  )
    // eslint-disable-next-line consistent-return
    .then((card) => {
      console.log(card.owner, req.user);
      if (card.owner !== req.user) {
        return Promise.reject(new ForbiddenError('Требуется авторизация'));
      }
      Card.findByIdAndDelete(cardId).orFail(
        () => new NotFoundError('Данная карточка не найдена'),
      )
        .then((delCard) => res.status(200).send({ data: delCard }));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(
    () => new NotFoundError('Данная карточка не найдена'),
  )
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(
    () => new NotFoundError('Данная карточка не найдена'),
  )
    .then((card) => res.send({ data: card }))
    .catch(next);
};
