/* Uses a Hugging Face sentiment model (or Perspective API) to classify each
   prompt, then visualises the positive/neutral/negative split (e.g. pie chart). */

   import Chart from 'https://cdn.jsdelivr.net/npm/chart.js/+esm';

   export async function renderSentiment(messages, targetSel) {
     // call HF API, aggregate, draw Chart.js pie
   }