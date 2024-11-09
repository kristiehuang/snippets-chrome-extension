import { useState, useEffect } from "react";
import "./App.css";
import { styled } from "styled-components";

export type Snippet = {
  text: string;
  timestamp: string;
  note?: string;
};

export type SnippetsByUrlType = Record<
  string,
  {
    urlTitle: string;
    snippets: Snippet[];
  }
>;

export const HIGHLIGHT_GREEN = "rgba(0, 255, 0, 0.1)";

const SnippetEntry = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  border-radius: 10px;
  background-color: #f2f2f0;
  padding: 10px;
  text-align: start;
`;

function App() {
  const [snippetsByUrl, setSnippetsByUrl] = useState<SnippetsByUrlType>({});

  useEffect(() => {
    chrome.storage.local.get(
      {
        snippets: {},
      },
      (result: { snippets: SnippetsByUrlType }) => {
        setSnippetsByUrl(result.snippets);
      }
    );
  }, []);

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Snippets saved</h2>
        <div style={{ position: "relative" }}>
          <select
            onChange={(e) => {
              if (e.target.value === "clear") {
                if (
                  window.confirm("Are you sure you want to clear all snippets?")
                ) {
                  chrome.storage.local.set({ snippets: {} }, () => {
                    setSnippetsByUrl({});
                  });
                }
                e.target.value = ""; // Reset select after action
              }
            }}
            style={{
              padding: "5px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            <option value="">Settings</option>
            <option value="clear">Clear all snippets</option>
          </select>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {Object.entries(snippetsByUrl)
          .sort(([, a], [, b]) => {
            const latestA = Math.max(
              ...a.snippets.map((s) => new Date(s.timestamp).getTime())
            );
            const latestB = Math.max(
              ...b.snippets.map((s) => new Date(s.timestamp).getTime())
            );
            return latestB - latestA;
          })
          .map(([url, snippetsForThisUrl]) => (
            <SnippetEntry key={url}>
              <a
                href="#"
                // In a Chrome extension popup, links typically don't open in a new tab by default due to the popup's limited context.
                // need to use the chrome.tabs API to create a new tab instead
                onClick={(e) => {
                  e.preventDefault();
                  chrome.tabs.create({ url });
                }}
                style={{
                  color: "green",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                {snippetsForThisUrl.urlTitle}
              </a>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {snippetsForThisUrl.snippets.map((snippet) => (
                  <div
                    key={snippet.timestamp}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <p
                      style={{
                        backgroundColor: HIGHLIGHT_GREEN,
                        margin: 0,
                        width: "fit-content",
                      }}
                    >
                      {snippet.text}
                    </p>
                    {/* <p style={{ paddingLeft: "15px", margin: 0 }}>temp note</p> */}
                    <i>{snippet.timestamp}</i>
                  </div>
                ))}
              </div>
            </SnippetEntry>
          ))}
      </div>
    </div>
  );
}

export default App;
