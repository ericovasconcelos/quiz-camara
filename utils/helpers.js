export function saveHighScore(score) {
    localStorage.setItem('quizCamaraHighScore', score.toString());
}

export async function getAuthToken() {
    if (window.netlifyIdentity && window.netlifyIdentity.currentUser()) {
        try {
            console.log("Refreshing Netlify Token...");
            // Force refresh (true) to ensure we don't get a stale token
            const token = await window.netlifyIdentity.currentUser().jwt(true);
            if (token) {
                // Decode token to see expiry (simple base64 decode of middle part)
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    console.log("Token Exp:", new Date(payload.exp * 1000).toLocaleString());
                } catch (e) { console.error("Error parsing token payload", e); }
            }
            console.log("Token Refreshed:", token ? "YES (Length: " + token.length + ")" : "NO");
            return token;
        } catch (e) {
            console.error("Error refreshing token", e);
            return null;
        }
    }
    console.warn("No current user in Netlify Identity");
    return null;
}
