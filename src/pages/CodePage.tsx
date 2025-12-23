import type { OpenSourceProjectProps } from "@/components/OpenSourceProject/OpenSourceProject.tsx";
import type { WebProjectProps } from "@/components/WebProject/WebProject.tsx";
import type { OpenSourceContributionProps } from "@/util/constants.ts";

import FilterableProjectList from "@/components/FilterableProjectList/FilterableProjectList.tsx";
import InlineAnchor from "@/components/InlineAnchor/InlineAnchor.tsx";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingOne from "@/components/layout/headings/HeadingOne.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import OpenSourceContribution from "@/components/OpenSourceContribution/OpenSourceContribution.tsx";
import OpenSourceProject from "@/components/OpenSourceProject/OpenSourceProject.tsx";
import Tabs from "@/components/Tabs/Tabs.tsx";
import WebProject from "@/components/WebProject/WebProject.tsx";
import { AlignItemsCSSValue, FlexFlowCSSValue } from "@/types/layout.ts";
import {
  ALL_CONTRIBUTION_TAGS,
  ALL_OPEN_SOURCE_TAGS,
  ALL_PROJECT_TAGS,
  OPEN_SOURCE_CONTRIBUTIONS,
  OPEN_SOURCE_PROJECTS,
  WEB_PROJECTS,
} from "@/util/constants.ts";

// Extend contribution props to match FilterableItem interface
type FilterableContribution = OpenSourceContributionProps & {
  name: string;
  descriptions: Array<string>;
};

// Transform contributions to match FilterableItem interface
const FILTERABLE_CONTRIBUTIONS: Array<FilterableContribution> =
  OPEN_SOURCE_CONTRIBUTIONS.map((c) => ({
    ...c,
    name: c.projectName,
    descriptions: [c.description, ...c.highlights],
  }));

/**
 * Web Projects tab content with search and filtering.
 */
function WebProjectsTab() {
  return (
    <FilterableProjectList<Omit<WebProjectProps, "isLast">>
      items={WEB_PROJECTS}
      allTags={ALL_PROJECT_TAGS}
      renderItem={(project, _index, isLast) => (
        <WebProject
          key={project.name}
          analytics={project.analytics}
          cloudinaryId={project.cloudinaryId}
          alt={project.alt}
          cursorStyle={project.cursorStyle}
          descriptions={project.descriptions}
          emoji={project.emoji}
          href={project.href}
          name={project.name}
          tagline={project.tagline}
          tags={project.tags}
          isLast={isLast}
        />
      )}
    />
  );
}

/**
 * Open Source Projects tab content with search and filtering.
 */
function OpenSourceTab() {
  return (
    <FilterableProjectList<Omit<OpenSourceProjectProps, "isLast">>
      items={OPEN_SOURCE_PROJECTS}
      allTags={ALL_OPEN_SOURCE_TAGS}
      renderItem={(project, _index, isLast) => (
        <OpenSourceProject
          key={project.name}
          name={project.name}
          descriptions={project.descriptions}
          githubUrl={project.githubUrl}
          language={project.language}
          tags={project.tags}
          isLast={isLast}
        />
      )}
    />
  );
}

/**
 * Contributions tab content showing external project contributions with search and filtering.
 */
function ContributionsTab() {
  return (
    <FilterableProjectList<FilterableContribution>
      items={FILTERABLE_CONTRIBUTIONS}
      allTags={ALL_CONTRIBUTION_TAGS}
      searchPlaceholder="Search contributions..."
      renderItem={(contribution, _index, isLast) => (
        <OpenSourceContribution
          key={contribution.projectName}
          projectName={contribution.projectName}
          projectUrl={contribution.projectUrl}
          description={contribution.description}
          prCount={contribution.prCount}
          language={contribution.language}
          highlights={contribution.highlights}
          tags={contribution.tags}
          isLast={isLast}
        />
      )}
    />
  );
}

export default function CodePage() {
  const tabs = [
    {
      id: "web-projects",
      label: "Web Projects",
      children: <WebProjectsTab />,
    },
    {
      id: "open-source",
      label: "Open Source",
      children: <OpenSourceTab />,
    },
    {
      id: "contributions",
      label: "Contributions",
      children: <ContributionsTab />,
    },
  ];

  return (
    <main>
      <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={8}>
        <FlexContainer
          flexFlow={FlexFlowCSSValue.COLUMN}
          alignItems={AlignItemsCSSValue.CENTER}
          gapY={4}
        >
          <HeadingOne>{"Code"}</HeadingOne>
          <Paragraph>
            {
              "Below you'll find samples of my work, from personal web projects to open source contributions. The majority of my professional work has been for private companies whose source code is not public."
            }
          </Paragraph>
          <Paragraph>
            {"For more of my work, check out my "}
            <InlineAnchor
              href="https://github.com/taearls"
              ariaLabel="Go to Tyler's Github profile"
              isExternal
              accent
            >
              GitHub profile
            </InlineAnchor>
            {"."}
          </Paragraph>
        </FlexContainer>

        <Tabs
          tabs={tabs}
          defaultTabId="web-projects"
          ariaLabel="Project categories"
          queryParam="tab"
        />
      </FlexContainer>
    </main>
  );
}
