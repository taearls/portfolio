// import type { Metadata } from "next";
// import "@/styles/globals.css";
// import { Header, Footer, PageContainer, Body } from "@/components/layout";

// export const metadata: Metadata = {
//   openGraph: {
//     title: "Tyler Earls | Software Engineer",
//     description:
//       "Tyler Earls is a software engineer based in Chicago, IL who works in React, Vue, TypeScript, Java, CSharp, Rust, HTML, and CSS.",
//     type: "website",
//     url: "https://www.tylerearls.com",
//     images: {
//       url: "https://res.cloudinary.com/taearls/image/upload/c_scale,w_450/v1605418591/teal-tyler-in-space.jpg",
//       alt: "Teal Tyler in Space",
//     },
//   },
//   authors: {
//     name: "Tyler Earls",
//   },
//   title: "Tyler Earls | Software Engineer",
//   description:
//     "Tyler Earls is a software engineer based in Chicago, IL who works in React, Vue, TypeScript, Java, CSharp, Rust, HTML, and CSS.",
//   keywords:
//     "HTML, CSS, JavaScript, Java, Rust, React, Vue, Node.js, Software Engineer, Web Development, SASS, SCSS, Less, Responsive Design, Software Engineer, Frontend, Fullstack",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <Body>
//         <Header />
//         <PageContainer>{children}</PageContainer>
//         <Footer />
//       </Body>
//     </html>
//   );
// }

// metadata list here: https://ogp.me/
const metadata = {
  author: "Tyler Earls, tyler.a.earls@gmail.com",
  description: "Cuckoo and the Birds is a rock band based in Chicago, IL.",
  image:
    "https://res.cloudinary.com/cuckooandthebirds/image/upload/c_scale,w_450/v1590178958/Twin%20Stars/laser-tyler-og.png",
  keywords:
    "Chicago, Illinois, DIY, Music, Punk, Indie, Rock, Alt Country, Pop, Alternative, Midwest, Guitar, Bass, Drums, Vocals, Live Music, Cuckoo, Birds, Cuckoo and the Birds",
  "og:description":
    "Cuckoo and the Birds is a rock band based in Chicago, IL who write sad and angry songs that flirt with harmonies.",
  "og:email": "cuckooandthebirds@gmail.com",
  "og:image":
    "https://res.cloudinary.com/cuckooandthebirds/image/upload/c_scale,w_450/v1590178958/Twin%20Stars/laser-tyler-og.png",
  "og:image:alt": "Laser Tyler",
  "og:image:height": "341",
  "og:image:url":
    "https://res.cloudinary.com/cuckooandthebirds/image/upload/c_scale,w_450/v1590178958/Twin%20Stars/laser-tyler-og.png",
  "og:image:width": "450",
  "og:locale": "en_US",
  "og:site_name": "Cuckoo and the Birds",
  "og:title": "Cuckoo and the Birds | Chicago, IL",
  "og:type": "website",
  "og:url": "https://www.cuckooandthebirds.com",
  title: "Cuckoo and the Birds | Chicago, IL",
  viewport: "width=device-width, initial-scale=1.0",
};

export default function Meta() {
  return (
    <>
      {Object.entries(metadata).map(([key, value]) => (
        <meta key={key} name={key} content={value} />
      ))}
    </>
  );
}
