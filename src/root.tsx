import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import "./styles/globals.css";

import PageContainer from "./components/layout/containers/PageContainer/PageContainer";
import Footer from "./components/layout/Footer/Footer";
import Header from "./components/layout/Header/Header";
import Meta from "./components/layout/Meta/Meta";
import routes from "./routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Meta />
      <Header />
      <PageContainer>{routes}</PageContainer>

      <Footer />
    </BrowserRouter>
  </StrictMode>,
);
