(() => {
  const records = [];

  function scrape(doc) {
    // target any message bubble that has a `direction` attribute
    doc.querySelectorAll('div[direction]').forEach(bubble => {
      const textEl = bubble.querySelector('p');
      const timeEl = bubble.querySelector('span[aria-live]');
      const text = textEl?.innerText.trim() || '';
      if (!text) return;

      records.push({
        who:       bubble.getAttribute('direction'),            // Incoming vs Outgoing
        timestamp: timeEl?.innerText.trim() || '—',            // “Sent at …”
        message:   text
      });
    });
  }

  // scrape the top document
  scrape(document);

  // scrape any same-origin iframes
  Array.from(window.frames).forEach(frame => {
    try { scrape(frame.document); }
    catch (e) { /* ignore cross-origin frames */ }
  });

  console.table(records);
  // copy to clipboard as JSON if you need to export
  copy(JSON.stringify(records, null, 2));

  return records;
})();
