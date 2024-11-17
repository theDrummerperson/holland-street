document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll("#top-right-nav a");
    const contentContainer = document.getElementById("content"); // Ensure this is the container for dynamic content

    // Function to load content using AJAX
    function loadContent(url) {
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }
                return response.text();
            })
            .then((html) => {
                contentContainer.innerHTML = html; // Update the content dynamically
                window.history.pushState({ path: url }, "", url); // Update the browser's address bar
            })
            .catch((error) => {
                console.error("Error loading content:", error);
                contentContainer.innerHTML = `<p>Failed to load content. Please try again later.</p>`;
            });
    }

    // Attach click event listeners to each link
    navLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent the default link behavior
            const url = this.getAttribute("href"); // Get the link's href attribute
            loadContent(url); // Load the content
        });
    });

    // Handle browser back/forward navigation
    window.addEventListener("popstate", function (event) {
        if (event.state && event.state.path) {
            loadContent(event.state.path);
        }
    });
});
