"use client";

import { usePathname } from "next/navigation";

export default function NavbarPlaceholder() {
  const pathname = usePathname();
  return ["/", "/roadmap"].includes(pathname) ? (
    <></>
  ) : (
    <div className="navbar-placeholder w-full h-12 md:h-13 lg:h-14 xl:h-15 2xl:h-18 3xl:h-20 4xl:h-22" />
  );
}
