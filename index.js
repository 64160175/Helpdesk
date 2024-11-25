const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const authRoutes = require('./routes/authRoute');

// Set up session middleware
app.use(session({
  secret: 'your_secret_key',
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

// Use auth routes
app.use('/', authRoutes);

app.get('/', (req, res) => {
  res.render('login');
});

app.get('/AdminRequestList', (req, res) => {
  res.render('AdminRequestList');
});

app.get('/ManagerRequestList', (req, res) => {
  res.render('ManagerRequestList');
});

app.get('/UserHome', (req, res) => {
  res.render('UserHome');
});

app.get('/UserRequest', (req, res) => {
  res.render('UserRequest');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});