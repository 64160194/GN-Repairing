document.addEventListener('DOMContentLoaded', function () {
    const addMemberForm = document.getElementById('addMemberForm');
    const addMemberModal = new bootstrap.Modal(document.getElementById('addMemberModal'));
    const submitAddMember = document.getElementById('submitAddMember');
    const editMemberModal = new bootstrap.Modal(document.getElementById('editMemberModal'));
    const editMemberForm = document.getElementById('editMemberForm');
    const editMemberId = document.getElementById('editMemberId');
    const editDeptId = document.getElementById('editDeptId');
    const deptFilter = document.getElementById('deptFilter');
    const roleFilter = document.getElementById('roleFilter');
    const memberTable = document.getElementById('memberTable');

    // ฟังก์ชันสำหรับจัดการการเพิ่มสมาชิก
    function handleAddMember(e) {
        e.preventDefault();
        const formData = new FormData(addMemberForm);
        const data = Object.fromEntries(formData.entries());

        fetch('/member_admin/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'สำเร็จ !',
                        text: 'เพิ่มสมาชิกสำเร็จ',
                    }).then(() => {
                        addMemberModal.hide();
                        location.reload(); // รีโหลดหน้าเพื่อแสดงข้อมูลใหม่
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด !',
                        text: 'เกิดข้อผิดพลาดในการเพิ่มสมาชิก: ' + result.message,
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด !',
                    text: 'เกิดข้อผิดพลาดในการเพิ่มสมาชิก',
                });
            });
    }

    // เพิ่ม Event Listener สำหรับปุ่ม Submit
    submitAddMember.addEventListener('click', handleAddMember);

    // ฟังก์ชันสำหรับรีเซ็ตฟอร์มเมื่อปิด Modal
    addMemberModal._element.addEventListener('hidden.bs.modal', function () {
        addMemberForm.reset();
    });

    // ส่วนของการแก้ไขและลบสมาชิก
    memberTable.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-member')) {
            const memberId = e.target.getAttribute('data-id');
            handleEditMember(memberId);
        } else if (e.target.classList.contains('delete-member')) {
            const memberId = e.target.getAttribute('data-id');
            handleDeleteMember(memberId);
        }
    });

    function handleEditMember(memberId) {
        const currentDept = document.querySelector(`.edit-member[data-id="${memberId}"]`).getAttribute('data-dept');

        editMemberId.value = memberId;

        // ตั้งค่า department ปัจจุบันใน dropdown
        Array.from(editDeptId.options).forEach(option => {
            if (option.textContent === currentDept) {
                option.selected = true;
            }
        });

        editMemberModal.show();
    }

    // จัดการการส่งฟอร์มแก้ไข
    document.getElementById('submitEditMember').addEventListener('click', function () {
        const formData = new FormData(editMemberForm);
        const data = Object.fromEntries(formData.entries());

        fetch('/member_admin/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'แก้ไขสำเร็จ',
                        text: 'ข้อมูลสมาชิกถูกอัปเดตเรียบร้อยแล้ว',
                    }).then(() => {
                        editMemberModal.hide();
                        location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด',
                        text: result.message || 'ไม่สามารถแก้ไขข้อมูลสมาชิกได้',
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
    });

    function handleDeleteMember(memberId) {
        Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: "คุณต้องการลบสมาชิกนี้ใช่หรือไม่?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/member_admin/delete/${memberId}`, {
                    method: 'GET',
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire(
                                'ลบสำเร็จ!',
                                'สมาชิกถูกลบออกจากระบบแล้ว',
                                'success'
                            ).then(() => {
                                location.reload();
                            });
                        } else {
                            Swal.fire(
                                'เกิดข้อผิดพลาด!',
                                'ไม่สามารถลบสมาชิกได้',
                                'error'
                            );
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire(
                            'เกิดข้อผิดพลาด!',
                            'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์',
                            'error'
                        );
                    });
            }
        });
    }

    function filterTable() {
        const deptId = deptFilter.value;
        const roleId = roleFilter.value;

        const rows = memberTable.querySelectorAll('tbody tr');

        rows.forEach(function (row) {
            let showRow = true;

            if (deptId) {
                const deptCell = row.querySelector('td:nth-child(3)');
                const selectedDeptOption = deptFilter.querySelector(`option[value="${deptId}"]`);
                if (deptCell.textContent.trim() !== selectedDeptOption.textContent) {
                    showRow = false;
                }
            }

            if (roleId) {
                const roleCell = row.querySelector('td:nth-child(5)');
                const selectedRoleOption = roleFilter.querySelector(`option[value="${roleId}"]`);
                if (roleCell.textContent.trim() !== selectedRoleOption.textContent) {
                    showRow = false;
                }
            }

            row.style.display = showRow ? '' : 'none';
        });
    }

    deptFilter.addEventListener('change', filterTable);
    roleFilter.addEventListener('change', filterTable);

    filterTable();
});