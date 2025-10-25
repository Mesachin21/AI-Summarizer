# 🧠 AI Article Summarizer (Chrome Extension)

A simple and powerful Chrome Extension that summarizes any article or webpage using **Google Gemini 2.5 Flash**.  
Choose between **Brief**, **Detailed**, or **Key Points** summaries — right from your browser toolbar.

---

## 🚀 Features

- ✨ Summarizes any webpage content instantly  
- 🔍 Supports 3 summary modes:  
  - **Brief** — short 2–3 sentence overview  
  - **Detailed** — deeper explanation of main ideas  
  - **Key Points** — 5–7 concise bullet points  
- ⚙️ Works using your **Gemini API key**  
- 🧩 Built using **Manifest V3**, **JavaScript**, and **Chrome Storage API**

---
ai-article-summarizer/
│
├── manifest.json          # Chrome Extension manifest (v3)
├── popup.html             # Main popup UI
├── popup.js               # Handles UI & API requests
├── content.js             # Extracts article text from pages
├── background.js          # Manages runtime and scripting
├── options.html           # UI to store Gemini API key
├── icon.png               # Extension icon
└── README.md              # Project documentation
