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
export async function uploadLabelImage(file, sessionId = null) {
  try {
    const formData = new FormData();
    formData.append("uploaded_image", file); // Fixed: backend expects "uploaded_image"

    const headers = {};
    if (sessionId) {
      headers["x-session-id"] = sessionId;
    } else if (currentSessionId) {
      headers["x-session-id"] = currentSessionId;
    }

    const res = await fetch(`${BASE_URL}/uploadfile`, {
      method: "POST",
      headers,
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.message || "Upload failed");
    }

    // Store session ID from response
    if (data.sessionId) {
      currentSessionId = data.sessionId;
    }

    return data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
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

// Get session history/messages
export async function getSessionHistory(sessionId = null) {
  const targetSessionId = sessionId || currentSessionId;
  
  if (!targetSessionId) {
    throw new Error("No session ID provided");
  }

  const res = await fetch(`${BASE_URL}/chat/history/${targetSessionId}`, {
    method: "GET"
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to get session history");
  }

  return res.json();
}

// Reset session (for new conversation)
export function resetSession() {
  currentSessionId = null;
}

// Clear session history
export async function clearSessionHistory(sessionId = null) {
  const targetSessionId = sessionId || currentSessionId;
  
  if (!targetSessionId) {
    throw new Error("No session ID provided");
  }

  const res = await fetch(`${BASE_URL}/chat/history/${targetSessionId}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to clear session history");
  }

  return res.json();
}
