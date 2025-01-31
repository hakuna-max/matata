export function initAuthorPhoto() {
  const canvas = document.getElementById("authorCanvas");
  if (!canvas) return;

  const photoUrl = canvas.getAttribute("data-photo");
  if (!photoUrl) return; // 如果没有图片则不绘制

  drawAuthorPhoto(photoUrl, canvas);
}

function drawAuthorPhoto(photoUrl, canvas) {
  console.log("Drawing photo from:", photoUrl);

  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.src = photoUrl;
  img.crossOrigin = "anonymous"; // 防止跨域问题
  img.onload = function () {
    // 设置高分辨率
    const pixelRatio = window.devicePixelRatio || 1;
    const canvasWidth = 150 * pixelRatio; // canvas 高分辨率宽度
    const canvasHeight = 150 * pixelRatio; // canvas 高分辨率高度

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = "150px"; // 显示尺寸
    canvas.style.height = "150px"; // 显示尺寸

    // 计算裁剪区域
    const aspectRatio = img.width / img.height;
    let cropWidth, cropHeight, cropX, cropY;

    if (aspectRatio > 1) {
      // 图片宽度大于高度，裁剪左右
      cropHeight = img.height;
      cropWidth = cropHeight * (canvasWidth / canvasHeight);
      cropX = (img.width - cropWidth) / 2;
      cropY = 0;
    } else {
      // 图片高度大于宽度，裁剪上下
      cropWidth = img.width;
      cropHeight = cropWidth * (canvasHeight / canvasWidth);
      cropX = 0;
      cropY = (img.height - cropHeight) / 2;
    }

    // 裁剪并绘制图片
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.beginPath();
    ctx.arc(canvasWidth / 2, canvasHeight / 2, canvasWidth / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(
      img, 
      cropX, cropY, cropWidth, cropHeight, // 裁剪区域
      0, 0, canvasWidth, canvasHeight     // 绘制到 canvas
    );
  };
}
