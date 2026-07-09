document.addEventListener("DOMContentLoaded", function() {
    
    // ═══════════════════════════════════════════════════════════════════
    // 1. MODALS & FLOATING ACTION BUTTON
    // ═══════════════════════════════════════════════════════════════════
    const fabBtn = document.getElementById("fab-btn");
    const editorOverlay = document.getElementById("editor-overlay");
    const blogEditor = document.getElementById("blog-editor");
    const authOverlay = document.getElementById("auth-modal-overlay");
    
    // Grab the navbar so we can slide it away
    const topNav = document.querySelector('.clay-bar'); 
    
    // Select all potential close buttons
    const closeBtns = document.querySelectorAll(".editor-close-btn, .auth-modal-close");

    // Open Modal Logic
    if (fabBtn) {
        fabBtn.addEventListener("click", function() {
            // Instantly slide the navbar out of the screen!
            if (topNav) topNav.classList.add("hidden");

            // Logged In: Show Editor
            if (editorOverlay && blogEditor) {
                editorOverlay.classList.add("visible");
                blogEditor.classList.add("visible");
            } 
            // Logged Out: Show Auth Lock
            else if (authOverlay) {
                authOverlay.classList.add("visible");
            }
        });
    }

    // Close Modal Logic (Buttons)
    closeBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            if (editorOverlay) editorOverlay.classList.remove("visible");
            if (blogEditor) blogEditor.classList.remove("visible");
            if (authOverlay) authOverlay.classList.remove("visible");
            
            // Bring the navbar back!
            if (topNav) topNav.classList.remove("hidden");
        });
    });

    // Close Modal Logic (Clicking dark background)
    window.addEventListener("click", function(event) {
        if (event.target === editorOverlay) {
            editorOverlay.classList.remove("visible");
            if (blogEditor) blogEditor.classList.remove("visible");
            if (topNav) topNav.classList.remove("hidden"); // Bring navbar back
        }
        if (event.target === authOverlay) {
            authOverlay.classList.remove("visible");
            if (topNav) topNav.classList.remove("hidden"); // Bring navbar back
        }
    });

    // ═══════════════════════════════════════════════════════════════════
    // 2. IMAGE UPLOAD PREVIEW
    // ═══════════════════════════════════════════════════════════════════
    const blogImageInput = document.getElementById('blog-image');
    const imagePreviewContainer = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const imageName = document.getElementById('image-name');
    const removeImageBtn = document.getElementById('remove-image');

    if (blogImageInput) {
        blogImageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                if (imageName) imageName.textContent = file.name;
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (previewImg) previewImg.src = e.target.result;
                    if (imagePreviewContainer) imagePreviewContainer.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', function() {
            if (blogImageInput) blogImageInput.value = '';
            if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
            if (imageName) imageName.textContent = '';
        });
    }

    // ═══════════════════════════════════════════════════════════════════
    // 3. PASSWORD SHOW/HIDE TOGGLE
    // ═══════════════════════════════════════════════════════════════════
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

    // ═══════════════════════════════════════════════════════════════════
    // 4. NAVBAR SCROLL HIDE
    // ═══════════════════════════════════════════════════════════════════
    let lastScrollTop = 0;
    const navbar = document.querySelector('.clay-bar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.classList.add('hidden');
            } else {
                navbar.classList.remove('hidden');
            }
            lastScrollTop = scrollTop;
        });
    }

    // ═══════════════════════════════════════════════════════════════════
    // 5. GLOBAL LOADING SPINNER (Fires on all clicks + form submissions)
    // ═══════════════════════════════════════════════════════════════════
    const loader = document.getElementById('loader-overlay');
    
    // A. Fire loader when clicking any navigation link
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Get the URL
            const url = this.getAttribute('href');
            
            // Only fire loader if it's a real page link (not a modal trigger or anchor)
            if (url && url !== '#' && !this.classList.contains('modal-close')) {
                if (loader) loader.classList.add('visible');
            }
        });
    });

    // B. Fire loader when submitting any form
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            if (this.checkValidity() && loader) {
                loader.classList.add('visible');
            }
        });
    });
    // ═══════════════════════════════════════════════════════════════════
    // 6. AUTO-DISMISS SUCCESS MESSAGES
    // ═══════════════════════════════════════════════════════════════════
    const successMessages = document.querySelectorAll('.form-success-banner');
    
    if (successMessages.length > 0) {
        successMessages.forEach(msg => {
            // Wait 3 seconds (3000 milliseconds) before fading out
            setTimeout(() => {
                msg.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                msg.style.opacity = '0';
                msg.style.transform = 'translateY(-10px)';
                
                // Remove it completely from the HTML after the fade finishes
                setTimeout(() => {
                    msg.remove();
                }, 500);
            }, 3000); 
        });
    }
});