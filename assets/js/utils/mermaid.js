export function initializeMermaid() {
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof mermaid === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js'; // 确保路径正确
      script.onload = function () {
        if (typeof mermaid !== 'undefined') {
          // Mermaid.js 加载成功后初始化
          mermaid.initialize({ 
            startOnLoad: true,
          });

          // 包裹 mermaid 图表内容
          wrapMermaidInContainer();
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
      mermaid.initialize({ 
        startOnLoad: true,
      });

      // 包裹 mermaid 图表内容
      wrapMermaidInContainer();
    }
  });

  /**
   * 将所有 mermaid 图表包裹在 mermaid-container 容器中
   */
  function wrapMermaidInContainer() {
    const mermaidElements = document.querySelectorAll('.mermaid');
    mermaidElements.forEach((element) => {
      // 检查是否已经被包裹，避免重复包裹
      if (!element.parentElement.classList.contains('mermaid-container')) {
        const container = document.createElement('div');
        container.className = 'mermaid-container';

        // 将当前 mermaid 元素放入容器中
        element.parentNode.insertBefore(container, element);
        container.appendChild(element);
      }
    });
  }
}
