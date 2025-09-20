import * as THREE from "three";

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

    this.init();
    this.animate();
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
    this.addEventListeners();
  }

  createMatrix() {
    if (this.instancedMesh) {
      this.scene.remove(this.instancedMesh);
    }

    const vFOV = (this.camera.fov * Math.PI) / 180;
    const worldScreenHeight = 2 * Math.tan(vFOV / 2) * this.camera.position.y;
    const worldScreenWidth = worldScreenHeight * this.camera.aspect;

    const cols = Math.ceil(this.canvasWidth / this.spacing) + 2;
    const rows = Math.ceil(this.canvasHeight / this.spacing) + 2;

    const scaleX = worldScreenWidth / this.canvasWidth;
    const scaleY = worldScreenHeight / this.canvasHeight;
    const pixelScale = Math.min(scaleX, scaleY);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const total = cols * rows;
    const material = new THREE.MeshBasicMaterial({
      color: this.baseColor,
      transparent: true,
      opacity: 1, // 全局透明度
    });

    this.instancedMesh = new THREE.InstancedMesh(geometry, material, total);

    // 保存固定缩放和间距
    this.fixedBoxSize = this.boxSize * pixelScale;
    this.fixedSpacing = this.spacing * pixelScale;

    // 启用 per-instance 颜色
    this.instancedMesh.instanceColor = new THREE.InstancedBufferAttribute(
      new Float32Array(total * 3),
      3,
    );

    this.scene.add(this.instancedMesh);

    // 初始化实例数据
    this.cubeData = [];
    const dummy = new THREE.Object3D();
    let index = 0;
    for (let i = -Math.floor(cols / 2); i < Math.ceil(cols / 2); i++) {
      for (let j = -Math.floor(rows / 2); j < Math.ceil(rows / 2); j++) {
        dummy.position.set(i * this.fixedSpacing, 0, j * this.fixedSpacing);
        dummy.scale.set(
          this.fixedBoxSize,
          this.fixedBoxSize,
          this.fixedBoxSize,
        );
        dummy.updateMatrix();
        this.instancedMesh.setMatrixAt(index, dummy.matrix);

        this.cubeData.push({
          baseX: i * this.fixedSpacing,
          baseZ: j * this.fixedSpacing,
          y: 0,
          color: this.baseColor.clone(),
        });
        index++;
      }
    }
  }

  addEventListeners() {
    this.container.addEventListener("mousemove", (e) => {
      this.isMouseInside = true;
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / this.canvasWidth) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / this.canvasHeight) * 2 + 1;
    });

    this.container.addEventListener("mouseleave", () => {
      this.isMouseInside = false;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.isMouseInside) {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(this.mouse, this.camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      raycaster.ray.intersectPlane(plane, this.targetPoint);
    }

    const dummy = new THREE.Object3D();

    this.cubeData.forEach((cube, i) => {
      let targetY = 0;
      let targetColor = this.baseColor.clone();

      if (this.isMouseInside) {
        const dx = cube.baseX - this.targetPoint.x;
        const dz = cube.baseZ - this.targetPoint.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        targetY = Math.exp(-0.005 * dist * dist) * 8;

        const tColor = Math.exp(-0.003 * dist * dist);
        targetColor = this.baseColor.clone().lerp(this.hoverColor, tColor);
      }

      // 平滑过渡高度
      cube.y += (targetY - cube.y) * this.delayFactor;
      cube.color.lerp(targetColor, this.delayFactor);

      // 更新矩阵
      dummy.position.set(cube.baseX, cube.y, cube.baseZ);
      dummy.scale.set(this.fixedBoxSize, this.fixedBoxSize, this.fixedBoxSize);
      dummy.updateMatrix();
      this.instancedMesh.setMatrixAt(i, dummy.matrix);

      // 更新颜色
      this.instancedMesh.setColorAt(i, cube.color);
    });

    this.instancedMesh.instanceMatrix.needsUpdate = true;
    this.instancedMesh.instanceColor.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
  }
}
