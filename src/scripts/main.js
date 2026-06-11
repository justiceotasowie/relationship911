import {
  loadHeaderFooter,
  renderListWithTemplate,
  isValidRelationshipAdvice,
} from "./utils.mjs";

loadHeaderFooter();

// 1. The Template Function: Turns a data object into HTML structure
function adviceCardTemplate(adviceItem) {
  return `
    <div class="advice-card ${adviceItem.category}">
      <span class="advice-id">Advice #${adviceItem.id}</span>
      <p class="advice-text">"${adviceItem.text}"</p>
    </div>
  `;
}

// Add a default parameter of 0 for the retry count
async function getExternalEmergencyAdvice(retryCount = 0) {
  const container = document.getElementById("welcome-advice");
  
  // 🛡️ SUBPAGE SECURITY: If the home page element isn't found, exit immediately!
  // This completely stops this loop from running background tasks on your subpages.
  if (!container) return;

  // 🛡️ SAFETY BRAKE: If we've retried 5 times without a match, use a safe backup
  if (retryCount >= 5) {
    console.log(
      "Max retries reached. Using high-quality backup relationship advice."
    );

    const highQualityBackups = [
      "Never go to bed angry; talk out your misunderstandings calmly.",
      "A strong relationship requires choosing to love each other even on days you struggle to like each other.",
      "Listen to understand your partner, not just to reply.",
      "Great communication is the secret foundation of lasting family trust.",
    ];

    // Pick a random one from our clean list
    const randomBackupText =
      highQualityBackups[Math.floor(Math.random() * highQualityBackups.length)];

    renderCleanAdviceCard(container, { id: "911", text: randomBackupText });
    return;
  }

  try {
    // ⚡ CACHE BUSTER: Append a timestamp parameter to force a fresh random advice object every single fetch attempt
    const url = `https://api.adviceslip.com/advice?_=${new Date().getTime()}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();
    const rawText = data.slip.advice;

    // 🔍 FILTER CHECK: If it fails, retry but INCREMENT the counter
    if (!isValidRelationshipAdvice(rawText)) {
      console.log(
        `[Attempt ${retryCount + 1}] Filtered out: "${rawText}". Retrying...`
      );
      return await getExternalEmergencyAdvice(retryCount + 1);
    }

    // If it passes, render it!
    renderCleanAdviceCard(container, { id: data.slip.id, text: rawText });
  } catch (error) {
    console.error("Error pulling third-party advice:", error);
    renderCleanAdviceCard(container, {
      id: 0,
      text: "Take a deep breath. Clear communication is key.",
    });
  }
}

// Helper function to manage the clean swipe-out and swipe-in transitions
async function renderCleanAdviceCard(container, adviceObject) {
  const currentCard = container.querySelector(".advice-card");
  if (currentCard) {
    currentCard.classList.add("swipe-out");
    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  const mappedAdvice = {
    id: adviceObject.id,
    text: adviceObject.text,
    category: "emergency",
  };

  container.innerHTML = "";
  renderListWithTemplate(adviceCardTemplate, container, [mappedAdvice]);

  const newCard = container.querySelector(".advice-card");
  if (newCard) {
    newCard.classList.add("swipe-in");
  }
}

// Only execute the automatic loops if we are physically sitting on the home page dashboard
if (document.getElementById("welcome-advice")) {
  // Run immediately on page load
  getExternalEmergencyAdvice();

  // Set up the interval loop to run every 12 seconds
  setInterval(() => {
    getExternalEmergencyAdvice();
  }, 12000);
}