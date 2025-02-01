import InlineAnchor from "@/components/InlineAnchor/InlineAnchor";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer";
import HeadingOne from "@/components/layout/headings/HeadingOne";
import Paragraph from "@/components/layout/Paragraph/Paragraph";
import { AlignItemsCSSValue, FlexFlowCSSValue } from "@/types/layout";

export default function Home() {
  return (
    <main>
      <FlexContainer
        flexFlow={FlexFlowCSSValue.COLUMN}
        alignItems={AlignItemsCSSValue.CENTER}
        gapY={8}
      >
        {/* TODO: this should be a card of some sort. animation needed. */}
        <HeadingOne align="left">
          {"Hi there!"}
          <br />
          {"My name is Tyler Earls."}
          <br />
          {"I am a software engineer and musician."}
        </HeadingOne>
      </FlexContainer>

      <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={4}>
        <Paragraph>
          {"Professionally, I write software as a consultant for "}
          <InlineAnchor
            href="https://www.inspire11.com"
            ariaLabel="Go to Inspire11's website"
            isExternal
            accent
          >
            Inspire11
          </InlineAnchor>
          {
            ". I look forward to collaborating with clients to build modern user experiences with scalability, maintainability, and a11y in mind."
          }
        </Paragraph>
      </FlexContainer>

      <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={4}>
        <Paragraph>
          {
            "As an engineer, my perspective is informed by my musical education. I find that both music and tech require one to be autodidactic, studying continuously in order to stay sharp."
          }
        </Paragraph>
      </FlexContainer>

      <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={4}>
        <FlexContainer gapY={2}>
          <Paragraph>
            {
              "For example, since the start of the Covid-19 pandemic, I have been studying Rust, and now I use it regularly both on side projects and on Exercism's "
            }
            <InlineAnchor
              href="https://www.exercism.io"
              ariaLabel="Go to Exercism"
              isExternal
              accent
            >
              dedicated Rust Track
            </InlineAnchor>
            {"."}
          </Paragraph>
        </FlexContainer>
        <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={2}>
          <Paragraph>
            {
              "I'm also developing a Rust crate that leverages music theory to generate valid chords and scales from user input. If you'd like, check out the "
            }
            <InlineAnchor
              href="https://github.com/taearls/audiate"
              ariaLabel="Go to the documentation for Audiate"
              isExternal
              accent
            >
              documentation
            </InlineAnchor>
            {" for Audiate to keep up-to-date with my progress."}
          </Paragraph>
        </FlexContainer>
      </FlexContainer>

      <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={4}>
        <Paragraph>
          {"Outside of tech, I write songs and lead a band called "}
          <InlineAnchor
            href="https://www.cuckooandthebirds.com/"
            ariaLabel="Go the Cuckoo and the Birds website"
            isExternal
            accent
          >
            Cuckoo and the Birds
          </InlineAnchor>

          {". If you'd like, you can listen at our "}
          <InlineAnchor
            href="https://cuckooandthebirds.bandcamp.com"
            ariaLabel="Go to the Cuckoo and the Birds bandcamp"
            isExternal
            accent
          >
            Bandcamp
          </InlineAnchor>
          {"."}
        </Paragraph>
      </FlexContainer>

      <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={4}>
        <Paragraph>
          {
            "I'm also a very avid Star Trek fan. During these difficult times, I find comfort in its optimistic view on the potential of humanity and its future."
          }
        </Paragraph>
      </FlexContainer>
    </main>
  );
}
