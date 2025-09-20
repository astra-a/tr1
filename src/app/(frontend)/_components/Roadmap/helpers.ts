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

  animateRotation(targetRotation: number, skipSnap = false) {
    this.targetRotation = targetRotation;
    gsap.to(this, {
      currentRotation: this.targetRotation,
      duration: 0.8,
      ease: "power2.out",
      overwrite: true,
      onUpdate: () => this.updateAllItems(false),
      onComplete: () => {
        if (!skipSnap) {
          this.snapTimeout = setTimeout(() => this.maybeSnap(), 300);
        }
      },
    });
  }

  maybeSnap() {
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
      onUpdate: () => this.updateAllItems(false),
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

  constructor(animationController: AnimationController, allItems: ItemBase[]) {
    this.animationController = animationController;
    this.allItems = allItems;
    this.currentState = "ROTATION";
    this.lastRotationBeforeTransition = 0;
    this.isTransitioningToPageScroll = false;
    this.lenis = new Lenis({
      lerp: 0.1, // 滚动平滑度，可以调节
    });
  }

  init() {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
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

    // 初始在旋转状态，停掉 Lenis
    this.lenis.stop();
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

  handleRotationState(e: WheelEvent) {
    const fifthItem = this.allItems.find(
      (i) => (i as TextItem)?.isBoundaryTrigger,
    );
    const isAtBoundary = fifthItem && Math.abs(fifthItem.currentAngle) < 0.01;

    if (isAtBoundary && e.deltaY > 0) {
      e.preventDefault();
      this.lastRotationBeforeTransition =
        this.animationController.currentRotation;
      this.currentState = "PAGE_SCROLL";
      gsap.killTweensOf(this.animationController);
      this.lenis.start();
      this.updateAppearance();
    } else {
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

  handlePageScrollState(e: WheelEvent) {
    if (e.deltaY < 0 && window.scrollY === 0) {
      e.preventDefault();
      this.currentState = "ROTATION";
      this.lenis.stop();

      this.animationController.animateRotation(
        this.lastRotationBeforeTransition,
        true,
      );

      this.updateAppearance();

      return;
    }
  }

  updateAppearance() {
    this.allItems.forEach((item) =>
      item.updateAppearance(this.currentState === "PAGE_SCROLL"),
    );
  }
}
