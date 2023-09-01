// This code should be in your popup.js or background script within your Chrome extension.

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    const externalUrl = currentTab.url;

    fetch(externalUrl)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Extract the og:image meta tag
            const ogImage = doc.querySelector('meta[property="og:image"]');

            if (ogImage) {
                const thumbnailUrl = ogImage.getAttribute('content');
                console.log("Thumbnail URL:", thumbnailUrl);
            } else {
                console.log("No Open Graph image found.");
            }
        })
        .catch(error => {
            console.error("Error fetching URL:", error);
        });
});