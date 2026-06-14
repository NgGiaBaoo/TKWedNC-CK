module.exports = function registerApplicationModule(app) {
  const applicationRouter = require("./applicationController");
  app.use("/applications", applicationRouter);
};
