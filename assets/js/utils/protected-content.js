// 设置 Cookie
export function setCookie(name, value, days) {
  const expires = days
    ? `; expires=${new Date(
        Date.now() + days * 24 * 60 * 60 * 1000
      ).toUTCString()}`
    : "";
  document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

// 获取 Cookie
export function getCookie(name) {
  const nameEQ = `${name}=`;
  return document.cookie.split(";").reduce((cookieValue, currentCookie) => {
    currentCookie = currentCookie.trim();
    return currentCookie.startsWith(nameEQ)
      ? currentCookie.substring(nameEQ.length)
      : cookieValue;
  }, null);
}

// 初始化受保护内容
export function initProtectedContent(id, correctPassword) {
  // 检查 Cookie 并决定显示内容还是密码表单
  const savedPassword = getCookie(`site_password-${id}`);
  if (savedPassword === correctPassword) {
    showProtectedContent(id);
  } else {
    showPasswordForm(id);
  }

  // 设置提交按钮事件
  const submitButton = document.getElementById(`submit-button-${id}`);
  if (submitButton) {
    submitButton.addEventListener("click", () =>
      checkPassword(id, correctPassword)
    );
  } else {
    console.error("Submit button element not found.");
  }

  // 设置回车键提交事件
  const passwordInput = document.getElementById(`password-input-${id}`);
  if (passwordInput) {
    passwordInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // 阻止默认行为
        checkPassword(id, correctPassword);
      }
    });
  } else {
    console.error("Password input element not found.");
  }
}

// 解码 Base64 内容
export function decodeBase64(encodedContent) {
  try {
    return decodeURIComponent(
      atob(encodedContent)
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );
  } catch (error) {
    console.error("Failed to decode content", error);
    return "Error decoding content.";
  }
}

// 显示受保护内容
export function showProtectedContent(id) {
  const contentElement = document.getElementById(`protected-content-${id}`);
  const formElement = document.getElementById(`protected-form-${id}`);

  if (contentElement && formElement) {
    const encodedContent = contentElement.getAttribute("data-content");
    const decodedContent = decodeBase64(encodedContent);

    contentElement.innerHTML = decodedContent; // 显示解码内容
    contentElement.style.display = "block";
    formElement.style.display = "none";
  } else {
    console.error("Content or Form element not found.");
  }
}

// 显示密码表单
export function showPasswordForm(id) {
  const formElement = document.getElementById(`protected-form-${id}`);
  if (formElement) {
    formElement.classList.add("visible"); // 添加 .visible 类
    console.log("Password form is now visible.");
  } else {
    console.error("Password form element not found.");
  }
}

// 验证密码// 计算 SHA-256 哈希值
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

// 修改验证密码的逻辑
export async function checkPassword(id, correctPassword) {
  const input = document.getElementById(`password-input-${id}`);
  const savedPassword = getCookie(`site_password-${id}`);
  const hashedPassword = document.querySelector(`#protected-content-${id}`).getAttribute('data-password');

  if (input) {
    const inputValue = input.value;
    const hashedInput = await hashPassword(inputValue);

    if (hashedInput === hashedPassword || savedPassword === hashedPassword) {
      console.log("Password is correct. Displaying protected content...");
      setCookie(`site_password-${id}`, hashedPassword, 1); // 设置 Cookie 有效期为 1 天
      showProtectedContent(id);
    } else {
      console.log("Password is incorrect. Showing error message...");

      const errorMessage = document.getElementById(`error-message-${id}`);
      if (errorMessage) {
        errorMessage.classList.add("show");
        console.log("Error message displayed.");
        setTimeout(() => {
          errorMessage.classList.remove("show");
          console.log("Error message hidden after 3 seconds.");
        }, 3000);
      } else {
        console.error(`Error message element not found for id: ${id}`);
      }
    }
  } else {
    console.error(`Password input element not found for id: ${id}`);
  }
}

// 自动初始化逻辑
document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing protected content...");
  const protectedForms = document.querySelectorAll(".protected-form");

  protectedForms.forEach((formElement) => {
    const id = formElement.getAttribute("data-id");
    const contentElement = document.querySelector(
      `.protected-content[data-id="${id}"]`
    );
    const password = contentElement?.getAttribute("data-password");

    if (id && password) {
      initProtectedContent(id, password);
    } else {
      console.error(
        `Failed to initialize: Missing ID or password for form ID: ${id}`
      );
    }
  });
});
