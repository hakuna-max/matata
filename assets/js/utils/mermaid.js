export function initializeMermaid() {
    document.addEventListener('DOMContentLoaded', function () {
      import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs')
        .then((module) => {
          const mermaid = module.default || module; // 确保可以正确访问 Mermaid
          mermaid.initialize({ startOnLoad: true });
        })
        .catch((error) => {
          console.error('Failed to load Mermaid:', error);
        });
    });
  }