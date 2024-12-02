const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

const port = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// ตั้งค่า view engine เป็น EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ตั้งค่า session
app.use(session({
  secret: 'your_session_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // ตั้งเป็น true ถ้าใช้ HTTPS
}));

// Import routes
const loginRoutes = require('./routes/loginRoutes');
app.use('/', loginRoutes);

const userHomeRoutes = require('./routes/userHomeRoutes');
app.use('/user_home', userHomeRoutes);

const requestAdminRoutes = require('./routes/requestAdminRoutes');
app.use('/request_admin', requestAdminRoutes);

const addRequestRoutes = require('./routes/addRequestRoutes');
app.use('/add_request', addRequestRoutes);

const detailsRepairingRoutes = require('./routes/detailsRepairingRoutes');
app.use('/details_repairing', detailsRepairingRoutes);

const requestMgrRoutes = require('./routes/requestMgrRoutes');
app.use('/request_mgr', requestMgrRoutes);

const memberUserRoutes = require('./routes/memberUserRoutes');
app.use('/member_user', memberUserRoutes);

// เริ่ม server
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });