/* Main orchestrator: handles file upload, delegates to all render modules */

import { getUserMessages }            from './modules/parser.js';
import { makeFreqTable, renderWordCloud } from './modules/wordcloud.js';
import { renderHourHistogram }        from './modules/timeline.js';
import { renderProfile }              from './modules/profile.js';
import { renderSentiment }            from './modules/sentiment.js';

// -------------------------------------------------
// JSON ingestion (file OR sample button)
// -------------------------------------------------
let chatData = null;     // global export
const sampleButtons = document.querySelectorAll('.sample-btn');
const fileInput       = document.getElementById('chatFile');

// helper – central place to parse + trigger renders
async function processJson(text) {
  try {
    chatData = JSON.parse(text);
  } catch (err) {
    console.error("❌ JSON Parse failed:", err.message);
    alert("The file is not valid JSON.");
    return;
  }

  console.log("Loaded raw chatData:", chatData);

  const messages = getUserMessages(chatData.conversations || chatData || []);
  console.log("✅ Parsed user messages:", messages);

  renderProfile(messages, '#profile');
  renderWordCloud(makeFreqTable(messages), '#wordcloud');
  renderHourHistogram(messages, '#timeline');
  renderSentiment(messages, '#sentiment');

  document.querySelectorAll('[data-placeholder]').forEach(el => el.remove());
}



// 1) Upload via hidden file input
fileInput.addEventListener('change', async e => {
  const file = e.target.files?.[0];
  if (!file) return;

  console.log(`Loading file: ${file.name}`);
  
  try { processJson(await file.text()); }
  catch (err) { alert('Bad JSON'); console.error(err); }
});

// 2) Click one of the sample buttons
sampleButtons.forEach(btn => {
  btn.addEventListener('click', async () => {
    // UI highlight
    sampleButtons.forEach(b => b.classList.toggle('active', b === btn));
    
    console.log(`Loading sample file: ${btn.dataset.file}`);

    try {
      const path = btn.dataset.file;           // e.g. sample_data/austin.conversation.json
      const res  = await fetch(path);
      processJson(await res.text());
    } catch (err) {
      alert('Could not load sample file.');
      console.error(err);
    }
  });
});
import { renderMeme } from './modules/meme.js';
import { renderMoodMusic } from './modules/music.js';

document.addEventListener('DOMContentLoaded', () => {
  renderMeme('#meme-of-the-day');
  renderMoodMusic('#mood-music', 'happy'); // Replace 'happy' with actual mood later
});
