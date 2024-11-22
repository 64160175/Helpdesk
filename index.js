const express = require('express');
const path = require('path');
const app = express();

// ตั้งค่า view engine เป็น EJS
app.set('view engine', 'ejs');

// ตั้งค่า directory สำหรับ views
app.set('views', path.join(__dirname, 'views'));

// ตั้งค่า static directory สำหรับไฟล์ CSS และอื่นๆ
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.render('AdminRequestList');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});