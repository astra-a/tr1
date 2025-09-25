"use client";

import { useCountDown } from "ahooks";
import { useEffect, useMemo } from "react";

export default function Countdown({
  deadline,
  onEnd,
}: {
  deadline: number;
  onEnd?: () => void;
}) {
  const [countdown, formattedResult] = useCountDown({
    targetDate: deadline * 1_000,
  });
  useEffect(() => {
    if (deadline > 0 && countdown <= 0) {
      onEnd?.();
    }
  }, [deadline, countdown]);
  const [days, hours, minutes, seconds] = useMemo(() => {
    return [
      formattedResult.days,
      formattedResult.hours,
      formattedResult.minutes,
      formattedResult.seconds,
    ];
  }, [deadline, countdown]);

  if (days > 0) {
    return (
      <>
        {days} <span className="text-teal">DAY</span> {hours}{" "}
        <span className="text-teal">HOUR</span>
      </>
    );
  } else if (hours > 0) {
    return (
      <>
        {hours} <span className="text-teal">HOUR</span> {minutes}{" "}
        <span className="text-teal">MINUTE</span>
      </>
    );
  } else {
    return (
      <>
        {minutes} <span className="text-teal">MINUTE</span> {seconds}{" "}
        <span className="text-teal">SECOND</span>
      </>
    );
  }
}
