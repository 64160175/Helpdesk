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

//----------------------------------------------------------------------------

// Auth routes
const authRoutes = require('./routes/authRoute'); app.use('/', authRoutes);

//user
const userRoutes = require('./routes/userRoutes'); app.use('/', userRoutes);
const orderRoute = require('./routes/orderRoute');app.use('/', orderRoute);
//manager
const managerRoutes = require('./routes/managerRoutes'); app.use('/', managerRoutes);

//admin
const adminRoutes = require('./routes/adminRoutes'); app.use('/', adminRoutes);
const memberRoutes = require('./routes/memberRoute'); app.use('/', memberRoutes);
const warehouseRoutes = require('./routes/warehouseRoute'); app.use('/', warehouseRoutes);


app.use(express.json());
app.use('/member', memberRoutes);
app.use('/orders', orderRoute);


//--------------------------------------------------------------------------

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});