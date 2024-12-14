
function approveRequest(reqId) {
    if (confirm('คุณแน่ใจหรือไม่ที่จะอนุมัติคำขอซ่อมนี้?')) {
        // ส่ง request ไปยัง server เพื่ออนุมัติ
        fetch(`/request_mgr/approve/${reqId}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('อนุมัติคำขอซ่อมเรียบร้อยแล้ว');
                    window.location.href = '/request_mgr';
                } else {
                    alert('เกิดข้อผิดพลาดในการอนุมัติคำขอซ่อม');
                }
            });
    }
}

function rejectRequest(reqId) {
    if (confirm('คุณแน่ใจหรือไม่ที่จะปฏิเสธคำขอซ่อมนี้?')) {
        // ส่ง request ไปยัง server เพื่อปฏิเสธ
        fetch(`/request_mgr/reject/${reqId}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('ปฏิเสธคำขอซ่อมเรียบร้อยแล้ว');
                    window.location.href = '/request_mgr';
                } else {
                    alert('เกิดข้อผิดพลาดในการปฏิเสธคำขอซ่อม');
                }
            });
    }
}

function handleRequest(reqId, isApproved) {
    fetch('/request_mgr/handle_request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            req_id: reqId,
            is_approved: isApproved
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            window.location.href = '/request_mgr';
        } else {
            alert('เกิดข้อผิดพลาด: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการส่งคำขอ');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.clickable-image');
    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
    const enlargedImage = document.getElementById('enlargedImage');

    images.forEach(img => {
        img.addEventListener('click', function() {
            enlargedImage.src = this.src;
            modal.show();
        });
    });
});

async function handleRequest(reqId, isApproved) {
    console.log('Handling request:', reqId, 'isApproved:', isApproved);
    
    // Disable buttons to prevent multiple submissions
    document.querySelectorAll('button').forEach(btn => btn.disabled = true);

    try {
        const response = await fetch('/request_mgr/handle_request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                req_id: reqId,
                is_approved: isApproved
            })
        });

        const data = await response.json();

        if (data.success) {
            // อัปเดต UI โดยไม่ต้องรีโหลดหน้า
            updateUI(isApproved);

            await Swal.fire({
                icon: 'success',
                title: isApproved ? 'อนุมัติสำเร็จ' : 'ปฏิเสธสำเร็จ',
                text: isApproved ? 'คำขอได้รับการอนุมัติแล้ว' : 'คำขอถูกปฏิเสธแล้ว',
                confirmButtonText: 'ตกลง'
            });

        } else {
            throw new Error(data.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
        }
    } catch (error) {
        console.error('Error:', error);
        await Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: error.message || 'เกิดข้อผิดพลาดในการดำเนินการ',
            confirmButtonText: 'ตกลง'
        });
    } finally {
        // Re-enable buttons
        document.querySelectorAll('button').forEach(btn => btn.disabled = false);
    }
}

function updateUI(isApproved) {
    const approveButton = document.querySelector('.btn-success');
    const rejectButton = document.querySelector('.btn-danger');
    const buttonContainer = approveButton.parentElement;

    // ลบปุ่มทั้งหมด
    buttonContainer.innerHTML = '';

    // เพิ่มปุ่มใหม่ตามสถานะ
    if (isApproved) {
        buttonContainer.innerHTML = '<button class="btn btn-success me-2" disabled>Approved</button>';
    } else {
        buttonContainer.innerHTML = '<button class="btn btn-danger" disabled>Rejected</button>';
    }
}

function approveRequest(reqId) {
    Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: "ที่จะอนุมัติคำขอซ่อมนี้",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, อนุมัติ!',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            handleRequest(reqId, true);
        }
    });
}

function rejectRequest(reqId) {
    Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: "ที่จะปฏิเสธคำขอซ่อมนี้",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ปฏิเสธ!',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            handleRequest(reqId, false);
        }
    });
}