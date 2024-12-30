export default function setupMainScale(minWidth = 768) {
    const mainElement = document.querySelector('.site-main');
  
    if (!mainElement) {
      console.warn("Element '.site-main' not found. Scaling will not be applied.");
      return;
    }
  
    function setMainScale() {
      const zoomLevel = window.innerWidth / document.documentElement.clientWidth;
  
      if (window.innerWidth >= minWidth) {
        mainElement.style.transform = `scale(${zoomLevel})`;
      } else {
        mainElement.style.transform = 'scale(1)'; // 小屏时恢复默认比例
      }
    }
  
    // 监听窗口大小变化
    window.addEventListener('resize', setMainScale);
  
    // 初始化缩放
    setMainScale();
  }