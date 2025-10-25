console.log("✅ content.js loaded on", window.location.href);


function getArticleText() {
  const article = document.querySelector("article");
  if (article) return article.innerText;

  const paragraphs = Array.from(document.querySelectorAll("p"));
  return paragraphs.map(p => p.innerText).join("\n");
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "GET_ARTICLE_TEXT") {
    try {
      const text = getArticleText();
      sendResponse({ text });
    } catch (err) {
      console.error("Error extracting article:", err);
      sendResponse({ text: "" });
    }
  }
});
