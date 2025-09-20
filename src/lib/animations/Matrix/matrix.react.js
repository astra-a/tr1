import { Application, Sprite, Texture } from "pixi.js";

const presetConfig = {
  boxSize: 0.3,
  backgroundColor: 0x000000,
  highlightColor: { r: 0, g: 255, b: 255 },
  darkColor: { r: 0, g: 0, b: 0 },
  fadeSpeed: 0.01,
  decay: 0.25,
  weightX: 0.8,
  weightY: 1.5,
  rangeFactor: 1.3,
  maxScale: 22.0,
  minGap: 7,
};

export class Matrix {
  constructor(containerId, width, height, options = {}) {
    this.config = {
      ...options,
      containerId: containerId,
      width: width,
      height: height,
    };

    this.mousePos = { x: 0, y: 0 };
    this.mouseActive = false;
    this.boxes = [];
    this.app = null;
  }

  // 初始化方法
  init() {
    this.createApp();
    return this;
  }

  // 創建Pixi應用
  createApp() {
    const { containerId, width, height } = this.config;
    const container = document.getElementById(containerId);

    if (!container) {
      console.error(`容器元素 #${containerId} 未找到`);
      return;
    }

    // 清除容器內容
    container.innerHTML = "";

    // 創建Pixi應用
    this.app = new Application({
      width: width,
      height: height,
      backgroundColor: this.config.backgroundColor,
      antialias: true,
    });

    container.appendChild(this.app.view);

    // 建立網格
    this.createGrid();

    // 設定事件監聽
    this.setupEventListeners();

    // 啟動動畫循環
    this.startAnimation();
  }

  // 建立網格
  createGrid() {
    const { width, height, boxSize, maxScale, minGap } = this.config;

    // 矩陣計算方法，避免間隔不足以放置變大的方塊
    const spacingX = boxSize * maxScale + minGap;
    const spacingY = boxSize * maxScale + minGap;
    const cols = Math.floor((width - boxSize) / spacingX) + 1;
    const rows = Math.floor((height - boxSize) / spacingY) + 1;

    // 計算居中偏移量
    const offsetX = (width - ((cols - 1) * spacingX + boxSize)) / 2;
    const offsetY = (height - ((rows - 1) * spacingY + boxSize)) / 2;

    // 創建矩陣
    this.boxes = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const box = new Sprite(Texture.WHITE);

        // 設定錨點為中心點 (0.5, 0.5)
        box.anchor.set(0.5);

        box.width = boxSize;
        box.height = boxSize;
        box.tint = 0x000000;
        box.alpha = 0;

        // 計算位置
        box.x = offsetX + col * spacingX;
        box.y = offsetY + row * spacingY;

        this.app.stage.addChild(box);

        // 儲存原始尺寸和位置
        box.originalSize = boxSize;

        this.boxes.push({
          box,
          cx: box.x,
          cy: box.y,
          targetAlpha: 0,
        });
      }
    }
  }

  // 設定事件監聽
  setupEventListeners() {
    // 滑鼠移動事件
    this.app.view.addEventListener("mousemove", (e) => {
      const rect = this.app.view.getBoundingClientRect();
      this.mousePos.x = e.clientX - rect.left;
      this.mousePos.y = e.clientY - rect.top;
      this.mouseActive = true;
    });

    this.app.view.addEventListener("mouseleave", () => {
      this.mouseActive = false;
    });

    // 觸摸事件支持
    this.app.view.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        const rect = this.app.view.getBoundingClientRect();
        this.mousePos.x = e.touches[0].clientX - rect.left;
        this.mousePos.y = e.touches[0].clientY - rect.top;
        this.mouseActive = true;
      }
    });

    this.app.view.addEventListener("touchend", () => {
      this.mouseActive = false;
    });
  }

  // 計算亮度函數
  computeBrightness(dx, dy, l) {
    const { decay, weightX, weightY } = this.config;
    const weightedDx = dx * weightX;
    const weightedDy = dy * weightY;
    const d = Math.sqrt(weightedDx * weightedDx + weightedDy * weightedDy);
    return Math.exp(-(d * d) / (l * l * decay * decay));
  }

  // 計算尺寸因子函數
  computeSizeFactor(dx, dy, l, minFactor = 1.0, maxFactor = 12.0) {
    const { decay, weightX, weightY } = this.config;
    const weightedDx = dx * weightX;
    const weightedDy = dy * weightY;
    const d = Math.sqrt(weightedDx * weightedDx + weightedDy * weightedDy);
    const t = Math.exp(-(d * d) / (l * l * decay * decay * 0.7));
    return minFactor + (maxFactor - minFactor) * t;
  }

  // 啟動動畫循環
  startAnimation() {
    const { width, height, fadeSpeed, highlightColor, darkColor, rangeFactor } =
      this.config;

    this.app.ticker.add(() => {
      // 計算目前對角線長度乘以範圍因子
      const currentL = Math.sqrt(width * width + height * height) * rangeFactor;

      this.boxes.forEach(({ box, cx, cy }) => {
        let dx = 0,
          dy = 0;

        if (this.mouseActive) {
          dx = cx - this.mousePos.x;
          dy = cy - this.mousePos.y;

          // 計算帶方向性權重的亮度
          let t = this.computeBrightness(dx, dy, currentL);
          t = Math.max(0, Math.min(1, t));
          box.targetAlpha = t;

          // 計算帶方向性權重的尺寸因子
          const sizeFactor = this.computeSizeFactor(dx, dy, currentL);

          // 應用尺寸變化
          box.width = box.originalSize * sizeFactor;
          box.height = box.originalSize * sizeFactor;

          const r = Math.round(
            darkColor.r + (highlightColor.r - darkColor.r) * t,
          );
          const g = Math.round(
            darkColor.g + (highlightColor.g - darkColor.g) * t,
          );
          const b = Math.round(
            darkColor.b + (highlightColor.b - darkColor.b) * t,
          );
          box.tint = (r << 16) + (g << 8) + b;
        } else {
          box.targetAlpha = 0;
          // 平滑恢復原始尺寸
          box.width += (box.originalSize - box.width) * 0.2;
          box.height += (box.originalSize - box.height) * 0.2;
        }

        // 更新透明度
        if (box.alpha < box.targetAlpha) {
          box.alpha = Math.min(box.alpha + fadeSpeed, box.targetAlpha);
        } else if (box.alpha > box.targetAlpha) {
          box.alpha = Math.max(box.alpha - fadeSpeed, box.targetAlpha);
        }
      });
    });
  }
}
