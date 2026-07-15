import "./globals.css";

export const metadata = {
  title: "Mahyar — Portfolio",
  description: "Photography, videography, and design portfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
