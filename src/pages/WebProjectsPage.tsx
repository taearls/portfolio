import type { WebProjectProps } from "@/components/WebProject/WebProject.tsx";

import { useMemo, useState } from "react";

import InlineAnchor from "@/components/InlineAnchor/InlineAnchor.tsx";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingOne from "@/components/layout/headings/HeadingOne.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import RenderIf from "@/components/layout/RenderIf.tsx";
import SearchInput from "@/components/SearchInput/SearchInput.tsx";
import TagFilter from "@/components/TagFilter/TagFilter.tsx";
import WebProject from "@/components/WebProject/WebProject.tsx";
import { AlignItemsCSSValue, FlexFlowCSSValue } from "@/types/layout.ts";
import { ALL_PROJECT_TAGS, WEB_PROJECTS } from "@/util/constants.ts";

/**
 * Filters projects based on search term and selected tags.
 * Search matches against project name and descriptions.
 * Tags use OR logic - project must have at least one selected tag.
 */
function filterProjects(
  projects: Array<Omit<WebProjectProps, "isLast">>,
  searchTerm: string,
  selectedTags: Array<string>,
): Array<Omit<WebProjectProps, "isLast">> {
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

export default function WebProjectsPage() {
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
    </main>
  );
}
