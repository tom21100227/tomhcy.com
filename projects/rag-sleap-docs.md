---
layout: project
type: project
image: img/placeholder.png
title: "RAG ChatBot"
date: 2025
published: true
labels:
  - LangChain
  - Python
  - Retrieval Augmented Generation
  - Google Cloud Platform
summary: "A serverless API that fetches my currently playing song from Spotify and Apple Music, deployed with Cloudflare Workers."
# projecturl: "https://github.com/tom21100227/now-playing-api"
---



<div id="streamlit-container" style="border: 1px solid #ddd; border-radius: 5px; padding: 10px;">
    <div id="app-loader" style="width: 100%; height: 600px;"></div>

    <div id="app-offline" style="display: none; text-align: center; padding: 50px; font-family: sans-serif; color: #555;">
        <h3>🚧 App Not Available</h3>
        <p>This app is currently offline. Please check back later!</p>
    </div>
    
</div>

<div style="text-align: center; margin-top: 20px;">
    <a href="https://gobbler-game-formally.ngrok-free.app" target="_blank" class="btn btn-primary">
        embedded frame not working? click here.
    </a>
</div>

<script>
    // The static URL for your Streamlit app from ngrok
    const streamlitUrl = "https://gobbler-game-formally.ngrok-free.app";

    const loader = document.getElementById("app-loader");
    const offlineMessage = document.getElementById("app-offline");

    // Function to check if the URL is reachable
    async function checkAppStatus() {
        try {
            // We use 'no-cors' mode because we only need to know if the server responds,
            // not to read its content, which avoids CORS issues.
            const response = await fetch(streamlitUrl, { mode: 'no-cors' });
            
            // If the fetch promise resolves, the server is up.
            showIframe();

        } catch (error) {
            // A TypeError (like "Failed to fetch") indicates a network error,
            // meaning the server is down.
            console.error("App is offline:", error);
            showOfflineMessage();
        }
    }

    // Function to display the iframe
    function showIframe() {
        loader.innerHTML = `
            <iframe
                src="${streamlitUrl}"
                width="100%"
                height="600px"
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