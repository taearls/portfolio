// Metadata configuration following Open Graph protocol: https://ogp.me/
// Uses React 19's built-in meta tag hoisting: https://react.dev/reference/react-dom/components/meta

const SITE_TITLE = "Tyler Earls | Software Engineer";
const SITE_DESCRIPTION =
  "Tyler Earls is a software engineer based in Chicago, IL who works in React, TypeScript, Rust, Java, CSharp, HTML, and CSS.";
const SITE_IMAGE =
  "https://res.cloudinary.com/taearls/image/upload/c_scale,w_450/v1605418591/teal-tyler-in-space.jpg";
const SITE_URL = "https://www.tylerearls.com";

export default function Meta() {
  return (
    <>
      {/* Page title - React 19 hoists this to <head> */}
      <title>{SITE_TITLE}</title>

      {/* Standard meta tags */}
      <meta name="author" content="Tyler Earls, tyler.a.earls@gmail.com" />
      <meta name="description" content={SITE_DESCRIPTION} />
      <meta
        name="keywords"
        content="HTML, CSS, JavaScript, Java, Rust, React, Vue, Node.js, Software Engineer, Web Development, SASS, SCSS, Less, Responsive Design, Software Engineer, Frontend, Fullstack"
      />

      {/* Open Graph meta tags (use property, not name) */}
      <meta property="og:title" content={SITE_TITLE} />
      <meta property="og:description" content={SITE_DESCRIPTION} />
      <meta property="og:image" content={SITE_IMAGE} />
      <meta property="og:image:url" content={SITE_IMAGE} />
      <meta property="og:image:alt" content="Teal Tyler in Space" />
      <meta property="og:image:width" content="450" />
      <meta property="og:image:height" content="341" />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_TITLE} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={SITE_TITLE} />
      <meta name="twitter:description" content={SITE_DESCRIPTION} />
      <meta name="twitter:image" content={SITE_IMAGE} />
    </>
  );
}
