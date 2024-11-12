// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get both navigation menus
    const topNav = document.getElementById('top-right-nav');
    const bottomNav = document.getElementById('bottom-center-nav');
    
    // Add click event listeners to both navigation menus
    topNav.addEventListener('click', handleNavClick);
    bottomNav.addEventListener('click', handleNavClick);
    
    // Main content container where we'll load the AJAX content
    const mainContent = document.querySelector('main');
    
    function handleNavClick(event) {
        event.preventDefault(); // Prevent default link behavior
        
        // Get the clicked link
        const link = event.target.closest('a');
        if (!link) return; // Exit if click wasn't on a link
        
        // Create new XMLHttpRequest object
        const xhr = new XMLHttpRequest();
        
        // Get the URL from the link
        const url = link.href;
        
        // Configure the request
        xhr.open('GET', url, true);
        
        // Add loading indicator
        mainContent.innerHTML = '<div class="loading">Loading...</div>';
        
        // Handle the response
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    // If it's one of the code view links (HTML, CSS, JS)
                    if (url.includes('raw.githubusercontent.com')) {
                        // Display code in a pre element
                        mainContent.innerHTML = `<pre><code>${xhr.responseText}</code></pre>`;
                    } else {
                        // For regular pages, extract the content from the <main> tag
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(xhr.responseText, 'text/html');
                        const newContent = doc.querySelector('main');
                        
                        if (newContent) {
                            mainContent.innerHTML = newContent.innerHTML;
                        } else {
                            mainContent.innerHTML = xhr.responseText;
                        }
                    }
                    
                    // Update the page title
                    document.title = `a.Ilyas Abukar - ${link.textContent}`;
                    
                    // Update URL without page reload
                    history.pushState({}, '', url);
                    
                } catch (error) {
                    mainContent.innerHTML = '<div class="error">Error loading content</div>';
                    console.error('Error processing content:', error);
                }
            } else {
                mainContent.innerHTML = '<div class="error">Error loading content</div>';
                console.error('Request failed with status:', xhr.status);
            }
        };
        
        // Handle network errors
        xhr.onerror = function() {
            mainContent.innerHTML = '<div class="error">Network error occurred</div>';
            console.error('Network error occurred');
        };
        
        // Send the request
        xhr.send();
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        location.reload();
    });
});
