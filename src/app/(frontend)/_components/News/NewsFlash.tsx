"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoltLightning } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function MarqueeText() {
  const divRef = useRef<HTMLDivElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);

  const [initialX, setInitialX] = useState<number>(100);
  const [duration, setDuration] = useState<number>(20);
  useEffect(() => {
    if (divRef?.current && pRef?.current) {
      const divWidth = divRef.current.clientWidth;
      const pWidth = pRef.current.clientWidth;
      setDuration((divWidth + pWidth) / ((100 + pWidth) / 20));
    }
  }, [divRef, pRef]);

  return (
    <div ref={divRef} className="overflow-hidden">
      {initialX > 100 ? (
        <motion.p
          key={initialX}
          className="w-min text-xs md:text-sm xl:text-base text-white whitespace-nowrap"
          initial={{ x: initialX }}
          animate={{ x: "-100%" }}
          transition={{
            duration,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          Fashion month always has one dangerous side effect—it makes us want to
          shop.
        </motion.p>
      ) : (
        <motion.p
          ref={pRef}
          key={initialX}
          className="w-min text-xs md:text-sm xl:text-base text-white whitespace-nowrap"
          initial={{ x: initialX }}
          animate={{ x: "-100%" }}
          transition={{
            duration,
            ease: "linear",
          }}
          onAnimationComplete={() => {
            setInitialX(divRef?.current?.clientWidth ?? 100);
          }}
        >
          Fashion month always has one dangerous side effect—it makes us want to
          shop.
        </motion.p>
      )}
    </div>
  );
}

export default function NewsFlash() {
  return (
    <div className="news-flash flex items-center">
      <div className="news-flash-title flex justify-between items-center gap-1 md:gap-1.5 lg:gap-2 xl:gap-3 2xl:gap-4 px-1 sm:px-1.5 md:px-2 lg:px-3 xl:px4 2xl:px-4.5 py-2 md:py-2.25 xl:py-2.5 bg-mint-green text-jet-black">
        <div className="w-5 h-6">
          <FontAwesomeIcon icon={faBoltLightning} />
        </div>
        <p className="hidden md:block text-xs md:text-sm xl:text-base font-semibold uppercase">
          newsflash
        </p>
      </div>
      <div className="flex-auto w-0 px-2 md:px-3 lg:px-4 xl:px-5 2xl:px-6 3xl:px-7">
        <MarqueeText />
      </div>
    </div>
  );
}
