module.exports = function registerJobModule(app) {
  const jobRouter = require("./jobController");
  app.use("/jobs", jobRouter);
};
module.exports = function registerJobModule(app) {
  const jobRouter = require("./jobController");
  app.use("/jobs", jobRouter);
};
