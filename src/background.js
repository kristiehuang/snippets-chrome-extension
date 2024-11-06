// background.js

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveSnippet",
    title: "Save Snippet",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveSnippet") {
    const selectedText = info.selectionText;
    saveSnippet(selectedText);
  }
});

function saveSnippet(text) {
  chrome.storage.local.get({ snippets: [] }, (result) => {
    const snippets = result.snippets;
    snippets.push(text);
    chrome.storage.local.set({ snippets: snippets }, () => {
      console.log("Snippet saved:", text);
    });
  });
}
