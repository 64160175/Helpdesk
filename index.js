const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const authRoutes = require('./routes/authRoute'); // Corrected the file name

// ตั้งค่า view engine เป็น EJS
app.set('view engine', 'ejs');

// ตั้งค่า directory สำหรับ views
app.set('views', path.join(__dirname, 'views'));

// ตั้งค่า static directory สำหรับไฟล์ CSS และอื่นๆ
app.use(express.static(path.join(__dirname, 'public')));

// ใช้ body-parser เพื่ออ่านข้อมูลจากฟอร์ม
app.use(bodyParser.urlencoded({ extended: false }));

// ใช้ routes สำหรับการ login
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