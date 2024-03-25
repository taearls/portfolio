import InlineAnchor from "@/components/InlineAnchor";
import WebProject from "@/components/WebProject/WebProject";
import { Paragraph } from "@/components/layout/Paragraph";
import { HeadingOne } from "@/components/layout/headings";
import { WEB_PROJECTS } from "@/util/constants";

export default function WebProjects() {
  return (
    <main>
      <HeadingOne>{"Web Projects"}</HeadingOne>
      <Paragraph>
        {
          "The following are samples of some of the projects I've maintained independently. Please note that the majority of the work I've done has been under the employment of private companies whose source code is not open sourced. That being the case, only a small fraction of my engineering output is possible to showcase."
        }
      </Paragraph>
      <Paragraph>
        {
          "In addition to this website, which has been rebuilt with Rust and Yew, my open sourced work includes the personal and freelance projects listed below. If you're interested to see more, feel free to stalk me on my "
        }
        <InlineAnchor
          href="https://github.com/taearls"
          ariaLabel="Go to Tyler's Github"
          text="Github"
          isExternal
        />
        {"."}
      </Paragraph>

      {WEB_PROJECTS.map((webProject, index) => (
        <WebProject
          key={index}
          analytics={webProject.analytics}
          cloudinaryId={webProject.cloudinaryId}
          alt={webProject.alt}
          cursorStyle={webProject.cursorStyle}
          descriptions={webProject.descriptions}
          emoji={webProject.emoji}
          href={webProject.href}
          imageExtension={webProject.imageExtension}
          name={webProject.name}
          tagline={webProject.tagline}
          isLast={index === WEB_PROJECTS.length - 1}
        />
      ))}
    </main>
  );
}
