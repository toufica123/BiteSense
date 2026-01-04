const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1️⃣ Test backend
export async function greetServer() {
  const res = await fetch(`${BASE_URL}/greet`);
  return res.text();
}

// 2️⃣ Upload image
export async function uploadLabelImage(file) {
  const formData = new FormData();
  formData.append("uploaded_image", file);

  const res = await fetch(`${BASE_URL}/uploadfile`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  return res.json(); // or res.text() depending on backend
}
