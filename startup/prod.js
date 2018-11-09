const helmet = require("helmet");
const compression = require("comression");

module.exports = function(app) {
  app.use(helmet());
  app.use(compression());
};
