document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get({ snippets: [] }, (result) => {
    const snippetList = document.getElementById('snippetList');
    result.snippets.forEach((snippet) => {
      const li = document.createElement('li');
      li.textContent = snippet;
      snippetList.appendChild(li);
    });
  });
});
