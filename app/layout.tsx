import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoticeShift — Know what changed",
  description: "Track the changes that matter across prices, opportunities, announcements and business information.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}