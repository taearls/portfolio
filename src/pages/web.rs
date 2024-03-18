use yew::{function_component, html, Html};

use crate::components::{
    HeadingOne, InlineAnchor, Page, Paragraph, WebProject, WebProjectAnalytics, WebProjectProps,
};

#[function_component(Web)]
pub fn web() -> Html {
    // TODO: find a cleaner way to initialize this data
    // https://getpantry.cloud/apiv1/pantry/taearls
    let web_projects: Vec<WebProjectProps> = vec![
            WebProjectProps {
                alt: "Image of Cuckoo and the Birds Website".into(),
                analytics: Some(WebProjectAnalytics {
                  campaign: "portfolio".into(),
                  medium: "web".into(),
                  source: "portfolio".into(),
                }),
                cloudinary_id: "screenshots/v2/cuckoo-mobile".into(),
                // cloudinarySrc: "https://res.cloudinary.com/taearls/image/upload/q_auto/v1/screenshots/v2/cuckoo-mobile.png",
                cursor_style: "pointer".into(),
                descriptions: vec![
                  "A website I made for my band, Cuckoo and the Birds, where you can find all our info, social media links, and press.".into(),
                  "If you're interested to listen, please consider supporting our music by streaming our EP, Twin Stars, on Spotify.".into(),
                  "Built mobile-first with Nuxt, Tailwind, and a (mostly) healthy dose of rock 'n' roll 🤘".into(),
                ],
                emoji: Some("🎵".into()),
                href: "https://www.cuckooandthebirds.com".into(),
                name: "Cuckoo and the Birds Website".into(),
                tagline: "Give our music a listen!".into(),
                image_extension: "png".into(),
                is_last: false,
              },
              WebProjectProps {
                alt: "Image of Road Ranger Banner".into(),
                analytics: None,
                cloudinary_id: "screenshots/v2/roadranger-desktop".into(),
                // cloudinarySrc:
                //   "https://res.cloudinary.com/taearls/image/upload/q_auto/v1/screenshots/v2/roadranger-desktop.png",
                descriptions: vec![
                  "A navigation header that I built while freelancing for Trekk.".into(),
                  "Both the mobile and desktop versions are based on designs their web designers prepared for the client and had me implement. Built with SCSS, JavaScript, and PHP.".into(),
                ],
                cursor_style: "pointer".into(),
                href: "https://www.roadrangerusa.com".into(),
                emoji: Some("⛽".into()),
                name: "Road Ranger".into(),
                tagline: "Check it out!".into(),
                image_extension: "jpg".into(),
                is_last: false,
              },
              WebProjectProps {
                alt: "Image of Space Clones Title Screen".into(),
                analytics: None,
                cloudinary_id: "screenshots/v2/space-clones-game".into(),
                // cloudinarySrc:
                //   "https://res.cloudinary.com/taearls/image/upload/q_auto/v1/screenshots/v2/space-clones-game.png",
                cursor_style: "url(images/space-clones-cursor.png), pointer".into(),
                descriptions: vec![
                  "An original space shooting video game inspired by Space Invaders, the 1978 arcade classic. Defeat the clone army and then their mothership to advance to the next level.".into(),
                  "If you get a high enough score, you can earn extra lives. Play solo, or take turns with a friend. The galaxy is yours to save from the invading clone army! Created using HTML5, CSS3, JavaScript, and jQuery.".into(),
                ],
                emoji: Some("😉".into()),
                href: "https://space-clones.netlify.com".into(),
                name: "Space Clones".into(),
                tagline: "Beat my high score!".into(),
                image_extension: "png".into(),
                is_last: true,
              },
        ];
    html! {
        <Page>
            <HeadingOne>
                {"Web Projects"}
            </HeadingOne>
            <Paragraph>
                {"The following are samples of some of the projects I've maintained independently. Please note that the majority of the work I've done has been under the employment of private companies whose source code is not open sourced. That being the case, only a small fraction of my engineering output is possible to showcase."}
            </Paragraph>
            <Paragraph>
                {"In addition to this website, which has been rebuilt with Rust and Yew,
                    my open sourced work includes the personal and freelance projects listed below. If you're interested to see more, feel free to stalk me on my "}
                <InlineAnchor href="https://github.com/taearls" aria_label="Go to Tyler's Github">
                    {"Github"}
                </InlineAnchor>
                {"."}
            </Paragraph>

            {
                web_projects.into_iter().enumerate().map(|(index, web_project)| {
                    html! {
                        <WebProject
                            key={index}
                            analytics={web_project.analytics}
                            cloudinary_id={web_project.cloudinary_id}
                            alt={web_project.alt}
                            cursor_style={web_project.cursor_style}
                            descriptions={web_project.descriptions}
                            emoji={web_project.emoji}
                            href={web_project.href}
                            image_extension={web_project.image_extension}
                            name={web_project.name}
                            tagline={web_project.tagline}
                            is_last={web_project.is_last}
                        />
                    }
                }).collect::<Html>()
            }
        </Page>
    }
}
