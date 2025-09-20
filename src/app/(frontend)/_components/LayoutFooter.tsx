"use client";

import Footer from "./Footer";
import { usePathname } from "next/navigation";

export default function LayoutFooter() {
  const pathname = usePathname();
  return "/" === pathname ? <></> : <Footer />;
}
