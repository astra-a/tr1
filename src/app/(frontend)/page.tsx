"use client";

import First from "./_components/Home/First";
import Second from "./_components/Home/Second";
import Third from "./_components/Home/Third";
import Fourth from "./_components/Home/Fourth";
import Fifth from "./_components/Home/Fifth";
import ReactFullpage from "@fullpage/react-fullpage";
import dayjs from "dayjs";
import { useRef } from "react";
import { useWindowSize } from "react-use";

export default function Home() {
  const { width } = useWindowSize();
  const leaveRef = useRef(0);

  return (
    <div className="w-full min-h-screen relative overflow-hidden antialiased">
      {width >= 768 ? (
        <ReactFullpage
          // debug
          // scrollingSpeed={700}
          touchSensitivity={20}
          fitToSection={true}
          licenseKey="xxxxxxxxxxxxxxxxxxxxxxxxx"
          normalScrollElements=".wallet-popover-panel"
          render={() => (
            <ReactFullpage.Wrapper>
              <div id="section1" className="section">
                <First />
              </div>
              <div className="w-full h-0.25 line-ray" />
              <div id="section2" className="section">
                <Second />
              </div>
              <div className="w-full h-0.25 line-ray" />
              <div id="section3" className="section">
                <Third />
              </div>
              <div id="section4" className="section">
                <Fourth />
              </div>
              <div id="section5" className="section">
                <Fifth />
              </div>
            </ReactFullpage.Wrapper>
          )}
          credits={{
            enabled: undefined,
            label: undefined,
            position: undefined,
          }}
          beforeLeave={(origin, destination, direction, trigger) => {
            console.log(
              dayjs().format("mm:ss SSS"),
              "beforeLeave",
              origin.item.id,
              "->",
              destination.item.id,
              direction,
              trigger,
              "interval:",
              Date.now() - leaveRef.current,
            );
            if (leaveRef.current && Date.now() - leaveRef.current < 1_000) {
              return false;
            }
            leaveRef.current = Date.now();
          }}
          onLeave={(origin, destination, direction, trigger) => {
            console.log(
              dayjs().format("mm:ss SSS"),
              "onLeave",
              origin.item.id,
              "->",
              destination.item.id,
              direction,
              trigger,
            );
          }}
          afterLoad={(origin, destination, direction, trigger) => {
            console.log(
              dayjs().format("mm:ss SSS"),
              "afterLoad",
              origin.item.id,
              "->",
              destination.item.id,
              direction,
              trigger,
            );
          }}
          afterRender={() => {
            window.scrollTo(0, 0);
          }}
        />
      ) : (
        <>
          <First />
          <div className="w-full h-0.25 line-ray" />
          <Second />
          <div className="w-full h-0.25 line-ray" />
          <Third />
          <Fourth />
          <Fifth />
        </>
      )}
    </div>
  );
}
