document.addEventListener("DOMContentLoaded", () => {
    // A function to handle navigation and content loading
    const loadContent = async (path) => {
        try {
            // Select the main content area to be replaced
            const contentContainer = document.querySelector("#content-container");
            if (!contentContainer) {
                console.error("Main content container with ID '#content-container' not found.");
                return;
            }

            // Fetch the HTML from the target page
            const response = await fetch(path);
            const text = await response.text();

            // Use DOMParser to parse the fetched HTML string
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");

            // Find the content container in the new document
            const newContent = doc.querySelector("#content-container");
            
            // Replace the old content with the new content
            if (newContent) {
                contentContainer.innerHTML = newContent.innerHTML;
                // Also update the page title
                document.title = doc.title;
            } else {
                 contentContainer.innerHTML = "<h1>Error: Content not found</h1><p>The requested page does not have a '#content-container' element.</p>";
            }

        } catch (error) {
            console.error("Error loading page: ", error);
        }
    };

    // Intercept clicks on local links
    document.body.addEventListener("click", (event) => {
        // Check if the clicked element is a link
        if (event.target.tagName === "A") {
            const href = event.target.getAttribute("href");
            
            // Check if it's an internal link (starts with '/' or is a relative path)
            // and not a link to an anchor on the same page (e.g., #top)
            if (href && !href.startsWith("http") && !href.startsWith("#")) {
                event.preventDefault(); // Prevent the default full page reload

                // Update the URL in the browser's address bar
                window.history.pushState({}, "", href);
                
                // Load the new content
                loadContent(href);
            }
        }
    });

    // Handle browser back/forward button navigation
    window.addEventListener("popstate", () => {
        // The `location.pathname` will have the path for the history entry
        loadContent(window.location.pathname);
    });
});