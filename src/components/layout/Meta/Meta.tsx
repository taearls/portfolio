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
