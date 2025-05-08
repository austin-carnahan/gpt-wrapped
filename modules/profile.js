/*  profile.js
    -----------
    Generates a playful “Chat Character” profile via the OpenAI Chat API
    and injects the result into the DOM.  — TEMP EDIT — If no messages arrive
    (parser not wired yet), auto‑loads sample_data/parsed_conversation.json.
*/

import { getApiKey } from './keyhelper.js';

const MAX_PROMPTS = 10;        // keep token cost low

export async function renderProfile(messages = [], targetSel) {
  /* ── TEMP fallback: load parsed sample if messages missing ───────── */
  if (!messages.length) {
    try {
      const res = await fetch('sample_data/parsed_conversation.json');
      if (res.ok) messages = await res.json();                 // [{ message, timestamp }]
      else throw new Error('Sample fetch failed');
    } catch (err) {
      console.warn('Sample profile JSON not found:', err.message);
    }
  }
  /* ─────────────────────────────────────────────────────────────────── */

  if (!messages.length) return;   // still nothing? bail silently

  const openaiKey = getApiKey('openaiKey', 'OpenAI API key');
  if (!openaiKey) return;         // user cancelled prompt

  /* --- 1. sample/trim messages --- */
  const sample = messages
    .slice()
    .sort(() => 0.5 - Math.random())
    .slice(0, MAX_PROMPTS)
    .map(m => m.message)
    .join('\n');

  /* --- 2. craft system & user prompts --- */
  const sysPrompt = `
You are ChatGPT Wrapped, a playful data-storyteller who creates quirky year-in-review-style “listener profiles” (à la Spotify Wrapped) from a person's ChatGPT prompts.
Your style is witty but concise: give the profile a catchy title (3-5 words, emoji welcome) and a punchy 2-3 sentence description that captures tone, favourite topics, and chat habits.
Avoid judging content; keep it light-hearted and celebratory.`;

  const userPrompt = `
Below is a sample of prompts from one ChatGPT user (anonymised).
• Analyse the language and recurring themes.
• Invent a fun “Chat Character” name for them.
• Write a short description (max 60 words).

PROMPTS:
${sample}

---
Return JSON with two keys only:
{
  "title": "<Profile Title>",
  "blurb": "<60-word description>"
}`;

  /* --- 3. call OpenAI --- */
  let json;
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: sysPrompt.trim() },
          { role: 'user',   content: userPrompt.trim() }
        ],
        temperature: 0.8,
        max_tokens: 150
      })
    });

    const data = await res.json();
    json = JSON.parse(data.choices[0].message.content);
  } catch (err) {
    console.error('Profile generation failed:', err);
    showError(targetSel, '❌ Unable to generate profile, please try again.');
    return;
  }

  /* --- 4. inject into DOM --- */
  const section = document.querySelector(targetSel);
  if (!section) return;

  // build the card
  const card = document.createElement('div');
  card.className = 'profile-card';
  card.innerHTML = `
    <h3>${json.title}</h3>
    <p>${json.blurb}</p>
  `;

  /* clear whatever is there (placeholder or old card) */
  section.querySelector('[data-placeholder]')?.remove();
  section.querySelector('.profile-card')?.remove();
  section.querySelector('.error-msg')?.remove(); 

  /* add the fresh card */
  section.appendChild(card);

  /* helper */
  function showError(sel, msg) {
    const el = document.querySelector(sel);
    if (!el) return;
  
    // clear any previous profile card
    el.querySelector('.profile-card')?.remove();
    el.querySelector('.error-msg')?.remove();     // <‑‑ remove old error
    const p = document.createElement('p');
    p.className = 'error-msg';
    p.textContent = msg;
    el.appendChild(p);
  }
}