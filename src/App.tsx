import { useState, useEffect } from "react";
import "./App.css";

export type SnippetEntry = {
  text: string;
  timestamp: string;
};

export type SnippetsByUrlType = Record<
  string,
  {
    urlTitle: string;
    snippets: SnippetEntry[];
  }
>;

export const SnippetsByUrl: SnippetsByUrlType = {
  "https://www.google.com": {
    urlTitle: "hello",
    snippets: [{ text: "asdf", timestamp: "2024-01-01" }],
  },
};

function App() {
  const [snippetsByUrl, setSnippetsByUrl] = useState<SnippetsByUrlType>({});

  useEffect(() => {
    chrome.storage.local.get(
      { snippets: {} },
      (result: { snippets: SnippetsByUrlType }) => {
        setSnippetsByUrl(result.snippets);
      }
    );
  }, []);

  return (
    <div className="App">
      <p>Snippets saved</p>
      <ul id="snippetList">
        {Object.entries(snippetsByUrl).map(([url, snippets]) => (
          <li key={url}>
            <a
              href="#"
              // In a Chrome extension popup, links typically don't open in a new tab by default due to the popup's limited context.
              // need to use the chrome.tabs API to create a new tab instead
              onClick={(e) => {
                e.preventDefault();
                chrome.tabs.create({ url });
              }}
            >
              {snippets.urlTitle}
            </a>
            <br />
            {snippets.snippets.map((snippet) => (
              <div key={snippet.timestamp}>
                {snippet.text}
                {snippet.timestamp}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
