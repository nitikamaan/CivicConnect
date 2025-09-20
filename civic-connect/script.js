// app.js - Complete Community Issue Reporting System

// Supabase Configuration
const SUPABASE_URL = 'https://viapjwhwndefdongsfxl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpYXBqd2h3bmRlZmRvbmdzZnhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MDQ3NzEsImV4cCI6MjA3MzI4MDc3MX0.C2IIvm41Do0tYLZ2ZgP6GUbmCSCepF1GH8bhjgky-iw';

// Global variables
let supabase = null;
let currentPage = 0;

// Initialize Supabase client
function initializeSupabase() {
    if (typeof window !== 'undefined' && window.supabase) {
        try {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing Supabase:', error);
            return false;
        }
    } else {
        console.warn('Supabase library not loaded, using sample data');
        return false;
    }
}

// Test Supabase connection
async function testSupabaseConnection() {
    if (!supabase) return false;

    try {
        const { count, error } = await supabase
            .from('issues')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Supabase connection test failed:', error);
            return false;
        }

        console.log('Supabase connection successful, issues count:', count);
        return true;
    } catch (error) {
        console.error('Supabase connection error:', error);
        return false;
    }
}

// Complete sample data for fallback
const sampleIssues = [
    {
        id: 1,
        title: 'Pothole on Elm Street',
        type: 'pothole',
        location: 'Elm Street, District 5',
        district: '5',
        description: 'Large pothole causing traffic issues',
        status: 'in-progress',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-20T14:30:00Z',
        image_url: 'https://images.unsplash.com/photo-1558618666-fbd1c5d12d9d?w=300&h=200&fit=crop',
        upvotes: 12,
        downvotes: 1,
        progress: 75,
        user_id: 'other-user'
    },
    {
        id: 2,
        title: 'Graffiti on Main Street',
        type: 'graffiti',
        location: 'Main Street, District 2',
        district: '2',
        description: 'Graffiti vandalism on building wall',
        status: 'resolved',
        created_at: '2024-01-10T09:00:00Z',
        updated_at: '2024-01-18T16:00:00Z',
        resolved_at: '2024-01-18T16:00:00Z',
        image_url: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop',
        upvotes: 28,
        downvotes: 2,
        progress: 100,
        user_id: 'current-user'
    },
    {
        id: 3,
        title: 'Broken Streetlight',
        type: 'streetlight',
        location: 'Oak Avenue, District 8',
        district: '8',
        description: 'Streetlight has been out for a week',
        status: 'open',
        created_at: '2024-01-20T18:00:00Z',
        updated_at: '2024-01-20T18:00:00Z',
        image_url: 'https://images.unsplash.com/photo-1573152958734-1922c188fba3?w=300&h=200&fit=crop',
        upvotes: 45,
        downvotes: 0,
        progress: 10,
        user_id: 'current-user'
    },
    {
        id: 4,
        title: 'Overflowing Garbage Bin',
        type: 'garbage',
        location: 'Pine Street, District 3',
        district: '3',
        description: 'Garbage bin overflowing for several days',
        status: 'in-progress',
        created_at: '2024-01-22T14:30:00Z',
        updated_at: '2024-01-23T09:15:00Z',
        image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300&h=200&fit=crop',
        upvotes: 18,
        downvotes: 1,
        progress: 40,
        user_id: 'other-user'
    },
    {
        id: 5,
        title: 'Damaged Sidewalk',
        type: 'other',
        location: 'Maple Drive, District 1',
        district: '1',
        description: 'Cracked sidewalk posing safety hazard',
        status: 'open',
        created_at: '2024-01-25T11:00:00Z',
        updated_at: '2024-01-25T11:00:00Z',
        image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
        upvotes: 8,
        downvotes: 0,
        progress: 0,
        user_id: 'current-user'
    },
    {
        id: 6,
        title: 'Traffic Signal Malfunction',
        type: 'other',
        location: 'Broadway & 5th Ave, District 4',
        district: '4',
        description: 'Traffic light stuck on red causing delays',
        status: 'resolved',
        created_at: '2024-01-12T07:45:00Z',
        updated_at: '2024-01-13T16:20:00Z',
        resolved_at: '2024-01-13T16:20:00Z',
        image_url: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=300&h=200&fit=crop',
        upvotes: 52,
        downvotes: 3,
        progress: 100,
        user_id: 'other-user'
    }
];

// Current user simulation
const getCurrentUserId = () => 'current-user';

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
}

function getStatusColor(status) {
    switch (status) {
        case 'open': return '#dc2626';
        case 'in-progress': return '#FFD700';
        case 'resolved': return '#16a34a';
        default: return '#666';
    }
}

function getCommentForIssue(issue) {
    const comments = {
        'in-progress': 'This is getting worse, urgent fix needed!',
        'resolved': 'Cleaned up quickly. Looks great now, thank you!',
        'open': "It's been like this for days now...",
        'default': 'No updates yet.'
    };
    return comments[issue.status] || comments['default'];
}

// Enhanced Supabase Integration Functions
async function getAllIssues() {
    if (!supabase) {
        console.log('Using sample data (Supabase not configured)');
        return sampleIssues;
    }
    
    try {
        const { data, error } = await supabase
            .from('issues')
            .select(`
                id,
                title,
                type,
                location,
                district,
                description,
                status,
                created_at,
                updated_at,
                resolved_at,
                image_url,
                upvotes,
                downvotes,
                progress,
                user_id
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        return data || [];
    } catch (error) {
        console.error('Error fetching issues:', error);
        showNotification('Failed to load issues from database. Using sample data.', 'warning');
        return sampleIssues;
    }
}

async function getMyReports() {
    const currentUserId = getCurrentUserId();
    
    if (!supabase) {
        return sampleIssues.filter(issue => issue.user_id === currentUserId);
    }
    
    try {
        const { data, error } = await supabase
            .from('issues')
            .select('*')
            .eq('user_id', currentUserId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching my reports:', error);
        showNotification('Failed to load your reports from database.', 'error');
        return sampleIssues.filter(issue => issue.user_id === currentUserId);
    }
}

async function getResolvedIssues(page = 0, limit = 12) {
    if (!supabase) {
        const resolved = sampleIssues.filter(issue => issue.status === 'resolved');
        return resolved.slice(page * limit, (page + 1) * limit);
    }
    
    try {
        const { data, error } = await supabase
            .from('issues')
            .select('*')
            .eq('status', 'resolved')
            .order('resolved_at', { ascending: false })
            .range(page * limit, (page + 1) * limit - 1);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching resolved issues:', error);
        return sampleIssues.filter(issue => issue.status === 'resolved').slice(page * limit, (page + 1) * limit);
    }
}

async function submitIssue(issueData) {
    if (!supabase) {
        console.log('Would submit to Supabase:', issueData);
        // Simulate successful submission
        const newIssue = {
            id: Date.now(),
            ...issueData,
            status: 'open',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            upvotes: 0,
            downvotes: 0,
            progress: 0,
            user_id: getCurrentUserId()
        };
        sampleIssues.unshift(newIssue);
        return newIssue;
    }
    
    try {
        const { data, error } = await supabase
            .from('issues')
            .insert([{
                ...issueData,
                user_id: getCurrentUserId(),
                status: 'open',
                upvotes: 0,
                downvotes: 0,
                progress: 0
            }])
            .select();

        if (error) {
            console.error('Supabase insert error:', error);
            throw error;
        }
        
        return data[0];
    } catch (error) {
        console.error('Error submitting issue:', error);
        showNotification('Failed to submit issue to database.', 'error');
        throw error;
    }
}

// Enhanced image upload with better error handling
async function uploadImage(file) {
    if (!supabase) {
        console.log('Would upload image to Supabase storage:', file.name);
        // Return a placeholder URL for demo
        return `https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop&t=${Date.now()}`;
    }
    
    try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            throw new Error('Only image files are allowed');
        }
        
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('File size must be less than 5MB');
        }
        
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('issue-images')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            throw uploadError;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('issue-images')
            .getPublicUrl(fileName);

        if (!urlData?.publicUrl) {
            throw new Error('Failed to get public URL for uploaded image');
        }

        console.log('Image uploaded successfully:', urlData.publicUrl);
        return urlData.publicUrl;
        
    } catch (error) {
        console.error('Error uploading image:', error);
        showNotification(`Image upload failed: ${error.message}`, 'error');
        throw error;
    }
}

// Enhanced voting with proper database integration
// Load and render community issues with filters
async function loadCommunityIssues(filter = 'recent') {
    const loadingElement = document.getElementById('loadingIndicator');
    const issuesGrid = document.getElementById('issuesGrid');
    if (!issuesGrid) return;

    try {
        if (loadingElement) loadingElement.style.display = 'block';

        const issues = await getAllIssues();

        // Apply filter
        let filteredIssues = issues;
        if (filter === 'recent') {
            filteredIssues = issues.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (filter === 'trending') {
            filteredIssues = issues.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        } else if (filter === 'nearest') {
            filteredIssues = issues; // TODO: add geo logic
        } else if (filter === 'all-categories') {
            filteredIssues = issues;
        } else if (filter === 'all-statuses') {
            filteredIssues = issues;
        }

        // Render issues
        if (filteredIssues.length === 0) {
            issuesGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📊</div>
                    <h3>No issues found</h3>
                    <p>Be the first to report an issue in your community!</p>
                    <button onclick="openReportModal()" class="cta-button">Report Issue</button>
                </div>
            `;
        } else {
            issuesGrid.innerHTML = filteredIssues.map(issue => renderIssueCard(issue)).join('');
        }

        updateDashboardStats(filteredIssues);

    } catch (error) {
        console.error('Error loading community issues:', error);
        issuesGrid.innerHTML = `
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <h3>Failed to load issues</h3>
                <p>Please refresh the page or try again later.</p>
                <button onclick="loadCommunityIssues('${filter}')" class="retry-btn">Retry</button>
            </div>
        `;
    } finally {
        if (loadingElement) loadingElement.style.display = 'none';
    }
}

// UI Functions
// Fixed renderIssueCard function with proper image handling
function renderIssueCard(issue) {
    const comment = getCommentForIssue(issue);
    const statusClass = issue.status.replace('-', '');

    const imageUrl = issue.image_url || 'https://via.placeholder.com/300x200';

    return `
        <div class="issue-card" data-issue-id="${issue.id}" onclick="showIssueDetail(${JSON.stringify(issue).replace(/"/g, '&quot;')})">
            <div class="issue-image" style="
                background-image: url('${imageUrl}'); 
                background-size: cover; 
                background-position: center;
                height: 180px;
                border-radius: 6px;
            "></div>
            <div class="issue-content">
                <div class="issue-header">
                    <h3 class="issue-title">${issue.title}</h3>
                    <div class="issue-votes">
                        <button class="vote-btn upvote" onclick="event.stopPropagation(); vote(${issue.id}, 'up')">
                            👍 ${issue.upvotes || 0}
                        </button>
                        <button class="vote-btn downvote" onclick="event.stopPropagation(); vote(${issue.id}, 'down')">
                            👎 ${issue.downvotes || 0}
                        </button>
                    </div>
                </div>
                <div class="issue-location">${issue.location}</div>
                <div class="issue-status ${statusClass}">Status: ${issue.status}</div>
                <div class="issue-comment">
                    <span>"${comment}"</span>
                </div>
                <div class="issue-meta">
                    <span class="issue-time">📅 ${formatTimeAgo(issue.created_at)}</span>
                    <span class="issue-type">🏷️ ${issue.type}</span>
                </div>
            </div>
        </div>
    `;
}


function renderReportItem(report) {
    const imageUrl = report.image_url || 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=100&h=100&fit=crop';
    
    return `
        <div class="report-item">
            <div class="report-image" style="background-image: url(${imageUrl}); background-size: cover; background-position: center;"></div>
            <div class="report-details">
                <h3 class="report-title">${report.title}</h3>
                <div class="report-meta">
                    <span class="issue-status ${report.status.replace('-', '')}">${report.status.replace('-', ' ')}</span>
                    <span>📍 ${report.location}</span>
                    <span>📅 ${formatDate(report.created_at)}</span>
                </div>
                <p class="report-description">${report.description}</p>
                <div class="report-stats">
                    <span>👍 ${report.upvotes || 0}</span>
                    <span>👎 ${report.downvotes || 0}</span>
                    <span>📊 ${report.progress || 0}% complete</span>
                </div>
            </div>
        </div>
    `;
}

// Dashboard Functions with better error handling
async function loadCommunityIssues() {
    const loadingElement = document.getElementById('loadingIndicator');
    const issuesGrid = document.getElementById('issuesGrid');
    
    if (!issuesGrid) return;
    
    try {
        // Show loading indicator
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }
        
        const issues = await getAllIssues();
        
        if (issues.length === 0) {
            issuesGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📊</div>
                    <h3>No issues found</h3>
                    <p>Be the first to report an issue in your community!</p>
                    <button onclick="openReportModal()" class="cta-button">Report Issue</button>
                </div>
            `;
            return;
        }
        
        issuesGrid.innerHTML = issues.map(issue => renderIssueCard(issue)).join('');
        
        // Update dashboard stats if elements exist
        updateDashboardStats(issues);
        
    } catch (error) {
        console.error('Error loading community issues:', error);
        issuesGrid.innerHTML = `
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <h3>Failed to load issues</h3>
                <p>Please refresh the page or try again later.</p>
                <button onclick="loadCommunityIssues()" class="retry-btn">Retry</button>
            </div>
        `;
    } finally {
        // Hide loading indicator
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}

// Update dashboard statistics
function updateDashboardStats(issues) {
    const totalIssues = issues.length;
    const openIssues = issues.filter(i => i.status === 'open').length;
    const inProgressIssues = issues.filter(i => i.status === 'in-progress').length;
    const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
    
    const elements = {
        totalIssues: document.getElementById('totalIssues'),
        openIssues: document.getElementById('openIssues'),
        inProgressIssues: document.getElementById('inProgressIssues'),
        resolvedIssues: document.getElementById('resolvedIssues')
    };
    
    if (elements.totalIssues) elements.totalIssues.textContent = totalIssues;
    if (elements.openIssues) elements.openIssues.textContent = openIssues;
    if (elements.inProgressIssues) elements.inProgressIssues.textContent = inProgressIssues;
    if (elements.resolvedIssues) elements.resolvedIssues.textContent = resolvedIssues;
}

// Enhanced form handling with better validation
async function handleReportSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Validation
    const title = document.getElementById('issueTitle')?.value?.trim();
    const type = document.getElementById('issueType')?.value;
    const location = document.getElementById('issueLocation')?.value?.trim();
    const description = document.getElementById('issueDescription')?.value?.trim();
    
    if (!title || !type || !location || !description) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (title.length < 5) {
        showNotification('Title must be at least 5 characters long', 'error');
        return;
    }
    
    if (description.length < 10) {
        showNotification('Description must be at least 10 characters long', 'error');
        return;
    }
    
    try {
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        const photoFile = document.getElementById('modalPhotoInput')?.files[0];
        
        let imageUrl = null;
        if (photoFile) {
            imageUrl = await uploadImage(photoFile);
        }
        
        const issueData = {
            title: title,
            type: type,
            location: location,
            description: description,
            image_url: imageUrl,
            district: extractDistrictFromLocation(location)
        };
        
        const newIssue = await submitIssue(issueData);
        
        // Close modal and refresh data
        closeReportModal();
        
        // Show success message
        showNotification('Issue reported successfully!', 'success');
        
        // Refresh dashboard if we're on it
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            await loadCommunityIssues();
        }
        
    } catch (error) {
        console.error('Error submitting report:', error);
        showNotification('Error submitting report. Please try again.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Helper function to extract district from location
function extractDistrictFromLocation(location) {
    const districtMatch = location.match(/district\s+(\d+)/i);
    return districtMatch ? districtMatch[1] : '1'; // Default to district 1
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const colors = {
        success: '#16a34a',
        error: '#dc2626',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    const icons = {
        success: '✅',
        error: '❌', 
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
    `;
    
    notification.innerHTML = `
        <span>${icons[type]}</span>
        <span>${message}</span>
        <button onclick="this.parentNode.remove()" style="
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
        ">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Initialize application with proper error handling
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Initializing application...');
    
    // Initialize Supabase
    const supabaseInitialized = initializeSupabase();
    
    if (supabaseInitialized) {
        // Test connection
        const connectionSuccessful = await testSupabaseConnection();
        if (connectionSuccessful) {
            showNotification('Connected to database successfully', 'success');
        } else {
            showNotification('Database connection failed. Using sample data.', 'warning');
        }
    }
    
    
    // Setup common functionality
    setupFileUpload();
    setupSearch();
    
    // Setup form submission
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', handleReportSubmit);
    }
    
    
    // Setup auto-locate button
    const autoLocateBtn = document.querySelector('.auto-locate-btn');
    if (autoLocateBtn) {
        autoLocateBtn.addEventListener('click', autoLocateAddress);
    }
    
    // Setup modal close on overlay click
    const modalOverlay = document.getElementById('reportModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeReportModal();
            }
        });
        
        // Setup modal close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeReportModal();
            }
        });
        
    }
    
    // Load page-specific data
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
        await loadCommunityIssues();
    }
    
    // Setup filter buttons
// Setup filter buttons
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterType = btn.dataset.filter;
        await loadCommunityIssues(filterType);
    });
});

    
    console.log('Application initialized successfully');
});

// Filter issues by type
function filterIssuesByType(type) {
    const issueCards = document.querySelectorAll('.issue-card');
    
    issueCards.forEach(card => {
        const issueId = card.dataset.issueId;
        const issue = sampleIssues.find(i => i.id == issueId);
        
        if (type === 'all' || !type || (issue && issue.type === type)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Enhanced file upload setup
function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const photoInput = document.getElementById('photoInput') || document.getElementById('modalPhotoInput');
    
    if (uploadArea && photoInput) {
        uploadArea.addEventListener('click', () => photoInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#FFD700';
            uploadArea.style.backgroundColor = '#2a2a2a';
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#444';
            uploadArea.style.backgroundColor = '#0a0a0a';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#444';
            uploadArea.style.backgroundColor = '#0a0a0a';
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                photoInput.files = files;
                handleFileSelect(files[0]);
            } else {
                showNotification('Please drop a valid image file', 'error');
            }
        });
        
        photoInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });
    }
}

function handleFileSelect(file) {
    if (!file.type.startsWith('image/')) {
        showNotification('Only image files are allowed', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showNotification('File size must be less than 5MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            uploadArea.style.backgroundImage = `url(${e.target.result})`;
            uploadArea.style.backgroundSize = 'cover';
            uploadArea.style.backgroundPosition = 'center';
            uploadArea.innerHTML = '<div style="background: rgba(0,0,0,0.7); color: white; padding: 8px; border-radius: 4px; font-weight: 500;">✅ Image selected</div>';
        }
    };
    reader.readAsDataURL(file);
}

// Enhanced search functionality
function setupSearch() {
    const searchInputs = document.querySelectorAll('#searchInput');
    
    searchInputs.forEach(input => {
        let searchTimeout;
        input.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = e.target.value.toLowerCase();
                
                if (window.location.pathname.includes('my-reports')) {
                    loadMyReports();
                } else if (window.location.pathname.includes('resolved')) {
                    currentPage = 0;
                    loadResolvedIssues();
                } else {
                    filterIssuesOnPage(query);
                }
            }, 300);
        });
    });
}

// Enhanced auto-location with better error handling
function autoLocateAddress() {
    if (!navigator.geolocation) {
        showNotification('Geolocation is not supported by this browser', 'error');
        return;
    }

    const locationInput = document.getElementById('issueLocation') || 
                         document.querySelector('input[placeholder*="address"]');
    
    if (!locationInput) {
        showNotification('Location input field not found', 'error');
        return;
    }

    // Show loading state
    const originalPlaceholder = locationInput.placeholder;
    locationInput.placeholder = 'Detecting location...';
    locationInput.disabled = true;

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
                // In a real implementation, use a geocoding service
                // For now, we'll create a formatted address
                const mockAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)} (Auto-detected location)`;
                locationInput.value = mockAddress;
                showNotification('Location detected successfully!', 'success');
            } catch (error) {
                console.error('Geocoding error:', error);
                locationInput.value = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
                showNotification('Location detected, but address lookup failed', 'warning');
            }
        },
        (error) => {
            console.error('Geolocation error:', error);
            let message = 'Unable to detect location. ';
            
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    message += 'Permission denied.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    message += 'Position unavailable.';
                    break;
                case error.TIMEOUT:
                    message += 'Request timeout.';
                    break;
                default:
                    message += 'Unknown error.';
                    break;
            }
            
            showNotification(message, 'error');
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 600000 // 10 minutes
        }
    );
    
    // Reset input state
    setTimeout(() => {
        locationInput.placeholder = originalPlaceholder;
        locationInput.disabled = false;
    }, 1000);
}

// Modal functions (keeping existing functionality)
function openReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form
        const form = document.getElementById('reportForm');
        if (form) form.reset();
        
        // Reset upload area
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            uploadArea.style.backgroundImage = '';
            uploadArea.innerHTML = `
                <div class="upload-icon">📷</div>
                <p>Click to upload or drag & drop</p>
                <span>PNG, JPG up to 5MB</span>
                <small>Optional: Add a photo to help describe the issue</small>
            `;
        }
    }
}

// Enhanced My Reports Functions
async function loadMyReports() {
    const loadingElement = document.getElementById('loadingIndicator');
    const reportsList = document.getElementById('myReportsList');
    const emptyState = document.getElementById('emptyState');
    
    if (!reportsList) return;
    
    try {
        if (loadingElement) loadingElement.style.display = 'block';
        
        let reports = await getMyReports();
        
        // Apply filters
        const statusFilter = document.getElementById('statusFilter')?.value;
        const typeFilter = document.getElementById('typeFilter')?.value;
        const searchQuery = document.getElementById('searchInput')?.value?.toLowerCase();
        
        if (statusFilter && statusFilter !== 'all') {
            reports = reports.filter(report => report.status === statusFilter);
        }
        
        if (typeFilter && typeFilter !== 'all') {
            reports = reports.filter(report => report.type === typeFilter);
        }
        
        if (searchQuery) {
            reports = reports.filter(report => 
                report.title.toLowerCase().includes(searchQuery) ||
                report.location.toLowerCase().includes(searchQuery) ||
                report.description.toLowerCase().includes(searchQuery)
            );
        }
        
        if (reports.length === 0) {
            reportsList.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
        } else {
            reportsList.style.display = 'block';
            if (emptyState) emptyState.style.display = 'none';
            reportsList.innerHTML = reports.map(report => renderReportItem(report)).join('');
        }
        
        // Update stats
        updateMyReportsStats(await getMyReports());
        
    } catch (error) {
        console.error('Error loading my reports:', error);
        showNotification('Failed to load your reports', 'error');
    } finally {
        if (loadingElement) loadingElement.style.display = 'none';
    }
}

function updateMyReportsStats(reports) {
    const totalReports = reports.length;
    const pendingReports = reports.filter(r => r.status === 'open').length;
    const inProgressReports = reports.filter(r => r.status === 'in-progress').length;
    const resolvedReports = reports.filter(r => r.status === 'resolved').length;
    
    const elements = {
        totalReports: document.getElementById('totalReports'),
        pendingReports: document.getElementById('pendingReports'),
        inProgressReports: document.getElementById('inProgressReports'),
        resolvedReports: document.getElementById('resolvedReports')
    };
    
    if (elements.totalReports) elements.totalReports.textContent = totalReports;
    if (elements.pendingReports) elements.pendingReports.textContent = pendingReports;
    if (elements.inProgressReports) elements.inProgressReports.textContent = inProgressReports;
    if (elements.resolvedReports) elements.resolvedReports.textContent = resolvedReports;
}

// Enhanced Resolved Issues Functions
async function loadResolvedIssues(append = false) {
    const loadingElement = document.getElementById('loadingIndicator');
    const issuesGrid = document.getElementById('resolvedIssuesGrid');
    const emptyState = document.getElementById('emptyState');
    const loadMoreSection = document.getElementById('loadMoreSection');
    
    if (!issuesGrid) return;
    
    try {
        if (loadingElement && !append) loadingElement.style.display = 'block';
        
        const issues = await getResolvedIssues(currentPage || 0);
        
        if (issues.length === 0 && !append) {
            issuesGrid.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            if (loadMoreSection) loadMoreSection.style.display = 'none';
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';
        
        const issuesHtml = issues.map(issue => renderIssueCard(issue)).join('');
        
        if (append) {
            issuesGrid.innerHTML += issuesHtml;
        } else {
            issuesGrid.innerHTML = issuesHtml;
        }
        
        // Show/hide load more button
        if (loadMoreSection) {
            loadMoreSection.style.display = issues.length >= 12 ? 'block' : 'none';
        }
        
        // Update current page
        if (append) {
            currentPage = (currentPage || 0) + 1;
        }
        
    } catch (error) {
        console.error('Error loading resolved issues:', error);
        showNotification('Failed to load resolved issues', 'error');
    } finally {
        if (loadingElement && !append) loadingElement.style.display = 'none';
    }
}

function filterIssuesOnPage(query) {
    const issueCards = document.querySelectorAll('.issue-card');
    let visibleCount = 0;
    
    issueCards.forEach(card => {
        const title = card.querySelector('.issue-title')?.textContent.toLowerCase() || '';
        const location = card.querySelector('.issue-location')?.textContent.toLowerCase() || '';
        
        if (query === '' || title.includes(query) || location.includes(query)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show/hide empty state based on visible results
    const emptyState = document.getElementById('searchEmptyState');
    if (emptyState) {
        emptyState.style.display = visibleCount === 0 && query !== '' ? 'block' : 'none';
    }
}

// Analytics and reporting functions
function getIssueAnalytics(issues) {
    const analytics = {
        totalIssues: issues.length,
        byStatus: {
            open: issues.filter(i => i.status === 'open').length,
            inProgress: issues.filter(i => i.status === 'in-progress').length,
            resolved: issues.filter(i => i.status === 'resolved').length
        },
        byType: {},
        byDistrict: {},
        averageVotes: 0,
        topIssues: []
    };
    
    // Calculate by type
    const types = ['pothole', 'streetlight', 'graffiti', 'garbage', 'other'];
    types.forEach(type => {
        analytics.byType[type] = issues.filter(i => i.type === type).length;
    });
    
    // Calculate by district
    issues.forEach(issue => {
        const district = issue.district || 'unknown';
        analytics.byDistrict[district] = (analytics.byDistrict[district] || 0) + 1;
    });
    
    // Calculate average votes
    if (issues.length > 0) {
        const totalVotes = issues.reduce((sum, issue) => sum + (issue.upvotes || 0), 0);
        analytics.averageVotes = Math.round(totalVotes / issues.length);
    }
    
    // Get top issues by votes
    analytics.topIssues = issues
        .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
        .slice(0, 5);
    
    return analytics;
}

// Database Schema Creation Helper (for documentation)
function getSupabaseSchema() {
    return `
        -- Issues table
        CREATE TABLE issues (
            id BIGSERIAL PRIMARY KEY,
            title TEXT NOT NULL CHECK (length(title) >= 5),
            type TEXT NOT NULL CHECK (type IN ('pothole', 'streetlight', 'graffiti', 'garbage', 'other')),
            location TEXT NOT NULL,
            district TEXT,
            description TEXT NOT NULL CHECK (length(description) >= 10),
            status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved')),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            resolved_at TIMESTAMPTZ,
            image_url TEXT,
            upvotes INTEGER DEFAULT 0,
            downvotes INTEGER DEFAULT 0,
            progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
            user_id TEXT NOT NULL
        );

        -- Issue votes table
        CREATE TABLE issue_votes (
            id BIGSERIAL PRIMARY KEY,
            issue_id BIGINT REFERENCES issues(id) ON DELETE CASCADE,
            user_id TEXT NOT NULL,
            vote_type TEXT CHECK (vote_type IN ('upvote', 'downvote')),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(issue_id, user_id)
        );

        -- Comments table (optional extension)
        CREATE TABLE issue_comments (
            id BIGSERIAL PRIMARY KEY,
            issue_id BIGINT REFERENCES issues(id) ON DELETE CASCADE,
            user_id TEXT NOT NULL,
            comment TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Indexes for better performance
        CREATE INDEX idx_issues_status ON issues(status);
        CREATE INDEX idx_issues_created_at ON issues(created_at DESC);
        CREATE INDEX idx_issues_district ON issues(district);
        CREATE INDEX idx_issues_user_id ON issues(user_id);
        CREATE INDEX idx_issue_votes_issue_id ON issue_votes(issue_id);

        -- Row Level Security (RLS) policies
        ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
        ALTER TABLE issue_votes ENABLE ROW LEVEL SECURITY;

        -- Allow all authenticated users to read issues
        CREATE POLICY "Anyone can view issues" ON issues FOR SELECT USING (true);

        -- Allow users to insert their own issues
        CREATE POLICY "Users can insert own issues" ON issues FOR INSERT WITH CHECK (auth.uid()::text = user_id);

        -- Allow users to update their own issues
        CREATE POLICY "Users can update own issues" ON issues FOR UPDATE USING (auth.uid()::text = user_id);

        -- Allow users to vote
        CREATE POLICY "Anyone can vote" ON issue_votes FOR ALL USING (true);
    `;
}

// Storage Setup Helper
function getStorageSetup() {
    return `
        -- Create storage bucket for issue images
        INSERT INTO storage.buckets (id, name, public) VALUES ('issue-images', 'issue-images', true);

        -- Storage policies
        CREATE POLICY "Anyone can view images" ON storage.objects FOR SELECT USING (bucket_id = 'issue-images');
        CREATE POLICY "Anyone can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'issue-images');
        CREATE POLICY "Users can delete own images" ON storage.objects FOR DELETE USING (bucket_id = 'issue-images' AND auth.uid()::text = owner);
    `;
}

// Performance monitoring
function logPerformance(operation, startTime) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`${operation} completed in ${duration.toFixed(2)}ms`);
}

// Global error handler with better reporting
window.addEventListener('error', (e) => {
    console.error('Global error:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
    });
    
    // Show user-friendly error message
    if (e.message.includes('supabase') || e.message.includes('fetch')) {
        showNotification('Connection issue. Please check your internet connection.', 'error');
    } else {
        showNotification('An unexpected error occurred. Please refresh the page.', 'error');
    }
});

// Handle offline/online status
window.addEventListener('offline', () => {
    showNotification('You are offline. Some features may not work properly.', 'warning');
});

window.addEventListener('online', () => {
    showNotification('Connection restored.', 'success');
    // Optionally refresh data when connection is restored
    if (document.getElementById('issuesGrid')) {
        loadCommunityIssues();
    }
});

// Load More functionality for resolved issues
function loadMore() {
    currentPage = (currentPage || 0) + 1;
    loadResolvedIssues(true);
}

// Export functions for global access
window.openReportModal = openReportModal;
window.closeReportModal = closeReportModal;
window.vote = vote;
window.loadMyReports = loadMyReports;
window.loadResolvedIssues = loadResolvedIssues;
window.loadMore = loadMore;
window.autoLocateAddress = autoLocateAddress;

// Debug helpers (remove in production)
window.debugSupabase = {
    getSchema: getSupabaseSchema,
    getStorageSetup: getStorageSetup,
    testConnection: testSupabaseConnection,
    sampleData: sampleIssues,
    analytics: () => getIssueAnalytics(sampleIssues)
};

// Show issue detail modal (integrated with Supabase/sampleIssues)
function showIssueDetail(issue) {
    if (!issue) return;

    const modalHTML = `
        <div class="modal-overlay" id="issueDetailModal" style="display:flex;">
            <div class="modal report-detail-modal">
                <div class="modal-header">
                    <div class="report-header-info">
                        <h3>${issue.title}</h3>
                        <span class="status-badge status-${issue.status}">${issue.status}</span>
                    </div>
                    <button class="modal-close" onclick="closeIssueDetail()">×</button>
                </div>
                <div class="modal-content">
                    <div class="report-body">
                        <div class="report-image">
                            <img src="${issue.image_url || 'https://via.placeholder.com/400x300'}" 
                                 alt="Report image">
                        </div>
                        <div class="report-details">
                            <div class="detail-group">
                                <label>Location:</label>
                                <p>${issue.location}</p>
                            </div>
                            <div class="detail-group">
                                <label>Issue Type:</label>
                                <p>${issue.type}</p>
                            </div>
                            <div class="detail-group">
                                <label>Description:</label>
                                <p>${issue.description}</p>
                            </div>
                            <div class="detail-group">
                                <label>Reported:</label>
                                <p>${formatTimeAgo(issue.created_at)} by ${issue.user_id}</p>
                            </div>
                        </div>
                    </div>
                    <div class="voting-section">
                        <div class="vote-buttons">
                            <button class="vote-btn upvote" onclick="vote(${issue.id}, 'up')">
                                👍 <span id="upvote-${issue.id}">${issue.upvotes || 0}</span>
                            </button>
                            <button class="vote-btn downvote" onclick="vote(${issue.id}, 'down')">
                                👎 <span id="downvote-${issue.id}">${issue.downvotes || 0}</span>
                            </button>
                        </div>
                        <button class="follow-btn">📌 Follow Updates</button>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-secondary" onclick="closeIssueDetail()">Close</button>
                </div>
            </div>
        </div>
    `;

    const existingModal = document.getElementById('issueDetailModal');
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('issueDetailModal');
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeIssueDetail();
    });
}





function closeIssueDetail() {
    const modal = document.getElementById('issueDetailModal');
    if (modal) modal.remove();
}

function openReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}
