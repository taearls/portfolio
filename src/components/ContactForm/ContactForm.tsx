// // use lazy_static::lazy_static;
// // use regex::Regex;
// // use serde::{Deserialize, Serialize};
// // use std::fmt;
// // use std::fmt::{Display, Formatter};
// // use web_sys::{HtmlInputElement, HtmlTextAreaElement};
// // use yew::{html, AttrValue, Component, Context, FocusEvent, Html, TargetCast};

// import { EMAIL_REGEX } from "@/util/constants";

// // use crate::components::{ErrorMessage, HeadingOne, Page, Paragraph, SuccessMessage};

// // pub struct ContactForm {
// //     form_data: ContactFormData,
// //     errors: Vec<ContactFormError>,
// // }

// // #[derive(Serialize, Deserialize, Debug)]
// // pub struct ContactFormData {
// //     name: AttrValue,
// //     email: AttrValue,
// //     message: AttrValue,
// //     to: AttrValue,
// // }

// // impl Default for ContactFormData {
// //     fn default() -> Self {
// //         Self {
// //             name: String::default(),
// //             email: String::default(),
// //             message: String::default(),
// //             to: PORTFOLIO_EMAIL.to_string(),
// //         }
// //     }
// // }

// // impl Clone for ContactFormData {
// //     fn clone(&self) -> Self {
// //         Self {
// //             name: self.name.clone(),
// //             email: self.email.clone(),
// //             message: self.message.clone(),
// //             to: self.to.clone(),
// //         }
// //     }
// // }

// // #[derive(Serialize, Deserialize, PartialEq, Debug)]
// // pub enum RequiredField {
// //     Name,
// //     Email,
// //     Message,
// // }

// // #[derive(Serialize, Deserialize, PartialEq, Debug)]
// // pub enum ContactFormError {
// //     RequiredField(RequiredField),
// //     InvalidEmail,
// //     TargetCastError,
// // }

// // impl Display for ContactFormError {
// //     fn fmt(&self, f: &mut Formatter) -> fmt::Result {
// //         let message = match self {
// //             ContactFormError::InvalidEmail => "invalid email",
// //             ContactFormError::TargetCastError => "target cast error",
// //             ContactFormError::RequiredField(required_field_variant) => match required_field_variant
// //             {
// //                 RequiredField::Name => "name is required",
// //                 RequiredField::Email => "email is required",
// //                 RequiredField::Message => "message is required",
// //             },
// //         };
// //         write!(f, "{message}")
// //     }
// // }

// // pub enum ContactMsg {
// //     FormSubmitted,
// //     NameChanged(String),
// //     EmailChanged(String),
// //     MessageChanged(String),
// //     Error(ContactFormError),
// // }

// impl Component for ContactForm {
//     type Properties = ();
//     type Message = ContactMsg;

//     fn create(_ctx: &Context<Self>) -> Self {
//         Self {
//             form_data: ContactFormData::default(),
//             errors: vec![],
//         }
//     }

//     fn update(&mut self, _ctx: &Context<Self>, msg: Self::Message) -> bool {
//         match msg {
//             ContactMsg::FormSubmitted => {
//                 // let ContactFormData {
//                 //     name,
//                 //     email,
//                 //     message,
//                 //     to,
//                 // } = &self.form_data;
//                 // dev: "http://localhost:3000/send";
//                 // prod: "https://tyler-shared-email-service.herokuapp.com/send"
//                 // console_log!("name is: ", name);
//                 // console_log!("email is: ", email);
//                 // console_log!("message is: ", message);
//                 // console_log!("to is: ", to);
//                 // self.errors.iter().for_each(|error| {
//                 //     console_log!("error: ", error.to_string());
//                 // });

//                 send_email(&self.form_data);

//                 // maybe I should clear out form data after it's sent
//                 // self.form_data = ContactFormData::default();
//                 false
//             }
//             ContactMsg::NameChanged(name) => {
//                 self.errors
//                     .retain(|x| x != &ContactFormError::RequiredField(RequiredField::Name));
//                 self.form_data.name = name;
//                 true
//             }
//             ContactMsg::EmailChanged(email) => {
//                 self.errors.retain(|x| {
//                     x != &ContactFormError::InvalidEmail
//                         && x != &ContactFormError::RequiredField(RequiredField::Email)
//                 });
//                 self.form_data.email = email;
//                 true
//             }
//             ContactMsg::MessageChanged(message) => {
//                 self.errors
//                     .retain(|x| x != &ContactFormError::RequiredField(RequiredField::Message));
//                 self.form_data.message = message;
//                 true
//             }
//             ContactMsg::Error(error_variant) => {
//                 let mut cleaning_up_email_errors = false;
//                 if error_variant == ContactFormError::InvalidEmail {
//                     if let Some(error_pos) = self
//                         .errors
//                         .iter()
//                         .position(|x| *x == ContactFormError::RequiredField(RequiredField::Email))
//                     {
//                         self.errors.swap_remove(error_pos);
//                         cleaning_up_email_errors = true;
//                     }
//                 }
//                 if error_variant == ContactFormError::RequiredField(RequiredField::Email) {
//                     if let Some(error_pos) = self
//                         .errors
//                         .iter()
//                         .position(|x| *x == ContactFormError::InvalidEmail)
//                     {
//                         self.errors.swap_remove(error_pos);
//                         cleaning_up_email_errors = true;
//                     }
//                 }
//                 if !self.errors.contains(&error_variant) {
//                     self.errors.push(error_variant);
//                     true
//                 } else {
//                     cleaning_up_email_errors
//                 }
//             }
//         }
//     }

//     fn view(&self, ctx: &Context<Self>) -> Html {
//         let link = ctx.link();
//         let onsubmit = link.callback(|e: FocusEvent| {
//             e.prevent_default();
//             ContactMsg::FormSubmitted
//         });
//         let on_name_change = link.callback(|e: FocusEvent| {
//             let input = e.target_dyn_into::<HtmlInputElement>();

//             if let Some(input) = input {
//                 match validate_required_field(&input.value()) {
//                     Some(name) => ContactMsg::NameChanged(name.to_string()),
//                     None => ContactMsg::Error(ContactFormError::RequiredField(RequiredField::Name)),
//                 }
//             } else {
//                 ContactMsg::Error(ContactFormError::TargetCastError)
//             }
//         });

//         let on_email_change = link.callback(|e: FocusEvent| {
//             let input = e.target_dyn_into::<HtmlInputElement>();

//             if let Some(input) = input {
//                 let value = input.value();
//                 match validate_required_field(&value) {
//                     Some(email) => match validate_email(email) {
//                         Some(email) => ContactMsg::EmailChanged(email.to_string()),
//                         None => ContactMsg::Error(ContactFormError::InvalidEmail),
//                     },
//                     None => {
//                         ContactMsg::Error(ContactFormError::RequiredField(RequiredField::Email))
//                     }
//                 }
//             } else {
//                 ContactMsg::Error(ContactFormError::TargetCastError)
//             }
//         });

//         let on_message_change = link.callback(|e: FocusEvent| {
//             let input = e.target_dyn_into::<HtmlTextAreaElement>();

//             if let Some(input) = input {
//                 match validate_required_field(&input.value()) {
//                     Some(message) => ContactMsg::MessageChanged(message.to_string()),
//                     None => {
//                         ContactMsg::Error(ContactFormError::RequiredField(RequiredField::Message))
//                     }
//                 }
//             } else {
//                 ContactMsg::Error(ContactFormError::TargetCastError)
//             }
//         });

//         html! {
//             <form
//                 id="contact"
//                 className="form-boxshadow mx-auto my-8 bg-gray-200 dark:bg-gray-900 rounded-md w-full max-w-sm"
//                 method="POST"
//                 enctype="text/plain"
//                 {onsubmit}
//             >
//                 <fieldset
//                     className="px-4 py-2"
//                 >
//                     <div>
//                         <label
//                             className="block text-purple-700 dark:text-purple-400 font-bold mb-1 md:mb-0 pr-4"
//                             for="contactName"
//                         >
//                             {"Name"}
//                             <span>{" *"}</span>
//                         </label>
//                         <input
//                             id="contactName"
//                             onblur={on_name_change}
//                             className="form-input w-full mb-2 text-soft-black placeholder-gray-600 focus:bg-white focus:outline-none focus:shadow-outline-light dark:focus:shadow-outline-dark"
//                             type="text"
//                             name="name"
//                         />
//                         <ErrorMessage show={self.errors.contains(&ContactFormError::RequiredField(RequiredField::Name))}>
//                             {"Please enter your name."}
//                         </ErrorMessage>
//                     </div>

//                     <div
//                         className="flex flex-col"
//                     >
//                         <label
//                             className="block text-purple-700 dark:text-purple-400 font-bold mb-1 md:mb-0 pr-4"
//                             for="contactEmail"
//                         >
//                             {"Email"}
//                             <span>{" *"}</span>
//                         </label>
//                         <input
//                             id="contactEmail"
//                             className="form-input w-full text-soft-black placeholder-gray-600 focus:bg-white focus:outline-none focus:shadow-outline-light dark:focus:shadow-outline-dark"
//                             type="email"
//                             name="email"
//                             required={true}
//                             onblur={on_email_change}
//                             placeholder="beammeup@scotty.com"
//                         />
//                         <ErrorMessage show={self.errors.contains(&ContactFormError::RequiredField(RequiredField::Email))}>
//                             {"Please enter your email."}
//                         </ErrorMessage>
//                         <ErrorMessage show={self.errors.contains(&ContactFormError::InvalidEmail)}>
//                             {"Please enter a valid email address."}
//                         </ErrorMessage>
//                     </div>

//                     <div
//                         className="flex flex-col"
//                     >
//                         <label
//                             className="block text-purple-700 dark:text-purple-400 font-bold mb-1 md:mb-0 pr-4"
//                             for="contactMessage"
//                         >
//                             {"Message "}<span>{" *"}</span>
//                         </label>
//                         <textarea
//                             id="contactMessage"
//                             className="form-textarea w-full h-32 text-soft-black placeholder-gray-600 focus:bg-white focus:outline-none focus:shadow-outline-light dark:focus:shadow-outline-dark"
//                             name="message"
//                             required={true}
//                             onblur={on_message_change}
//                         />
//                         <ErrorMessage show={self.errors.contains(&ContactFormError::RequiredField(RequiredField::Message))}>
//                             {"Please enter a message."}
//                         </ErrorMessage>
//                     </div>

//                     <div className="relative">
//                         <SuccessMessage>
//                             {"Thank you. I look forward to working with you!"}
//                         </SuccessMessage>
//                         <SuccessMessage>
//                             {"Success! I'll be in touch shortly."}
//                         </SuccessMessage>
//                         <ErrorMessage>
//                             {"There was an error sending your message. Please try again."}
//                         </ErrorMessage>

//                         <div className="flex items-center">
//                             <input
//                                 type="submit"
//                                 value="Send Email"
//                                 disabled={is_form_disabled(self)}
//                                 // :disabled="saveDisabled"
//                                 className="inline-block my-2 cursor-pointer text-white transition-colors transition-padding ease-in-out duration-200 bg-purple-700 dark:bg-purple-400 rounded-lg pl-2 pr-10 disabled:pr-2 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:shadow-outline-light dark:focus:shadow-outline-dark"
//                             />
//                         </div>
//                     </div>
//                 </fieldset>
//             </form>
//         }
//     }
// }

const isFormDisabled = (): boolean => {
  // TODO: re-implement this fn
  // let ContactForm { form_data, errors } = contact;
  // in order of precedence:
  // 1. UI error messages present
  // 2. email address invalid
  // 3. required fields empty
  // !errors.is_empty()
  //     || validate_email(&form_data.email).is_none()
  //     || required_values_empty(form_data)
  return false;
};

// fn required_values_empty(form_data: &ContactFormData) -> bool {
//     let ContactFormData {
//         name,
//         email,
//         message,
//         ..
//     } = form_data;
//     name.is_empty() || email.is_empty() || message.is_empty()
// }

// fn validate_required_field(value: &str) -> Option<&str> {
//     if value.is_empty() {
//         None
//     } else {
//         Some(value)
//     }
// }

// const validateEmail = (value: string): boolean => {
//   return value !== "" && EMAIL_REGEX.test(value);
// };

// #[cfg(feature = "email-service")]
// fn email_service_base_url() -> String {
//     // dev: "http://localhost:3000/send";
//     // prod: "https://tyler-shared-email-service.herokuapp.com/send"
//     // if is_dev() {
//     String::from("http://localhost:3000")
//     // } else {
//     //     String::from("https://tyler-shared-email-service.herokuapp.com")
//     // }
// }

// #[cfg(feature = "email-service")]
// fn is_dev() -> bool {
//     match std::env::var("DEVELOPMENT") {
//         Ok(value) => {
//             console_log!("value is: ", value.clone());
//             value.trim().to_lowercase() == "true"
//         }
//         Err(err) => {
//             console_error!("error reading env var DEVELOPMENT: ", err.to_string());
//             false
//         }
//     }
// }

// #[cfg(any(feature = "email-service", feature = "contact-form-mailto-link"))]
// fn send_email(form_data: &ContactFormData) {
//     // send email here, handle feature
//     #[cfg(feature = "email-service")]
//     send_with_email_service(form_data);

//     #[cfg(feature = "contact-form-mailto-link")]
//     redirect_with_mailto_link(form_data);
// }

// #[cfg(feature = "email-service")]
// fn send_with_email_service(form_data: &ContactFormData) {
//     use crate::api;

//     let email_body = serde_json::to_string(form_data).unwrap();
//     let email_url = email_service_base_url() + "/send";
//     api::post(email_url, email_body);
// }

// #[cfg(feature = "contact-form-mailto-link")]
// fn redirect_with_mailto_link(form_data: &ContactFormData) {
//     use web_sys::window;

//     let link = mailto_link(form_data);

//     window().unwrap().open_with_url(&link).unwrap();
// }

// #[cfg(feature = "contact-form-mailto-link")]
// fn mailto_link(form_data: &ContactFormData) -> String {
//     let ContactFormData {
//         name,
//         email,
//         message,
//         to,
//     } = form_data;
//     let parsed = reqwest::Url::parse_with_params(
//         &format!("mailto:{to}"),
//         &[
//             ("cc", email),
//             // TODO: figure out how to send decoded body
//             ("body", &format!("{name} sent you a message!\n\n{message}")),
//         ],
//     );
//     parsed.unwrap().to_string()
// }
// TODO: write this fn
const onSubmit = () => ({});

export default function ContactForm() {
  return (
    <form
      id="contact"
      className="form-boxshadow mx-auto my-8 w-full max-w-sm rounded-md bg-gray-200 dark:bg-gray-900"
      method="POST"
      encType="text/plain"
      onSubmit={onSubmit}
    >
      <fieldset className="px-4 py-2">
        <div>
          <label className="mb-1 block pr-4 font-bold" htmlFor="contactName">
            {"Name"}
            <span>{" *"}</span>
          </label>
          <input
            id="contactName"
            // onBlur={on_name_change}
            className="form-input mb-2 w-full text-soft-black placeholder-gray-600 focus:bg-white focus:shadow-outline-light focus:outline-none dark:focus:shadow-outline-dark"
            type="text"
            name="name"
          />
          {/* <ErrorMessage show={self.errors.contains(&ContactFormError::RequiredField(RequiredField::Name))}>
                              {"Please enter your name."}
                          </ErrorMessage> */}
        </div>

        <div className="flex flex-col">
          <label
            className="mb-1 block pr-4 font-bold text-purple-700 md:mb-0 dark:text-purple-400"
            htmlFor="contactEmail"
          >
            {"Email"}
            <span>{" *"}</span>
          </label>
          <input
            id="contactEmail"
            className="form-input w-full text-soft-black placeholder-gray-600 focus:bg-white focus:shadow-outline-light focus:outline-none dark:focus:shadow-outline-dark"
            type="email"
            name="email"
            required
            // onBlur={on_email_change}
            placeholder="beammeup@scotty.com"
          />
          {/* <ErrorMessage show={self.errors.contains(&ContactFormError::RequiredField(RequiredField::Email))}>
                              {"Please enter your email."}
                          </ErrorMessage>
                          <ErrorMessage show={self.errors.contains(&ContactFormError::InvalidEmail)}>
                              {"Please enter a valid email address."}
                          </ErrorMessage> */}
        </div>

        <div className="flex flex-col">
          <label
            className="mb-1 block pr-4 font-bold md:mb-0"
            htmlFor="contactMessage"
          >
            {"Message "}
            <span>{" *"}</span>
          </label>
          <textarea
            id="contactMessage"
            className="form-textarea h-32 w-full text-soft-black placeholder-gray-600 focus:bg-white focus:shadow-outline-light focus:outline-none dark:focus:shadow-outline-dark"
            name="message"
            required
            // onBlur={on_message_change}
          />
          {/* <ErrorMessage show={self.errors.contains(&ContactFormError::RequiredField(RequiredField::Message))}>
                              {"Please enter a message."}
                          </ErrorMessage> */}
        </div>

        <div className="relative">
          {/* <SuccessMessage>
                              {"Thank you. I look forward to working with you!"}
                          </SuccessMessage>
                          <SuccessMessage>
                              {"Success! I'll be in touch shortly."}
                          </SuccessMessage>
                          <ErrorMessage>
                              {"There was an error sending your message. Please try again."}
                          </ErrorMessage> */}

          <div className="flex items-center">
            <input
              type="submit"
              value="Send Email"
              disabled={isFormDisabled()}
              className="transition-padding my-2 inline-block cursor-pointer rounded-lg bg-purple-700 pl-2 pr-10 text-white transition-colors duration-200 ease-in-out focus:shadow-outline-light focus:outline-none disabled:cursor-not-allowed disabled:pr-2 disabled:opacity-50 dark:bg-purple-400 dark:focus:shadow-outline-dark"
            />
          </div>
        </div>
      </fieldset>
    </form>
  );
}
