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
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// ตั้งค่า view engine เป็น EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

const memberAdminRoutes = require('./routes/memberAdminRoutes');
app.use('/member_admin', memberAdminRoutes);

const manageDeptRoutes = require('./routes/manageDeptRoutes');
app.use('/manage_dept', manageDeptRoutes);

const requestMgrAdminRoutes = require('./routes/requestMgrAdminRoutes');
app.use('/request_mgradmin', requestMgrAdminRoutes);

const reportIssueController = require('./controllers/reportIssueController');
app.get('/api/repair-types', reportIssueController.getRepairTypesData);
app.get('/api/department-requests', reportIssueController.getDepartmentRequestsData);

const reportIssueRoutes = require('./routes/reportIssueRoutes');
app.use('/report_issue', reportIssueRoutes);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });