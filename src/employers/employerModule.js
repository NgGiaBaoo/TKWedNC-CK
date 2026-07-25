module.exports = function registerEmployerModule(app) {
  const employerRouter = require("./employerController");
  const { requireAuth } = require("../auth/authMiddleware");
  app.use("/employers", requireAuth, employerRouter);
};