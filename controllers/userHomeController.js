const userHomeController = {
  showUserHome: (req, res) => {
    res.render('user_home', { title: 'User Home', user: req.user });
  }
};

module.exports = userHomeController;