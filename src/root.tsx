import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import "./styles/globals.css";

import PageContainer from "./components/layout/containers/PageContainer/PageContainer.tsx";
import Footer from "./components/layout/Footer/Footer.tsx";
import Header from "./components/layout/Header/Header.tsx";
import routes from "./routes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {/* <Meta /> */}
      <Header />
      <PageContainer>{routes}</PageContainer>

      <Footer />
    </BrowserRouter>
  </StrictMode>,
);
