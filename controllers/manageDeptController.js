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
            const { dept_name } = req.body;
            const newId = await manageDeptModel.addDepartment(dept_name);
            res.json({ success: true, message: 'The Department has been added successfully.', id: newId });
        } catch (error) {
            console.error('An error occurred while adding the department:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ success: false, message: 'A department with this name already exists. มีแผนกที่ใช้ชื่อนี้อยู่แล้ว' });
            } else {
                res.status(500).json({ success: false, message: 'An error occurred while adding the department. เกิดข้อผิดพลาดขณะเพิ่มแผนก' });
            }
        }
    },

    checkDepartmentUsers: async (req, res) => {
        try {
            const deptId = req.params.deptId;
            const hasUsers = await manageDeptModel.checkDepartmentUsers(deptId);
            res.json({ hasUsers });
        } catch (error) {
            console.error('Error checking department users:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    deleteDepartment: async (req, res) => {
        try {
            const { deptId } = req.body;
    
            // ตรวจสอบว่ามีผู้ใช้งานในแผนกหรือไม่
            const hasUsers = await manageDeptModel.checkDepartmentUsers(deptId);
    
            if (hasUsers) {
                return res.status(400).json({
                    success: false,
                    message: 'The Department cannot be deleted because there are users assigned to it. ไม่สามารถลบแผนกได้เนื่องจากมีผู้ใช้งานอยู่ในแผนกนี้'
                });
            }
    
            // ถ้าไม่มีผู้ใช้งาน ดำเนินการลบแผนก
            const result = await manageDeptModel.deleteDepartment(deptId);
    
            if (result && result.affectedRows > 0) {
                res.json({ success: true, message: 'The Department has been deleted successfully.' });
            } else {
                res.status(400).json({ success: false, message: 'The Department could not be deleted. It may not exist or there is another error.' });
            }
        } catch (error) {
            console.error('Error deleting department:', error);
            res.status(500).json({ success: false, message: 'Error Deleting Department' });
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
            if (!deptName || deptName.trim() === '') {
                return res.status(400).json({ success: false, message: 'ชื่อแผนกไม่สามารถเว้นว่างได้' });
            }
            const result = await manageDeptModel.updateDepartment(deptId, deptName);
            if (result) {
                res.json({ success: true, message: 'The Department has been updated successfully.' });
            } else {
                res.json({ success: false, message: 'Unable to update Department.' });
            }
        } catch (error) {
            console.error('Error updating department:', error);
            res.status(500).json({ success: false, message: 'Error Updating Department.' });
        }
    }
};

module.exports = manageDeptController;