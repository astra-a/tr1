import gsap from "gsap";
import Lenis from "@studio-freight/lenis";

export const CONFIG = {
  // 角度间隔保持不变
  angleInterval: 28,
  svg: { minSize: 5, maxSize: 18 },
  // scrollSpeed 不再用于连续旋转，但可以保留以供将来参考
  animation: { duration: 1.2, ease: "power3.out" },
  // rotationBounds 不再用于限制连续滚动，可以保留但作用变小
  rotationBounds: { min: -56, max: 56 },
  overshootFadePx: 500,
  transitionThreshold: 50,
  pageScrollThreshold: 100,
};

// --- 基础元素类 (ItemBase, TextItem, SvgItem, CenterSvgItem) 保持不变 ---

export abstract class ItemBase {
  el: HTMLElement;
  baseAngle: number;
  currentAngle: number = 0;
  controller: AnimationController | null = null;

  constructor(el: HTMLElement) {
    this.el = el;
    this.baseAngle = parseFloat(el.dataset.angle || "0");
  }

  setController(controller: AnimationController) {
    this.controller = controller;
  }

  abstract update(rotation: number): void;

  // 辅助函数：将角度归一化到 [-180, 180]
  normalizeAngle(angle: number) {
    angle %= 360;
    if (angle > 180) {
      angle -= 360;
    } else if (angle <= -180) {
      angle += 360;
    }
    return angle;
  }
}

export class TextItem extends ItemBase {
  update(rotation: number) {
    this.currentAngle = this.baseAngle + rotation;
    // 旋转
    gsap.set(this.el, { rotation: this.currentAngle });

    // 缩放和透明度：基于当前角度与 0 角度的接近程度进行控制
    const normalizedAngle = this.normalizeAngle(this.currentAngle);
    const centerAngle = CONFIG.angleInterval / 2;
    const normalizedAbsoluteAngle = Math.abs(normalizedAngle);

    // 中心激活状态：当 item 靠近中心时 (0度)
    const isActive = normalizedAbsoluteAngle < centerAngle;
    this.el.classList.toggle("active", isActive);

    // --- 内圈文字透明度 ---
    if (!(this.el.dataset.isOuter === "true")) {
      // 内圈文字判定
      const maxVisibleDiff = CONFIG.angleInterval * 2; // 可调范围
      const opacityFactor = Math.pow(
        1 - Math.min(normalizedAbsoluteAngle / maxVisibleDiff, 1),
        2,
      ); // 指数变化让过渡柔和
      gsap.set(this.el, { opacity: opacityFactor });
    }
  }
}
export class SvgItem extends ItemBase {
  update(rotation: number) {
    this.currentAngle = this.baseAngle + rotation;
    gsap.set(this.el, { rotation: this.currentAngle });

    const svgContainer = this.el.querySelector(".svg-container") as HTMLElement;
    if (!svgContainer) return;

    let opacity: number;
    let size: number;
    let filter: string;

    if (this.currentAngle > 0) {
      // 左侧强制不可见
      opacity = 0;
      size = CONFIG.svg.minSize;
      filter = "grayscale(100%)";
    } else {
      // 右侧渐变（currentAngle <= 0）
      const diff = Math.abs(this.currentAngle); // 0 -> 90
      const maxAngle = CONFIG.angleInterval * 3; // 可调渐变范围
      const t = diff >= maxAngle ? 0 : 1 - diff / maxAngle;
      const tEx = Math.pow(t, 1.5); // 指数过渡

      opacity = tEx;
      size =
        CONFIG.svg.minSize + tEx * (CONFIG.svg.maxSize - CONFIG.svg.minSize);
      filter = `grayscale(${100 - tEx * 100}%)`;
    }

    gsap.set(svgContainer, {
      opacity,
      width: `${size}px`,
      height: `${size}px`,
      filter,
    });
  }
}
export class CenterSvgItem extends ItemBase {
  update(rotation: number) {
    const progress = rotation / CONFIG.angleInterval; // 得到经过了多少段
    const normalizedRotation = (progress * 360) % 360; // 保证始终在 0~360
    gsap.set(this.el, { rotation: normalizedRotation });
  }
}

// --- 动画控制器 (AnimationController) ---

export class AnimationController {
  allItems: ItemBase[] = [];
  targetRotation: number = 0;
  currentRotation: number = 0;
  lastScrollDirection: number = 0;

  constructor(allItems: ItemBase[]) {
    this.allItems = allItems;
  }

  init() {
    this.allItems.forEach((item) => item.setController(this));
    // 初始设置，将第一个 TextItem 居中
    const firstTextItem = this.allItems.find(
      (item) => item instanceof TextItem,
    );
    this.currentRotation = firstTextItem ? -firstTextItem.baseAngle : 0;
    this.updateAllItems(false);
  }

  updateAllItems(isPageScroll: boolean) {
    this.allItems.forEach((item) => item.update(this.currentRotation));
  }

  /**
   * 实现段落式的平滑过渡动画到新的旋转角度
   */
  animateRotation(targetRotation: number) {
    this.targetRotation = targetRotation;
    gsap.to(this, {
      currentRotation: -this.targetRotation,
      duration: 0.6, // 稍微缩短，与 OuterTextCarousel 同步
      ease: "power2.out",
      overwrite: true,
      onUpdate: () => this.updateAllItems(false),
    });
  }

  rotateToIndex(
    index: number,
    roadmaps: { date: string; description: string; title: string }[],
  ) {
    // 计算居中的基准索引（例如，总长为 7，居中索引为 4）
    const roadmapCenterIndex = Math.ceil(roadmaps.length / 2);

    // 目标 TextItem 的 baseAngle 计算（需要与 index.tsx 中创建 DOM 元素的逻辑一致）
    // baseAngle = (i - roadmapCenterIndex + 1) * CONFIG.angleInterval;
    const targetBaseAngle =
      (index - roadmapCenterIndex + 1) * CONFIG.angleInterval;

    // 我们希望这个 baseAngle 的元素移动到 0 度位置，所以目标旋转角度为 0 - baseAngle
    const newTargetRotation = 0 - targetBaseAngle;

    this.animateRotation(newTargetRotation);
  }
}

// --- 外圈文字轮播 (OuterTextCarousel) ---

export class OuterTextCarousel {
  container: HTMLDivElement;
  outerEl: HTMLDivElement;
  currentIndex: number = 0;
  animating: boolean = false; // 动画状态标志，用于防抖

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.outerEl = container.querySelector<HTMLDivElement>(".outer")!;
    if (!this.outerEl) {
      throw new Error("Outer container (.outer) not found");
    }
  }

  init(blockContents: { title: string; description: string }[]) {
    this.outerEl.innerHTML = "";

    blockContents.forEach((item) => {
      const block = document.createElement("div");
      block.className = "block";

      const titleEl = document.createElement("div");
      titleEl.className = "title";
      titleEl.textContent = item.title;
      block.appendChild(titleEl);

      const contentEl = document.createElement("div");
      contentEl.className = "content";
      contentEl.textContent = item.description;
      block.appendChild(contentEl);

      this.outerEl.appendChild(block);
    });

    // 初始化到第一个索引
    this.showIndex(0, false);
  }

  /**
   * 轮播到指定的索引位置
   */
  showIndex(index: number, animate = true) {
    const blocks = Array.from(this.outerEl.children) as HTMLDivElement[];

    // 约束新索引
    const newIndex = Math.max(0, Math.min(index, blocks.length - 1));

    // 如果索引没有变化，且不在动画中，直接返回
    if (newIndex === this.currentIndex && !this.animating && animate) return;

    this.currentIndex = newIndex;

    const block = blocks[0];
    if (!block) return;

    // 1. 获取尺寸和间距
    const blockWidth = block.getBoundingClientRect().width;
    const outerContainerWidth = this.container.getBoundingClientRect().width;

    let gap = 100;
    if (blocks.length > 1) {
      const secondBlockLeft = blocks[1].getBoundingClientRect().left;
      const firstBlockRight = blocks[0].getBoundingClientRect().right;
      gap = secondBlockLeft - firstBlockRight;
    }

    // 2. 计算基准平移距离
    const moveDistance = blockWidth + gap;
    const leftAlignOffset = this.currentIndex * moveDistance;

    // 3. 计算居中校正量：将当前块的中心与容器的中心对齐
    const centerCorrection = outerContainerWidth / 2 - blockWidth / 2;

    // 4. 最终的 translateX 偏移量
    const offset = -leftAlignOffset + centerCorrection;

    if (animate) {
      this.animating = true;
      gsap.to(this.outerEl, {
        x: offset,
        duration: 0.6,
        ease: "power3.out",
        onUpdate: () => {
          blocks.forEach((b, i) => {
            b.classList.toggle("active", i === this.currentIndex);
          });
        },
        onComplete: () => {
          this.animating = false;
        },
      });
    } else {
      gsap.set(this.outerEl, { x: offset });
      blocks.forEach((b, i) => {
        b.classList.toggle("active", i === this.currentIndex);
      });
    }
  }

  next() {
    if (this.animating) return;
    this.showIndex(this.currentIndex + 1);
  }

  prev() {
    if (this.animating) return;
    this.showIndex(this.currentIndex - 1);
  }

  // 移除 bindWheel()
}

// 移除 StateTransitionController 类

// --- 集中同步控制器 (CarouselSyncController) ---

export class CarouselSyncController {
  outerCarousel: OuterTextCarousel;
  animationController: AnimationController;
  roadmaps: any[];
  containerRef: React.RefObject<HTMLDivElement>;

  private scrollAccum: number = 0;
  private readonly scrollThreshold = 50;
  private lenis: Lenis;
  private inPageScroll: boolean = false;
  // 新增：用于记录触摸开始时的 Y 坐标
  private startY: number = 0;

  constructor(
    outerCarousel: OuterTextCarousel,
    animationController: AnimationController,
    roadmaps: any[],
    containerRef: React.RefObject<HTMLDivElement>,
  ) {
    this.outerCarousel = outerCarousel;
    this.animationController = animationController;
    this.roadmaps = roadmaps;
    this.containerRef = containerRef;
    this.lenis = new Lenis({ lerp: 0.1 });
  }

  init() {
    // 绑定触摸事件处理函数
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);

    // 将事件绑定到容器上
    const containerEl = this.containerRef.current;
    if (containerEl) {
      // touchstart/touchend 使用 passive: true 提高性能
      containerEl.addEventListener("touchstart", this.handleTouchStart, {
        passive: true,
      });
      // touchmove 需要阻止默认行为来控制分段旋转，所以 passive: false
      containerEl.addEventListener("touchmove", this.handleTouchMove, {
        passive: false,
      });
      containerEl.addEventListener("touchend", this.handleTouchEnd, {
        passive: true,
      });
    }

    // 初始化两个组件的状态到第一个索引
    this.outerCarousel.showIndex(0, false);
    this.animationController.rotateToIndex(0, this.roadmaps);

    // Lenis raf 循环
    const raf = (time: number) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    this.lenis.stop(); // 初始停掉
  }

  dispose() {
    // 移除触摸事件监听
    const containerEl = this.containerRef.current;
    if (containerEl) {
      containerEl.removeEventListener("touchstart", this.handleTouchStart);
      containerEl.removeEventListener("touchmove", this.handleTouchMove);
      containerEl.removeEventListener("touchend", this.handleTouchEnd);
    }
    // 移除原有的 wheel 监听（如果存在，这里假设已经不在 init 中了）
  }

  // 移除 handleWheel

  handleTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
      this.startY = e.touches[0].clientY;
      this.scrollAccum = 0; // 重置累积位移
    }
  }

  handleTouchEnd() {
    this.scrollAccum = 0;
  }

  handleTouchMove(e: TouchEvent) {
    if (!this.containerRef.current || e.touches.length !== 1) return;

    const currentY = e.touches[0].clientY;
    // deltaY: 向上滑动 (正值)；向下滑动 (负值)。
    // 这与滚轮事件的 deltaY (向下滚为正) 语义相反。
    const deltaY = this.startY - currentY;

    // 更新起始点，以便下次 move 事件计算相对位移
    this.startY = currentY;

    // 我们使用 -deltaY 来模拟滚轮的 deltaY (向下滚/上滑为正)
    const delta = deltaY;

    if (this.inPageScroll) {
      // 已进入页面滚动模式
      if (window.scrollY === 0 && delta < 0) {
        // 在顶部且上滑 (delta < 0)，返回旋转模式
        e.preventDefault();
        this.inPageScroll = false;
        this.lenis.stop();
        this.scrollAccum = 0;
        // 回到最后一个索引状态
        this.outerCarousel.showIndex(this.roadmaps.length - 1, false);
        this.animationController.rotateToIndex(
          this.roadmaps.length - 1,
          this.roadmaps,
        );
      }
      // 其余情况：不阻止默认行为，让浏览器或 Lenis 处理页面滚动
      return;
    }

    // --- 分段旋转模式 ---
    e.preventDefault(); // 阻止页面默认滚动，以实现分段旋转

    if (this.outerCarousel.animating) return;

    this.scrollAccum += delta;

    if (Math.abs(this.scrollAccum) >= this.scrollThreshold) {
      let newIndex = this.outerCarousel.currentIndex;
      const scrollDirectionPositive = this.scrollAccum > 0; // scrollAccum > 0 表示向下一段（或向上滑）

      if (scrollDirectionPositive) {
        // 向下一段（模拟 wheel 的 deltaY > 0）
        if (newIndex === this.roadmaps.length - 1) {
          // 已在最后一个索引，进入页面滚动
          this.inPageScroll = true;
          this.lenis.start();
          this.scrollAccum = 0;
          return;
        }
        newIndex = Math.min(newIndex + 1, this.roadmaps.length - 1);
      } else {
        // 向上一段（模拟 wheel 的 deltaY < 0）
        newIndex = Math.max(newIndex - 1, 0);
      }

      if (newIndex !== this.outerCarousel.currentIndex) {
        this.outerCarousel.showIndex(newIndex);
        this.animationController.rotateToIndex(newIndex, this.roadmaps);
      }

      this.scrollAccum = 0;
    }
  }
}
