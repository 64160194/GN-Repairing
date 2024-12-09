document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');

    // Populate year dropdown
    const yearSelect = document.getElementById('yearSelect');
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // Add event listener for the apply filter button
    document.getElementById('applyFilter').addEventListener('click', function() {
        const selectedMonth = document.getElementById('monthSelect').value;
        const selectedYear = document.getElementById('yearSelect').value;
        fetchDataAndUpdateChart(selectedMonth, selectedYear);
    });

    // Initial data fetch
    fetchDataAndUpdateChart();
});

function fetchDataAndUpdateChart(month = '', year = '') {
    fetch(`/api/repair-types?month=${month}&year=${year}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            const repairTypes = ['Facility (อาคารสถานที่)', 'Utility (สาธารณูปโภค)', 'Electrical System (ระบบไฟฟ้า)', 'Other (อื่น ๆ)'];
            const counts = repairTypes.map(type => {
                const item = data.find(d => d.repair_type === type);
                return item ? item.count : 0;
            });
            console.log('Processed counts:', counts);

            createChart(repairTypes, counts);
            createTable(repairTypes, counts);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('repairTypeChart').insertAdjacentHTML('afterend', `<p class="text-danger">Error loading chart: ${error.message}</p>`);
        });
}

function createChart(labels, data) {
    const ctx = document.getElementById('repairTypeChart').getContext('2d');
    
    // Clear previous chart if it exists
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Repairs',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
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
                        stepSize: 1,
                        precision: 0
                    }
                }
            },
        }
    });
}

function createTable(types, counts) {
    const tableBody = document.querySelector('#repairTypeTable tbody');
    tableBody.innerHTML = ''; // Clear existing table rows
    types.forEach((type, index) => {
        const row = tableBody.insertRow();
        const cellType = row.insertCell(0);
        const cellCount = row.insertCell(1);
        cellType.textContent = type;
        cellCount.textContent = counts[index];
    });
}