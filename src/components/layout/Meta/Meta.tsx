// metadata list here: https://ogp.me/
const metadata = {
  author: "Tyler Earls, tyler.a.earls@gmail.com",
  description:
    "Tyler Earls is a software engineer based in Chicago, IL who works in React, TypeScript, Rust, Java, CSharp, HTML, and CSS.",
  image:
    "https://res.cloudinary.com/taearls/image/upload/c_scale,w_450/v1605418591/teal-tyler-in-space.jpg",
  keywords:
    "HTML, CSS, JavaScript, Java, Rust, React, Vue, Node.js, Software Engineer, Web Development, SASS, SCSS, Less, Responsive Design, Software Engineer, Frontend, Fullstack",
  "og:description":
    "Tyler Earls is a software engineer based in Chicago, IL who works in React, TypeScript, Rust, Java, CSharp, HTML, and CSS.",
  "og:email": "tyler.a.earls@gmail.com",
  "og:image":
    "https://res.cloudinary.com/taearls/image/upload/c_scale,w_450/v1605418591/teal-tyler-in-space.jpg",
  "og:image:alt": "Teal Tyler in Space",
  "og:image:height": "341",
  "og:image:url":
    "https://res.cloudinary.com/taearls/image/upload/c_scale,w_450/v1605418591/teal-tyler-in-space.jpg",
  "og:image:width": "450",
  "og:locale": "en_US",
  "og:site_name": "Tyler Earls | Software Engineer",
  "og:title": "Tyler Earls | Software Engineer",
  "og:type": "website",
  "og:url": "https://www.tylerearls.com",
  title: "Tyler Earls | Software Engineer",
  viewport: "width=device-width, initial-scale=1.0",
};

// TODO: figure out why this component isn't working, remove values from index.html
export default function Meta() {
  // console.log({
  //   metaTags: Object.entries(metadata),
  // });

  return (
    <>
      {Object.entries(metadata).map(([key, value]) => (
        <meta key={key} name={key} content={value} />
      ))}
    </>
  );
}
