// ---------- Companion Definitions ----------
const companions = {
  Whisp: {name:"Whisp", voice:{input:true, output:true}, systemPrompt:"Gentle, calm, supportive."},
  Star: {name:"Star", voice:{input:true, output:true}, systemPrompt:"Bold, bright, energetic."},
  Robot: {name:"Robot", voice:{input:true, output:true}, systemPrompt:"Logical, witty, precise."},
  Cloud: {name:"Cloud", voice:{input:true, output:true}, systemPrompt:"Fluffy, whimsical, expressive."}
};

// ---------- Landing Page ----------
const companionCards = document.querySelectorAll(".companionCard");
const nicknameInput = document.getElementById("nicknameInput");

companionCards.forEach(card=>{
  card.addEventListener("click",()=>setActiveCompanion(card.dataset.companion));
});

function setActiveCompanion(id){
  companionCards.forEach(c=>c.classList.remove("active"));
  document.querySelector(`.companionCard[data-companion='${id}']`)?.classList.add("active");
  localStorage.setItem("companion",id);
  applyVoiceRules();
}

function startChat(){
  if(!nicknameInput.value.trim()){ alert("Enter a nickname"); return; }
  localStorage.setItem("nickname",nicknameInput.value.trim());
  document.getElementById("landingPage").classList.add("hidden");
  document.getElementById("chatContainer").classList.remove("hidden");
  document.querySelector("footer").classList.remove("hidden");
  document.getElementById("profileName").textContent = nicknameInput.value.trim();
  document.getElementById("profileLanguage").textContent = localStorage.getItem("language")||"en-US";
  document.getElementById("profileCompanion").textContent = localStorage.getItem("companion")||"Whisp";
  populateStarters();
  applyVoiceRules();
  checkOnboarding();
}

// ---------- Conversation Starters ----------
const conversationStarters = {
  "Workplace":["Good morning! How's your day starting?"],
  "Dating & Social":["Hi there! Would you like to grab coffee?"],
  "Travel":["Hi! Where is the nearest train station?"],
  "School":["Hello! How was class today?"],
  "Advanced Small Talk":["Hello! Did you see the game yesterday?"]
};

function populateStarters(){
  const dd = document.getElementById("starterDropdown");
  dd.innerHTML = `<option value="">-- Select Starter --</option>`;
  Object.keys(conversationStarters).forEach(cat=>{
    const today = new Date().getDay();
    const phrase = conversationStarters[cat][today%conversationStarters[cat].length];
    const opt = document.createElement("option");
    opt.value = phrase;
    opt.textContent = `${cat}: ${phrase}`;
    dd.appendChild(opt);
  });
}

function startStarter(){
  const val = document.getElementById("starterDropdown").value;
  if(val) sendMessage(val);
}

// ---------- Chat ----------
const chat = document.getElementById("chat");

function addMessage(text,sender){
  const div=document.createElement("div");
  div.className=`message ${sender}`;
  div.textContent=text;
  chat.appendChild(div);
  chat.scrollTop=chat.scrollHeight;
}

function showTyping(text){
  let i=0;
  const div=document.createElement("div");
  div.className="message bot";
  chat.appendChild(div);
  function type(){
    if(i<text.length){ div.textContent+=text[i]; i++; setTimeout(type,20); } 
    else { speakBotText(text); chat.scrollTop=chat.scrollHeight; }
  }
  type();
}

// ---------- Voice ----------
const micBtn = document.getElementById("micBtn");
let windowVoiceOutputAllowed=true;
let windowVoiceSpeed=1;

function applyVoiceRules(){
  const companionId = localStorage.getItem("companion") || "Whisp";
  const companion = companions[companionId];
  windowVoiceOutputAllowed = companion.voice.output;
  micBtn.disabled = !companion.voice.input;
}

function speakBotText(text){
  if(!windowVoiceOutputAllowed) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = localStorage.getItem("language") || "en-US";
  utter.rate = windowVoiceSpeed;
  speechSynthesis.speak(utter);
}

// ---------- Speech-to-Speech ----------
let speechMode=true;
const speechBtn = document.getElementById("speechToSpeechBtn");
function toggleSpeechToSpeech(){
  speechMode=!speechMode;
  speechBtn.classList.toggle("active",speechMode);
  speechBtn.textContent=`🗣️ Speech-to-Speech: ${speechMode?'ON':'OFF'}`;
}

function startSpeechToSpeech(){
  if(!speechMode || micBtn.disabled) return;
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = localStorage.getItem("language") || "en-US";
  recognition.interimResults=false; recognition.continuous=false;
  micBtn.classList.add("listening");
  recognition.onresult=async (event)=>{
    const spoken = event.results[0][0].transcript;
    sendMessage(spoken);
  };
  recognition.onend=()=>{ micBtn.classList.remove("listening"); }
  recognition.start();
}

// ---------- Send Message ----------
async function sendMessage(msg=null){
  const input=document.getElementById("userInput");
  const text=msg||input.value.trim();
  if(!text) return;
  addMessage(text,"user");
  input.value="";
  // placeholder AI response
  setTimeout(()=>showTyping(`Echo: ${text}`),500);
}

// ---------- Onboarding ----------
function checkOnboarding(){
  const onboard=document.getElementById("onboarding");
  if(!localStorage.getItem("onboarded")) onboard.classList.remove("hidden");
}
function finishOnboarding(){
  localStorage.setItem("onboarded","true");
  document.getElementById("onboarding").classList.add("hidden");
}

// ---------- Privacy/Support ----------
function showPrivacy(){ alert("Privacy page placeholder"); }
function showSupport(){ alert("Support page placeholder"); }
