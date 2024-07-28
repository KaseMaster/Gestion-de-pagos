document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const uploadBtn = document.getElementById('uploadBtn');
    const csvFile = document.getElementById('csvFile');
    const portfolioTable = document.getElementById('portfolioTable');
    const clearPaymentsBtn = document.getElementById('clearPaymentsBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadPaymentsBtn = document.getElementById('downloadPaymentsBtn');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
            mobileMenu.classList.add('hidden');
        }
    });

    // Dark mode toggle
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        });
    }

    // Auto-scroll table
    portfolioTable.addEventListener('mousemove', (event) => {
        const tableWidth = portfolioTable.offsetWidth;
        const mouseX = event.clientX;
        const scrollAmount = 20; // Adjust this value as needed

        if (mouseX > tableWidth - 50) {
            portfolioTable.scrollLeft += scrollAmount;
        } else if (mouseX < 50) {
            portfolioTable.scrollLeft -= scrollAmount;
        }
    });

    uploadBtn.addEventListener('click', () => {
        const file = csvFile.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                updateTable(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });

    function updateTable(data) {
        const tbody = portfolioTable.querySelector('tbody');
        tbody.innerHTML = '';

        data.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="py-2 px-4 border-b"><input type="date" class="start-date" data-index="${index}" value="${row.start_date}"></td>
                <td class="py-2 px-4 border-b"><input type="date" class="end-grace-period" data-index="${index}" value="${row.end_grace_period}" readonly></td>
                <td class="py-2 px-4 border-b"><input type="text" class="name" data-index="${index}" value="${row.name}"></td>
                <td class="py-2 px-4 border-b"><input type="text" class="portfolio" data-index="${index}" value="${row.portfolio}"></td>
                <td class="py-2 px-4 border-b"><input type="number" class="initial-capital" data-index="${index}" value="${row.initial_capital}"></td>
                <td class="py-2 px-4 border-b"><input type="number" class="return-percentage" data-index="${index}" value="${row.return_percentage}"></td>
                <td class="py-2 px-4 border-b"><input type="date" class="next-payment-date" data-index="${index}" value="${row.next_payment_date}"></td>
                <td class="py-2 px-4 border-b"><input type="number" class="total-to-pay" data-index="${index}" value="${row.total_to_pay}" readonly></td>
                <td class="py-2 px-4 border-b"><input type="text" class="notes" data-index="${index}" value="${row.notes}"></td>
            `;
            tbody.appendChild(tr);
        });
        addEventListenersToInputs();
        // Remove the call to initializeHorizontalScroll as it's not defined
    }

    function addEventListenersToInputs() {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('change', updateRowData);
        });
    }

    function updateRowData(event) {
        const input = event.target;
        const index = input.dataset.index;
        const row = input.closest('tr');

        const startDate = row.querySelector('.start-date').value;
        const endGracePeriod = row.querySelector('.end-grace-period');
        const initialCapital = parseFloat(row.querySelector('.initial-capital').value);
        const returnPercentage = parseFloat(row.querySelector('.return-percentage').value);
        const totalToPay = row.querySelector('.total-to-pay');

        if (startDate) {
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 30);
            endGracePeriod.value = endDate.toISOString().split('T')[0];
        }

        if (!isNaN(initialCapital) && !isNaN(returnPercentage)) {
            totalToPay.value = (initialCapital * returnPercentage / 100).toFixed(2);
        }
    }

    clearPaymentsBtn.addEventListener('click', () => {
        const totalToPayInputs = document.querySelectorAll('.total-to-pay');
        totalToPayInputs.forEach(input => {
            input.value = '';
        });
    });

    downloadBtn.addEventListener('click', () => {
        const rows = Array.from(portfolioTable.querySelectorAll('tbody tr'));
        const csvContent = rows.map(row => {
            const inputs = row.querySelectorAll('input');
            return Array.from(inputs).map(input => input.value).join(',');
        }).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'portfolio.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    downloadPaymentsBtn.addEventListener('click', () => {
        const rows = Array.from(portfolioTable.querySelectorAll('tbody tr'));
        const csvContent = rows.map(row => {
            const portfolio = row.querySelector('.portfolio').value;
            const totalToPay = row.querySelector('.total-to-pay').value;
            return `${portfolio},${totalToPay}`;
        }).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'pagos.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    portfolioTable.addEventListener('mousemove', (event) => {
        const tableRect = portfolioTable.getBoundingClientRect();
        const mouseX = event.clientX - tableRect.left;
        const scrollAmount = 20; // Adjust this value as needed
        const scrollThreshold = 50; // Adjust this value as needed

        if (mouseX > tableRect.width - scrollThreshold) {
            portfolioTable.scrollLeft += scrollAmount;
        } else if (mouseX < scrollThreshold) {
            portfolioTable.scrollLeft -= scrollAmount;
        }
    });
});