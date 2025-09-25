"use client";

import { useCountDown } from "ahooks";
import { useMemo } from "react";

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
  const [days, hours, minutes, seconds] = useMemo(() => {
    if (deadline <= 0) {
      return ["-", "-", "-", "-"];
    } else if (countdown <= 0) {
      onEnd?.();
      return [0, 0, 0, 0];
    } else {
      return [
        formattedResult.days,
        formattedResult.hours,
        formattedResult.minutes,
        formattedResult.seconds,
      ];
    }
  }, [deadline, countdown]);

  return (
    <div className="flex items-center gap-2 lg:gap-3 xl:gap-4 2xl:gap-5 text-xs leading-none font-semibold text-white uppercase">
      <div className="time-block rounded-lg day">
        <div className="time-block-inner px-2 py-1.25 flex flex-col justify-center items-center gap-1 rounded-inherit">
          <p>{days}</p>
          <p>day</p>
        </div>
      </div>
      <div className="time-block rounded-lg hours">
        <div className="time-block-inner px-1 py-1.25 flex flex-col justify-center items-center gap-1 rounded-inherit">
          <p>{hours}</p>
          <p>hours</p>
        </div>
      </div>
      <div className="time-block rounded-lg mins">
        <div className="time-block-inner px-1 py-1.25 flex flex-col justify-center items-center gap-1 rounded-inherit">
          <p>{minutes}</p>
          <p>mins</p>
        </div>
      </div>
      <div className="time-block rounded-lg secs">
        <div className="time-block-inner px-1 py-1.25 flex flex-col justify-center items-center gap-1 rounded-inherit">
          <p>{seconds}</p>
          <p>secs</p>
        </div>
      </div>
    </div>
  );
}
