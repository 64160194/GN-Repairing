const manageDeptModel = require('../models/manageDeptModel');

const manageDeptController = {
  getDepartments: async (req, res) => {
    try {
      const departments = await manageDeptModel.getAllDepartments();
      res.render('manage_dept', { 
        title: 'Manage Department', 
        user: req.user,
        departments: departments
      });
    } catch (error) {
      console.error('Error fetching departments:', error);
      res.status(500).send('Internal Server Error');
    }
  }
};

module.exports = manageDeptController;