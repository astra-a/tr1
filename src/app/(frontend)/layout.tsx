import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import type { Metadata } from "next";
import localFont from "next/font/local";
import CustomWagmiProvider from "@/providers/CustomWagmiProvider";
import Navbar from "./_components/Navbar";
import NavbarPlaceholder from "./_components/NavbarPlaceholder";
import LayoutFooter from "./_components/LayoutFooter";
import TransactionsPadding from "./_components/TransactionsPadding";
import FixedStarVideoBackground from "./_components/FixedStarVideoBackground";
import { APP_BASEURL, APP_DESCRIPTION, APP_TITLE } from "@/constants";

import "./globals.scss";
import "@rainbow-me/rainbowkit/styles.css";

export const metadata: Metadata = {
  title: APP_TITLE,
  description: APP_DESCRIPTION,
  // generator: 'v0.dev',
  icons: "/images/logo-full.png",
  openGraph: {
    type: "website",
    url: APP_BASEURL,
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    images: [
      {
        url: `${APP_BASEURL}/images/logo-full.png`,
      },
    ],
  },
};

const sarpanch = localFont({
  src: [
    {
      path: "../../../public/fonts/Sarpanch/Sarpanch-Regular.ttf",
      weight: "400",
    },
    {
      path: "../../../public/fonts/Sarpanch/Sarpanch-Medium.ttf",
      weight: "500",
    },
    {
      path: "../../../public/fonts/Sarpanch/Sarpanch-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "../../../public/fonts/Sarpanch/Sarpanch-Bold.ttf",
      weight: "700",
    },
    {
      path: "../../../public/fonts/Sarpanch/Sarpanch-ExtraBold.ttf",
      weight: "800",
    },
    {
      path: "../../../public/fonts/Sarpanch/Sarpanch-Black.ttf",
      weight: "900",
    },
  ],
  variable: "--font-sarpanch",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body className={`${sarpanch.variable} font-sarpanch`}>
        <CustomWagmiProvider>
          <div className="flex flex-col min-h-screen">
            <FixedStarVideoBackground wrapperClass="fixed inset-0" />

            <Navbar />
            <NavbarPlaceholder />
            <div className="w-full flex-auto overflow-hidden">{children}</div>
            <LayoutFooter />
            <TransactionsPadding />
            <ToastContainer theme="dark" />
          </div>
        </CustomWagmiProvider>
      </body>
    </html>
  );
}
