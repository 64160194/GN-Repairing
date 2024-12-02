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
            res.json({ success: true, message: 'แผนกถูกเพิ่มเรียบร้อยแล้ว', id: result.insertId });
        } catch (error) {
            console.error('Error adding department:', error);
            res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการเพิ่มแผนก' });
        }
    },

    deleteDepartment: async (req, res) => {
        try {
            const { deptId } = req.body;
            const result = await manageDeptModel.deleteDepartment(deptId);
            if (result && result.affectedRows > 0) {
                res.json({ success: true, message: 'แผนกถูกลบเรียบร้อยแล้ว' });
            } else {
                res.status(400).json({ success: false, message: 'ไม่สามารถลบแผนกได้' });
            }
        } catch (error) {
            console.error('Error deleting department:', error);
            res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการลบแผนก' });
        }
    },

    toggleDepartmentStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await manageDeptModel.toggleDepartmentStatus(id);
            if (result && result.affectedRows > 0) {
                res.json({ success: true, message: 'สถานะแผนกถูกเปลี่ยนเรียบร้อยแล้ว' });
            } else {
                res.status(400).json({ success: false, message: 'ไม่สามารถเปลี่ยนสถานะแผนกได้' });
            }
        } catch (error) {
            console.error('Error toggling department status:', error);
            res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะแผนก' });
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