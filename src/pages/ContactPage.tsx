import InlineAnchor from "@/components/InlineAnchor/InlineAnchor";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer";
import HeadingOne from "@/components/layout/headings/HeadingOne";
import Paragraph from "@/components/layout/Paragraph/Paragraph";
import {
  AlignItemsCSSValue,
  FlexFlowCSSValue,
  JustifyContentCSSValue,
} from "@/types/layout";
import { PORTFOLIO_EMAIL } from "@/util/constants";

export default function Contact() {
  return (
    <main>
      <FlexContainer
        flexFlow={FlexFlowCSSValue.COLUMN}
        alignItems={AlignItemsCSSValue.BASELINE}
        gapY={4}
      >
        <FlexContainer justifyContent={JustifyContentCSSValue.CENTER} fullWidth>
          <HeadingOne>{"Contact Tyler Earls"}</HeadingOne>
        </FlexContainer>
        <FlexContainer>
          <Paragraph>
            {
              "If you're interested in hiring me for coding work, my music, or just want to say hello—I'd love to hear from you. I'm a voracious learner, and nothing is too nerdy or niche for my taste."
            }
          </Paragraph>
        </FlexContainer>

        <FlexContainer>
          <Paragraph>
            {"The best way to reach me is via email at "}
            <InlineAnchor
              href={`mailto:${PORTFOLIO_EMAIL}`}
              ariaLabel="Send an email to Tyler Earls"
              accent
            >
              {PORTFOLIO_EMAIL}
            </InlineAnchor>
            {"."}
          </Paragraph>
        </FlexContainer>
      </FlexContainer>

      {/* <ContactForm /> */}
    </main>
  );
}
