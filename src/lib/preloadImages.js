export function preloadImages(sources) {
  if (!Array.isArray(sources) || sources.length === 0) return Promise.resolve();
  const unique = Array.from(new Set(sources.filter(Boolean)));
  const loaders = unique.map((src) =>
    new Promise((resolve) => {
      const img = new Image();
      const done = () => resolve();
      img.onload = done;
      img.onerror = done;
      img.decoding = 'async';
      img.fetchPriority = 'low';
      img.src = src;
      if (img.complete) {
        resolve();
      }
    })
  );
  return Promise.all(loaders).then(() => undefined);
}
