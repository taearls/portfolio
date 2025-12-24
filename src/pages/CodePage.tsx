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

// Union type for combined projects
type CombinedProject =
  | (Omit<WebProjectProps, "isLast"> & { projectType: "web" })
  | (Omit<OpenSourceProjectProps, "isLast"> & { projectType: "openSource" });

// Combine web projects and open source projects, sorted by lastModified (descending)
// Projects without lastModified date are sorted last
const ALL_PROJECTS: Array<CombinedProject> = [
  ...WEB_PROJECTS.map((p) => ({ ...p, projectType: "web" as const })),
  ...OPEN_SOURCE_PROJECTS.map((p) => ({
    ...p,
    projectType: "openSource" as const,
  })),
].sort((a, b) => {
  const aDate = "lastModified" in a ? a.lastModified : undefined;
  const bDate = "lastModified" in b ? b.lastModified : undefined;

  // Items without dates go last
  if (!aDate && !bDate) return 0;
  if (!aDate) return 1;
  if (!bDate) return -1;

  // Sort descending (most recent first)
  return bDate.localeCompare(aDate);
});

// Combine all tags from both project types
const ALL_COMBINED_TAGS: Array<string> = Array.from(
  new Set([...ALL_PROJECT_TAGS, ...ALL_OPEN_SOURCE_TAGS]),
).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

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
 * Projects tab content with search and filtering (combines web and open source projects).
 */
function ProjectsTab() {
  return (
    <FilterableProjectList<CombinedProject>
      items={ALL_PROJECTS}
      allTags={ALL_COMBINED_TAGS}
      renderItem={(project, _index, isLast) => {
        if (project.projectType === "web") {
          return (
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
          );
        }
        return (
          <OpenSourceProject
            key={project.name}
            name={project.name}
            descriptions={project.descriptions}
            githubUrl={project.githubUrl}
            tags={project.tags}
            isLast={isLast}
          />
        );
      }}
    />
  );
}

/**
 * Open Source tab content showing external project contributions with search and filtering.
 */
function OpenSourceTab() {
  return (
    <FilterableProjectList<FilterableContribution>
      items={FILTERABLE_CONTRIBUTIONS}
      allTags={ALL_CONTRIBUTION_TAGS}
      renderItem={(contribution, _index, isLast) => (
        <OpenSourceContribution
          key={contribution.projectName}
          projectName={contribution.projectName}
          projectUrl={contribution.projectUrl}
          description={contribution.description}
          prCount={contribution.prCount}
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
      id: "projects",
      label: "Projects",
      children: <ProjectsTab />,
    },
    {
      id: "open-source",
      label: "Open Source",
      children: <OpenSourceTab />,
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
          <Paragraph className="self-start">
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
          defaultTabId="projects"
          ariaLabel="Project categories"
          queryParam="tab"
        />
      </FlexContainer>
    </main>
  );
}
