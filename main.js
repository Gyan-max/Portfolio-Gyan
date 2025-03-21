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

// Highlight active section in navigation
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('nav a');

function highlightNavOnScroll() {
    let scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Add fade-in animation for sections
function revealSections() {
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight - 150) {
            section.classList.add('visible');
        }
    });
}

// Event listeners
window.addEventListener('scroll', () => {
    highlightNavOnScroll();
    revealSections();
});

// Add active class to CSS
document.head.insertAdjacentHTML('beforeend', `
<style>
nav a.active {
    color: var(--nav-hover) !important;
}

.fade-in {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in.visible {
    opacity: 1;
    transform: translateY(0);
}
</style>
`);

// Terminal typing effect for terminal-like elements
function typeTerminalEffect() {
    const terminalElements = document.querySelectorAll('.terminal-like');
    
    terminalElements.forEach(terminal => {
        const originalHTML = terminal.innerHTML;
        const textContent = terminal.textContent;
        
        // Store original HTML for later restoration
        terminal.setAttribute('data-original', originalHTML);
        
        // Clear the terminal content
        terminal.innerHTML = '';
        terminal.style.height = 'auto';
        
        // Get the visible section for the terminal
        const parentSection = terminal.closest('.section');
        
        // Only animate if parent section is visible
        if (parentSection && !parentSection.classList.contains('collapsed')) {
            animateTyping(terminal, originalHTML, 0);
        }
    });
}

function animateTyping(element, html, index) {
    if (index < html.length) {
        element.innerHTML = html.substring(0, index + 1) + '<span class="typing-cursor"></span>';
        setTimeout(() => {
            animateTyping(element, html, index + 1);
        }, 10); // Speed of typing
    } else {
        // Remove the cursor when typing is complete and add it at the end
        element.innerHTML = html + '<span class="typing-cursor"></span>';
    }
}

// Apply typing effect when a section becomes active
document.querySelectorAll('.nav-toggle').forEach(toggle => {
    toggle.addEventListener('click', function() {
        // Get the target section
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        // Wait for section to become visible before animating
        setTimeout(() => {
            // Find all terminal elements in this section
            const terminals = targetSection.querySelectorAll('.terminal-like');
            
            terminals.forEach(terminal => {
                // Get the original HTML if it exists
                const originalHTML = terminal.getAttribute('data-original') || terminal.innerHTML;
                
                // Store it if not already stored
                if (!terminal.getAttribute('data-original')) {
                    terminal.setAttribute('data-original', originalHTML);
                }
                
                // Clear and animate
                terminal.innerHTML = '';
                animateTyping(terminal, originalHTML, 0);
            });
        }, 400); // Wait for transition to complete
    });
});

// Initialize terminal effects on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initial setup for all terminals
    document.querySelectorAll('.terminal-like').forEach(terminal => {
        // Store original HTML
        terminal.setAttribute('data-original', terminal.innerHTML);
    });
    
    // Apply typing effect to the first visible section
    const activeSection = document.querySelector('.section:not(.collapsed)');
    if (activeSection) {
        const terminals = activeSection.querySelectorAll('.terminal-like');
        terminals.forEach(terminal => {
            terminal.innerHTML = '';
            animateTyping(terminal, terminal.getAttribute('data-original'), 0);
        });
    }
});
