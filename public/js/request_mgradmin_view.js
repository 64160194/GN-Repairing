document.addEventListener('DOMContentLoaded', function() {
    const approveBtn = document.getElementById('approveBtn');
    const rejectBtn = document.getElementById('rejectBtn');

    if (approveBtn && approveBtn.disabled) {
        if (rejectBtn) rejectBtn.style.display = 'none';
    } else if (rejectBtn && rejectBtn.disabled) {
        if (approveBtn) approveBtn.style.display = 'none';
    }
});

function approveRequest(reqId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You are about to approve this request.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, approve it!'
    }).then((result) => {
        if (result.isConfirmed) {
            handleRequest(reqId, 'approve');
        }
    });
}

function rejectRequest(reqId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You are about to reject this request.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, reject it!'
    }).then((result) => {
        if (result.isConfirmed) {
            handleRequest(reqId, 'reject');
        }
    });
}

async function handleRequest(reqId, action) {
    try {
        const response = await fetch('/request_mgradmin/handle_request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ req_id: reqId, action: action }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: action === 'approve' ? 'Request Approved' : 'Request Rejected',
                text: result.message,
            }).then(() => {
                // Update the UI with the new data
                updateUIWithNewData(result.updatedRequest);
            });
        } else {
            throw new Error(result.message || 'An error occurred');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
        });
    }
}

function updateUI(action) {
    const approveBtn = document.getElementById('approveBtn');
    const rejectBtn = document.getElementById('rejectBtn');
    
    if (action === 'approve') {
        approveBtn.disabled = true;
        approveBtn.textContent = 'Approved';
        if (rejectBtn) rejectBtn.style.display = 'none';
    } else if (action === 'reject') {
        rejectBtn.disabled = true;
        rejectBtn.textContent = 'Rejected';
        if (approveBtn) approveBtn.style.display = 'none';
    }
}