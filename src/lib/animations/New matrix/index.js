import * as THREE from "three";
import { gsap } from "gsap";

export class MatrixEffect {
  constructor(
    container,
    {
      canvasWidth,
      canvasHeight,
      boxSize = 2.7,
      spacing = 10,
      baseColor = 0x555555,
      hoverColor = 0x00ffff,
      delayFactor = 0.1,
      targetFps = 20,
    },
  ) {
    this.container = container;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.boxSize = boxSize;
    this.spacing = spacing;
    this.delayFactor = delayFactor;
    this.baseColor = new THREE.Color(baseColor);
    this.hoverColor = new THREE.Color(hoverColor);

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cubes = [];
    this.mouse = new THREE.Vector2();
    this.isMouseInside = false;
    this.targetPoint = new THREE.Vector3();
    this.isMouseLeave = false;
    this.isAnimating = false;
    this.animate = this.animate.bind(this);
    gsap.ticker.fps(targetFps);
    this.init();
  }

  init() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.canvasWidth / this.canvasHeight,
      0.1,
      1000,
    );
    this.camera.position.set(0, 60, 0);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    this.container.appendChild(this.renderer.domElement);

    this.createMatrix();
    this.renderer.render(this.scene, this.camera);
    this.addEventListeners();
    window.addEventListener("resize", () => this.onWindowResize());
  }

  onWindowResize() {
    console.log("onWindowResize called");
    const rect = this.container.getBoundingClientRect();
    this.canvasWidth = rect.width;
    this.canvasHeight = rect.height;

    this.camera.aspect = this.canvasWidth / this.canvasHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.canvasWidth, this.canvasHeight);

    this.cubes.forEach((cube) => this.scene.remove(cube));
    this.cubes = [];
    this.createMatrix();
    this.renderer.render(this.scene, this.camera);
  }

  startAnimation() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      gsap.ticker.add(this.animate);
    }
  }

  createMatrix() {
    this.cubes.forEach((cube) => this.scene.remove(cube));
    this.cubes = [];

    const vFOV = (this.camera.fov * Math.PI) / 180;
    const worldScreenHeight = 2 * Math.tan(vFOV / 2) * this.camera.position.y;
    const worldScreenWidth = worldScreenHeight * this.camera.aspect;

    const cols = Math.ceil(this.canvasWidth / this.spacing) + 2;
    const rows = Math.ceil(this.canvasHeight / this.spacing) + 2;

    const scaleX = worldScreenWidth / this.canvasWidth;
    const scaleY = worldScreenHeight / this.canvasHeight;

    const pixelScale = Math.min(scaleX, scaleY);

    const fixedBoxSize = this.boxSize * pixelScale;
    const fixedSpacing = this.spacing * pixelScale;

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    for (let i = -Math.floor(cols / 2); i < Math.ceil(cols / 2); i++) {
      for (let j = -Math.floor(rows / 2); j < Math.ceil(rows / 2); j++) {
        const material = new THREE.MeshBasicMaterial({
          color: this.baseColor.clone(),
          transparent: true,
          opacity: 0.25,
        });

        const cube = new THREE.Mesh(geometry, material);

        // 保持立方体，scaleX/Y/Z 都相等
        cube.scale.set(fixedBoxSize, fixedBoxSize, fixedBoxSize);

        // 放置位置
        cube.position.set(i * fixedSpacing, 0, j * fixedSpacing);
        cube.baseY = 0;

        this.cubes.push(cube);
        this.scene.add(cube);
      }
    }
  }

  addEventListeners() {
    this.container.addEventListener("mousemove", (e) => {
      if (!this.isMouseInside) {
        this.isMouseInside = true;
        this.startAnimation(); // 鼠标进入时启动动画
      }
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / this.canvasWidth) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / this.canvasHeight) * 2 + 1;
    });
    this.container.addEventListener("mouseleave", () => {
      this.isMouseInside = false;
      this.startAnimation();
    });
  }

  animate() {
    if (!this.isAnimating) return;
    // console.log("Frame running...");
    let needContinue = false;

    // // === FPS 计算逻辑 ===
    // if (!this.lastFrameTime) {
    //   this.lastFrameTime = performance.now();
    //   this.frameCount = 0;
    //   this.fpsLastTime = this.lastFrameTime;
    // }
    // this.frameCount++;
    // const now = performance.now();
    // const delta = now - this.lastFrameTime;
    // this.lastFrameTime = now;
    //
    // // 每隔 1 秒统计一次 FPS
    // if (now - this.fpsLastTime >= 1000) {
    //   const fps = (this.frameCount * 1000) / (now - this.fpsLastTime);
    //   console.log("FPS:", Math.round(fps));
    //   this.fpsLastTime = now;
    //   this.frameCount = 0;
    // }
    // // ==================

    if (this.isMouseInside) {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(this.mouse, this.camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      raycaster.ray.intersectPlane(plane, this.targetPoint);
    }

    this.cubes.forEach((cube) => {
      let targetY = 0;
      let targetColor = this.baseColor.clone();
      let targetOpacity = 0.25; // 初始半透明

      if (this.isMouseInside) {
        const dx = cube.position.x - this.targetPoint.x;
        const dz = cube.position.z - this.targetPoint.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        targetY = Math.exp(-0.005 * dist * dist) * 8;

        const tColor = Math.exp(-0.003 * dist * dist);
        targetColor = this.baseColor.clone().lerp(this.hoverColor, tColor);

        const minOpacity = 0.3;
        targetOpacity = minOpacity + (1 - minOpacity) * tColor;
      }

      if (this.isMouseLeave) {
        targetY = 0;
        targetColor = this.baseColor.clone();
        targetOpacity = 0.25; // 恢复默认透明度

        if (
          Math.abs(cube.position.y - targetY) <= 0.01 &&
          Math.abs(cube.material.opacity - targetOpacity) <= 0.01 &&
          Math.abs(cube.material.color.r - targetColor.r) <= 0.01 &&
          Math.abs(cube.material.color.g - targetColor.g) <= 0.01 &&
          Math.abs(cube.material.color.b - targetColor.b) <= 0.01
        ) {
          this.isMouseLeave = false; // 完成平滑过渡后停止
        }
      }

      // 平滑过渡高度
      cube.position.y += (targetY - cube.position.y) * this.delayFactor;
      cube.material.color.r +=
        (targetColor.r - cube.material.color.r) * this.delayFactor;
      cube.material.color.g +=
        (targetColor.g - cube.material.color.g) * this.delayFactor;
      cube.material.color.b +=
        (targetColor.b - cube.material.color.b) * this.delayFactor;
      cube.material.opacity +=
        (targetOpacity - cube.material.opacity) * this.delayFactor;

      if (this.isMouseInside) {
        // 鼠标在必须继续渲染
        needContinue = true;
      } else {
        // 鼠标离开只有没回到基态时才继续
        const nearTarget =
          Math.abs(cube.position.y - targetY) > 0.01 ||
          Math.abs(cube.material.opacity - targetOpacity) > 0.01 ||
          Math.abs(cube.material.color.r - targetColor.r) > 0.01 ||
          Math.abs(cube.material.color.g - targetColor.g) > 0.01 ||
          Math.abs(cube.material.color.b - targetColor.b) > 0.01;

        if (nearTarget) {
          needContinue = true;
        }
      }
    });

    this.renderer.render(this.scene, this.camera);

    if (!needContinue) {
      this.isAnimating = false;
      // 从 GSAP ticker 中移除 animate 方法，彻底停止调用
      gsap.ticker.remove(this.animate);
    }
  }
}
