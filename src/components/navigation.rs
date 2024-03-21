use yew::{classes, function_component, html, AttrValue, Component, Context, Html, Properties};

use crate::components::InlineAnchor;

pub struct Navigation;

#[derive(Properties, PartialEq, Clone)]
struct NavigationLink {
    aria_label: AttrValue,
    display_text: AttrValue,
    href: AttrValue,
    #[prop_or_default]
    is_external: bool,
    // TODO: remove this, read index in vec instead.
    is_last: bool,
}

impl Component for Navigation {
    type Properties = ();
    type Message = ();

    fn create(_ctx: &Context<Self>) -> Self {
        Self
    }

    fn view(&self, _ctx: &Context<Self>) -> Html {
        let links = vec![
            NavigationLink {
                aria_label: "Visit Home Page".into(),
                display_text: "Home".into(),
                href: "/".into(),
                is_external: false,
                is_last: false,
            },
            NavigationLink {
                aria_label: "Visit Web Projects Page".into(),
                display_text: "Web".into(),
                href: "/web-projects".into(),
                is_external: false,
                is_last: false,
            },
            NavigationLink {
                aria_label: "Visit Contact Page".into(),
                display_text: "Contact".into(),
                href: "/contact".into(),
                is_external: false,
                is_last: false,
            },
            NavigationLink {
                aria_label: "Listen to Tyler's music on Bandcamp".into(),
                display_text: "Music".into(),
                href: "https://cuckooandthebirds.bandcamp.com".into(),
                is_external: true,
                is_last: true,
            },
        ];
        html! {
            <div class="w-full h-fit mb-4">
                <nav
                    class={"fixed dark:bg-soft-black bg-white flex flex-col sm:flex-row items-center justify-evenly sm:justify-center w-full top-0 font-default font-mono dark:text-white text-black border border-b border-t-0 border-l-0 border-r-0 mb-4 sm:h-16 h-48"}
                >
                    <ul class="flex flex-col h-auto sm:h-16 items-center justify-center sm:flex-row w-40 sm:w-full">
                        {
                            links.into_iter().enumerate().map(|(index, link)| {
                                html! {
                                    <NavigationLinkListItem
                                        key={index}
                                        is_last={link.is_last}
                                        aria_label={link.aria_label}
                                        is_external={link.is_external}
                                        href={link.href}
                                        display_text={link.display_text}
                                    />
                                }
                            }).collect::<Html>()
                        }
                    </ul>
                </nav>
                <div
                    class={"w-screen top-0 bg-none sm:h-16 h-48"}
                >
                </div>
            </div>
        }
    }
}

#[function_component(NavigationLinkListItem)]
fn navigation_link_list_item(link: &NavigationLink) -> Html {
    let border = if link.is_last {
        "border-none"
    } else {
        "border border-gray-400 dark:border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 sm:border-none"
    };
    html! {
        <li
            class={classes!("flex justify-center sm:inline-block mx-auto py-2 sm:py-0 w-full sm:mx-0 sm:w-auto sm:h-fit".to_string(), border)}
        >
            <InlineAnchor
                classes={"m-0 px-4"}
                aria_label={link.aria_label.clone()}
                href={link.href.clone()}
                is_external={link.is_external}
            >
                {link.display_text.clone()}
            </InlineAnchor>
        </li>
    }
}
