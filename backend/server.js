const dotenv = require("dotenv").config({path : '../.env'});
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
const connection = require("./src/config/database");
const { requireAuth, requireRole } = require("./src/middleware/auth");
const crypto = require("crypto");
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan('combined'));
app.use(cookieParser(process.env.COOKIE_SECRET));

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const sessionStore = new MySQLStore({}, connection);

app.use(
  session({
    secret: process.env.SESSION_KEY,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    }
  }),
);

// Apply rate limiting to login and register only
app.use("/auth/login", authLimiter);
app.use("/auth/register", authLimiter);
app.use("/auth", require("./src/controllers/auth"));
// Employers: GET for read, PUT/POST for employer to manage own profile; DELETE is Admin-only
app.use("/employers", requireAuth, (req, res, next) => {
  if (req.method === 'GET' || req.method === 'PUT' || req.method === 'POST') return next();
  requireRole("Admin")(req, res, next);
}, require("./src/controllers/employer"));

app.use("/jobs", requireAuth, require("./src/controllers/job"));
// Applications: GET is role-aware in controller (Candidate sees own, Employer sees own, Admin sees all)
// POST for Candidates to apply, PUT/DELETE are Admin-only
app.use("/applications", requireAuth, (req, res, next) => {
  if (req.method === 'GET' || req.method === 'POST') return next();
  requireRole("Admin")(req, res, next);
}, require("./src/controllers/application"));
// Candidates: GET is role-aware (Candidate/Employer can read own data, Admin sees all)
// PUT/POST for candidates to manage own profile; DELETE is Admin-only
app.use("/candidates", requireAuth, (req, res, next) => {
  if (req.method === 'GET' || req.method === 'PUT' || req.method === 'POST') return next();
  requireRole("Admin")(req, res, next);
}, require("./src/controllers/candidate"));
app.use("/users", requireAuth, requireRole("Admin"), require("./src/controllers/user"));

const PORT = process.env.BACKEND_PORT || 3000; // Default port : 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});