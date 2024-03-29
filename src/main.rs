use yew::prelude::*;
use yew::Html;
use yew_router::prelude::*;

mod components;
use components::{Body, Footer, Header};

mod pages;
use pages::{Contact, Home, NotFound, Web};

mod api;

#[derive(Clone, Routable, PartialEq, Eq)]
enum Route {
    #[at("/")]
    Home,
    #[at("/web-projects")]
    Web,
    #[at("/contact")]
    Contact,
    #[not_found]
    #[at("/404")]
    NotFound,
}

fn switch(routes: Route) -> Html {
    match routes {
        Route::Home => html! { <Home /> },
        Route::Web => html! { <Web /> },
        Route::Contact => html! { <Contact /> },
        Route::NotFound => html! { <NotFound /> },
    }
}

#[function_component(App)]
fn app() -> Html {
    html! {
        <BrowserRouter>
            <Body>
                <Header />
                <Switch<Route> render={switch} />
                <Footer />
            </Body>
        </BrowserRouter>
    }
}

fn main() {
    wasm_logger::init(wasm_logger::Config::default());
    yew::Renderer::<App>::new().render();
}
