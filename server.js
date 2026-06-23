const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const db = require("./localdb");
const registerJobModule = require("./src/jobs/jobModule");
const registerApplicationModule = require("./src/applications/applicationModule");
const registerCandidateModule = require("./src/candidates/candidateModule");

const app = express();

app.use(express.json());
app.use(cookieParser('your-secret-key'));
app.use(
  session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
  }),
);

app.get("/", (req, res) => {
    res.send("Server OK");
});

// Job routes
registerJobModule(app);

// Application routes
registerApplicationModule(app);

// Candidate routes
registerCandidateModule(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});