import { ReleaseDataType } from "@/pages/MusicPage/MusicDetailsPage";

export const RELEASE_DETAILS_DATA: Record<string, ReleaseDataType> = {
  "show-me-the-dark": {
    alt: "Album Artwork for Show Me The Dark",
    artworkCredit: "Mikal Bae and Alcides Diaz",
    descriptions: [
      "Show Me The Dark was originally recorded in the winter of 2019 with the intention to include it in a future release with the new band. When the pandemic happened, we stopped rehearsals before we had a chance to learn all the songs together and record them.",
      "As a result, this track is a bit of an outlier, and to me that’s fitting because the arrangement features a lot of elements I haven’t had before: violins, electric drums, synthesizers, a poem I wrote the night before tracking.",
      "The first iteration of this song was written during a time of high functioning anxiety for me. As I reflected then on my life at the elder age of 25, I identified many fond memories from my younger adulthood with details that had become fuzzy or forgotten over time.",
      "Show Me The Dark was born out of a desperation to regain access to those obscured memories and the self inhabiting them which felt so far that it seemed like a past life.",
    ],
    href: "https://cuckooandthebirds.bandcamp.com/track/show-me-the-dark",
    imgsrc: "Show Me The Dark/show-me-the-dark-artwork.jpg",
    performingCredits: [
      "Vocals, Guitars, Bass - Tyler Earls",
      "Guitars, Synths, Drum Machine, Backing Vocals - Jake Pearson",
      "Violin - Rachel Gonzalez",
      "Backing Vocals - Daniel Rausch",
    ],
    recordingCredits: [
      "Songs written by Tyler Earls",
      "Produced by Jake Pearson",
      "Tracked by Jake Pearson",
      "Mixed and Mastered by Mark Gustafson",
    ],
    title: "Show Me The Dark",
    videoCredits: [
      "Video by DigitalAlchemists (Mikal Bae and Alcides Diaz)",
      "Directed by Mikal Bae",
      "Assets by Mikal Bae and Alcides Diaz",
    ],
    videosrc: "https://www.youtube.com/embed/W9NnCvO9xac",
    year: 2021,
  },
  "twin-stars": {
    alt: "Album Artwork for Twin Stars",
    artworkCredit: "Breanda Fedie",
    descriptions: [
      "Twin Stars is a project born in the aftermath of Tyler’s previous band breaking up. It explores the stages of coping with losing someone so close that a part of yourself seems lost, too.",
      "These songs encapsulate a newfound sense of agency after a toxic friendship ends with finality, and the necessary re-framing of identity that follows.",
      "In a similar sense, because these are the first five songs Tyler has written since high school, when the Cuckoo and the Birds moniker was created, they can be viewed as a thought experiment to test how far this reinvigorated expression can go.",
      "They were tracked, mixed, and mastered by Zachary Taylor, whose recording prowess and drumming wizardry take the songs to new heights. They were recorded DIY style over several nights in the comfort of Zach’s basement.",
      "Featuring only two musicians, the raw, understated texture becomes a distinguishing character of Twin Stars.",
    ],
    href: "https://cuckooandthebirds.bandcamp.com/album/twin-stars",
    imgsrc: "Twin Stars/twin-stars-album-art.jpg",
    performingCredits: [
      "Vocals, Guitars, Bass - Tyler Earls",
      "Drums, Percussion - Zachary Taylor",
    ],
    recordingCredits: [
      "Songs written by Tyler Earls",
      "Tracked, Mixed, and Mastered by Zachary Taylor",
    ],
    title: "Twin Stars",
    videoCredits: [],
    videosrc: null,
    year: 2019,
  },
} as const;

export const RELEASE_SLUG_DATA = [
  {
    alt: "Artwork for Show Me The Dark",
    cldImgPath: "Show Me The Dark/show-me-the-dark-artwork",
    releaseId: "show-me-the-dark",
    title: "Show Me The Dark",
    year: 2021,
  },
  {
    alt: "Album Artwork for Twin Stars",
    cldImgPath: "Twin Stars/twin-stars-album-art.jpg",
    releaseId: "twin-stars",
    title: "Twin Stars",
    year: 2019,
  },
];
