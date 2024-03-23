import type { Metadata } from "next";
import "styles/global.css";
import { Header, Footer, PageContainer, Body } from "@/components/layout";

export const metadata: Metadata = {
  openGraph: {
    title: "Tyler Earls | Software Engineer",
    description:
      "Tyler Earls is a software engineer based in Chicago, IL who works in React, Vue, TypeScript, Java, CSharp, Rust, HTML, and CSS.",
    type: "website",
    url: "https://www.tylerearls.com",
    images: {
      url: "https://res.cloudinary.com/taearls/image/upload/c_scale,w_450/v1605418591/teal-tyler-in-space.jpg",
      alt: "Teal Tyler in Space",
    },
  },
  authors: {
    name: "Tyler Earls",
  },
  title: "Tyler Earls | Software Engineer",
  description:
    "Tyler Earls is a software engineer based in Chicago, IL who works in React, Vue, TypeScript, Java, CSharp, Rust, HTML, and CSS.",
  keywords:
    "HTML, CSS, JavaScript, Java, Rust, React, Vue, Node.js, Software Engineer, Web Development, SASS, SCSS, Less, Responsive Design, Software Engineer, Frontend, Fullstack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Body>
        <Header />
        <PageContainer>{children}</PageContainer>
        <Footer />
      </Body>
    </html>
  );
}
