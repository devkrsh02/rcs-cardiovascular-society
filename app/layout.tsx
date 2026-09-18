import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RCS | RSU Cardiovascular Society",
  description:
    "RSU Cardiovascular Society: activities, Tuesday cardiology news, board information and semester member resources.",
  icons: {
    icon: "/rcs-logo.jpeg",
    shortcut: "/rcs-logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
