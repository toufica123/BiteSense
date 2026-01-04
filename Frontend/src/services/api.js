const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Store session ID for the current conversation
let currentSessionId = null;

// Get current session ID
export function getSessionId() {
  return currentSessionId;
}

// Set session ID
export function setSessionId(id) {
  currentSessionId = id;
}

// Test backend connection
export async function greetServer() {
  const res = await fetch(`${BASE_URL}/greet`);
  return res.json();
}

// Upload image to backend
export async function uploadLabelImage(file) {
  const formData = new FormData();
  formData.append("image", file); // Fixed: was "uploaded_image"

  const res = await fetch(`${BASE_URL}/uploadfile`, {
    method: "POST",
    body: formData,
    headers: currentSessionId ? { "X-Session-Id": currentSessionId } : {}
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Upload failed");
  }

  const data = await res.json();

  // Store session ID from response
  if (data.sessionId) {
    currentSessionId = data.sessionId;
  }

  return data;
}

// Send chat message to Groq via backend
export async function sendChatMessage(message) {
  if (!currentSessionId) {
    throw new Error("No active session. Please upload an image first.");
  }

  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Session-Id": currentSessionId
    },
    body: JSON.stringify({ message })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Chat failed");
  }

  return res.json();
}

// Reset session (for new conversation)
export function resetSession() {
  currentSessionId = null;
}
