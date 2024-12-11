
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