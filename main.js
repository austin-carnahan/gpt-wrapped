/* Main orchestrator: handles file upload, delegates to all render modules */

import { getUserMessages }            from './modules/parser.js';
import { makeFreqTable, renderWordCloud } from './modules/wordcloud.js';
import { renderHourHistogram }        from './modules/timeline.js';
import { renderProfile }              from './modules/profile.js';
import { renderSentiment }            from './modules/sentiment.js';

let chatData = null;   // global store for full export

document.getElementById('chatFile').addEventListener('change', async e => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    chatData = JSON.parse(await file.text());
    const messages = getUserMessages(chatData);

    // Kick off each section (non‑blocking)
    renderProfile(messages,   '#profile');
    renderWordCloud(makeFreqTable(messages), '#wordcloud');
    renderHourHistogram(messages, '#timeline');
    renderSentiment(messages,  '#sentiment');

    // Quick visual cue
    document.querySelectorAll('[data-placeholder]').forEach(el => el.remove());
  } catch (err) {
    alert('Unable to parse JSON export.');
    console.error(err);
  }
});
