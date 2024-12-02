document.addEventListener('DOMContentLoaded', function() {

    document.querySelectorAll('.edit-dept').forEach(button => {
        button.addEventListener('click', function() {
            const deptId = this.getAttribute('data-id');

            console.log('Edit department:', deptId);
        });
    });

    document.querySelectorAll('.delete-dept').forEach(button => {
        button.addEventListener('click', function() {
            const deptId = this.getAttribute('data-id');
            Swal.fire({
                title: 'คุณแน่ใจหรือไม่ ?',
                text: "คุณต้องการลบแผนกนี้ใช่หรือไม่ ?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ใช่, ลบเลย !',
                cancelButtonText: 'ยกเลิก'
            }).then((result) => {
                if (result.isConfirmed) {

                    console.log('Delete department:', deptId);

                    Swal.fire(
                        'ลบแล้ว !',
                        'แผนกถูกลบเรียบร้อยแล้ว',
                        'success'
                    )
                }
            })
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addDeptBtn').addEventListener('click', function() {
        Swal.fire({
            title: 'เพิ่มแผนกใหม่',
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="ชื่อแผนก">',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'เพิ่ม',
            cancelButtonText: 'ยกเลิก',
            preConfirm: () => {
                const deptName = document.getElementById('swal-input1').value;
                if (!deptName) {
                    Swal.showValidationMessage('กรุณากรอกชื่อแผนก');
                }
                return { deptName: deptName }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // ส่งข้อมูลไปยัง server เพื่อบันทึกแผนกใหม่
                fetch('/api/departments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ deptName: result.value.deptName })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire(
                            'เพิ่มแผนกสำเร็จ!',
                            'แผนกใหม่ถูกเพิ่มเรียบร้อยแล้ว',
                            'success'
                        ).then(() => {
                            // รีโหลดหน้าเพื่อแสดงข้อมูลใหม่
                            location.reload();
                        });
                    } else {
                        Swal.fire(
                            'เกิดข้อผิดพลาด!',
                            'ไม่สามารถเพิ่มแผนกได้',
                            'error'
                        );
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire(
                        'เกิดข้อผิดพลาด!',
                        'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
                        'error'
                    );
                });
            }
        })
    });
});