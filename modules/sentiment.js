/* Uses a Hugging Face sentiment model (or Perspective API) to classify each
   prompt, then visualises the positive/neutral/negative split (e.g. pie chart). */

  import { getApiKey } from './modules/key-helper.js';
  import Chart from 'https://cdn.jsdelivr.net/npm/chart.js/+esm';

  export async function renderSentiment(messages, targetSel) {
    // see profile.js for how to get the API key
    // call HF API, aggregate, draw Chart.js pie
  }