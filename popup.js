document.getElementById("summerize").addEventListener("click", async () => {
  const resultDiv = document.getElementById("result");
  const summaryType = document.getElementById("summary-type").value;
  resultDiv.innerHTML = "<div class='loader'></div>";

  const { geminiApiKey } = await chrome.storage.sync.get("geminiApiKey");
  if (!geminiApiKey) {
    resultDiv.textContent = "Please set your Gemini API Key in options.";
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript(
      { target: { tabId: tab.id }, files: ["content.js"] },
      () => {
        chrome.tabs.sendMessage(
          tab.id,
          { type: "GET_ARTICLE_TEXT" },
          async (response) => {
            if (chrome.runtime.lastError) {
              console.error("Runtime error:", chrome.runtime.lastError.message);
              resultDiv.textContent = "Cannot access this page.";
              return;
            }

            if (!response || !response.text) {
              resultDiv.textContent = "No article text found.";
              return;
            }

            try {
              const summary = await getGeminiSummary(response.text, summaryType, geminiApiKey);
              resultDiv.textContent = summary;
            } catch (err) {
              resultDiv.textContent = "Error generating summary: " + err.message;
            }
          }
        );
      }
    );
  });
});

// ✅ Function must be defined in the same file
async function getGeminiSummary(rawText, summaryType, apiKey) {
  const max = 20000;
  const text = rawText.length > max ? rawText.slice(0, max) + "..." : rawText;

  const promptMap = {
    brief: `Provide a brief summary of the following article in 2-3 sentences:\n\n${text}`,
    detailed: `Provide a detailed summary of the following article, covering all main points and key details:\n\n${text}`,
    keypoints:  `Summarize the following article in 5-7 key points. Format each point as a line starting with "- " (dash followed by a space). Do not use asterisks or other bullet symbols, only use the dash. Keep each point concise and focused on a single key insight from the article:\n\n${text}`,
  };

  const prompt = promptMap[summaryType] || promptMap.brief;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 },
      }),
    }
  );

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error.message || "Gemini API error");
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No summary generated.";
}
