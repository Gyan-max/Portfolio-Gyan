// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initial loading sequence
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.querySelector('.container');
    const typingText = document.querySelector('#loading-screen .typing-text');
    const npmLoader = document.querySelector('.npm-loader');
    
    // Step 1: Show the name with animation (already in CSS)
    
    // Step 2: Handle typing animation and then show NPM loader
    if (typingText) {
        // Initially hide the text
        typingText.style.visibility = 'hidden';
        
        // Show it after the name fade-in animation is complete
        setTimeout(() => {
            typingText.style.visibility = 'visible';
            
            // Calculate when typing animation should complete
            const textLength = typingText.textContent.length;
            const typingDuration = 2000; // matches the CSS animation duration
            
            // Show the npm loader after typing is done
            setTimeout(() => {
                // Stop the cursor blinking and typing animation
                document.querySelector('.cursor').style.animation = 'none';
                // Show npm loader
                npmLoader.style.display = 'block';
                
                // Step 3: After a short delay, hide the loading screen and show the main content
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    mainContent.classList.remove('hidden');
                }, 2000);
            }, typingDuration);
        }, 1000);
    }
    
    // Step 4: Handle navigation toggles for collapsible sections
    const navToggles = document.querySelectorAll('.nav-toggle');
    
    navToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // If this section is already open, close it
            if (!targetSection.classList.contains('collapsed')) {
                targetSection.classList.add('collapsed');
                this.classList.remove('active');
                return;
            }
            
            // Step 5: Close all sections and deactivate all toggles
            document.querySelectorAll('.section').forEach(section => {
                section.classList.add('collapsed');
            });
            
            document.querySelectorAll('.nav-toggle').forEach(link => {
                link.classList.remove('active');
            });
            
            // Open the clicked section and activate its toggle
            targetSection.classList.remove('collapsed');
            this.classList.add('active');
        });
    });
    
    // Add glassmorphism cursor effect
    const body = document.querySelector('body');
    let cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    body.appendChild(cursorGlow);
    
    document.addEventListener('mousemove', function(e) {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
    
    // Add cursor glow style
    document.head.insertAdjacentHTML('beforeend', `
        <style>
        .cursor-glow {
            position: fixed;
            width: 250px;
            height: 250px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: -1;
            opacity: 0.7;
            filter: blur(10px);
        }
        </style>
    `);

    // Dark mode toggle functionality
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    // Check if toggle exists
    if (darkModeToggle) {
        // Initialize based on user preference if stored
        const storedPreference = localStorage.getItem('darkMode');
        if (storedPreference !== null) {
            const isDarkMode = storedPreference === 'true';
            darkModeToggle.checked = isDarkMode;
            if (!isDarkMode) {
                document.body.classList.add('light-mode');
            }
        } else {
            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                document.body.classList.add('light-mode');
                darkModeToggle.checked = false;
            }
        }
        
        // Handle toggle changes
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.remove('light-mode');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.body.classList.add('light-mode');
                localStorage.setItem('darkMode', 'false');
            }
        });

        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (storedPreference === null) { // Only if user hasn't explicitly set a preference
                darkModeToggle.checked = e.matches;
                if (e.matches) {
                    document.body.classList.remove('light-mode');
                } else {
                    document.body.classList.add('light-mode');
                }
            }
        });
    }
});
