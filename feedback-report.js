// Feedback Report functionality
document.addEventListener('DOMContentLoaded', function () {
    // Date range for the report (from issue description)
    const reportStartDate = new Date('2025-08-17T23:56:00.418+00:00');
    const reportEndDate = new Date('2025-09-19T22:17:06.993+00:00');
    
    // DOM elements
    const loadingEl = document.getElementById('loading');
    const errorStateEl = document.getElementById('error-state');
    const reportResultsEl = document.getElementById('report-results');
    const retryBtn = document.getElementById('retry-btn');
    const errorMessageEl = document.getElementById('error-message');
    
    // Summary elements
    const totalFeedbackEl = document.getElementById('total-feedback');
    const avgRatingEl = document.getElementById('avg-rating');
    const contactFormsEl = document.getElementById('contact-forms');
    
    // Feedback list elements
    const feedbackListEl = document.getElementById('feedback-list');
    const noFeedbackEl = document.getElementById('no-feedback');

    // Load and display feedback data
    async function loadFeedbackData() {
        showLoading();
        
        try {
            const feedbackData = await fetchFeedbackData();
            displayFeedbackReport(feedbackData);
        } catch (error) {
            console.error('Error loading feedback data:', error);
            showError(error.message || 'Failed to load feedback data');
        }
    }

    // Fetch feedback data from backend or localStorage
    async function fetchFeedbackData() {
        const config = window.FeedbackConfig;
        
        if (config && config.baseUrl && config.apiKey) {
            // Try to fetch from Supabase backend
            try {
                const response = await fetch(`${config.baseUrl}?startDate=${reportStartDate.toISOString()}&endDate=${reportEndDate.toISOString()}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${config.apiKey}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Backend responded with ${response.status}`);
                }

                return await response.json();
            } catch (backendError) {
                console.warn('Backend fetch failed, trying localStorage fallback:', backendError);
                // Fall back to localStorage
                return getFeedbackFromLocalStorage();
            }
        } else {
            // Use localStorage as primary source
            return getFeedbackFromLocalStorage();
        }
    }

    // Get feedback data from localStorage
    function getFeedbackFromLocalStorage() {
        const aiFileRequests = JSON.parse(localStorage.getItem('ai_file_requests') || '[]');
        const otherFeedback = JSON.parse(localStorage.getItem('feedback_data') || '[]');
        
        // Combine all feedback sources
        const allFeedback = [
            ...aiFileRequests.map(item => ({
                rating: 5,
                text: `Contact Form Submission\n\nEmail: ${item.email}\n\nMessage: ${item.message}`,
                timestamp: item.ts,
                type: 'contact_form'
            })),
            ...otherFeedback
        ];

        // Filter by date range
        const filteredFeedback = allFeedback.filter(item => {
            const itemDate = new Date(item.timestamp);
            return itemDate >= reportStartDate && itemDate <= reportEndDate;
        });

        return { feedback: filteredFeedback };
    }

    // Display the feedback report
    function displayFeedbackReport(data) {
        const feedback = data.feedback || [];
        
        // Calculate summary statistics
        const totalCount = feedback.length;
        const contactFormCount = feedback.filter(item => item.type === 'contact_form' || item.text.includes('Contact Form Submission')).length;
        const averageRating = totalCount > 0 
            ? (feedback.reduce((sum, item) => sum + (item.rating || 0), 0) / totalCount).toFixed(1)
            : '0.0';

        // Update summary cards
        totalFeedbackEl.textContent = totalCount;
        avgRatingEl.textContent = averageRating;
        contactFormsEl.textContent = contactFormCount;

        // Display feedback items
        if (totalCount === 0) {
            noFeedbackEl.hidden = false;
            feedbackListEl.innerHTML = '';
        } else {
            noFeedbackEl.hidden = true;
            displayFeedbackList(feedback);
        }

        showResults();
    }

    // Display individual feedback items
    function displayFeedbackList(feedback) {
        feedbackListEl.innerHTML = '';
        
        // Sort feedback by date (most recent first)
        const sortedFeedback = [...feedback].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        sortedFeedback.forEach((item, index) => {
            const feedbackItem = createFeedbackItem(item, index);
            feedbackListEl.appendChild(feedbackItem);
        });
    }

    // Create a feedback item element
    function createFeedbackItem(feedback, index) {
        const item = document.createElement('div');
        item.className = 'feedback-item';
        
        const date = new Date(feedback.timestamp);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const rating = feedback.rating || 0;
        const ratingStars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        
        // Extract email from contact form submissions
        const emailMatch = feedback.text.match(/Email:\s*([^\n]+)/);
        const email = emailMatch ? emailMatch[1].trim() : '';
        
        // Clean up the message text
        let displayText = feedback.text;
        if (feedback.text.includes('Contact Form Submission')) {
            const messageMatch = feedback.text.match(/Message:\s*([^\n]+)/);
            displayText = messageMatch ? messageMatch[1].trim() : 'Contact form submission';
        }

        item.innerHTML = `
            <div class="feedback-header">
                <div class="feedback-meta">
                    <span class="feedback-date">${formattedDate}</span>
                    <span class="feedback-rating" title="Rating: ${rating}/5">${ratingStars}</span>
                </div>
                <div class="feedback-type">
                    ${feedback.type === 'contact_form' || feedback.text.includes('Contact Form Submission') ? 
                        '<span class="type-badge contact-form">Contact Form</span>' : 
                        '<span class="type-badge feedback">Feedback</span>'
                    }
                </div>
            </div>
            <div class="feedback-content">
                ${email ? `<div class="feedback-email"><strong>Email:</strong> ${email}</div>` : ''}
                <div class="feedback-message">${displayText}</div>
            </div>
        `;

        return item;
    }

    // Show loading state
    function showLoading() {
        loadingEl.hidden = false;
        errorStateEl.hidden = true;
        reportResultsEl.hidden = true;
    }

    // Show error state
    function showError(message) {
        loadingEl.hidden = true;
        errorStateEl.hidden = false;
        reportResultsEl.hidden = true;
        errorMessageEl.textContent = message;
    }

    // Show results
    function showResults() {
        loadingEl.hidden = true;
        errorStateEl.hidden = true;
        reportResultsEl.hidden = false;
    }

    // Retry button handler
    retryBtn.addEventListener('click', loadFeedbackData);

    // Initialize the report
    loadFeedbackData();

    // Mobile menu functionality (similar to main site)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', function () {
            this.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const mobileNavLinks = navLinksContainer.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function () {
                mobileMenuBtn.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!mobileMenuBtn.contains(e.target) && !navLinksContainer.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navLinksContainer.classList.remove('active');
            }
        });
    }
});