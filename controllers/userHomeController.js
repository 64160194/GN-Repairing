const UserHomeModel = require('../models/userHomeModel');

const userHomeController = {
  showUserHome: async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.redirect('/');
      }

      const user = await UserHomeModel.getUserById(req.session.userId);

      if (!user) {
        return res.redirect('/');
      }

      res.render('user_home', { user: user });
    } catch (error) {
      console.error('Error in showUserHome:', error);
      res.status(500).render('error', { message: 'An error occurred while loading the user home page.' });
    }
  }
};

module.exports = userHomeController;