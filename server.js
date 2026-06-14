const express = require("express");
const db = require("./localdb");
const registerJobModule = require("./src/jobs/jobModule");
const registerApplicationModule = require("./src/applications/applicationModule");
const registerCandidateModule = require("./src/candidates/candidateModule");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server OK");
});

// Register Job routes
registerJobModule(app);

// Register Application routes
registerApplicationModule(app);

// Register Candidate routes
registerCandidateModule(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});