import gsap from "gsap";

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

  updateAppearance(transitionProgress = 0, isPageScroll = false) {
    if (isPageScroll) {
      gsap.set(this.domElement, { opacity: 0 });
      return;
    }

    if (Math.abs(transitionProgress) > 0) {
      const progress = Math.min(
        Math.abs(transitionProgress) / CONFIG.pageScrollThreshold,
        1,
      );
      let finalOpacity = transitionProgress > 0 ? 1 - progress : progress;
      finalOpacity = Math.max(0, Math.min(1, finalOpacity));
      gsap.to(this.domElement, {
        opacity: finalOpacity,
        duration: 0.5,
        ease: "power2.out",
      });
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

  updateAppearance(transitionProgress = 0, isPageScroll = false) {
    if (!this.block) return;

    if (isPageScroll) {
      this.isOpacityZero = true;
      gsap.to(this.block, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => {
          this.isOpacityZero = true;
        },
      });
      return;
    }

    if (Math.abs(transitionProgress) > 0) {
      const finalOpacity =
        transitionProgress > 0
          ? 1 - Math.min(transitionProgress / CONFIG.pageScrollThreshold, 1)
          : Math.min(-transitionProgress / CONFIG.pageScrollThreshold, 1);

      gsap.to(this.block, {
        opacity: finalOpacity,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => {
          this.isOpacityZero = finalOpacity === 0;
        },
      });
      return;
    }

    if (transitionProgress > 0) {
      const blockOpacity =
        1 - Math.min(transitionProgress / CONFIG.overshootFadePx, 1);
      gsap.set(this.block, { opacity: blockOpacity });
      this.isOpacityZero = blockOpacity === 0;
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

  updateAppearance(transitionProgress = 0, isPageScroll = false) {
    if (!this.container) return;

    if (isPageScroll) {
      gsap.to(this.container, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
      });
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
      const rotationSpeedFactor = 360 / 25;
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
  isPageScroll: boolean = false;

  constructor(allItems: ItemBase[]) {
    this.allItems = allItems;
    this.targetRotation = 0;
    this.currentRotation = 0;
    this.lastScrollDirection = 0;
    this.snapTimeout = null;
    this.isPageScroll = false;
  }

  init() {
    this.allItems.forEach((item) => item.setController(this));
    this.currentRotation = -this.allItems[0].baseAngle;
    this.updateAllItems();
  }

  updateAllItems() {
    this.allItems.forEach((item) => {
      if (item.domElement.className !== "center-svg-item") {
        item.domElement.style.transform = `rotate(${this.currentRotation + item.baseAngle}deg) translateX(${item.r}px)`;
      }
      item.updateAppearance(this.isPageScroll ? 1 : 0);
    });
  }

  animateRotation(targetRotation: number) {
    this.targetRotation = targetRotation;
    gsap.to(this, {
      currentRotation: this.targetRotation,
      duration: 0.8,
      ease: "power2.out",
      overwrite: true,
      onUpdate: () => this.updateAllItems(),
      onComplete: () => {
        this.snapTimeout = setTimeout(() => this.maybeSnap(), 300);
      },
    });
  }

  maybeSnap() {
    if (this.isPageScroll) return;
    this.snapToClosestItem();
  }

  snapToClosestItem() {
    let closestDistance = Infinity;
    let closestItemAngle = 0;

    this.allItems.forEach((item) => {
      if (item.domElement.className === "center-svg-item") return;

      const effectiveDistance = this.currentRotation + item.baseAngle;
      const normalized = effectiveDistance % 360;
      const absNormalized = Math.abs(
        normalized > 180 ? normalized - 360 : normalized,
      );

      if (absNormalized < closestDistance - 0.1) {
        closestDistance = absNormalized;
        closestItemAngle = item.baseAngle;
      } else if (Math.abs(absNormalized - closestDistance) < 1) {
        if (this.lastScrollDirection > 0) {
          if (item.baseAngle > closestItemAngle)
            closestItemAngle = item.baseAngle;
        } else {
          if (item.baseAngle < closestItemAngle)
            closestItemAngle = item.baseAngle;
        }
      }
    });

    const newTargetRotation = 0 - closestItemAngle;
    gsap.to(this, {
      currentRotation: newTargetRotation,
      duration: 1.2,
      ease: "power3.out",
      overwrite: true,
      onUpdate: () => this.updateAllItems(),
    });
  }
}

export class StateTransitionController {
  animationController: AnimationController;
  allItems: ItemBase[] = [];
  currentState: string;
  transitionProgress: number;
  lastRotationBeforeTransition: number;
  transitionTimeout: any;
  isTransitioningToPageScroll: boolean;

  constructor(animationController: AnimationController, allItems: ItemBase[]) {
    this.animationController = animationController;
    this.allItems = allItems;
    this.currentState = "ROTATION";
    this.transitionProgress = 0;
    this.lastRotationBeforeTransition = 0;
    this.transitionTimeout = null;
    this.isTransitioningToPageScroll = false;
  }

  init() {
    window.addEventListener("wheel", this.handleWheel.bind(this), {
      passive: false,
    });
    document.body.style.overflowY = "hidden";
  }

  handleWheel(e: WheelEvent) {
    this.animationController.lastScrollDirection = e.deltaY;
    switch (this.currentState) {
      case "ROTATION":
        this.handleRotationState(e);
        break;
      case "TRANSITION":
        this.handleTransitionState(e);
        break;
      case "PAGE_SCROLL":
        this.handlePageScrollState(e);
        break;
    }
  }

  handleRotationState(e: WheelEvent) {
    const fifthItem = this.allItems.find(
      (i) => (i as TextItem)?.isBoundaryTrigger,
    );
    const isAtBoundary = fifthItem && Math.abs(fifthItem.currentAngle) < 0.01;

    if (isAtBoundary && e.deltaY > 0) {
      e.preventDefault();
      this.transitionProgress += e.deltaY;

      if (this.transitionProgress >= CONFIG.transitionThreshold) {
        this.currentState = "TRANSITION";
        this.lastRotationBeforeTransition =
          this.animationController.currentRotation;
        gsap.killTweensOf(this.animationController);
        this.updateAppearance();
      }
    } else {
      this.transitionProgress = 0;
      let newRotation =
        this.animationController.currentRotation -
        e.deltaY * CONFIG.scrollSpeed;
      if (newRotation > CONFIG.rotationBounds.max) {
        newRotation = CONFIG.rotationBounds.max;
      } else if (newRotation < CONFIG.rotationBounds.min) {
        newRotation = CONFIG.rotationBounds.min;
      }
      this.animationController.animateRotation(newRotation);
    }
  }

  handleTransitionState(e: WheelEvent) {
    e.preventDefault();

    const delta = e.deltaY * 0.1;
    this.transitionProgress += delta;
    this.transitionProgress = Math.min(
      CONFIG.pageScrollThreshold,
      Math.max(-CONFIG.pageScrollThreshold, this.transitionProgress),
    );

    if (
      this.transitionProgress >= CONFIG.pageScrollThreshold &&
      !this.isTransitioningToPageScroll
    ) {
      // 标记正在过渡到页面滚动状态
      this.isTransitioningToPageScroll = true;

      // 添加微小延迟确保透明度变化已应用
      setTimeout(() => {
        this.currentState = "PAGE_SCROLL";
        this.isTransitioningToPageScroll = false;
        document.body.style.overflowY = "auto";
        this.updateAppearance();
      }, 600);
    } else if (
      this.transitionProgress <= -CONFIG.transitionThreshold &&
      !this.isTransitioningToPageScroll
    ) {
      // 保持 transitionProgress 为负值，等待滚动自然更新
      this.isTransitioningToPageScroll = true;
      setTimeout(() => {
        this.currentState = "ROTATION";
        this.isTransitioningToPageScroll = false;
        document.body.style.overflowY = "hidden";
        this.animationController.animateRotation(
          this.lastRotationBeforeTransition,
        );
        this.updateAppearance();
      }, 600);
    }

    this.updateAppearance();
  }

  handlePageScrollState(e: WheelEvent) {
    if (e.deltaY < 0 && window.scrollY === 0) {
      e.preventDefault();
      this.transitionProgress += e.deltaY;

      if (Math.abs(this.transitionProgress) >= CONFIG.transitionThreshold) {
        this.transitionProgress = -CONFIG.transitionThreshold;
        this.currentState = "TRANSITION";

        this.updateAppearance();
      }
    } else {
      this.transitionProgress = 0;
    }
  }

  updateAppearance() {
    this.allItems.forEach((item) =>
      item.updateAppearance(
        this.transitionProgress,
        this.currentState === "PAGE_SCROLL",
      ),
    );
  }
}
