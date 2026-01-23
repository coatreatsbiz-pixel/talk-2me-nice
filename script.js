// --- Companion Setup ---
const companionCards = document.querySelectorAll(".companionCard");
let selectedCompanion = "Whisp";

companionCards.forEach(card => {
  card.addEventListener("click", () => {
    companionCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    selectedCompanion = card.dataset.companion;
  });
});

// --- Start Chat ---
document.getElementById("startChatBtn").addEventListener("click", () => {
  const nickname = document.getElementById("nicknameInput").value.trim();
  if (!nickname) { alert("Enter a nickname"); return; }

  document.getElementById("profileName").textContent = nickname;
  document.getElementById("profileCompanion").textContent = selectedCompanion;

  document.getElementById("landingPage").style.display = "none";
  document.getElementById("chatContainer").style.display = "flex";

  populateStarters();
});

// --- Conversation Starters ---
const conversationStarters = {
  "Workplace": ["Good morning! How's your day starting?"],
  "Dating & Social": ["Hi there! Want to grab coffee?"],
  "Travel": ["Hi! Where is the nearest train station?"],
  "School": ["Hello! How was class today?"],
  "Advanced Small Talk": ["Did you see the game yesterday?"]
};

function populateStarters() {
  const dd = document.getElementById("starterDropdown");
  dd.innerHTML = `<option value="">-- Select Starter --</option>`;
  for (let cat in conversationStarters) {
    const phrase = conversationStarters[cat][0]; // only 1 starter
    const opt = document.createElement("option");
    opt.value = phrase;
    opt.textContent = `${cat}: ${phrase}`;
    dd.appendChild(opt);
  }
}

function startStarter() {
  const val = document.getElementById("starterDropdown").value;
  if (val) sendMessage(val);
}

// --- Chat Handling ---
const chat = document.getElementById("chat");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function sendMessage(msg=null) {
  const input = document.getElementById("userInput");
  const text = msg || input.value.trim();
  if (!text) return;
  addMessage(text, "user");
  input.value = "";
  // Placeholder bot reply
  setTimeout(()=>addMessage(`Echo: ${text}`, "bot"), 500);
}
