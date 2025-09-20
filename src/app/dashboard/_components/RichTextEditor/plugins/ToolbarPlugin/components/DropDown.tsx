/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useEffect, useRef, useState } from "react";
import * as React from "react";

export default function DropDown({
  buttonLabel,
  buttonAriaLabel,
  buttonClassName,
  buttonIcon,
  children,
  stopCloseOnClickSelf,
}: {
  buttonAriaLabel?: string;
  buttonClassName: string;
  buttonIcon?: ReactNode;
  buttonLabel?: string;
  children: ReactNode;
  stopCloseOnClickSelf?: boolean;
}) {
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [showDropDown, setShowDropDown] = useState(false);

  // useEffect(() => {
  //   const button = buttonRef.current;
  //   const dropDown = dropDownRef.current;
  //
  //   if (showDropDown && button !== null && dropDown !== null) {
  //     const { top, left } = button.getBoundingClientRect();
  //     dropDown.style.top = `${top + 40}px`;
  //     dropDown.style.left = `${Math.min(
  //       left,
  //       window.innerWidth - dropDown.clientWidth - 20,
  //     )}px`;
  //   }
  // }, [dropDownRef, buttonRef, showDropDown]);

  useEffect(() => {
    const button = buttonRef.current;

    if (button !== null && showDropDown) {
      const handle = (event: MouseEvent) => {
        const target = event.target;
        if (stopCloseOnClickSelf) {
          if (dropDownRef?.current?.contains(target as Node)) return;
        }
        if (!button.contains(target as Node)) {
          setShowDropDown(false);
        }
      };
      document.addEventListener("click", handle);

      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [dropDownRef, buttonRef, showDropDown, stopCloseOnClickSelf]);

  return (
    <div className="rich-text-editor-toolbar__dropdown-wrapper">
      <button
        ref={buttonRef}
        type="button"
        aria-label={buttonAriaLabel || buttonLabel}
        className={buttonClassName}
        onClick={() => setShowDropDown(!showDropDown)}
      >
        {buttonIcon}
        {buttonLabel && (
          <span className="text dropdown-button-text">{buttonLabel}</span>
        )}
        <i className="chevron-down" />
      </button>

      {showDropDown && (
        <div className="rich-text-editor-toolbar__dropdown" ref={dropDownRef}>
          {children}
        </div>
      )}
    </div>
  );
}
