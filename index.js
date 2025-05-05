
// Global var so other modules can access parsed data later
export let chatData = null; // will hold the parsed JSON once loaded


// UPLOAD CHAT DATA BUTTON
// Select the (visible) <input type="file"> element
const fileInput = document.getElementById('chatFile') || document.getElementById('uploadFile');
if (!fileInput) {
  console.error('⚠️  File input not found. Make sure the element exists in index.html');
}

fileInput?.addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    chatData = JSON.parse(text);
    console.log('✅ Chat data stored in global var:', chatData);

    // TEMP: visual cue that the upload worked
    document.querySelectorAll('[data-placeholder]').forEach((el) => {
      el.innerHTML = '<p>Data loaded – rendering coming next…</p>';
    });
  } catch (err) {
    alert('Unable to parse JSON – is this the correct export file?');
    console.error(err);
  }
});


// CHAT CHARACTER PROFILE
// Use fetch to make a request to chatGPT with a custom prompt

// EXAMPLE PROMPT:

// ### SYSTEM
// You are ChatGPT Wrapped, a playful data‑storyteller who creates quirky year‑in‑review–style “listener profiles” (à la Spotify Wrapped) from a person’s ChatGPT prompts.  
// Your style is witty but concise: give the profile a catchy title (3‑5 words, emoji welcome) and a punchy 2–3 sentence description that captures tone, favourite topics, and chat habits.  
// Avoid judging content; keep it light‑hearted and celebratory.

// ### USER
// Below is a sample of prompts from one ChatGPT user (anonymised).  
// • Analyse the language and recurring themes.  
// • Invent a fun “Chat Character” name for them.  
// • Write a short description (max 60 words).  

// PROMPTS:
// {{PROMPT_LIST}}

// ---  
// Return JSON with two keys only:  
// {
//   "title": "<Profile Title>",
//   "blurb": "<60‑word description>"
// }


// CHAT WORD CLOUD
// helper: remove punctuation, lowercase, drop stop‑words
import stopWords from 'https://cdn.jsdelivr.net/npm/stopword/+esm';

function makeFreqTable(messages) {
    const freq = {};
    for (const m of messages) {
        m.content
        .toLowerCase()
        .split(/[^a-zA-Z0-9'-]+/)           // crude tokeniser
        .filter(w => w && !stopWords.en.includes(w))
        .forEach(w => (freq[w] = (freq[w] || 0) + 1));
    }
    return freq;  // { word: count, … }
}

  // import d3 js for word cloud visualization
  import * as cloud from 'https://cdn.jsdelivr.net/npm/d3-cloud@1/+esm';

  /// make word cloud here



// CHAT TIME OF DAY
// Import tools for making a use frequency histogram for hours of the day
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js/+esm';
import dayjs   from 'https://cdn.jsdelivr.net/npm/dayjs/+esm';




// CHAT EMOTIONS AND SENTIMENT ANALYSIS
// Probably a PIE CHART here? Positive vs negative sentiment
// Or Alternative: Perspective API – gives “toxicity”, “politeness” etc.

