const manageDeptModel = require('../models/manageDeptModel');

const manageDeptController = {
  getDepartments: async (req, res) => {
    try {
      const departments = await manageDeptModel.getAllDepartments();
      res.render('manage_dept', { 
        title: 'Manage Departments', 
        departments: departments,
        user: req.user
      });
    } catch (error) {
      console.error('Error fetching departments:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  addDepartment: async (req, res) => {
    try {
      const { name } = req.body;
      const result = await manageDeptModel.addDepartment(name);
      res.json({ success: true, message: 'Department added successfully', id: result.insertId });
    } catch (error) {
      console.error('Error adding department:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  deleteDepartment: async (req, res) => {
    try {
      const { id } = req.params;
      await manageDeptModel.deleteDepartment(id);
      res.json({ success: true, message: 'Department deleted successfully' });
    } catch (error) {
      console.error('Error deleting department:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  toggleDepartmentStatus: async (req, res) => {
    try {
      const { id } = req.params;
      await manageDeptModel.toggleDepartmentStatus(id);
      res.json({ success: true, message: 'Department status toggled successfully' });
    } catch (error) {
      console.error('Error toggling department status:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  updateDepartment: async (req, res) => {
    try {
      const { deptId, deptName } = req.body;
      const result = await manageDeptModel.updateDepartment(deptId, deptName);
      if (result) {
        res.json({ success: true, message: 'Department updated successfully' });
      } else {
        res.json({ success: false, message: 'ไม่สามารถอัปเดตแผนกได้' });
      }
    } catch (error) {
      console.error('Error updating department:', error);
      res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตแผนก' });
    }
  }
};

module.exports = manageDeptController;