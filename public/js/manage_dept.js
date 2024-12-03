document.addEventListener('DOMContentLoaded', function() {
    // Existing code...

    // Edit department
    const editButtons = document.querySelectorAll('.edit-dept');
    const editModal = new bootstrap.Modal(document.getElementById('editDeptModal'));
    const editForm = document.getElementById('editDeptForm');
    const editDeptId = document.getElementById('editDeptId');
    const editDeptName = document.getElementById('editDeptName');
    const saveDeptChanges = document.getElementById('saveDeptChanges');

    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const deptId = this.getAttribute('data-id');
            const deptName = this.getAttribute('data-name');
            editDeptId.value = deptId;
            editDeptName.value = deptName;
            editModal.show();
        });
    });

    saveDeptChanges.addEventListener('click', function() {
        const deptId = editDeptId.value;
        const newDeptName = editDeptName.value;

        fetch('/manage_dept/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ deptId, newDeptName }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'แก้ไขสำเร็จ',
                    text: 'ชื่อแผนกถูกแก้ไขเรียบร้อยแล้ว',
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถแก้ไขชื่อแผนกได้',
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์',
            });
        });

        editModal.hide();
    });

    document.getElementById('saveDeptChanges').addEventListener('click', function() {
        const deptId = document.getElementById('editDeptId').value;
        const deptName = document.getElementById('editDeptName').value;

        fetch('/manage_dept/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ deptId, deptName }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ',
                    text: 'บันทึกการแก้ไขเรียบร้อยแล้ว',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    location.reload(); // รีโหลดหน้าเพื่อแสดงข้อมูลที่อัปเดต
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถบันทึกการแก้ไขได้: ' + data.message,
                });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์',
            });
        });
    });

});