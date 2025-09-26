import gsap from "gsap";
import Lenis from "@studio-freight/lenis";

export const CONFIG = {
  angleInterval: 36,
  scrollSpeed: 0.3,
  svg: { minSize: 5, maxSize: 24 },
  animation: { duration: 1.2, ease: "power3.out" },
  rotationBounds: { min: -72, max: 72 },
  overshootFadePx: 500,
  transitionThreshold: 50,
  pageScrollThreshold: 100,
};

export abstract class ItemBase {
  domElement: HTMLElement;
  baseAngle: number = 0;
  r: number = 0;
  controller: AnimationController | undefined;

  constructor(domElement: HTMLDivElement) {
    this.domElement = domElement;
    this.baseAngle = parseFloat(this.domElement?.dataset?.angle ?? "0") || 0;
    this.r = parseFloat(this.domElement?.dataset?.r ?? "0") || 0;
  }

  get currentAngle() {
    let effectiveAngle =
      (this.baseAngle + (this.controller?.currentRotation ?? 0)) % 360;
    if (effectiveAngle < -180) effectiveAngle += 360;
    if (effectiveAngle > 180) effectiveAngle -= 360;
    return effectiveAngle;
  }

  setController(controller: AnimationController) {
    this.controller = controller;
  }

  updateAppearance(isPageScroll = false) {
    if (isPageScroll) {
      return;
    }

    const diff = Math.abs(this.currentAngle);
    const maxVisibleDiff = 90;
    const opacityFactor = 1 - Math.min(diff / maxVisibleDiff, 1);
    gsap.set(this.domElement, { opacity: opacityFactor });
  }
}

export class TextItem extends ItemBase {
  block: HTMLDivElement | null;
  isOuter: boolean = false;
  isBoundaryTrigger: boolean = false;
  isOpacityZero: boolean = false;

  constructor(domElement: HTMLDivElement) {
    super(domElement);
    this.block = this.domElement.querySelector(".block");
    this.isOuter = this.domElement.dataset.isOuter === "true";
    this.isBoundaryTrigger =
      this.domElement.dataset.isBoundaryTrigger === "true";
    this.isOpacityZero = false;
  }

  updateAppearance(isPageScroll = false) {
    if (!this.block) return;

    if (isPageScroll) {
      return;
    }

    const diff = Math.abs(this.currentAngle);
    const maxVisibleDiff = 90;
    const opacityFactor = 1 - Math.min((diff / maxVisibleDiff) * 2.5, 1);
    gsap.set(this.block, { opacity: opacityFactor });
    this.isOpacityZero = opacityFactor === 0;
  }
}

export class SvgItem extends ItemBase {
  container: HTMLDivElement | null;
  svg: SVGSVGElement | null;

  constructor(domElement: HTMLDivElement) {
    super(domElement);
    this.container = this.domElement.querySelector(".svg-container");
    this.svg = this.domElement.querySelector("svg");
  }

  updateAppearance(isPageScroll = false) {
    if (!this.container) return;

    if (isPageScroll) {
      return;
    }

    const angle = this.currentAngle;
    const visible = angle > 0;

    if (this.container) {
      gsap.set(this.container, {
        opacity: visible ? 1 : 0,
      });
    }

    if (visible) {
      const diff = Math.abs(angle);
      const maxVisibleDiff = 90;
      const interpolateFactor =
        diff < maxVisibleDiff ? 1 - diff / maxVisibleDiff : 0;

      const exaggeratedFactor = Math.pow(interpolateFactor, 2);

      const size =
        CONFIG.svg.minSize +
        exaggeratedFactor * (CONFIG.svg.maxSize - CONFIG.svg.minSize);
      const grayscale = 100 - exaggeratedFactor * 100;

      gsap.set(this.container, {
        width: `${size}px`,
        height: `${size}px`,
      });
      this.container.style.filter = `grayscale(${grayscale}%)`;
    } else {
      gsap.set(this.container, { opacity: 0 });
    }
  }
}

export class CenterSvgItem extends ItemBase {
  constructor(domElement: HTMLDivElement) {
    super(domElement);
  }

  updateAppearance() {
    if (this.controller) {
      const rotationSpeedFactor = 360 / 36;
      const rotation = this.controller.currentRotation * rotationSpeedFactor;
      gsap.set(this.domElement, { rotation: rotation });
    }
  }
}

export class AnimationController {
  allItems: ItemBase[] = [];
  targetRotation: number = 0;
  currentRotation: number = 0;
  lastScrollDirection: number = 0;
  snapTimeout: any = null;

  constructor(allItems: ItemBase[]) {
    this.allItems = allItems;
    this.targetRotation = 0;
    this.currentRotation = 0;
    this.lastScrollDirection = 0;
    this.snapTimeout = null;
  }

  init() {
    this.allItems.forEach((item) => item.setController(this));
    this.currentRotation = -this.allItems[0].baseAngle;
    this.updateAllItems(false);
  }

  updateAllItems(isPageScroll: boolean) {
    this.allItems.forEach((item) => {
      if (item.domElement.className !== "center-svg-item") {
        item.domElement.style.transform = `rotate(${this.currentRotation + item.baseAngle}deg) translateX(${item.r}px)`;
      }
      item.updateAppearance(isPageScroll);
    });
  }

  animateRotation(targetRotation: number, onComplete?: () => void) {
    this.targetRotation = targetRotation;
    gsap.to(this, {
      currentRotation: this.targetRotation,
      duration: 0.8,
      ease: "power2.out",
      overwrite: true,
      onUpdate: () => this.updateAllItems(false),
      onComplete: () => {
        if (onComplete) {
          onComplete();
        }
      },
    });
  }
}

export class StateTransitionController {
  animationController: AnimationController;
  allItems: ItemBase[] = [];
  currentState: string;
  lastRotationBeforeTransition: number;
  isTransitioningToPageScroll: boolean;
  private lenis: Lenis;
  private isAnimating: boolean = false;
  private triggerThreshold = 60; // 滚动达到此阈值才触发旋转
  private readyForPageScroll = false;

  constructor(animationController: AnimationController, allItems: ItemBase[]) {
    this.animationController = animationController;
    this.allItems = allItems;
    this.currentState = "ROTATION";
    this.lastRotationBeforeTransition = 0;
    this.isTransitioningToPageScroll = false;
    this.lenis = new Lenis({ lerp: 0.1 });
  }

  init() {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    window.addEventListener("wheel", this.handleWheel.bind(this), {
      passive: false,
    });
    document.body.style.overflowY = "hidden";

    const raf = (time: number) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    this.lenis.stop(); // 初始停掉页面滚动
  }

  handleWheel(e: WheelEvent) {
    this.animationController.lastScrollDirection = e.deltaY;

    switch (this.currentState) {
      case "ROTATION":
        this.handleRotationState(e);
        break;
      case "PAGE_SCROLL":
        this.handlePageScrollState(e);
        break;
    }
  }

  private normalizeDelta(e: WheelEvent) {
    let d = e.deltaY;
    if (e.deltaMode === 1) d *= 16;
    else if (e.deltaMode === 2) d *= window.innerHeight;
    return d;
  }

  handleRotationState(e: WheelEvent) {
    e.preventDefault();

    // 动画锁，旋转中不处理
    if (this.isAnimating) return;

    // --- 边界检测：进入页面滚动 ---
    const boundaryItem = this.allItems.find(
      (i) => i instanceof TextItem && i.isBoundaryTrigger,
    ) as TextItem | undefined;

    const isAtBoundary =
      boundaryItem && Math.abs(boundaryItem.currentAngle) < 0.05;

    if (isAtBoundary) {
      // 到达边界，先不滑动页面，只记录状态
      this.readyForPageScroll = true;
    } else {
      this.readyForPageScroll = false;
    }

    // --- 用户滑动且已经准备好滑动页面 ---
    if (this.readyForPageScroll && e.deltaY > 0) {
      this.currentState = "PAGE_SCROLL";
      this.lastRotationBeforeTransition =
        this.animationController.currentRotation;
      this.lenis.start();
      return;
    }

    // --- 常规旋转逻辑 ---
    const delta = this.normalizeDelta(e);
    if (Math.abs(delta) < this.triggerThreshold) return;

    const direction = Math.sign(delta);

    const navItems = this.allItems.filter(
      (item): item is TextItem => item instanceof TextItem && item.isOuter,
    );

    let closestDistance = Infinity;
    let currentItemIndex = -1;

    navItems.forEach((item, index) => {
      const effectiveDistance =
        this.animationController.currentRotation + item.baseAngle;
      const normalized = effectiveDistance % 360;
      const absNormalized = Math.abs(
        normalized > 180 ? normalized - 360 : normalized,
      );
      if (absNormalized < closestDistance) {
        closestDistance = absNormalized;
        currentItemIndex = index;
      }
    });

    if (currentItemIndex === -1) return;

    const targetIndex = currentItemIndex + direction;
    const clampedTargetIndex = Math.max(
      0,
      Math.min(navItems.length - 1, targetIndex),
    );

    if (clampedTargetIndex === currentItemIndex) return;

    const targetItem = navItems[clampedTargetIndex];
    if (targetItem) {
      const newTargetRotation = -targetItem.baseAngle;
      this.isAnimating = true;
      this.animationController.animateRotation(newTargetRotation, () => {
        this.isAnimating = false;
      });
    }
  }

  handlePageScrollState(e: WheelEvent) {
    // 页面向上滚动到顶部 → 回到 ROTATION 状态
    if (e.deltaY < 0 && window.scrollY === 0) {
      e.preventDefault();
      this.currentState = "ROTATION";
      this.lenis.stop();
      this.isAnimating = false;
      this.animationController.animateRotation(
        this.lastRotationBeforeTransition,
      );
      this.updateAppearance();
    }
  }

  updateAppearance() {
    this.allItems.forEach((item) =>
      item.updateAppearance(this.currentState === "PAGE_SCROLL"),
    );
  }
}
