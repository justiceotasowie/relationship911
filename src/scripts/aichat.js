import { loadHeaderFooter } from "./utils.mjs";
loadHeaderFooter(); 
const baseURL = import.meta.env.VITE_GroqCloud_KEY;
const API_KEY = baseURL;
document.getElementById("sendBtn").onclick = async () => {
  const input = document.getElementById("chatInput");
  const chatBox = document.getElementById("chatBox");
  const message = input.value;
  if (!message) return;

  chatBox.innerHTML += `<p><b>You:</b> ${message}</p>`;
  input.value = "";

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
       model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await res.json();

    // Check if API returned an error
    if (!res.ok) {
      chatBox.innerHTML += `<p style="color:red;"><b>Error:</b> ${data.error?.message || "API failed"}</p>`;
      return;
    }

    // Check if choices exist
    if (!data.choices ||!data.choices[0]) {
      chatBox.innerHTML += `<p style="color:red;"><b>Error:</b> No response from AI</p>`;
      console.log("Full response:", data);
      return;
    }

    const reply = data.choices[0].message.content;
    chatBox.innerHTML += `<p><b>Therapist:</b> ${reply}</p>`;

  } catch (err) {
    chatBox.innerHTML += `<p style="color:red;"><b>Error:</b> ${err.message}</p>`;
  }

   chatBox.scrollTop = chatBox.scrollHeight;
};