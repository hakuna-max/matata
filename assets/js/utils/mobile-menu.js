export function setupMobileMenuToggle() {
    document.addEventListener("DOMContentLoaded", () => {
      const toggleButton = document.querySelector(".menu-toggle");
      const mobileMenu = document.querySelector(".mobile-menu");
  
      if (toggleButton && mobileMenu) {
        toggleButton.addEventListener("click", () => {
          mobileMenu.classList.toggle("show"); // 切换 "show" 类
        });
  
        // 点击页面其他区域时隐藏菜单
        document.addEventListener("click", (e) => {
          if (!mobileMenu.contains(e.target) && !toggleButton.contains(e.target)) {
            mobileMenu.classList.remove("show");
          }
        });
      }
    });
  }
  