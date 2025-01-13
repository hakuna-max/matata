/**
 * 初始化 D3.js 画布
 * @param {string} containerId - 图表容器的 ID
 * @param {number} width - 图表宽度
 * @param {number} height - 图表高度
 * @returns {object} svg - 返回初始化的 SVG 画布对象
 */
export function initializeCanvas(containerId, width = 600, height = 500) {
  // console.log("Initializing D3 container with ID:", containerId); // 调试日志
  const svg = d3.select("#" + containerId)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`) // 使用 viewBox 自适应
    .attr("preserveAspectRatio", "xMidYMid meet");

  // 将画布引用存储到全局变量中
  window["d3_" + containerId] = svg;

  return svg;
}

/**
 * 初始化所有 D3 图表容器
 * 自动查找页面中所有 `d3-container-*` 的元素，并初始化画布
 */
export function initializeAllContainers(chartLogicMap) {
  document.addEventListener("DOMContentLoaded", () => {
    const containers = document.querySelectorAll('[id^="d3-container-"]');

    containers.forEach((container) => {
      const containerId = container.id;
      const width = parseInt(container.dataset.width, 10) || 600;
      const height = parseInt(container.dataset.height, 10) || 500;

      if (!window["d3_" + containerId]) {
        // 初始化画布
        const svg = initializeCanvas(containerId, width, height);

        // 根据逻辑映射执行绘图
        if (chartLogicMap[containerId]) {
          chartLogicMap[containerId](svg);
        }

        console.log(`Initialized D3 canvas for container: ${containerId}`);
      } else {
        console.warn(`Canvas for container ${containerId} is already initialized.`);
      }
    });
  });
}
