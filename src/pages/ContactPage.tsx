import InlineAnchor from "@/components/InlineAnchor/InlineAnchor.tsx";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingOne from "@/components/layout/headings/HeadingOne.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import Todo from "@/components/Todo/Todo.tsx";
import {
  AlignItemsCSSValue,
  FlexFlowCSSValue,
  JustifyContentCSSValue,
} from "@/types/layout.ts";
import { PORTFOLIO_EMAIL } from "@/util/constants.ts";

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

        <Todo
          description="I should add a pic of myself, something fun."
          className="h-[500px] w-[500px] rounded-md bg-pink-500 text-2xl font-bold dark:bg-pink-400 dark:text-soft-black"
        ></Todo>
      </FlexContainer>

      {/* <ContactForm /> */}
    </main>
  );
}
