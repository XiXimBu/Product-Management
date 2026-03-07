module.exports = (req, res, next) => {
  if (!req.session.flash) req.session.flash = {};

  req.flash = (type, message) => {
    if (!type) return [];

    if (typeof message === 'undefined') {
      const messages = req.session.flash[type] || [];
      delete req.session.flash[type];
      return messages;
    }

    if (!req.session.flash[type]) req.session.flash[type] = [];
    req.session.flash[type].push(message);
    return req.session.flash[type].length;
  };

  next();
};
