# ChatGPT Wrapped

Turn your personal ChatGPT history into a playful, Spotify‑Wrapped–style year‑in‑review.

Upload your exported `chat_history.json`, and the app instantly:

- **Generates a quirky “Chat Character” profile** summarising your vibe.  
- **Builds a word cloud** of your most‑used words.  
- **Plots when you chat the most** (hour‑by‑hour histogram).  
- **Breaks down sentiment** across your prompts.

All in the browser – no servers, no data leaves your machine.


Live demo: [https://austin-carnahan.github.io/gpt-wrapped/](https://austin-carnahan.github.io/gpt-wrapped/)

---

## 🚀 Deployment

| Step | What we use |
|------|-------------|
| Hosting | **GitHub Pages** – serves the site as static files (HTML + CSS + JS). |
| Dependencies | Imported via **ESM CDNs** (jsDelivr) so we avoid bundlers & build pipelines. |
| Build process | **None.** Commit → push → Pages deploys automatically. |

Live demo: `https://<user>.github.io/gpt-wrapped/`

> ⚠️ If you point a custom domain, add `CNAME`/`A` records and enable “Enforce HTTPS” in Pages settings.

---

## 🧠 AI tools under the hood

| Tool | What it does | API / Model |
|------|--------------|-------------|
| **Sentiment Analysis** | Labels each prompt *positive / neutral / negative* → shown in a chart. | Hugging Face Inference API (`cardiffnlp/twitter-roberta-base-sentiment-latest`) |
| **“Chat Character” Profile** | Generates the catchy title & blurb summarising your chat personality. | OpenAI Chat Completion API (`gpt-3.5-turbo`) |

Both calls run client‑side; you paste your API keys once and they stay in `localStorage`.

---

## 📁 File structure

```
.
├── index.html         # markup + section placeholders
├── styles.css         # minimal styling
├── main.js            # orchestrator – handles upload, kicks off renders
└── modules/           # feature modules (one per teammate)
    ├── parser.js      # extracts user messages from export JSON
    ├── wordcloud.js   # freq table + d3-cloud rendering
    ├── timeline.js    # hourly histogram with Chart.js
    ├── profile.js     # OpenAI call + profile card
    └── sentiment.js   # HF sentiment model + pie/bar chart
    └── keyhelper.js   # Prompts user for an API key for services and stores locally

```

## 🛠️ Local development

No Node needed – just open via a tiny server so ES‑modules load:

TODO: Quick examples for serving on local machine