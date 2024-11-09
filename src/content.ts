// content.js

import { HIGHLIGHT_GREEN, Snippet } from "./App";

function highlightText(text: string) {
  const bodyText = document.body.innerHTML;
  const highlightedText = `<span style="background-color: ${HIGHLIGHT_GREEN};">${text}</span>`;
  document.body.innerHTML = bodyText.replace(text, highlightedText);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "highlightText") {
    highlightText(request.text);
    sendResponse({ status: "Text highlighted" });
  }
});

// Check for saved snippets and highlight them
chrome.storage.local.get({ snippets: {} }, (result) => {
  const snippets = result.snippets;
  const currentUrl = window.location.href;

  snippets[currentUrl]?.snippets.forEach((snippet: Snippet) => {
    highlightText(snippet.text);
  });
});

export {};
