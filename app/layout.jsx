import "./globals.css";

export const metadata = {
  title: "Andrii Hrechukh Front-end Developer | Next.js",
  description: "Portfolio of Andrii Hrechukh, a Front-end Developer specializing in building fast, scalable, and responsive web applications with modern tech stack.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
