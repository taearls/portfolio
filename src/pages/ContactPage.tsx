import ContactEmailForm from "@/components/ContactEmailForm.tsx";
import FeatureFlagWrapper from "@/components/FeatureFlagWrapper/FeatureFlagWrapper.tsx";
import InlineAnchor from "@/components/InlineAnchor/InlineAnchor.tsx";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingOne from "@/components/layout/headings/HeadingOne.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import { useFeatureFlags } from "@/hooks/useFeatureFlags.ts";
import {
  AlignItemsCSSValue,
  FlexFlowCSSValue,
  JustifyContentCSSValue,
} from "@/types/layout.ts";
import { PORTFOLIO_EMAIL } from "@/util/constants.ts";

/**
 * Component to display when the contact form feature is disabled via runtime flag.
 * This enables the "emergency kill switch" pattern - build-time flag includes the code,
 * but runtime flag can still disable it without a rebuild.
 */
function ContactFormDisabledMessage() {
  const { flags } = useFeatureFlags();
  const flagConfig = flags["email-contact-form"];
  const message = flagConfig?.message;

  if (!message) {
    return null;
  }

  return (
    <FlexContainer justifyContent={JustifyContentCSSValue.CENTER}>
      <Paragraph>{message}</Paragraph>
    </FlexContainer>
  );
}

export default function Contact() {
  return (
    <main>
      <FlexContainer
        flexFlow={FlexFlowCSSValue.COLUMN}
        alignItems={AlignItemsCSSValue.CENTER}
        gapY={4}
      >
        <FlexContainer justifyContent={JustifyContentCSSValue.CENTER} fullWidth>
          <HeadingOne>{"Contact Tyler Earls"}</HeadingOne>
        </FlexContainer>
        <FlexContainer
          justifyContent={JustifyContentCSSValue.CENTER}
          flexFlow={FlexFlowCSSValue.COLUMN}
          gapY={4}
        >
          <Paragraph>
            {
              "If you're interested in hiring me for coding work, my music, or just want to say hello—I'd love to hear from you. I'm a voracious learner, and nothing is too nerdy or niche for my taste."
            }
          </Paragraph>

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

      <FeatureFlagWrapper
        flagKey="email-contact-form"
        whenEnabled={<ContactEmailForm />}
        whenDisabled={<ContactFormDisabledMessage />}
      />
    </main>
  );
}
