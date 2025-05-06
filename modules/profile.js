/* Calls the OpenAI Chat Completion API to generate the “Wrapped” profile
   and injects the returned title + blurb into the profile section. */
   import { getApiKey } from './modules/keyhelper.js';

   export async function renderProfile(messages, targetSel) {
    const openaiKey = getApiKey('openaiKey', 'OpenAI API key');
    if (!openaiKey) return;   // user cancelled
    // TODO: craft prompt, fetch OpenAI, parse JSON, update DOM
  }



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