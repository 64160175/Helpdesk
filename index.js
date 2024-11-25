const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();


// Set up session middleware
app.use(session({
  secret: 'masth2024',
  resave: false,
  saveUninitialized: true
}));

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up static directory
app.use(express.static(path.join(__dirname, 'public')));

// Use body-parser
app.use(bodyParser.urlencoded({ extended: false }));



// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
};

// Middleware to check user type
const checkUserType = (type) => {
  return (req, res, next) => {
    if (req.session.user && req.session.user.u_type === type) {
      next();
    } else {
      res.status(403).render('403');
    }
  };
};

app.get('/', (req, res) => {
  res.render('login');
});

const authRoutes = require('./routes/authRoute');
app.use('/', authRoutes);

//user
const userRoutes = require('./routes/userRoutes');
app.use('/', userRoutes);

//manager
const managerRoutes = require('./routes/managerRoutes');
app.use('/', managerRoutes);

//admin
const memberRoutes = require('./routes/memberRoute');
app.use('/', memberRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/', adminRoutes);


const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});