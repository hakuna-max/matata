export function initializeMermaid() {
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof mermaid === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js'; // 确保路径正确
      script.onload = function () {
        if (typeof mermaid !== 'undefined') {
          // Mermaid.js 加载成功后初始化
          mermaid.initialize({ startOnLoad: true });
        } else {
          console.error('Mermaid is not defined after script load.');
        }
      };
      script.onerror = function () {
        console.error('Failed to load Mermaid.js.');
      };
      document.body.appendChild(script);
    } else {
      // 如果已经加载过 Mermaid.js，直接初始化
      mermaid.initialize({ startOnLoad: true });
    }
  });
}
