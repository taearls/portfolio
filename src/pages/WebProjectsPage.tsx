import InlineAnchor from "@/components/InlineAnchor/InlineAnchor.tsx";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingOne from "@/components/layout/headings/HeadingOne.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import WebProject from "@/components/WebProject/WebProject.tsx";
import { AlignItemsCSSValue, FlexFlowCSSValue } from "@/types/layout.ts";
import { WEB_PROJECTS } from "@/util/constants.ts";

export default function WebProjectsPage() {
  return (
    <main>
      <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={8}>
        <FlexContainer
          flexFlow={FlexFlowCSSValue.COLUMN}
          alignItems={AlignItemsCSSValue.CENTER}
          gapY={4}
        >
          <HeadingOne>{"Web Projects"}</HeadingOne>
          <Paragraph>
            {
              "The following are samples of some of the projects I've maintained independently. Please note that the majority of the work I've done has been under the employment of private companies whose source code is not open sourced. That being the case, only a small fraction of my engineering output is possible to showcase."
            }
          </Paragraph>
          <Paragraph>
            {"In addition to this website, which has been rebuilt with "}
            <InlineAnchor
              href="https://react.dev"
              ariaLabel="Go to React's official documentation website"
              isExternal
              accent
            >
              React
            </InlineAnchor>
            {" and "}
            <InlineAnchor
              href="https://vite.dev"
              ariaLabel="Go to Vite's official documentation website"
              isExternal
              accent
            >
              Vite
            </InlineAnchor>
            {
              ", my open sourced work includes the personal and freelance projects listed below. If you're interested to see more, feel free to stalk me on my "
            }
            <InlineAnchor
              href="https://github.com/taearls"
              ariaLabel="Go to Tyler's Github"
              isExternal
              accent
            >
              Github
            </InlineAnchor>
            {"."}
          </Paragraph>
        </FlexContainer>

        <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={8}>
          {WEB_PROJECTS.map((webProject, index) => (
            <WebProject
              key={webProject.name}
              analytics={webProject.analytics}
              cloudinaryId={webProject.cloudinaryId}
              alt={webProject.alt}
              cursorStyle={webProject.cursorStyle}
              descriptions={webProject.descriptions}
              emoji={webProject.emoji}
              href={webProject.href}
              name={webProject.name}
              tagline={webProject.tagline}
              isLast={index === WEB_PROJECTS.length - 1}
            />
          ))}
        </FlexContainer>
      </FlexContainer>
    </main>
  );
}
