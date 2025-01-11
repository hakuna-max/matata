/**
 * 初始化 D3.js 画布
 * @param {string} containerId - 图表容器的 ID
 * @param {number} width - 图表宽度（可选）
 * @param {number} height - 图表高度（可选）
 * @returns {object} svg - 返回初始化的 SVG 画布对象
 */
export function initializeCanvas(containerId, width, height) {
  const container = document.getElementById(containerId);

  // 获取容器宽高（优先使用提供的 width 和 height）
  const containerWidth = container.offsetWidth - 20; // 减去 10px 左右 padding
  const containerHeight = container.offsetHeight - 20; // 减去 10px 上下 padding
  width = width || containerWidth; // 如果未提供 width，则使用容器宽度
  height = height || containerHeight; // 如果未提供 height，则使用容器高度

  // 初始化 SVG 画布
  const svg = d3.select("#" + containerId)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // 将画布引用存储到全局变量中
  window["d3_" + containerId] = svg;

  return svg;
}
/**
 * 初始化所有 D3.js 容器
 */
export function initializeAllContainers() {
  document.addEventListener("DOMContentLoaded", () => {
    const containers = document.querySelectorAll('[id^="d3-container-"]');

    containers.forEach((container) => {
      const containerId = container.id;

      // 动态获取自定义宽高或默认宽高
      const width = parseInt(container.dataset.width, 10) || 600; // 使用自定义宽度（如果有）
      const height = parseInt(container.dataset.height, 10) || 500; // 使用自定义高度（如果有）

      // 初始化画布
      initializeCanvas(containerId, width, height);

      console.log(`Initialized D3 canvas for container: ${containerId}, width: ${width || container.offsetWidth}, height: ${height || container.offsetHeight}`);
    });
  });

  // 监听窗口大小变化，自动调整画布大小
  window.addEventListener("resize", () => {
    const containers = document.querySelectorAll('[id^="d3-container-"]');

    containers.forEach((container) => {
      const containerId = container.id;
      const svg = window["d3_" + containerId];

      if (svg) {
        // 动态调整宽高
        const width = container.offsetWidth - 20; // 减去左右 10px padding
        const height = container.offsetHeight - 20; // 减去上下 10px padding

        svg.attr("width", width).attr("height", height);

        console.log(`Resized D3 canvas for container: ${containerId}, width: ${width}, height: ${height}`);
      }
    });
  });
}
