document.addEventListener('DOMContentLoaded', function () {
    const loadReportBtn = document.getElementById('load-report');
    const exportBtn = document.getElementById('export-report');
    const submissionsList = document.getElementById('submissions-list');
    const totalSubmissionsEl = document.getElementById('total-submissions');
    const uniqueEmailsEl = document.getElementById('unique-emails');
    const avgPerDayEl = document.getElementById('avg-per-day');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');

    let currentData = [];

    // Format date for display
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    // Calculate days between dates
    function daysBetween(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(diffDays, 1);
    }

    // Update statistics
    function updateStats(submissions, startDate, endDate) {
        const total = submissions.length;
        const uniqueEmails = new Set(submissions.map(s => s.email)).size;
        const days = daysBetween(startDate, endDate);
        const avgPerDay = total > 0 ? (total / days).toFixed(1) : '0';

        totalSubmissionsEl.textContent = total;
        uniqueEmailsEl.textContent = uniqueEmails;
        avgPerDayEl.textContent = avgPerDay;
    }

    // Render submissions list
    function renderSubmissions(submissions) {
        if (submissions.length === 0) {
            submissionsList.innerHTML = '<div class="no-data">No submissions found for the selected date range.</div>';
            return;
        }

        const submissionsHTML = submissions.map(submission => `
            <div class="submission-item">
                <div class="submission-email">${submission.email || 'N/A'}</div>
                <div class="submission-message">${submission.message || submission.text || 'Form submission'}</div>
                <div class="submission-date">${formatDate(submission.timestamp || submission.ts || new Date())}</div>
            </div>
        `).join('');

        submissionsList.innerHTML = submissionsHTML;
    }

    // Load data from localStorage (fallback)
    function loadFromLocalStorage(startDate, endDate) {
        const localData = JSON.parse(localStorage.getItem('ai_file_requests') || '[]');
        
        const filteredData = localData.filter(item => {
            if (!item.ts && !item.timestamp) return false;
            const itemDate = new Date(item.ts || item.timestamp);
            return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        });

        return filteredData;
    }

    // Mock data for demonstration (since we can't actually query the Supabase backend without proper authentication)
    function generateMockData(startDate, endDate) {
        const mockSubmissions = [
            {
                email: 'john.doe@example.com',
                message: 'agentbase inbound',
                timestamp: '2025-08-20T14:30:00.000Z'
            },
            {
                email: 'sarah.smith@company.com',
                message: 'agentbase inbound',
                timestamp: '2025-08-22T10:15:00.000Z'
            },
            {
                email: 'mike.johnson@startup.io',
                message: 'agentbase inbound',
                timestamp: '2025-09-01T16:45:00.000Z'
            },
            {
                email: 'lisa.brown@agency.net',
                message: 'agentbase inbound',
                timestamp: '2025-09-10T09:20:00.000Z'
            },
            {
                email: 'david.wilson@marketing.com',
                message: 'agentbase inbound',
                timestamp: '2025-09-15T11:30:00.000Z'
            },
            {
                email: 'emma.davis@consulting.org',
                message: 'agentbase inbound',
                timestamp: '2025-09-20T13:45:00.000Z'
            }
        ];

        // Filter mock data by date range
        const filteredData = mockSubmissions.filter(item => {
            const itemDate = new Date(item.timestamp);
            return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        });

        return filteredData;
    }

    // Load feedback report
    async function loadReport() {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert('Start date must be before end date');
            return;
        }

        submissionsList.innerHTML = '<div class="loading-message">Loading feedback data...</div>';
        loadReportBtn.disabled = true;
        loadReportBtn.textContent = 'Loading...';

        try {
            let submissions = [];

            // Try to load from localStorage first (fallback data)
            const localData = loadFromLocalStorage(startDate, endDate);
            
            if (localData.length > 0) {
                submissions = localData;
                console.log('Loaded data from localStorage:', submissions.length, 'submissions');
            } else {
                // If no local data, show mock data for demonstration
                submissions = generateMockData(startDate, endDate);
                console.log('Using mock data for demonstration:', submissions.length, 'submissions');
            }

            // Note: In a real implementation, you would query the Supabase backend here
            // However, since we don't have read access to the backend, we use fallback/mock data

            currentData = submissions;
            updateStats(submissions, startDate, endDate);
            renderSubmissions(submissions);

        } catch (error) {
            console.error('Error loading feedback data:', error);
            submissionsList.innerHTML = `
                <div class="error-message">
                    Error loading feedback data: ${error.message}<br>
                    <small>Note: This demo shows sample data. In production, this would connect to the Supabase backend.</small>
                </div>
            `;
        } finally {
            loadReportBtn.disabled = false;
            loadReportBtn.textContent = 'Generate Report';
        }
    }

    // Export to CSV
    function exportToCSV() {
        if (currentData.length === 0) {
            alert('No data to export. Please generate a report first.');
            return;
        }

        const headers = ['Email', 'Message', 'Timestamp'];
        const csvContent = [
            headers.join(','),
            ...currentData.map(item => [
                `"${item.email || 'N/A'}"`,
                `"${item.message || item.text || 'Form submission'}"`,
                `"${item.timestamp || item.ts || new Date()}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `feedback-report-${startDateInput.value}-to-${endDateInput.value}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    // Event listeners
    loadReportBtn.addEventListener('click', loadReport);
    exportBtn.addEventListener('click', exportToCSV);

    // Auto-generate report on page load with default dates
    setTimeout(loadReport, 500);
});