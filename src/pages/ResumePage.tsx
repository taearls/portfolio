import InlineAnchor from "@/components/InlineAnchor/InlineAnchor.tsx";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingOne from "@/components/layout/headings/HeadingOne.tsx";
import HeadingThree from "@/components/layout/headings/HeadingThree.tsx";
import HeadingTwo from "@/components/layout/headings/HeadingTwo.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import {
  AlignItemsCSSValue,
  FlexFlowCSSValue,
  TextAlignment,
} from "@/types/layout.ts";

type WorkExperience = {
  title: string;
  company: string;
  companyUrl?: string;
  location: string;
  period: string;
  team?: string;
  highlights: Array<string>;
};

const WORK_EXPERIENCE: Array<WorkExperience> = [
  {
    title: "Senior Consultant / Consultant",
    company: "Inspire11",
    companyUrl: "https://www.inspire11.com",
    location: "Remote (USA)",
    period: "2022–Present",
    highlights: [
      "Cultivated engineering excellence in multiple internationally distributed teams through mentorship programs and knowledge-sharing initiatives",
      "Led the implementation of a work proposal for a multi-national insurance claims platform, directly contributing to successful business acquisition",
      "Authored user stories for multiple application features across the entire application stack: bridging high level business context with precise technical guidance, accelerating the code delivery of junior developers",
      "Designed enterprise-grade authentication architecture that enhanced security while maintaining seamless user experience for insurance clients",
      "Created a foundational UI component library, streamlining the implementation of a branded design system while empowering developers to focus on business logic",
      "Architected API integration strategy between React frontend and C# backend, ensuring data integrity across multiple pipelines and legacy systems",
      "Triaged critical bugs in production by communicating directly with real users and business stakeholders, building a highly visible brand as the go-to tech lead for time-sensitive issues",
      "Led a performance optimization initiative that reduced deployment pipeline times by 30%",
      "Championed accessibility standards that ensured compliance while enhancing the user experience",
    ],
  },
  {
    title: "Fullstack Engineer",
    company: "Cquence",
    location: "Remote (USA)",
    period: "2022",
    highlights: [
      "Architected cross-platform collaboration framework for an Electron application, designing both frontend and backend systems for real-time notifications",
      "Developed modular React component architecture aligned with design specifications, enabling seamless integration of collaborative features",
      "Established quality assurance infrastructure across 6 projects, implementing automated linting and build processes for React, Node.js, and Python codebases",
      "Designed relational database schema and REST API layer to support collaborative document workflows, implementing full-stack solution with React, Node.js, and Postgres",
    ],
  },
  {
    title: "Software Engineer II / Software Engineer I",
    company: "Ensighten",
    location: "Remote (USA)",
    period: "2019–2022",
    team: "Privacy team",
    highlights: [
      "Architected and developed enterprise-scale privacy compliance application used by Fortune 500 companies, ensuring regulatory adherence while maintaining performance",
      "Facilitated technical knowledge transfer through company-wide presentations, mentoring sessions and documentation initiatives",
      "Led development of a Vue 3 component library that standardized UI development across 7 teams while adhering to an organizational design system",
      "Championed accessibility standards for high-traffic web applications, implementing WCAG-compliant solutions for Fortune 500 customers",
      "Created Cloud CI/CD pipeline architecture using AWS S3 that became the organizational standard for multiple projects",
      "Led migration strategy from legacy AngularJS to modern Vue architecture, reducing page load times by 87% while enhancing maintainability",
      "Established automated testing infrastructure with Jest and Cypress that significantly improved code quality and release reliability",
      "Implemented enterprise data migration strategy using Mongock with Java/SpringBoot, enabling version-controlled MongoDB operations for 40+ customers",
    ],
  },
  {
    title: "Web Developer",
    company: "Alpine Home Air",
    location: "Chicago, IL",
    period: "2018–2019",
    highlights: [
      "Upgraded checkout flow from legacy software to a new payment processor on dozens of web pages through the customer journey",
      "Built administration tool with Vue.js to search employee and customer directory, used by 8 sales employees",
      "Implemented customer-facing product comparison tool with jQuery and CSS Flexbox on a high traffic page with thousands of daily users",
    ],
  },
];

type SkillCategory = {
  category: string;
  skills: Array<string>;
};

const SKILLS: Array<SkillCategory> = [
  {
    category: "Languages",
    skills: ["TypeScript", "React", "Node.js", "Rust", "Java", "C#"],
  },
  {
    category: "Technologies",
    skills: [
      "Docker",
      "AWS",
      "Vite",
      "Azure DevOps",
      "Service Workers",
      "MongoDB",
      "Postgres",
    ],
  },
  {
    category: "Other",
    skills: [
      "API Design",
      "Performance",
      "Authentication",
      "Authorization",
      "Web accessibility",
      "Testing",
      "Mobile-first CSS",
    ],
  },
];

function WorkExperienceItem({
  title,
  company,
  companyUrl,
  location,
  period,
  team,
  highlights,
  isLast,
}: WorkExperience & { isLast: boolean }) {
  return (
    <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={2}>
      <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={1}>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <HeadingThree align={TextAlignment.LEFT}>{title}</HeadingThree>
          <span className="text-secondary-text text-base font-medium lg:text-lg">
            {period}
          </span>
        </div>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
          {companyUrl != null ? (
            <InlineAnchor
              href={companyUrl}
              ariaLabel={`Visit ${company}'s website`}
              isExternal
              accent
            >
              {company}
            </InlineAnchor>
          ) : (
            <span className="text-accent-color font-medium">{company}</span>
          )}
          <span className="text-secondary-text text-base">{location}</span>
          {team != null && (
            <span className="text-secondary-text text-base">({team})</span>
          )}
        </div>
      </FlexContainer>

      <ul
        className="m-0 list-disc space-y-1 pl-5"
        aria-label={`Work highlights at ${company}`}
      >
        {highlights.map((highlight) => (
          <li
            key={highlight}
            className="text-primary-text text-base leading-normal lg:text-lg"
          >
            {highlight}
          </li>
        ))}
      </ul>

      {!isLast && <hr className="line-break mt-3" />}
    </FlexContainer>
  );
}

function SkillsSection() {
  return (
    <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={3}>
      {SKILLS.map(({ category, skills }) => (
        <div
          key={category}
          className="flex flex-col gap-1 sm:flex-row sm:gap-2"
        >
          <span className="text-accent-color min-w-32 font-medium">
            {category}:
          </span>
          <span className="text-primary-text text-base lg:text-lg">
            {skills.join(", ")}
          </span>
        </div>
      ))}
    </FlexContainer>
  );
}

export default function ResumePage() {
  return (
    <main>
      <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={8}>
        {/* Header */}
        <FlexContainer
          flexFlow={FlexFlowCSSValue.COLUMN}
          alignItems={AlignItemsCSSValue.CENTER}
          gapY={4}
        >
          <HeadingOne>{"Resume"}</HeadingOne>
          <Paragraph>
            {
              "Tyler Earls is: a senior software engineer designing scalable solutions across the entire application stack; a team lead that standardizes best practices and mentors developers to accelerate productivity; and a key technical communicator creating alignment with business stakeholders, application architects, and product managers."
            }
          </Paragraph>
          <a
            href="/tyler-earls-resume.pdf"
            download="Tyler Earls - Resume.pdf"
            className="btn-accent bg-accent-hover ring-accent-focus min-h-11 cursor-pointer self-start rounded-lg px-6 py-2 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-900"
            aria-label="Download resume as PDF"
          >
            Download Resume as PDF
          </a>
        </FlexContainer>

        {/* Work Experience */}
        <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={4}>
          <HeadingTwo align={TextAlignment.LEFT}>Work Experience</HeadingTwo>
          <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={6}>
            {WORK_EXPERIENCE.map((experience, index) => (
              <WorkExperienceItem
                key={`${experience.company}-${experience.period}`}
                {...experience}
                isLast={index === WORK_EXPERIENCE.length - 1}
              />
            ))}
          </FlexContainer>
        </FlexContainer>

        {/* Languages and Technologies */}
        <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={4}>
          <HeadingTwo align={TextAlignment.LEFT}>
            Languages and Technologies
          </HeadingTwo>
          <SkillsSection />
        </FlexContainer>

        {/* Open Source */}
        <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={4}>
          <HeadingTwo align={TextAlignment.LEFT}>
            Open Source Contributions
          </HeadingTwo>
          <Paragraph className="self-start">
            {"I actively contribute to open source projects. View my "}
            <InlineAnchor
              href="/code?tab=open-source"
              ariaLabel="View open source contributions on the Code page"
              accent
            >
              open source contributions
            </InlineAnchor>
            {" for details on my work with projects like "}
            <InlineAnchor
              href="https://github.com/oxc-project/oxc"
              ariaLabel="View oxc on GitHub"
              isExternal
              accent
            >
              oxc
            </InlineAnchor>
            {", "}
            <InlineAnchor
              href="https://github.com/rolldown/rolldown"
              ariaLabel="View rolldown on GitHub"
              isExternal
              accent
            >
              rolldown
            </InlineAnchor>
            {", "}
            <InlineAnchor
              href="https://github.com/leptos-rs/leptos"
              ariaLabel="View leptos on GitHub"
              isExternal
              accent
            >
              leptos
            </InlineAnchor>
            {", and more."}
          </Paragraph>
        </FlexContainer>
      </FlexContainer>
    </main>
  );
}
