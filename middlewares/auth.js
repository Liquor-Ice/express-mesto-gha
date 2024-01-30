const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const UnauthorizedError = require('../errors/UnauthorizedError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // let payload;
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'strong-secret', (err) => {
    if (err) {
      throw new UnauthorizedError('Необходима авторизация');
    }
  })
    .then((payload) => {
      req.user = payload;
      next();
    })
    .catch(next);
  // try {
  //   const { authorization } = req.headers;

  //   if (!authorization || !authorization.startsWith('Bearer ')) {
  //     throw new UnauthorizedError('Необходима авторизация');
  //   }
  //   const token = authorization.replace('Bearer ', '');
  //   payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'strong-secret',
  // (err) => {
  //     if (err) {
  //       throw new UnauthorizedError('Необходима авторизация');
  //     }
  //   });
  // } catch (err) {
  //   next(err);
  // }

  // req.user = payload;

  // next();
};
