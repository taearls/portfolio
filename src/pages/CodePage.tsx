import type { OpenSourceProjectProps } from "@/components/OpenSourceProject/OpenSourceProject.tsx";
import type { WebProjectProps } from "@/components/WebProject/WebProject.tsx";

import { useMemo, useState } from "react";

import InlineAnchor from "@/components/InlineAnchor/InlineAnchor.tsx";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingOne from "@/components/layout/headings/HeadingOne.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import RenderIf from "@/components/layout/RenderIf.tsx";
import OpenSourceContribution from "@/components/OpenSourceContribution/OpenSourceContribution.tsx";
import OpenSourceProject from "@/components/OpenSourceProject/OpenSourceProject.tsx";
import SearchInput from "@/components/SearchInput/SearchInput.tsx";
import Tabs from "@/components/Tabs/Tabs.tsx";
import TagFilter from "@/components/TagFilter/TagFilter.tsx";
import WebProject from "@/components/WebProject/WebProject.tsx";
import { AlignItemsCSSValue, FlexFlowCSSValue } from "@/types/layout.ts";
import {
  ALL_OPEN_SOURCE_TAGS,
  ALL_PROJECT_TAGS,
  OPEN_SOURCE_CONTRIBUTIONS,
  OPEN_SOURCE_PROJECTS,
  WEB_PROJECTS,
} from "@/util/constants.ts";

/**
 * Generic filter function for projects with name and descriptions.
 */
function filterProjects<
  T extends { name: string; descriptions: Array<string>; tags: Array<string> },
>(
  projects: Array<T>,
  searchTerm: string,
  selectedTags: Array<string>,
): Array<T> {
  return projects.filter((project) => {
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch =
      searchLower === "" ||
      project.name.toLowerCase().includes(searchLower) ||
      project.descriptions.some((desc) =>
        desc.toLowerCase().includes(searchLower),
      );

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => project.tags.includes(tag));

    return matchesSearch && matchesTags;
  });
}

/**
 * Web Projects tab content with search and filtering.
 */
function WebProjectsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<Array<string>>([]);

  const filteredProjects = useMemo(
    () => filterProjects(WEB_PROJECTS, searchTerm, selectedTags),
    [searchTerm, selectedTags],
  );

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
  };

  const hasActiveFilters = searchTerm !== "" || selectedTags.length > 0;
  const noResultsFound = filteredProjects.length === 0 && hasActiveFilters;

  return (
    <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={8}>
      <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={4}>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name or description..."
        />
        <TagFilter
          tags={ALL_PROJECT_TAGS}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearAll={handleClearAllTags}
        />
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {hasActiveFilters &&
            (noResultsFound
              ? "No projects found matching your criteria."
              : `Showing ${filteredProjects.length} ${filteredProjects.length === 1 ? "project" : "projects"}.`)}
        </div>
      </FlexContainer>

      <RenderIf condition={noResultsFound}>
        <FlexContainer
          flexFlow={FlexFlowCSSValue.COLUMN}
          alignItems={AlignItemsCSSValue.CENTER}
          gapY={4}
        >
          <Paragraph>
            {
              "No projects found matching your criteria. Try adjusting your search or filters."
            }
          </Paragraph>
        </FlexContainer>
      </RenderIf>

      <RenderIf condition={!noResultsFound}>
        <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={8}>
          {filteredProjects.map((webProject, index) => (
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
              tags={webProject.tags}
              isLast={index === filteredProjects.length - 1}
            />
          ))}
        </FlexContainer>
      </RenderIf>
    </FlexContainer>
  );
}

/**
 * Open Source Projects tab content with search and filtering.
 */
function OpenSourceTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<Array<string>>([]);

  const filteredProjects = useMemo(
    () => filterProjects(OPEN_SOURCE_PROJECTS, searchTerm, selectedTags),
    [searchTerm, selectedTags],
  );

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
  };

  const hasActiveFilters = searchTerm !== "" || selectedTags.length > 0;
  const noResultsFound = filteredProjects.length === 0 && hasActiveFilters;

  return (
    <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={8}>
      <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={4}>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name or description..."
        />
        <TagFilter
          tags={ALL_OPEN_SOURCE_TAGS}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearAll={handleClearAllTags}
        />
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {hasActiveFilters &&
            (noResultsFound
              ? "No projects found matching your criteria."
              : `Showing ${filteredProjects.length} ${filteredProjects.length === 1 ? "project" : "projects"}.`)}
        </div>
      </FlexContainer>

      <RenderIf condition={noResultsFound}>
        <FlexContainer
          flexFlow={FlexFlowCSSValue.COLUMN}
          alignItems={AlignItemsCSSValue.CENTER}
          gapY={4}
        >
          <Paragraph>
            {
              "No projects found matching your criteria. Try adjusting your search or filters."
            }
          </Paragraph>
        </FlexContainer>
      </RenderIf>

      <RenderIf condition={!noResultsFound}>
        <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={8}>
          {filteredProjects.map((project, index) => (
            <OpenSourceProject
              key={project.name}
              name={project.name}
              descriptions={project.descriptions}
              githubUrl={project.githubUrl}
              language={project.language}
              tags={project.tags}
              isLast={index === filteredProjects.length - 1}
            />
          ))}
        </FlexContainer>
      </RenderIf>
    </FlexContainer>
  );
}

/**
 * Contributions tab content showing external project contributions.
 */
function ContributionsTab() {
  return (
    <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={6}>
      {OPEN_SOURCE_CONTRIBUTIONS.map((contribution, index) => (
        <OpenSourceContribution
          key={contribution.projectName}
          projectName={contribution.projectName}
          projectUrl={contribution.projectUrl}
          description={contribution.description}
          prCount={contribution.prCount}
          language={contribution.language}
          highlights={contribution.highlights}
          isLast={index === OPEN_SOURCE_CONTRIBUTIONS.length - 1}
        />
      ))}
    </FlexContainer>
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
        />
      </FlexContainer>
    </main>
  );
}
