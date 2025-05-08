
import { getApiKey } from './keyhelper.js';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  PieController
} from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/+esm';

Chart.register(ArcElement, Tooltip, Legend, Title, PieController);

const HF_MODEL = 'cardiffnlp/twitter-roberta-base-sentiment';

export async function renderSentiment(messages = [], targetSel) {
  // ❌ Remove fallback — only use messages passed in
  if (!messages.length) {
    console.warn('No messages provided to renderSentiment.');
    return;
  }

  const hfKey = getApiKey('hfKey', 'Hugging Face API key');
  if (!hfKey) return;

  const counts = { positive: 0, negative: 0, neutral: 0 };

  for (const m of messages) {
    if (!m.message || typeof m.message !== 'string') {
      console.warn('⚠️ Skipping invalid message:', m);
      continue;
    }

    const input = m.message.slice(0, 500);

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

      const labelSet = Array.isArray(data[0]) ? data[0] : data;
      const topLabel = labelSet.reduce((a, b) => (a.score > b.score ? a : b)).label;

      console.log(`📊 "${input}" → ${topLabel}`);

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

  const heading = document.createElement('h2');
  heading.textContent = '💬 Sentiment Analysis';
  section.appendChild(heading);

  const chartCard = document.createElement('div');
  chartCard.className = 'profile-card';

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
            color: '#1f2937',
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
