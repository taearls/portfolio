use yew::{classes, function_component, html, AttrValue, Children, Classes, Html, Properties};

#[derive(Properties, PartialEq)]
pub struct PageProps {
    #[prop_or_default]
    pub children: Children,
    #[prop_or_default]
    pub class: Classes,
    #[prop_or_default]
    pub style: AttrValue,
}

#[function_component(Page)]
pub fn page(props: &PageProps) -> Html {
    let PageProps {
        children,
        class,
        style,
    } = props;

    html! {
        <div class={classes!("px-4 mx-auto w-4/5 max-w-4xl leading-8".to_string(), class.clone())} style={style.clone()}>
            { for children.iter() }
        </div>
    }
}
