const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (req.user && req.user.role_id === requiredRole) {
      next();
    } else {
      res.status(403).render('unauthorized', { 
        title: 'Unauthorized Access',
        message: 'You do not have the required role to access this page'
      });
    }
  };
};

module.exports = roleMiddleware;