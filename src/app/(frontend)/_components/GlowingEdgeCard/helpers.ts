export const cardUpdate = (e: PointerEvent, $el: HTMLDivElement) => {
  const position = pointerPositionRelativeToElement($el, e);
  const [px, py] = position.pixels;
  const [perx, pery] = position.percent;
  const [dx, dy] = distanceFromCenter($el, px, py);
  const edge = closenessToEdge($el, px, py);
  const angle = angleFromPointerEvent($el, dx, dy);

  $el?.style.setProperty("--pointer-x", `${round(perx)}%`);
  $el?.style.setProperty("--pointer-y", `${round(pery)}%`);
  $el?.style.setProperty("--pointer-°", `${round(angle)}deg`);
  $el?.style.setProperty("--pointer-d", `${round(edge * 100)}`);
  $el?.classList.remove("animating");
};

export const centerOfElement = ($el: HTMLDivElement) => {
  const { width, height } = $el.getBoundingClientRect();
  return [width / 2, height / 2];
};

export const pointerPositionRelativeToElement = (
  $el: HTMLDivElement,
  e: PointerEvent,
) => {
  const pos = [e.clientX, e.clientY];
  const { left, top, width, height } = $el.getBoundingClientRect();
  const x = pos[0] - left;
  const y = pos[1] - top;
  const px = clamp((100 / width) * x);
  const py = clamp((100 / height) * y);
  return { pixels: [x, y], percent: [px, py] };
};

export const angleFromPointerEvent = (
  $el: HTMLDivElement,
  dx: number,
  dy: number,
) => {
  // in degrees
  let angleRadians = 0;
  let angleDegrees = 0;
  if (dx !== 0 || dy !== 0) {
    angleRadians = Math.atan2(dy, dx);
    angleDegrees = angleRadians * (180 / Math.PI) + 90;
    if (angleDegrees < 0) {
      angleDegrees += 360;
    }
  }
  return angleDegrees;
};

export const distanceFromCenter = (
  $el: HTMLDivElement,
  x: number,
  y: number,
) => {
  // in pixels
  const [cx, cy] = centerOfElement($el);
  return [x - cx, y - cy];
};

export const closenessToEdge = ($el: HTMLDivElement, x: number, y: number) => {
  // in fraction (0,1)
  const [cx, cy] = centerOfElement($el);
  const [dx, dy] = distanceFromCenter($el, x, y);
  let k_x = Infinity;
  let k_y = Infinity;
  if (dx !== 0) {
    k_x = cx / Math.abs(dx);
  }
  if (dy !== 0) {
    k_y = cy / Math.abs(dy);
  }
  return clamp(1 / Math.min(k_x, k_y), 0, 1);
};

export const round = (value: number, precision = 3) =>
  parseFloat(value.toFixed(precision));

export const clamp = (value: number, min = 0, max = 100) =>
  Math.min(Math.max(value, min), max);

/** code for the intro animation, not related to teh interaction */
export const playAnimation = (
  $el: HTMLDivElement,
  angleStart = 110,
  onEnd?: () => void,
) => {
  const angleIncrement = 355;
  const cancels: (() => void)[] = [];

  $el?.style.setProperty("--pointer-°", `${angleStart}deg`);
  $el?.classList.add("animating");

  cancels.push(
    animateNumber({
      ease: easeOutCubic,
      duration: 500,
      onUpdate: (v: number) => {
        $el?.style.setProperty("--pointer-d", v.toString());
      },
    }),
  );

  cancels.push(
    animateNumber({
      ease: easeInCubic,
      delay: 0,
      duration: 1500,
      endValue: 50,
      onUpdate: (v: number) => {
        const d = angleIncrement * (v / 100) + angleStart;
        $el?.style.setProperty("--pointer-°", `${d}deg`);
      },
    }),
  );

  cancels.push(
    animateNumber({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      startValue: 50,
      endValue: 100,
      onUpdate: (v: number) => {
        const d = angleIncrement * (v / 100) + angleStart;
        $el?.style.setProperty("--pointer-°", `${d}deg`);
      },
    }),
  );

  cancels.push(
    animateNumber({
      ease: easeInCubic,
      duration: 1500,
      delay: 2500,
      startValue: 100,
      endValue: 0,
      onUpdate: (v: number) => {
        $el?.style.setProperty("--pointer-d", v.toString());
      },
      onEnd: () => {
        $el?.classList.remove("animating");
        onEnd?.();
      },
    }),
  );

  return () => {
    cancels.forEach((c) => c());
    $el?.classList.remove("animating");
    onEnd?.();
  };
};

export function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}
export function easeInCubic(x: number) {
  return x * x * x;
}

export function animateNumber(options: any) {
  const {
    startValue = 0,
    endValue = 100,
    duration = 1000,
    delay = 0,
    onUpdate = () => {},
    ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    onStart = () => {},
    onEnd = () => {},
  } = options;

  const startTime = performance.now() + delay;
  let rafId: number;
  let stopped = false;

  function update() {
    if (stopped) return;
    const currentTime = performance.now();
    const elapsed = currentTime - startTime;
    const t = Math.min(elapsed / duration, 1); // Normalize to [0, 1]
    const easedValue = startValue + (endValue - startValue) * ease(t); // Apply easing

    onUpdate(easedValue);

    if (t < 1) {
      requestAnimationFrame(update); // Continue the animation
    } else if (t >= 1) {
      onEnd();
    }
  }

  const timeoutId = setTimeout(() => {
    if (stopped) return;
    onStart();
    rafId = requestAnimationFrame(update); // Start the animation after the delay
  }, delay);

  return () => {
    stopped = true;
    cancelAnimationFrame(rafId);
    clearTimeout(timeoutId);
  };
}
