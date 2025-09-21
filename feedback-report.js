// Feedback Report JavaScript
// Configuration from main site
const FEEDBACK_CONFIG = {
    baseUrl: 'https://jedbptsmqiiamizbooiz.supabase.co/functions/v1/feedback',
    apiKey: 'widget_mekzbste_ho7r1j1wevh'
};

// DOM Elements
let totalFeedbackEl, avgRatingEl, contactSubmissionsEl, feedbackListEl;
let loadingStateEl, errorStateEl;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM element references
    totalFeedbackEl = document.getElementById('total-feedback');
    avgRatingEl = document.getElementById('avg-rating');
    contactSubmissionsEl = document.getElementById('contact-submissions');
    feedbackListEl = document.getElementById('feedback-list');
    loadingStateEl = document.getElementById('loading-state');
    errorStateEl = document.getElementById('error-state');

    // Mobile menu functionality (reused from main script)
    initializeMobileMenu();

    // Load initial report
    generateReport();
});

function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const mobileNavLinks = navLinksContainer.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navLinksContainer.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navLinksContainer.classList.remove('active');
            }
        });
    }
}

async function generateReport() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (!startDate || !endDate) {
        showError('Please select both start and end dates');
        return;
    }

    const startTimestamp = new Date(startDate).toISOString();
    const endTimestamp = new Date(endDate).toISOString();

    showLoading(true);
    hideError();

    try {
        // In a real implementation, this would be a GET request to fetch feedback data
        // For now, we'll simulate this with a demo dataset since we can't directly query Supabase
        const feedbackData = await fetchFeedbackData(startTimestamp, endTimestamp);
        displayReport(feedbackData, startTimestamp, endTimestamp);
    } catch (error) {
        console.error('Error generating report:', error);
        showError('Failed to generate report. This is a demo environment.');
        // Show demo data as fallback
        showDemoReport(startTimestamp, endTimestamp);
    } finally {
        showLoading(false);
    }
}

async function fetchFeedbackData(startTimestamp, endTimestamp) {
    // In a real implementation, this would make a GET request to Supabase
    // Since we can't implement server-side filtering in a static site, we'll simulate this
    
    // For demo purposes, simulate what the API response would look like
    throw new Error('Demo mode - cannot connect to live database');
}

function showDemoReport(startTimestamp, endTimestamp) {
    // Demo data that represents what would come from the database
    const demoFeedback = [
        {
            id: 1,
            timestamp: '2025-08-18T10:30:00.000Z',
            rating: 5,
            text: 'Contact Form Submission\n\nEmail: john.doe@example.com\n\nMessage: agentbase inbound',
            type: 'contact_form'
        },
        {
            id: 2,
            timestamp: '2025-08-20T14:15:00.000Z',
            rating: 4,
            text: 'Great service, very responsive team!',
            type: 'feedback'
        },
        {
            id: 3,
            timestamp: '2025-09-05T09:45:00.000Z',
            rating: 5,
            text: 'Contact Form Submission\n\nEmail: jane.smith@company.com\n\nMessage: agentbase inbound',
            type: 'contact_form'
        },
        {
            id: 4,
            timestamp: '2025-09-10T16:20:00.000Z',
            rating: 5,
            text: 'Excellent AI visibility results. Saw immediate improvement in our search rankings.',
            type: 'feedback'
        },
        {
            id: 5,
            timestamp: '2025-09-15T11:00:00.000Z',
            rating: 5,
            text: 'Contact Form Submission\n\nEmail: mike.johnson@startup.io\n\nMessage: agentbase inbound',
            type: 'contact_form'
        }
    ];

    displayReport(demoFeedback, startTimestamp, endTimestamp);
}

function displayReport(feedbackData, startTimestamp, endTimestamp) {
    // Calculate summary statistics
    const totalFeedback = feedbackData.length;
    const avgRating = totalFeedback > 0 ? 
        (feedbackData.reduce((sum, item) => sum + item.rating, 0) / totalFeedback).toFixed(1) : 0;
    const contactSubmissions = feedbackData.filter(item => 
        item.text.includes('Contact Form Submission') || item.type === 'contact_form'
    ).length;

    // Update summary statistics
    totalFeedbackEl.textContent = totalFeedback;
    avgRatingEl.textContent = avgRating;
    contactSubmissionsEl.textContent = contactSubmissions;

    // Clear and populate feedback list
    feedbackListEl.innerHTML = '';
    
    if (feedbackData.length === 0) {
        feedbackListEl.innerHTML = '<p class="no-feedback">No feedback found for the selected date range.</p>';
        return;
    }

    feedbackData.forEach(feedback => {
        const feedbackItem = createFeedbackItem(feedback);
        feedbackListEl.appendChild(feedbackItem);
    });
}

function createFeedbackItem(feedback) {
    const item = document.createElement('div');
    item.className = 'feedback-item';
    
    const date = new Date(feedback.timestamp);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    
    const isContactForm = feedback.text.includes('Contact Form Submission') || feedback.type === 'contact_form';
    const itemType = isContactForm ? 'Contact Form' : 'Feedback';
    
    // Extract email from contact form submissions
    let displayText = feedback.text;
    let emailMatch = feedback.text.match(/Email: ([^\n]+)/);
    let email = emailMatch ? emailMatch[1] : null;
    
    if (isContactForm && email) {
        displayText = `New contact from: ${email}`;
    }
    
    item.innerHTML = `
        <div class="feedback-header">
            <span class="feedback-type">${itemType}</span>
            <span class="feedback-date">${formattedDate}</span>
            <span class="feedback-rating">★ ${feedback.rating}/5</span>
        </div>
        <div class="feedback-content">
            <p>${displayText}</p>
        </div>
    `;
    
    return item;
}

function showLoading(show) {
    if (loadingStateEl) {
        loadingStateEl.hidden = !show;
    }
}

function showError(message) {
    if (errorStateEl) {
        const errorMessage = errorStateEl.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
        }
        errorStateEl.hidden = false;
    }
}

function hideError() {
    if (errorStateEl) {
        errorStateEl.hidden = true;
    }
}

// Make generateReport globally available for the HTML button onclick
window.generateReport = generateReport;