document.addEventListener('DOMContentLoaded', function () {
    const addMemberForm = document.getElementById('addMemberForm');
    const addMemberModal = new bootstrap.Modal(document.getElementById('addMemberModal'));
    const submitAddMember = document.getElementById('submitAddMember');

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

    // ส่วนของการกรองข้อมูล
    const departmentFilter = document.getElementById('departmentFilter');
    const roleFilter = document.getElementById('roleFilter');
    const memberTable = document.getElementById('memberTable');

    function filterTable() {
        const departmentValue = departmentFilter.value;
        const roleValue = roleFilter.value;
        const rows = memberTable.getElementsByTagName('tbody')[0].rows;

        for (let i = 0; i < rows.length; i++) {
            const departmentCell = rows[i].cells[3];
            const roleCell = rows[i].cells[4];
            const departmentMatch = !departmentValue || departmentCell.textContent.trim() === departmentValue;
            const roleMatch = !roleValue || roleCell.textContent.trim() === roleValue;

            if (departmentMatch && roleMatch) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }

    departmentFilter.addEventListener('change', filterTable);
    roleFilter.addEventListener('change', filterTable);

    // ส่วนของการแก้ไขและลบสมาชิก
    memberTable.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-member')) {
            const memberId = e.target.getAttribute('data-id');
            // เพิ่มโค้ดสำหรับการแก้ไขสมาชิกที่นี่
            console.log('Edit member with ID:', memberId);
        } else if (e.target.classList.contains('delete-member')) {
            const memberId = e.target.getAttribute('data-id');
            // เพิ่มโค้ดสำหรับการลบสมาชิกที่นี่
            console.log('Delete member with ID:', memberId);
        }
    });
});