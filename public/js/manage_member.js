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
                        title: 'Success !',
                        text: 'Member added successfully.',
                    }).then(() => {
                        addMemberModal.hide();
                        location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error !',
                        text: 'An error occurred while adding the member: ' + result.message,
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error !',
                    text: 'An error occurred while adding the member.',
                });
            });
    }

    submitAddMember.addEventListener('click', handleAddMember);

    addMemberModal._element.addEventListener('hidden.bs.modal', function () {
        addMemberForm.reset();
    });

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
                        title: 'Edit successful',
                        text: 'Member information has been updated successfully.',
                    }).then(() => {
                        editMemberModal.hide();
                        location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'An error occurred.',
                        text: result.message || 'Unable to edit member information.',
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
    });

    function handleDeleteMember(memberId) {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete this member?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it !',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/member_admin/delete/${memberId}`, {
                    method: 'GET',
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire(
                                'Deleted successfully!',
                                'The member has been removed from the system.',
                                'success'
                            ).then(() => {
                                location.reload();
                            });
                        } else {
                            Swal.fire(
                                'An error occurred!',
                                'Unable to delete the member.',
                                'error'
                            );
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire(
                            'An error occurred!',
                            'An error occurred while connecting to the server.',
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