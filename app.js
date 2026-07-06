/**
 * DraftDeck - Complete JavaScript Functionality
 *
 * This file handles all client-side functionality:
 * - Authentication (Registration, Login, Logout)
 * - Blog Creation and Management
 * - Profile Management
 * - Password Change
 * - Address Management
 * - Navigation and UI State
 */

// ═══════════════════════════════════════════════════════════════════
// LOCAL STORAGE KEYS
// ═══════════════════════════════════════════════════════════════════
const STORAGE_KEYS = {
    USERS: 'draftdeck_users',
    CURRENT_USER: 'draftdeck_current_user',
    BLOGS: 'draftdeck_blogs'
};

// ═══════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Show toast notification
 */
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');

    toastText.textContent = message;
    toast.style.background = isError ? 'rgba(255, 242, 224, 0.97)' : 'rgba(255, 242, 224, 0.97)';
    toast.style.borderColor = isError ? 'rgba(200, 60, 40, 0.5)' : 'rgba(40, 160, 80, 0.5)';
    toast.style.color = isError ? 'rgba(185, 45, 25, 0.95)' : 'rgba(25, 120, 60, 0.95)';
    toast.classList.add('visible');

    setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
}

/**
 * Get users from local storage
 */
function getUsers() {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
}

/**
 * Save users to local storage
 */
function saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

/**
 * Get current user from local storage
 */
function getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
}

/**
 * Save current user to local storage
 */
function saveCurrentUser(user) {
    if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
}

/**
 * Get blogs from local storage
 */
function getBlogs() {
    const blogs = localStorage.getItem(STORAGE_KEYS.BLOGS);
    return blogs ? JSON.parse(blogs) : [];
}

/**
 * Save blogs to local storage
 */
function saveBlogs(blogs) {
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
}

/**
 * Get user initials for avatar
 */
function getInitials(username) {
    if (!username) return '?';
    const parts = username.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate username (alphanumeric and underscores, 3-20 chars)
 */
function isValidUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
}

/**
 * Validate password (min 6 characters)
 */
function isValidPassword(password) {
    return password && password.length >= 6;
}

// ═══════════════════════════════════════════════════════════════════
// NAVIGATION / ROUTING
// ═══════════════════════════════════════════════════════════════════

/**
 * Page router - shows/hides pages based on navigation
 */
function showPage(pageName) {
    const pages = ['home', 'about', 'profile', 'login', 'register'];

    // Hide all pages
    pages.forEach(p => {
        const el = document.getElementById('page-' + p);
        if (el) el.style.display = 'none';
    });

    // Show selected page
    const selectedPage = document.getElementById('page-' + pageName);
    if (selectedPage) {
        selectedPage.style.display = '';
    }

    // Show/hide FAB on home page
    const fab = document.getElementById('fab-btn');
    if (fab) {
        fab.style.display = pageName === 'home' ? '' : 'none';
    }

    // Close any open modals when navigating
    closeAllModals();
}

/**
 * Initialize navigation click handlers
 */
function initNavigation() {
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
}

// ═══════════════════════════════════════════════════════════════════
// AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════

/**
 * Update UI based on login status
 */
function updateAuthUI() {
    const currentUser = getCurrentUser();
    const navAuth = document.getElementById('nav-auth');
    const navUser = document.getElementById('nav-user');
    const navProfile = document.getElementById('nav-profile');
    const welcomeBanner = document.getElementById('welcome-banner');
    const welcomeUsername = document.getElementById('welcome-username');
    const navUsername = document.getElementById('nav-username');
    const navInitials = document.getElementById('nav-initials');

    if (currentUser) {
        // User is logged in
        navAuth.style.display = 'none';
        navUser.style.display = 'inline-flex';
        navProfile.style.display = 'inline-flex';

        // Update username displays
        const username = currentUser.username || 'User';
        welcomeUsername.textContent = username;
        navUsername.textContent = username;
        navInitials.textContent = getInitials(username);

        // Show welcome banner on home
        if (welcomeBanner) {
            welcomeBanner.style.display = 'flex';
        }

        // Update FAB visibility
        const fab = document.getElementById('fab-btn');
        if (fab) fab.style.display = '';

    } else {
        // User is not logged in
        navAuth.style.display = 'contents';
        navUser.style.display = 'none';
        navProfile.style.display = 'none';

        // Hide welcome banner
        if (welcomeBanner) {
            welcomeBanner.style.display = 'none';
        }

        // Hide FAB when not on home page
        const fab = document.getElementById('fab-btn');
        const currentPage = document.querySelector('.page-wrapper:not([style*="display: none"])');
        if (fab && currentPage && currentPage.id !== 'page-home') {
            fab.style.display = 'none';
        }
    }
}

/**
 * Handle registration form submission
 */
function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm').value;
    const errorDiv = document.getElementById('register-error');
    const errorText = document.getElementById('register-error-text');

    // Reset error display
    errorDiv.style.display = 'none';

    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
        showError('register', 'Please fill in all fields');
        return;
    }

    if (!isValidUsername(username)) {
        showError('register', 'Username must be 3-20 characters (letters, numbers, underscores only)');
        return;
    }

    if (!isValidEmail(email)) {
        showError('register', 'Please enter a valid email address');
        return;
    }

    if (!isValidPassword(password)) {
        showError('register', 'Password must be at least 6 characters');
        return;
    }

    if (password !== confirmPassword) {
        showError('register', 'Passwords do not match');
        return;
    }

    // Check if user already exists
    const users = getUsers();
    const existingUser = users.find(u => u.email === email || u.username.toLowerCase() === username.toLowerCase());

    if (existingUser) {
        if (existingUser.email === email) {
            showError('register', 'This email is already registered');
        } else {
            showError('register', 'This username is already taken');
        }
        return;
    }

    // Show loader
    showLoader();

    // Simulate network delay
    setTimeout(() => {
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password, // In production, this should be hashed
            profilePicture: null,
            address: null,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        // Auto-login after registration
        saveCurrentUser(newUser);

        // Clear form
        document.getElementById('register-form').reset();

        hideLoader();

        // Update UI and redirect to home
        updateAuthUI();
        showPage('home');
        showToast('Welcome to DraftDeck! Your account has been created.');
    }, 800);
}

/**
 * Show error message in form
 */
function showError(formType, message) {
    const errorDiv = document.getElementById(formType + '-error');
    const errorText = document.getElementById(formType + '-error-text');

    if (errorDiv && errorText) {
        errorText.textContent = message;
        errorDiv.style.display = 'flex';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

/**
 * Handle login form submission
 */
function handleLogin(e) {
    e.preventDefault();

    const identifier = document.getElementById('login-identifier').value.trim();
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    const errorText = document.getElementById('login-error-text');

    // Reset error display
    errorDiv.style.display = 'none';

    // Validate inputs
    if (!identifier || !password) {
        showError('login', 'Please fill in all fields');
        return;
    }

    // Show loader
    showLoader();

    // Simulate network delay
    setTimeout(() => {
        // Find user
        const users = getUsers();
        const user = users.find(u =>
            (u.email === identifier.toLowerCase() || u.username.toLowerCase() === identifier.toLowerCase())
            && u.password === password
        );

        hideLoader();

        if (!user) {
            showError('login', 'Invalid email/username or password');
            return;
        }

        // Save current user
        saveCurrentUser(user);

        // Clear form
        document.getElementById('login-form').reset();

        // Update UI and redirect to home
        updateAuthUI();
        showPage('home');
        loadBlogs();
        showToast('Welcome back, ' + user.username + '!');
    }, 800);
}

/**
 * Handle logout
 */
function handleLogout() {
    saveCurrentUser(null);
    updateAuthUI();
    showPage('home');
    loadBlogs();
    showToast('You have been logged out');
}

// ═══════════════════════════════════════════════════════════════════
// BLOG MANAGEMENT
// ═══════════════════════════════════════════════════════════════════

/**
 * Open blog editor
 */
function openBlogEditor() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        // Show auth modal
        openModal('auth-modal-overlay');
        return;
    }

    // Reset editor form
    document.getElementById('blog-title').value = '';
    document.getElementById('blog-textarea').value = '';
    document.getElementById('blog-image').value = '';
    document.getElementById('image-preview').style.display = 'none';
    document.getElementById('image-name').textContent = '';

    // Show editor
    const overlay = document.getElementById('editor-overlay');
    const editor = document.getElementById('blog-editor');

    overlay.classList.add('visible');
    editor.classList.add('visible');
}

/**
 * Close blog editor
 */
function closeBlogEditor() {
    const overlay = document.getElementById('editor-overlay');
    const editor = document.getElementById('blog-editor');

    overlay.classList.remove('visible');
    editor.classList.remove('visible');
}

/**
 * Handle blog image selection
 */
function handleBlogImageSelect() {
    const fileInput = document.getElementById('blog-image');
    const imageName = document.getElementById('image-name');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');

    const file = fileInput.files[0];
    if (file) {
        // Show filename
        imageName.textContent = file.name;

        // Show preview
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Remove selected blog image
 */
function removeBlogImage() {
    const fileInput = document.getElementById('blog-image');
    const imagePreview = document.getElementById('image-preview');
    const imageName = document.getElementById('image-name');

    fileInput.value = '';
    imagePreview.style.display = 'none';
    imageName.textContent = '';
}

/**
 * Handle blog publishing
 */
function handlePublishBlog() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        closeBlogEditor();
        openModal('auth-modal-overlay');
        return;
    }

    const title = document.getElementById('blog-title').value.trim();
    const content = document.getElementById('blog-textarea').value.trim();
    const fileInput = document.getElementById('blog-image');
    const imageFile = fileInput.files[0];

    // Validate
    if (!title) {
        showToast('Please enter a blog title', true);
        return;
    }

    if (!content) {
        showToast('Please write some content', true);
        return;
    }

    // Show loader
    showLoader();

    // Create blog object
    const blog = {
        id: Date.now().toString(),
        title,
        content,
        author: currentUser.username,
        authorId: currentUser.id,
        image: null,
        createdAt: new Date().toISOString()
    };

    // Handle image if selected
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            blog.image = e.target.result;
            saveBlogPostWithLoader(blog);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveBlogPostWithLoader(blog);
    }
}

/**
 * Save blog post to storage and update UI
 */
/**
 * Save blog post to storage and update UI (with loader)
 */
function saveBlogPostWithLoader(blog) {
    // Simulate network delay
    setTimeout(() => {
        saveBlogPost(blog);
        hideLoader();
        showToast('Blog published successfully!');
    }, 800);
}

/**
 * Save blog post to storage and update UI
 */
function saveBlogPost(blog) {
    const blogs = getBlogs();
    blogs.unshift(blog); // Add to beginning
    saveBlogs(blogs);

    // Close editor
    closeBlogEditor();

    // Reload blogs
    loadBlogs();
}

/**
 * Load and display blogs on home page
 */
function loadBlogs() {
    const blogList = document.getElementById('blog-list');
    const emptyState = document.getElementById('empty-state');
    const blogs = getBlogs();

    if (!blogList) return;

    blogList.innerHTML = '';

    if (blogs.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Render each blog
    blogs.forEach(blog => {
        const blogCard = document.createElement('div');
        blogCard.className = 'blog-card';

        let imageHtml = '';
        if (blog.image) {
            imageHtml = `<img src="${blog.image}" alt="${blog.title}" class="blog-card-image">`;
        }

        blogCard.innerHTML = `
            <div class="blog-card-header">
                <h2 class="blog-card-title">${escapeHtml(blog.title)}</h2>
                <span class="blog-card-date">${formatDate(blog.createdAt)}</span>
            </div>
            ${imageHtml}
            <div class="blog-card-content">${escapeHtml(blog.content)}</div>
            <div class="blog-card-author">
                <span class="blog-card-author-avatar">${getInitials(blog.author)}</span>
                <span class="blog-card-author-name">${escapeHtml(blog.author)}</span>
            </div>
        `;

        blogList.appendChild(blogCard);
    });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ═══════════════════════════════════════════════════════════════════
// PROFILE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════

/**
 * Load user profile data
 */
function loadProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const profileUsername = document.getElementById('profile-username');
    const profileEmail = document.getElementById('profile-email');
    const profileAvatar = document.getElementById('profile-avatar');
    const navInitials = document.getElementById('nav-initials');

    if (profileUsername) {
        profileUsername.textContent = currentUser.username || 'Username';
    }

    if (profileEmail) {
        profileEmail.textContent = currentUser.email || '';
    }

    if (profileAvatar) {
        if (currentUser.profilePicture) {
            profileAvatar.innerHTML = `<img src="${currentUser.profilePicture}" alt="Profile" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
        } else {
            profileAvatar.textContent = getInitials(currentUser.username);
        }
    }

    if (navInitials) {
        navInitials.textContent = getInitials(currentUser.username);
    }
}

/**
 * Handle profile picture upload
 */
function handleProfilePictureUpload() {
    const fileInput = document.getElementById('profile-picture-upload');
    const file = fileInput.files[0];
    const currentUser = getCurrentUser();

    if (!file || !currentUser) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        // Update current user
        currentUser.profilePicture = e.target.result;

        // Update in users array
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            saveUsers(users);
        }

        // Update local storage
        saveCurrentUser(currentUser);

        // Update UI
        loadProfile();
        updateAuthUI();
        showToast('Profile picture updated!');
    };
    reader.readAsDataURL(file);
}

// ═══════════════════════════════════════════════════════════════════
// PASSWORD CHANGE
// ═══════════════════════════════════════════════════════════════════

/**
 * Open change password modal
 */
function openPasswordModal() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showPage('login');
        return;
    }

    // Reset form
    document.getElementById('change-password-form').reset();

    openModal('password-modal-overlay');
}

/**
 * Handle password change submission
 */
function handlePasswordChange(e) {
    e.preventDefault();

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;

    // Validate
    if (!currentPassword || !newPassword || !confirmPassword) {
        showToast('Please fill in all fields', true);
        return;
    }

    // Verify current password
    if (currentPassword !== currentUser.password) {
        showToast('Current password is incorrect', true);
        return;
    }

    if (!isValidPassword(newPassword)) {
        showToast('New password must be at least 6 characters', true);
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', true);
        return;
    }

    // Update password
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        saveUsers(users);

        // Update current user
        currentUser.password = newPassword;
        saveCurrentUser(currentUser);

        // Close modal
        closeModal('password-modal-overlay');

        showToast('Password updated successfully!');
    }
}

// ═══════════════════════════════════════════════════════════════════
// ADDRESS MANAGEMENT
// ═══════════════════════════════════════════════════════════════════

/**
 * Open address modal
 */
function openAddressModal() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showPage('login');
        return;
    }

    // Reset form
    document.getElementById('address-form').reset();

    // Pre-fill if address exists
    if (currentUser.address) {
        document.getElementById('address-street').value = currentUser.address.street || '';
        document.getElementById('address-city').value = currentUser.address.city || '';
        document.getElementById('address-state').value = currentUser.address.state || '';
        document.getElementById('address-zip').value = currentUser.address.zip || '';
        document.getElementById('address-country').value = currentUser.address.country || '';
        document.getElementById('address-modal-title').textContent = 'Edit Address';
    } else {
        document.getElementById('address-modal-title').textContent = 'Add Address';
    }

    openModal('address-modal-overlay');
}

/**
 * Handle address save
 */
function handleAddressSave(e) {
    e.preventDefault();

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const address = {
        street: document.getElementById('address-street').value.trim(),
        city: document.getElementById('address-city').value.trim(),
        state: document.getElementById('address-state').value.trim(),
        zip: document.getElementById('address-zip').value.trim(),
        country: document.getElementById('address-country').value.trim()
    };

    // Validate
    if (!address.street || !address.city || !address.state || !address.zip || !address.country) {
        showToast('Please fill in all address fields', true);
        return;
    }

    // Update user
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
        users[userIndex].address = address;
        saveUsers(users);

        // Update current user
        currentUser.address = address;
        saveCurrentUser(currentUser);

        // Close modal
        closeModal('address-modal-overlay');

        showToast('Address saved successfully!');
    }
}

// ═══════════════════════════════════════════════════════════════════
// MODAL MANAGEMENT
// ═══════════════════════════════════════════════════════════════════

/**
 * Open a modal by ID
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('visible');
    }
}

/**
 * Close a modal by ID
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('visible');
    }
}

/**
 * Close all modals
 */
function closeAllModals() {
    const modals = document.querySelectorAll('.modal-overlay, .auth-modal-overlay, .editor-overlay');
    modals.forEach(modal => {
        modal.classList.remove('visible');
    });
}

// ═══════════════════════════════════════════════════════════════════
// LOADER / LOADING SPINNER
// ═══════════════════════════════════════════════════════════════════

/**
 * Show loading spinner
 */
function showLoader() {
    const loader = document.getElementById('loader-overlay');
    if (loader) {
        loader.classList.add('visible');
    }
}

/**
 * Hide loading spinner
 */
function hideLoader() {
    const loader = document.getElementById('loader-overlay');
    if (loader) {
        loader.classList.remove('visible');
    }
}

// ═══════════════════════════════════════════════════════════════════
// PASSWORD SHOW/HIDE TOGGLE
// ═══════════════════════════════════════════════════════════════════

/**
 * Initialize password show/hide buttons
 */
function initPasswordToggles() {
    document.querySelectorAll('.show-pass-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);

            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    this.textContent = 'Hide';
                } else {
                    input.type = 'password';
                    this.textContent = 'Show';
                }
            }
        });
    });
}

// ═══════════════════════════════════════════════════════════════════
// EVENT LISTENERS INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

/**
 * Initialize all event listeners
 */
function initEventListeners() {
    // Navigation
    initNavigation();

    // Password toggles
    initPasswordToggles();

    // Forms
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const changePasswordForm = document.getElementById('change-password-form');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handlePasswordChange);
    }

    const addressForm = document.getElementById('address-form');
    if (addressForm) {
        addressForm.addEventListener('submit', handleAddressSave);
    }

    // FAB button
    const fabBtn = document.getElementById('fab-btn');
    if (fabBtn) {
        fabBtn.addEventListener('click', openBlogEditor);
    }

    // Editor close button
    const editorClose = document.getElementById('editor-close');
    if (editorClose) {
        editorClose.addEventListener('click', closeBlogEditor);
    }

    // Editor overlay click to close
    const editorOverlay = document.getElementById('editor-overlay');
    if (editorOverlay) {
        editorOverlay.addEventListener('click', closeBlogEditor);
    }

    // Publish button
    const publishBtn = document.getElementById('publish-btn');
    if (publishBtn) {
        publishBtn.addEventListener('click', handlePublishBlog);
    }

    // Blog image upload
    const blogImage = document.getElementById('blog-image');
    if (blogImage) {
        blogImage.addEventListener('change', handleBlogImageSelect);
    }

    // Remove blog image
    const removeImage = document.getElementById('remove-image');
    if (removeImage) {
        removeImage.addEventListener('click', removeBlogImage);
    }

    // Auth modal close
    const authModalClose = document.getElementById('auth-modal-close');
    if (authModalClose) {
        authModalClose.addEventListener('click', () => closeModal('auth-modal-overlay'));
    }

    const authModalOverlay = document.getElementById('auth-modal-overlay');
    if (authModalOverlay) {
        authModalOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal('auth-modal-overlay');
            }
        });
    }

    // Profile logout button
    const profileLogout = document.getElementById('profile-logout');
    if (profileLogout) {
        profileLogout.addEventListener('click', handleLogout);
    }

    // Nav logout button
    const navLogout = document.getElementById('nav-logout');
    if (navLogout) {
        navLogout.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }

    // Change password button
    const changePasswordBtn = document.getElementById('change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', openPasswordModal);
    }

    // Password modal close
    const passwordModalClose = document.getElementById('password-modal-close');
    if (passwordModalClose) {
        passwordModalClose.addEventListener('click', () => closeModal('password-modal-overlay'));
    }

    const passwordModalOverlay = document.getElementById('password-modal-overlay');
    if (passwordModalOverlay) {
        passwordModalOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal('password-modal-overlay');
            }
        });
    }

    // Add address button
    const addAddressBtn = document.getElementById('add-address-btn');
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', openAddressModal);
    }

    // Address modal close
    const addressModalClose = document.getElementById('address-modal-close');
    if (addressModalClose) {
        addressModalClose.addEventListener('click', () => closeModal('address-modal-overlay'));
    }

    const addressModalOverlay = document.getElementById('address-modal-overlay');
    if (addressModalOverlay) {
        addressModalOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal('address-modal-overlay');
            }
        });
    }

    // Profile picture upload
    const profilePictureUpload = document.getElementById('profile-picture-upload');
    if (profilePictureUpload) {
        profilePictureUpload.addEventListener('change', handleProfilePictureUpload);
    }
}

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

/**
 * Initialize scroll-based navbar hide/show
 */
function initScrollHide() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.clay-bar');

    if (!navbar) return;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - hide navbar
            navbar.classList.add('hidden');
        } else {
            // Scrolling up - show navbar
            navbar.classList.remove('hidden');
        }

        lastScrollTop = scrollTop;
    });
}

/**
 * Initialize the application
 */
function init() {
    // Initialize event listeners
    initEventListeners();

    // Initialize scroll hide
    initScrollHide();

    // Update auth UI based on login status
    updateAuthUI();

    // Load blogs
    loadBlogs();

    // Load profile if on profile page
    loadProfile();

    // Start on home page
    showPage('home');
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', init);