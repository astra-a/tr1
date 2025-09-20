"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CloseButton,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import WalletButton from "./WalletButton";

const ROUTES = [
  { name: "Home", url: "/" },
  // { name: "LaunchPad", url: "/launchpad" },
  // { name: "News", url: "/news" },
  { name: "Roadmap", url: "/roadmap" },
  { name: "White Paper", url: "" },
  // { name: "Map", url: "/map" },
  { name: "My Page", url: "/my-page" },
];

function WindowNavChild({ route }: { route: { name: string; url: string } }) {
  const pathname = usePathname();
  const isActive = useMemo(() => {
    if (pathname === route.url) {
      return true;
    } else if ("/news" === route.url) {
      return pathname.startsWith(route.url);
    } else if ("/launchpad" === route.url) {
      return pathname.startsWith(route.url);
    } else {
      return false;
    }
  }, [pathname, route.url]);

  // if ("LaunchPad" === route.name) {
  //   return (
  //     <BeforeLaunchpad
  //       triggerButtonText={route.name}
  //       buttonIsActive={isActive}
  //     />
  //   );
  // }

  if (route.url) {
    return (
      <a
        href={route.url}
        className={`text-base 3xl:text-lg 4xl:text-2xl ${isActive ? "text-white" : "text-white/60"} hover:text-white hover:underline transition`}
      >
        {route.name}
      </a>
    );
  } else {
    return (
      <div className="text-base 3xl:text-lg 4xl:text-2xl text-white/60">
        {route.name}
      </div>
    );
  }
}

function WindowNav() {
  return (
    <div className="hidden md:flex items-center justify-between w-full h-full relative">
      <div className="flex items-center h-full">
        <div className="text-xl tracking-[-0.03em] text-white flex justify-center items-center px-4 xl:px-6 2xl:px-8">
          <Image
            src="/images/logo-full.png"
            alt="AIOS"
            width={192}
            height={73}
            className="w-auto h-8 xl:h-10 2xl:h-12 3xl:h-14"
          />
        </div>
        <div className="h-full w-px bg-dark-slate-gray" />
        <div className="flex items-center gap-4 lg:gap-10 px-8 lg:px-20 4xl:px-36">
          {ROUTES.map((item, i) => (
            <WindowNavChild key={i} route={item} />
          ))}
        </div>
      </div>
      <div className="flex h-full">
        <WalletButton />
      </div>
    </div>
  );
}

function MobileNav() {
  const [activeRoute, setActiveRoute] = useState(ROUTES[0]);
  const pathname = usePathname();
  useEffect(() => {
    for (const route of ROUTES) {
      if (pathname === route.url) {
        setActiveRoute(route);
        break;
      } else if ("/news" === route.url && pathname.startsWith(route.url)) {
        setActiveRoute(route);
        break;
      } else {
        setActiveRoute(ROUTES[0]);
      }
    }
  }, [pathname]);

  return (
    <div className="flex md:hidden items-center justify-between w-full h-full relative">
      <div className="flex items-center h-full px-2 border-r border-dark-slate-gray">
        <Image
          src="/images/logo-full.png"
          alt="AIOS"
          width={192}
          height={73}
          className="w-auto h-6"
        />
      </div>
      <Popover>
        <PopoverButton className="block text-base text-white focus:outline-none data-active:text-white data-focus:outline data-focus:outline-white data-hover:text-white">
          {activeRoute.name}
        </PopoverButton>
        <PopoverPanel
          transition
          anchor="bottom"
          className="divide-y divide-white/5 w-50 px-5 pt-2 pb-4 border border-white/20 rounded-lg backdrop-blur-2xl transition duration-200 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0 z-40"
        >
          <div className="flex flex-col justify-center gap-3">
            {ROUTES.map((item, i) => (
              <CloseButton
                key={i}
                as="a"
                href={item.url}
                className={`text-base ${item.name === activeRoute.name ? "text-white" : "text-white/60"} hover:text-white`}
                onClick={() => setActiveRoute(item)}
              >
                {item.name}
              </CloseButton>
            ))}
          </div>
        </PopoverPanel>
      </Popover>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          className="btn-mint-green connect-wallet h-full flex justify-center items-center gap-2 px-1.5 py-3 border border-white/10 text-sm text-[#051117] cursor-pointer"
        >
          Connect
        </button>
      </div>
    </div>
  );
}

export default function Navbar() {
  return (
    <>
      <div className="navbar fixed top-0 w-full h-12 md:h-13 lg:h-14 xl:h-15 2xl:h-18 3xl:h-19.5 4xl:h-32 z-40 flex justify-center bg-jet-black border-b border-dark-slate-gray">
        <div className="navbar-container flex items-center justify-between w-full h-full">
          <MobileNav />
          <WindowNav />
        </div>
      </div>
      {/*<div className="navbar-placeholder w-full h-12 md:h-13 lg:h-14 xl:h-15 2xl:h-18 3xl:h-19.5 4xl:h-32" />*/}
    </>
  );
}
