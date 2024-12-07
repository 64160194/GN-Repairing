document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    const ctx = document.getElementById('repairTypeChart');
    if (!ctx) {
        console.error('Canvas element not found');
        return;
    }
    console.log('Canvas element found');

    fetch('/api/repair-types')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            const repairTypes = ['Facility (อาคารสถานที่)','Utility (สาธารณูปโภค)','Electrical System (ระบบไฟฟ้า)','Other (อื่น ๆ)'];
            const counts = repairTypes.map(type => {
                const item = data.find(d => d.repair_type === type);
                return item ? item.count : 0;
            });
            console.log('Processed counts:', counts);

            createChart(ctx, repairTypes, counts);
            createTable(repairTypes, counts);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('repairTypeChart').insertAdjacentHTML('afterend', `<p class="text-danger">Error loading chart: ${error.message}</p>`);
        });
});

function createChart(ctx, labels, data) {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Repairs',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Distribution of Repair Types'
                }
            }
        }
    });
    console.log('Chart created');
}

function createTable(types, counts) {
    const tableBody = document.querySelector('#repairTypeTable tbody');
    types.forEach((type, index) => {
        const row = tableBody.insertRow();
        const cellType = row.insertCell(0);
        const cellCount = row.insertCell(1);
        cellType.textContent = type;
        cellCount.textContent = counts[index];
    });
    console.log('Table created');
}

