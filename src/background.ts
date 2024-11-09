// background.js

import { SnippetsByUrlType } from "./App";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveSnippet",
    title: "Save snippet",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(
  (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
    if (info.selectionText && tab && info.menuItemId === "saveSnippet") {
      const selectedText = info.selectionText;
      saveSnippet(selectedText, tab);
    }
  }
);

function saveSnippet(text: string, tab: chrome.tabs.Tab) {
  chrome.storage.local.get(
    { snippets: {} },
    (result: { snippets: SnippetsByUrlType }) => {
      const snippets = result.snippets;
      if (tab.url) {
        if (!snippets[tab.url]) {
          snippets[tab.url] = {
            urlTitle: tab.title ?? tab.url,
            snippets: [],
          };
        }
        snippets[tab.url].snippets.push({
          text,
          timestamp: new Date().toLocaleString(),
        });
        chrome.storage.local.set({ snippets: snippets }, () => {
          console.log("Snippet saved:", tab, tab.url, tab.title);
        });
        console.log("sending highlighttext:", tab, tab.id, text);

        // Send message to content script to highlight the saved text
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, { action: "highlightText", text });
        }
      }
    }
  );
}

export {};
