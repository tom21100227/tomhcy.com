---
layout: project
type: project
image: img/placeholder.png
title: "RAG ChatBot"
date: 2025
published: true
redirect_from:
  - /rag/
labels:
  - LangChain
  - Python
  - Retrieval Augmented Generation
  - Google Cloud Platform
summary: "A serverless API that fetches my currently playing song from Spotify and Apple Music, deployed with Cloudflare Workers."
# projecturl: "https://github.com/tom21100227/now-playing-api"
---

<div style="text-align: center; margin-top: 20px; margin-bottom: 24px;">
    <a href="https://rag-sleap-docs-demo.tomhcy.com/" target="_blank" class="btn btn-primary">
        constant redirect/embedded frame not working? click here.
    </a>
</div>

<div id="streamlit-container" style="border: 1px solid #ddd; border-radius: 5px; padding: 10px;">
    <div id="app-loader" style="width: 100%; height: 80vh;"></div>

    <div id="app-offline" style="display: none; text-align: center; padding: 50px; font-family: sans-serif; color: #555;">
        <h3>🚧 App Not Available</h3>
        <p>This app is currently offline. Please check back later!</p>
    </div>
</div>

To learn more about this, checkout [REDACTED](tomhcy.com/404.html)

<script>
    const streamlitUrl = "https://rag-sleap-docs-demo.tomhcy.com/";

    const loader = document.getElementById("app-loader");
    const offlineMessage = document.getElementById("app-offline");

    // Function to check if the URL is reachable
    async function checkAppStatus() {
        try {
            const response = await fetch(streamlitUrl, { mode: 'no-cors' });
            
            // Those does not work because CORS policy. But keeping it for reference.
            
            // If the server responded with a 502 Bad Gateway, show the offline message.
            if (response.status === 502) {
                console.error("502 Bad Gateway: App is offline");
                showOfflineMessage();
                return;
            }
            
            // If the fetch promise resolves successfully, the server is up.
            showIframe();
        } catch (error) {
            // A TypeError (like "Failed to fetch") indicates a network error.
            console.error("App is offline:", error);
            showOfflineMessage();
        }
    }

    // Function to display the iframe
    function showIframe() {
        // Add ngrok-skip-browser-warning as URL parameter
        const iframeUrl = `${streamlitUrl}?ngrok-skip-browser-warning=true`;
        loader.innerHTML = `
            <iframe
                src="${iframeUrl}"
                width="100%"
                height="100%"
                style="border:none;">
            </iframe>
        `;
        offlineMessage.style.display = 'none';
    }

    // Function to display the offline message
    function showOfflineMessage() {
        loader.style.display = 'none';
        offlineMessage.style.display = 'block';
    }

    // Run the check when the page loads
    checkAppStatus();
</script>