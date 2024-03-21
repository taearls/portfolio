use yew::{classes, html, AttrValue, Component, Context, Html};

pub struct SocialMediaIcon {
    aria_label: AttrValue,
    href: AttrValue,
    class: AttrValue,
}

pub struct SocialMediaIcons;

impl Component for SocialMediaIcons {
    type Properties = ();
    type Message = ();

    fn create(_ctx: &Context<Self>) -> Self {
        Self
    }

    fn view(&self, _ctx: &Context<Self>) -> Html {
        let icons: Vec<SocialMediaIcon> = vec![
            SocialMediaIcon {
                aria_label: "Go to Tyler's LinkedIn".into(),
                href: "https://www.linkedin.com/in/tylerearls".into(),
                class: "fa-brands fa-linkedin".into(),
            },
            SocialMediaIcon {
                aria_label: "Go to Tyler's Github".into(),
                href: "https://www.github.com/taearls".into(),
                class: "fa-brands fa-github".into(),
            },
            SocialMediaIcon {
                aria_label: "Go to Tyler's Bandcamp".into(),
                href: "https://cuckooandthebirds.bandcamp.com".into(),
                class: "fa-brands fa-bandcamp".into(),
            },
        ];
        html! {
            <div class="flex justify-center">
                {
                    icons.into_iter().enumerate().map(|(index, icon)| {
                        html!{
                            <a
                                key={index}
                                href={icon.href.clone()}
                                aria-label={icon.aria_label.clone()}
                                class="px-2 py-1 rounded-sm focus:outline-none focus:shadow-outline-light dark:focus:shadow-outline-dark"
                                target="_blank"
                            >
                                <span
                                    class="text-purple-700 dark:text-purple-400 rounded-sm hover:text-cyan-400 dark:hover:text-cyan-300"
                                >
                                    <i
                                        class={classes!("fa-2xl", icon.class.clone())}>
                                    </i>
                                </span>
                            </a>
                        }
                    }).collect::<Html>()
                }
            </div>
        }
    }
}
