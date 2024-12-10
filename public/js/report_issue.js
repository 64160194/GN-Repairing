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
        fetchDataAndUpdateCharts(selectedMonth, selectedYear);
    });

    fetchDataAndUpdateCharts();
});

function fetchDataAndUpdateCharts(month = '', year = '') {
    fetchRepairTypesData(month, year);
    fetchDepartmentRequestsData(month, year);
}

function fetchRepairTypesData(month = '', year = '') {
    const url = `/api/repair-types?month=${month}&year=${year}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Repair Types Data received:', data);
            const repairTypes = ['Facility (อาคารสถานที่)', 'Utility (สาธารณูปโภค)', 'Electrical System (ระบบไฟฟ้า)', 'Other (อื่น ๆ)'];
            const counts = repairTypes.map(type => {
                const item = data.find(d => d.repair_type === type);
                return item ? item.count : 0;
            });
            console.log('Processed repair types counts:', counts);

            createRepairTypeChart(repairTypes, counts);
            createRepairTypeLegend(repairTypes, counts);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('repairTypeChart').insertAdjacentHTML('afterend', `<p class="text-danger">Error loading repair types chart: ${error.message}</p>`);
        });
}

function fetchDepartmentRequestsData(month = '', year = '') {
    const url = `/api/department-requests?month=${month}&year=${year}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Department Requests Data received:', data);
            createDepartmentRequestsChart(data);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('departmentRequestsChart').insertAdjacentHTML('afterend', `<p class="text-danger">Error loading department requests chart: ${error.message}</p>`);
        });
}

//Pie Chart
function createRepairTypeChart(labels, data) {
    const ctx = document.getElementById('repairTypeChart').getContext('2d');
    if (window.myPieChart) {
        window.myPieChart.destroy();
    }
    window.myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
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
    console.log('Repair Type Chart created');
}

function createRepairTypeLegend(labels, data) {
    const legendContainer = document.getElementById('repairTypeLegend');
    legendContainer.innerHTML = '';
    
    labels.forEach((label, index) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'd-flex align-items-center mb-2';
        
        const colorBox = document.createElement('div');
        colorBox.style.width = '20px';
        colorBox.style.height = '20px';
        colorBox.style.backgroundColor = window.myPieChart.data.datasets[0].backgroundColor[index];
        colorBox.style.marginRight = '10px';
        
        const labelText = document.createElement('span');
        labelText.textContent = `${label}: ${data[index]}`;
        
        legendItem.appendChild(colorBox);
        legendItem.appendChild(labelText);
        legendContainer.appendChild(legendItem);
    });
}

//Bar Chart
function createDepartmentRequestsChart(data) {
    const ctx = document.getElementById('departmentRequestsChart').getContext('2d');
    if (window.myBarChart) {
        window.myBarChart.destroy();
    }
    window.myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.dept_name),
            datasets: [{
                label: 'Number of Requests',
                data: data.map(item => item.request_count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Requests'
                    },
                    ticks: {
                        stepSize: 1,
                        precision: 0
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Department'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Number of Requests by Department'
                }
            }
        }
    });
    console.log('Department Requests Chart created');
}