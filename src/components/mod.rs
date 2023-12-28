pub mod layout;
pub use layout::{headings::*, Footer, Header, Page, Paragraph};

mod navigation;
use navigation::Navigation;

mod social_media_icons;

mod body;
pub use body::Body;

mod input_toggle;
#[allow(unused_imports)]
pub use input_toggle::InputToggle;

pub mod util;
pub use util::InlineAnchor;

pub mod web_project;
pub use web_project::{WebProject, WebProjectAnalytics, WebProjectProps};

mod cloudinary_image;
pub use cloudinary_image::CloudinaryImage;

mod error_message;
#[allow(unused_imports)]
pub use error_message::ErrorMessage;

mod success_message;
#[allow(unused_imports)]
pub use success_message::SuccessMessage;

mod mailto_link;
pub use mailto_link::MailtoLink;

#[cfg(any(feature = "email-service", feature = "contact-form-mailto-link"))]
mod contact_form;
#[cfg(any(feature = "email-service", feature = "contact-form-mailto-link"))]
pub use contact_form::ContactForm;
