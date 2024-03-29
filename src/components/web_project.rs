use yew::{function_component, html, AttrValue, Html, Properties};

use crate::components::{CloudinaryImage, HeadingTwo, Paragraph};

#[derive(PartialEq, Eq)]
pub struct WebProjectAnalytics {
    pub campaign: AttrValue,
    pub medium: AttrValue,
    pub source: AttrValue,
}

#[derive(Properties, PartialEq, Eq)]
pub struct WebProjectProps {
    #[prop_or_default]
    pub analytics: Option<WebProjectAnalytics>,
    pub cloudinary_id: AttrValue,
    pub image_extension: AttrValue,
    pub alt: AttrValue,
    #[prop_or("pointer".into())]
    pub cursor_style: AttrValue,
    #[prop_or_default]
    pub descriptions: Vec<String>,
    #[prop_or_default]
    pub emoji: Option<String>,
    pub href: AttrValue,
    pub name: AttrValue,
    pub tagline: AttrValue,
    #[prop_or_default]
    pub is_last: bool,
}

#[function_component(WebProject)]
pub fn web_project(props: &WebProjectProps) -> Html {
    let WebProjectProps {
        analytics,
        cloudinary_id,
        image_extension,
        alt,
        cursor_style,
        emoji,
        href,
        name,
        tagline,
        descriptions,
        is_last,
    } = props;
    html! {
        <div class="mx-auto mt-12">
            <HeadingTwo>
                { name.clone() }
            </HeadingTwo>
            <div class="flow-root mb-8">
                <div class="mx-auto text-center w-11/12 mb-2 sm:mb-0 sm:w-1/2 sm:float-left sm:clearfix sm:mr-4">
                    <div class="flex justify-center">
                        <a
                            class="block rounded-sm focus:outline-none focus:shadow-outline-light dark:focus:shadow-outline-dark"
                            target="_blank"
                            href={link_with_analytics(href, analytics)}
                            rel={if analytics.is_none() { "noopener" } else { "noreferrer" }}
                            style={format!("cursor: {cursor_style}")}
                        >
                            <CloudinaryImage
                                alt={alt.clone()}
                                public_id={cloudinary_id.clone()}
                                extension={image_extension.clone()}
                                transformations={vec!["q_auto".into(), "w_400".into()]}
                            />
                        </a>
                    </div>
                    <a
                        class="block cursor-pointer font-semibold rounded-sm mt-1 text-purple-700 dark:text-purple-400 focus:outline-none focus:shadow-outline-light dark:focus:shadow-outline-dark"
                        target="_blank"
                        rel="noreferrer"
                        href={href.clone()}
                    >
                        <span class="text-purple-700 md:text-lg dark:text-purple-400">
                            { tagline.clone() }
                        </span>
                        if let Some(emoji) = emoji {
                            <span>
                                { format!(" {emoji}") }
                            </span>
                        }
                    </a>
                </div>
                <div>
                    {
                        descriptions.clone().into_iter().enumerate()
                            .map(|(index, description)| {
                                html! {
                                    <Paragraph key={index} class="mt-0">
                                        {description}
                                    </Paragraph>
                                }
                            }).collect::<Html>()
                    }
                </div>
            </div>
            if !is_last {
                <hr class="line-break" />
            }
        </div>
    }
}

fn link_with_analytics(href: &str, analytics: &Option<WebProjectAnalytics>) -> String {
    if let Some(analytics) = analytics {
        let WebProjectAnalytics {
            campaign,
            medium,
            source,
        } = analytics;
        // TODO: use a Url type here instead of appending to a string
        format!("{href}?utm_campaign={campaign}&utm_medium={medium}&source={source}")
    } else {
        href.to_string()
    }
}
