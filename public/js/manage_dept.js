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
                    title: 'Edit successful.',
                    text: 'The Department name has been successfully updated.',
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'An error occurred.',
                    text: data.message || 'Unable to update the department name',
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'An error occurred.',
                text: 'An error occurred while connecting to the server.',
            });
        });

        editModal.hide();
    });

    document.querySelectorAll('.delete-dept').forEach(button => {
        button.addEventListener('click', function() {
            const deptId = this.getAttribute('data-id');
            const deptName = this.getAttribute('data-name');
            
            Swal.fire({
                title: 'Are you sure?',
                text: `Do you want to delete the department "${deptName}" ?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
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
                        return response.json().then(data => {
                            if (!response.ok) {
                                throw new Error(data.message || 'Network response was not ok');
                            }
                            return data;
                        });
                    })
                    .then(data => {
                        if (data.success) {
                            Swal.fire(
                                'Deleted!',
                                'The Department has been deleted successfully.',
                                'success'
                            ).then(() => {
                                location.reload();
                            });
                        } else {
                            throw new Error(data.message || 'Unable to delete the department.');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire(
                            'An error occurred!',
                            error.message || 'An error occurred while connecting to the server.',
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
                    title: 'Department added successfully.',
                    text: data.message,
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'An error occurred.',
                    text: data.message,
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'An error occurred.',
                text: 'Unable to connect to the server.',
            });
        });
    });
});