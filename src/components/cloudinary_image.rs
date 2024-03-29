use yew::{function_component, html, AttrValue, Html, Properties};

#[derive(Properties, PartialEq, Eq)]
pub struct CloudinaryImageProps {
    #[prop_or_default]
    pub transformations: Vec<AttrValue>,
    pub alt: AttrValue,
    #[prop_or("jpg".into())]
    pub extension: AttrValue,
    pub public_id: AttrValue,
}

#[function_component(CloudinaryImage)]
pub fn cloudinary_image(props: &CloudinaryImageProps) -> Html {
    let public_id = props.public_id.clone();
    let extension = props.extension.clone();
    let transformations: String = props.transformations.join(",");
    let src = if transformations.is_empty() {
        format!("https://res.cloudinary.com/taearls/image/upload/{public_id}.{extension}")
    } else {
        format!("https://res.cloudinary.com/taearls/image/upload/{transformations}/v1/{public_id}.{extension}")
    };

    html! {
        <img
            {src}
            alt={props.alt.clone()}
        />
    }
}
