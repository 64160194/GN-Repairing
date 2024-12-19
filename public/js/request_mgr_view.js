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
            handleRequest(reqId, true);
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
            handleRequest(reqId, false);
        }
    });
}

async function handleRequest(reqId, isApproved) {
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
            throw new Error(data.message || 'An error occurred');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message || 'Something went wrong!',
        });
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