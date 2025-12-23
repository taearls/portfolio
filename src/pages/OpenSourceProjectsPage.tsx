import type { OpenSourceProjectProps } from "@/components/OpenSourceProject/OpenSourceProject.tsx";

import { useMemo, useState } from "react";

import InlineAnchor from "@/components/InlineAnchor/InlineAnchor.tsx";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingOne from "@/components/layout/headings/HeadingOne.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import RenderIf from "@/components/layout/RenderIf.tsx";
import OpenSourceProject from "@/components/OpenSourceProject/OpenSourceProject.tsx";
import SearchInput from "@/components/SearchInput/SearchInput.tsx";
import TagFilter from "@/components/TagFilter/TagFilter.tsx";
import { AlignItemsCSSValue, FlexFlowCSSValue } from "@/types/layout.ts";
import {
  ALL_OPEN_SOURCE_TAGS,
  OPEN_SOURCE_PROJECTS,
} from "@/util/constants.ts";

/**
 * Filters projects based on search term and selected tags.
 * Search matches against project name and descriptions.
 * Tags use OR logic - project must have at least one selected tag.
 */
function filterProjects(
  projects: Array<Omit<OpenSourceProjectProps, "isLast">>,
  searchTerm: string,
  selectedTags: Array<string>,
): Array<Omit<OpenSourceProjectProps, "isLast">> {
  return projects.filter((project) => {
    // Search filter: match name or any description
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch =
      searchLower === "" ||
      project.name.toLowerCase().includes(searchLower) ||
      project.descriptions.some((desc) =>
        desc.toLowerCase().includes(searchLower),
      );

    // Tag filter: project must have at least one of the selected tags (OR logic)
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => project.tags.includes(tag));

    return matchesSearch && matchesTags;
  });
}

export default function OpenSourceProjectsPage() {
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
    <main>
      <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={8}>
        <FlexContainer
          flexFlow={FlexFlowCSSValue.COLUMN}
          alignItems={AlignItemsCSSValue.CENTER}
          gapY={4}
        >
          <HeadingOne>{"Open Source"}</HeadingOne>
          <Paragraph>
            {
              "I'm passionate about contributing to the open source community. Below are some of my Rust projects that showcase my systems programming skills and interests."
            }
          </Paragraph>
          <Paragraph>
            {
              "These projects range from music theory libraries to developer tooling. For more of my work, check out my "
            }
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
          {/* Live region for screen reader announcements */}
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
    </main>
  );
}
