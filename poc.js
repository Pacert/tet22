// poc_collect_chat.js
// PoC: Collect chat messages on the same page without an external endpoint

;(function() {
  // Create or reuse a global array to store collected chat entries
  window.collectedChat = window.collectedChat || [];

  /**
   * Stores a chat message and timestamp in the global collector.
   * @param {string} text - The chat message text
   */
  function collect(text) {
    window.collectedChat.push({
      time: new Date().toISOString(),
      message: text
    });
    console.log('🗄️ collectedChat:', window.collectedChat);
  }

  // Find the chat-list container (<ul> with <li> items)
  const chatList = Array.from(document.querySelectorAll('ul'))
    .find(ul =>
      Array.from(ul.querySelectorAll('li')).some(li => li.innerText.trim().length > 0)
    );

  if (!chatList) {
    console.error('❌ chat container not found');
    return;
  }
  console.log('✅ hooked chatList:', chatList);

  // Observe for new messages added to the list
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const text = node.innerText.trim();
          if (text) collect(text);
        }
      });
    });
  });
  observer.observe(chatList, { childList: true });

  // Collect any existing messages on page load
  chatList.querySelectorAll('li').forEach(li => {
    const text = li.innerText.trim();
    if (text) collect(text);
  });

  console.log('🏠 PoC collection running! Inspect with `window.collectedChat`.');
})();
