const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const UnauthorizedError = require('../errors/UnauthorizedError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  let payload;

  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Необходима авторизация');
    }
    const token = authorization.replace('Bearer ', '');
    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'strong-secret');
    } catch (error) {
      throw new UnauthorizedError('Необходима авторизация');
    }
  } catch (err) {
    next(err);
  }

  req.user = payload;

  next();
};
