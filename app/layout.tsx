import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "./components/app-shell";

export const metadata: Metadata = {
  title: { default: "NoticeShift — Know what changed", template: "%s · NoticeShift" },
  description: "Track the changes that matter across prices, opportunities, announcements and business information.",
  applicationName: "NoticeShift",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg" },
  themeColor: "#f7f7f2",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AppShell>{children}</AppShell></body></html>;
}
