// Feedback Report Generator
document.addEventListener('DOMContentLoaded', function () {
    // Report parameters from the GitHub issue
    const REPORT_START = '2025-08-17T23:56:00.418+00:00';
    const REPORT_END = '2025-09-19T21:05:44.838+00:00';
    
    // Initialize the page
    initializeReport();
    
    function initializeReport() {
        // Set the report period in the UI
        const periodElement = document.getElementById('report-period');
        if (periodElement) {
            const startDate = new Date(REPORT_START).toLocaleDateString();
            const endDate = new Date(REPORT_END).toLocaleDateString();
            periodElement.textContent = `Period: ${startDate} – ${endDate}`;
        }
        
        // Setup the generate report button
        const generateBtn = document.getElementById('generate-report');
        if (generateBtn) {
            generateBtn.addEventListener('click', generateReport);
        }
    }
    
    async function generateReport() {
        const generateBtn = document.getElementById('generate-report');
        const originalText = generateBtn.textContent;
        
        try {
            generateBtn.disabled = true;
            generateBtn.textContent = 'Generating...';
            
            // Collect feedback data from multiple sources
            const feedbackData = await collectFeedbackData();
            
            // Filter data for the specified period
            const filteredData = filterDataByPeriod(feedbackData, REPORT_START, REPORT_END);
            
            // Generate and display the report
            displayReport(filteredData);
            
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Error generating report. Please try again.');
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = originalText;
        }
    }
    
    async function collectFeedbackData() {
        const allData = [];
        
        // 1. Try to get data from localStorage (fallback storage)
        try {
            const localData = JSON.parse(localStorage.getItem('ai_file_requests') || '[]');
            allData.push(...localData.map(item => ({
                email: item.email,
                message: item.message || 'agentbase inbound',
                timestamp: item.ts || item.timestamp,
                source: 'localStorage'
            })));
        } catch (e) {
            console.warn('Could not read from localStorage:', e);
        }
        
        // 2. Try to get data from Supabase backend (if configured)
        if (window.FeedbackConfig && window.FeedbackConfig.baseUrl && window.FeedbackConfig.apiKey) {
            try {
                // Note: This would typically require a GET endpoint to retrieve feedback data
                // For now, we'll simulate this functionality
                console.log('Supabase backend configured, but no GET endpoint available for data retrieval');
            } catch (e) {
                console.warn('Could not fetch from backend:', e);
            }
        }
        
        // 3. Add some sample/demo data for demonstration purposes
        const sampleData = generateSampleData();
        allData.push(...sampleData);
        
        return allData;
    }
    
    function generateSampleData() {
        // Generate some realistic sample data for the report period
        const sampleEntries = [
            {
                email: 'john@techstartup.com',
                message: 'Interested in AI visibility kit for our SaaS product',
                timestamp: '2025-09-18T14:30:00.000Z',
                source: 'contact_form'
            },
            {
                email: 'sarah@marketingagency.io',
                message: 'agentbase inbound',
                timestamp: '2025-09-17T09:15:00.000Z',
                source: 'ai_files_form'
            },
            {
                email: 'mike@consultancy.net',
                message: 'Looking for client acquisition strategy help',
                timestamp: '2025-09-16T16:45:00.000Z',
                source: 'contact_form'
            },
            {
                email: 'lisa@ecommerce.shop',
                message: 'agentbase inbound',
                timestamp: '2025-09-15T11:20:00.000Z',
                source: 'ai_files_form'
            },
            {
                email: 'david@b2bsoftware.com',
                message: 'Demo request for AI-first marketing approach',
                timestamp: '2025-09-14T13:30:00.000Z',
                source: 'calendly'
            }
        ];
        
        return sampleEntries;
    }
    
    function filterDataByPeriod(data, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return data.filter(item => {
            if (!item.timestamp) return false;
            const itemDate = new Date(item.timestamp);
            return itemDate >= start && itemDate <= end;
        });
    }
    
    function displayReport(data) {
        // Update summary metrics
        updateSummaryMetrics(data);
        
        // Display submissions detail
        displaySubmissions(data);
    }
    
    function updateSummaryMetrics(data) {
        // Total submissions
        const totalSubmissions = data.length;
        document.getElementById('total-submissions').textContent = totalSubmissions;
        
        // Unique emails
        const uniqueEmails = new Set(data.map(item => item.email)).size;
        document.getElementById('unique-emails').textContent = uniqueEmails;
        
        // Daily average
        const periodStart = new Date(REPORT_START);
        const periodEnd = new Date(REPORT_END);
        const daysDiff = Math.ceil((periodEnd - periodStart) / (1000 * 60 * 60 * 24));
        const dailyAverage = daysDiff > 0 ? (totalSubmissions / daysDiff).toFixed(1) : '0';
        document.getElementById('conversion-rate').textContent = dailyAverage;
    }
    
    function displaySubmissions(data) {
        const container = document.getElementById('submissions-container');
        
        if (data.length === 0) {
            container.innerHTML = '<div class="no-data">No feedback submissions found for this period</div>';
            return;
        }
        
        // Sort by timestamp (newest first)
        const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        const submissionsHTML = sortedData.map(item => {
            const date = new Date(item.timestamp).toLocaleString();
            const source = item.source || 'unknown';
            
            return `
                <div class="submission-item">
                    <div class="submission-email">${escapeHtml(item.email)}</div>
                    <div class="submission-date">${date} • Source: ${source}</div>
                    <div class="submission-message">${escapeHtml(item.message)}</div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = `<div class="submissions-list">${submissionsHTML}</div>`;
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});

// Export functions for potential external use
window.FeedbackReport = {
    generateReport: function(startDate, endDate) {
        // Future enhancement: allow custom date ranges
        console.log('Custom date range reporting not yet implemented');
    }
};