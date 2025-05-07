import { getApiKey } from './keyhelper.js';
import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/+esm';

import {
  
  ArcElement,
  Tooltip,
  Legend,
  Title,
  PieController
} from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/+esm';

// Register pie chart-related components
Chart.register(ArcElement, Tooltip, Legend, Title, PieController);


const HF_MODEL = 'cardiffnlp/twitter-roberta-base-sentiment';

export async function renderSentiment(messages = [], targetSel) {
  /* ── TEMP fallback: load parsed sample if messages missing ───────── */
  if (!messages.length) {
    try {
      const res = await fetch(`sample_data/parsed_conversation.json?ts=${Date.now()}`);

      if (res.ok) messages = await res.json(); // [{ message, timestamp }]
      else throw new Error('Sample fetch failed');
    } catch (err) {
      console.warn('Sample profile JSON not found:', err.message);
    }
  }

  if (!messages.length) return; // still nothing? bail

  const hfKey = getApiKey('hfKey', 'Hugging Face API key');
  if (!hfKey) return;

  const counts = { positive: 0, negative: 0, neutral: 0 };

  for (const m of messages) {
    if (!m.message || typeof m.message !== 'string') {
      console.warn('⚠️ Skipping invalid message:', m);
      continue;
    }

    const input = m.message.slice(0, 500); // truncate for API

    try {
      const res = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${hfKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: input })
      });

      const data = await res.json();
      console.log('🔎 Full API response:', data);


      if (!Array.isArray(data)) {
        console.warn('Unexpected response:', data);
        continue;
      }

      //const topLabel = data.reduce((a, b) => (a.score > b.score ? a : b)).label;
      const labelSet = Array.isArray(data[0]) ? data[0] : data;
      const topLabel = labelSet.reduce((a, b) => (a.score > b.score ? a : b)).label;

      console.log(`"${input}" → ${topLabel}`);



      if (topLabel === 'LABEL_2') counts.positive++;
      else if (topLabel === 'LABEL_0') counts.negative++;
      else counts.neutral++;

    } catch (err) {
      console.warn(`❌ Failed to classify: "${input}"`, err);
    }
  }

  const section = document.querySelector(targetSel);
  if (!section) return;

  section.innerHTML = ''; // Clear previous content

  // 👇 Keep existing heading intact
  const heading = document.createElement('h2');
  heading.textContent = '💬 Sentiment Analysis'; // or whatever you like
  section.appendChild(heading);

  // 👇 Wrap just the chart in a styled box
  const chartCard = document.createElement('div');
  chartCard.className = 'profile-card'; // reuse same style for the box

  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;

  chartCard.appendChild(canvas);
  section.appendChild(chartCard);



  new Chart(canvas, {
    type: 'pie',
    data: {
      labels: ['Positive 😊', 'Negative 😞', 'Neutral 😐'],
      datasets: [{
        data: [counts.positive, counts.negative, counts.neutral],
        backgroundColor: ['#4ade80', '#f87171', '#fbbf24'],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#1f2937', // match --clr-text
            font: {
              size: 14,
              family: 'system-ui, sans-serif'
            }
          }
        },
        title: {
          display: false
        }
      }
    }
  });
}
