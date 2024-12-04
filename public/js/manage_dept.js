document.addEventListener('DOMContentLoaded', function() {
    const editButtons = document.querySelectorAll('.edit-dept');
    const editModal = new bootstrap.Modal(document.getElementById('editDeptModal'));
    const editForm = document.getElementById('editDeptForm');
    const editDeptId = document.getElementById('editDeptId');
    const editDeptName = document.getElementById('editDeptName');
    const saveDeptChanges = document.getElementById('saveDeptChanges');
    const addDeptBtn = document.getElementById('addDeptBtn');
    const addDeptModal = new bootstrap.Modal(document.getElementById('addDeptModal'));

    // เพิ่มการอ้างอิงถึงอิลิเมนต์สำหรับการค้นหา
    const searchDept = document.getElementById('searchDept');
    const deptTable = document.querySelector('table');
    const deptRows = deptTable.querySelectorAll('tbody tr');

    // ฟังก์ชันสำหรับกรองแผนก
    function filterDepartments(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        deptRows.forEach(row => {
            const deptName = row.querySelector('td:first-child').textContent.toLowerCase();
            if (deptName.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Event listener สำหรับปุ่มค้นหา
    searchDept.addEventListener('input', function() {
        filterDepartments(this.value);
    });

    searchDept.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filterDepartments(this.value);
        }
    });

    // Event listener สำหรับปุ่ม "เพิ่มแผนกใหม่"
    if (addDeptBtn) {
        addDeptBtn.addEventListener('click', function() {
            addDeptModal.show();
        });
    }

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

        fetch('/manage_dept/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ deptId, deptName: newDeptName }),
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
                    text: data.message || 'ไม่สามารถแก้ไขชื่อแผนกได้',
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

    document.querySelectorAll('.delete-dept').forEach(button => {
        button.addEventListener('click', function() {
            const deptId = this.getAttribute('data-id');
            const deptName = this.getAttribute('data-name');
            
            Swal.fire({
                title: 'คุณแน่ใจหรือไม่?',
                text: `คุณต้องการลบแผนก "${deptName}" ใช่หรือไม่?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'ใช่, ลบเลย!',
                cancelButtonText: 'ยกเลิก'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch('/manage_dept/delete', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ deptId: deptId })
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.success) {
                            Swal.fire(
                                'ลบแล้ว!',
                                'แผนกถูกลบเรียบร้อยแล้ว',
                                'success'
                            ).then(() => {
                                location.reload();
                            });
                        } else {
                            throw new Error(data.message || 'ไม่สามารถลบแผนกได้');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire(
                            'เกิดข้อผิดพลาด!',
                            error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์',
                            'error'
                        );
                    });
                }
            });
        });
    });
    
    // เพิ่มฟังก์ชันสำหรับการเพิ่มแผนกใหม่
    document.getElementById('addDeptForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const newDeptName = document.getElementById('newDeptName').value;
    
        fetch('/manage_dept/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dept_name: newDeptName }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'เพิ่มแผนกสำเร็จ',
                    text: data.message,
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: data.message,
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
            });
        });
    });
});