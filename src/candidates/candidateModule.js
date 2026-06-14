module.exports = function registerCandidateModule(app) {
  const candidateRouter = require("./candidateController");
  app.use("/candidates", candidateRouter);
};
