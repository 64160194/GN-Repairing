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
            res.json({ success: true, message: 'แผนกถูกเพิ่มเรียบร้อยแล้ว', id: newId });
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการเพิ่มแผนก:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ success: false, message: 'มีแผนกที่ใช้ชื่อนี้อยู่แล้ว' });
            } else {
                res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดขณะเพิ่มแผนก' });
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
                    message: 'ไม่สามารถลบแผนกได้เนื่องจากมีผู้ใช้งานอยู่ในแผนกนี้'
                });
            }
    
            // ถ้าไม่มีผู้ใช้งาน ดำเนินการลบแผนก
            const result = await manageDeptModel.deleteDepartment(deptId);
    
            if (result && result.affectedRows > 0) {
                res.json({ success: true, message: 'แผนกถูกลบเรียบร้อยแล้ว' });
            } else {
                res.status(400).json({ success: false, message: 'ไม่สามารถลบแผนกได้ อาจเกิดจากแผนกไม่มีอยู่หรือมีข้อผิดพลาดอื่น' });
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
            if (!deptName || deptName.trim() === '') {
                return res.status(400).json({ success: false, message: 'ชื่อแผนกไม่สามารถเว้นว่างได้' });
            }
            const result = await manageDeptModel.updateDepartment(deptId, deptName);
            if (result) {
                res.json({ success: true, message: 'แผนกถูกอัปเดตเรียบร้อยแล้ว' });
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