document.addEventListener('click', (event) => {
  const target = event.composedPath().find((node) => node.hasAttribute && node.hasAttribute('disableonclick'));
  if (target) {
    target.disabled = true;
  }
});
