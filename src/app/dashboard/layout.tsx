import { headers } from "next/headers";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Providers from "./providers";
import CustomWagmiProvider from "@/providers/CustomWagmiProvider";
import { Toaster } from "sonner";
import {
  DASHBOARD_APP_BASEURL,
  DASHBOARD_APP_DESCRIPTION,
  DASHBOARD_APP_TITLE,
} from "@/constants";

import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

export const metadata: Metadata = {
  title: DASHBOARD_APP_TITLE,
  description: DASHBOARD_APP_DESCRIPTION,
  icons: "/images/logo-full.png",
  openGraph: {
    type: "website",
    url: DASHBOARD_APP_BASEURL,
    title: DASHBOARD_APP_TITLE,
    description: DASHBOARD_APP_DESCRIPTION,
    images: [
      {
        url: `${DASHBOARD_APP_BASEURL}/images/logo-full.png`,
      },
    ],
  },
};

const interDisplay = localFont({
  src: [
    {
      path: "../../../public/fonts/InterDisplay/InterDisplay-Light.woff2",
      weight: "300",
    },
    {
      path: "../../../public/fonts/InterDisplay/InterDisplay-Regular.woff2",
      weight: "400",
    },
    {
      path: "../../../public/fonts/InterDisplay/InterDisplay-Medium.woff2",
      weight: "500",
    },
    {
      path: "../../../public/fonts/InterDisplay/InterDisplay-SemiBold.woff2",
      weight: "600",
    },
    {
      path: "../../../public/fonts/InterDisplay/InterDisplay-Bold.woff2",
      weight: "700",
    },
  ],
  variable: "--font-inter-display",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body
        className={`${interDisplay.variable} bg-b-surface1 font-inter text-body-1 text-t-primary antialiased`}
      >
        <Providers>
          <CustomWagmiProvider>{children}</CustomWagmiProvider>
        </Providers>
        <Toaster richColors expand />
      </body>
    </html>
  );
}

export async function generateViewport(): Promise<Viewport> {
  const userAgent = (await headers()).get("user-agent");
  const isiPhone = /iphone/i.test(userAgent ?? "");
  return isiPhone
    ? {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1, // disables auto-zoom on ios safari
      }
    : {};
}
