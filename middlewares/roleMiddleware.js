const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (req.user && req.user.role_id === parseInt(requiredRole)) {
      next();
    } else {
      res.status(403).render('unauthorized', {
        title: 'Unauthorized Access',
        message: 'คุณไม่มีสิทธิ์เข้าถึงการใช้งาน โปรดเข้าสู่ระบบใหม่อีกครั้ง'
      });
    }
  };
};

module.exports = roleMiddleware;