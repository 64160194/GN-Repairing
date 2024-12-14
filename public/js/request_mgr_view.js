
function approveRequest(reqId) {
    if (confirm('Are you sure you want to approve this repair request ?')) {
        fetch(`/request_mgr/approve/${reqId}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('The repair request has been successfully approved.');
                    window.location.href = '/request_mgr';
                } else {
                    alert('An error occurred while approving the repair request.');
                }
            });
    }
}

function rejectRequest(reqId) {
    if (confirm('Are you sure you want to reject this repair request?')) {
        fetch(`/request_mgr/reject/${reqId}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('The repair request has been successfully rejected.');
                    window.location.href = '/request_mgr';
                } else {
                    alert('An error occurred while rejecting the repair request.');
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
            alert('An error occurred.: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting the request.');
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
            await Swal.fire({
                icon: 'success',
                title: isApproved ? 'Approval successful.' : 'Rejection successful.',
                text: isApproved ? 'Request has been approved.' : 'The request has been rejected.',
                confirmButtonText: 'Okay!'
            });

            window.location.href = '/request_mgr';
        } else {
            throw new Error(data.message || 'An unknown error occurred.');
        }
    } catch (error) {
        console.error('Error:', error);
        await Swal.fire({
            icon: 'error',
            title: 'An error occurred.',
            text: error.message || 'An error occurred during the operation.',
            confirmButtonText: 'Okay!'
        });
    } finally {
        document.querySelectorAll('button').forEach(btn => btn.disabled = false);
    }
}

function updateUI(isApproved) {
    const approveButton = document.querySelector('.btn-success');
    const rejectButton = document.querySelector('.btn-danger');
    const buttonContainer = approveButton.parentElement;

    buttonContainer.innerHTML = '';

    if (isApproved) {
        buttonContainer.innerHTML = '<button class="btn btn-success me-2" disabled>Approved</button>';
    } else {
        buttonContainer.innerHTML = '<button class="btn btn-danger" disabled>Rejected</button>';
    }
}

async function approveRequest(reqId) {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "Are you sure you want to approve this repair request?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, approve it!',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        await handleRequest(reqId, true);
    }
}

async function rejectRequest(reqId) {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You want to reject this repair request?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, reject it.!',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        await handleRequest(reqId, false);
    }
}