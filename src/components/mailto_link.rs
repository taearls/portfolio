use crate::components::InlineAnchor;
use yew::{function_component, html, AttrValue, Html, Properties};

#[derive(Properties, PartialEq, Eq)]
pub struct MailtoLinkProps {
    #[prop_or("tyler.a.earls@gmail.com".into())]
    contact_email: AttrValue,
    #[prop_or_default]
    is_external: bool,
}

#[function_component(MailtoLink)]
pub fn mailto_link(props: &MailtoLinkProps) -> Html {
    let MailtoLinkProps {
        contact_email,
        is_external,
    } = props;
    html! {
        <InlineAnchor href={format!("mailto:{contact_email}")} aria_label="Send Tyler Earls an email" is_external={*is_external}>
            {contact_email.clone()}
        </InlineAnchor>
    }
}
