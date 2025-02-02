import { useLocation, useNavigate } from "react-router";

import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingOne from "@/components/layout/headings/HeadingOne.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import { FlexFlowCSSValue } from "@/types/layout.ts";

export default function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <main>
      <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={8}>
        <HeadingOne>Oh no!</HeadingOne>
        <Paragraph data-testid="does-not-exist">
          <code>
            {`${window.location.host}${location.pathname}${location.search}${location.hash}`}
          </code>{" "}
          does not exist.
        </Paragraph>
        <button
          className={"accent w-fit text-xl underline"}
          onClick={
            // Attempt to recover by navigating to previous page
            () => navigate(-1)
          }
        >
          Return to Previous Page
        </button>
      </FlexContainer>
    </main>
  );
}
