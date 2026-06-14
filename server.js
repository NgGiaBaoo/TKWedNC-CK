const express = require("express");
const db = require("./localdb");
const registerJobModule = require("./jobs/jobModule");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server OK");
});

// Register Job routes
registerJobModule(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});