import CloudinaryImage from "@/components/CloudinaryImage/CloudinaryImage.tsx";
import InlineAnchor from "@/components/InlineAnchor/InlineAnchor.tsx";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingOne from "@/components/layout/headings/HeadingOne.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import { AlignItemsCSSValue, FlexFlowCSSValue } from "@/types/layout.ts";

export default function HomePage() {
  return (
    <main>
      <FlexContainer
        alignItems={AlignItemsCSSValue.CENTER}
        flexFlow={FlexFlowCSSValue.COLUMN}
        gapY={4}
      >
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

        <CloudinaryImage
          publicId="front_of_brick_wall_smiling"
          directory="profile"
          width={400}
          height={400}
          alt="Picture of Tyler Earls standing in front of a brick wall and smiling"
          transformation={
            "ar_1:1,c_thumb,g_xy_center,r_max,w_800,x_730,y_800,f_png"
          }
        />

        <Paragraph>
          {
            "Professionally, I write fullstack web applications as a consultant for "
          }
          <InlineAnchor
            href="https://www.inspire11.com"
            ariaLabel="Go to Inspire11's website"
            isExternal
            accent
          >
            Inspire11
          </InlineAnchor>
          {
            ". I lead teams that build modern user experiences with scalability, maintainability, and a11y in mind. I specialize in React, Java, C#, and Rust."
          }
        </Paragraph>

        {/* <Paragraph>
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
        </Paragraph> */}

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

        <CloudinaryImage
          publicId="cuckoo_show_at_bungalow"
          directory="profile"
          alt="Tyler talking in the microphone while preparing for the next song at a basement show with their band, Cuckoo and the Birds."
          transformation={"ar_3:4,c_crop,g_face,w_900"}
        />

        <Paragraph>
          {
            "I'm also a very avid Star Trek fan. During these difficult times, I find comfort in its optimistic view on the potential of humanity and its future."
          }
        </Paragraph>

        {/* <CloudinaryImage
          publicId="star_trek_convention_captains_chair"
          alt="Tyler sitting in a replica of Captain Picard's chair at the Star Trek convention in Chicago, circa 2022."
          transformation={"c_crop,e_upscale,g_center,q_auto:best"}
        /> */}

        <CloudinaryImage
          publicId="star_trek_convention_photo_abstract"
          alt="A heavily distorted and abstract photo of Tyler sitting in a replica of Captain Picard's chair at the Star Trek convention in Chicago, circa 2022."
          transformation={"c_crop,e_upscale,g_center,q_auto:best"}
        />
      </FlexContainer>
    </main>
  );
}
