const logger = require('./logger');

const responseLogger = (req, res, next) => {
  const oldSend = res.send;
    res.send = function () {
    const summaryMessage = `Response: ${res.statusCode} - ${req.method} ${req.url}`;
    logger.info(summaryMessage);
    oldSend.apply(res, arguments);
    };

  next();
};

module.exports = responseLogger;