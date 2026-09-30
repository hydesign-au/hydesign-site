import type { FolderSlug, ImageKey, VideoKey } from "./media.gen";
import type { GalleryOrientation } from "./services/types";

export type ProjectSection = {
  title: string;
  body: string;
  image?: ImageKey;
};

export type Project = {
  slug: string;
  title: string;
  // Suburb or city for cards, page headings, metadata and schema.
  location: string;
  metaDescription: string;
  // One sentence used as the hero subtitle and card copy.
  summary: string;
  intro: string[];
  sections: ProjectSection[];
  heroImage: ImageKey;
  heroVideo?: VideoKey;
  galleryOrientation: GalleryOrientation;
  relatedProjects: string[];
  galleryFolder: FolderSlug;
};

// Edge Geelong and Platform One carry owner-led copy. Rosella Mural and RocoMamas
// stay with short, factual descriptions from the existing site and media library.
export const projects: Project[] = [
  {
    slug: "rosella-mural",
    title: "Rosella Mural",
    location: "Cremorne",
    galleryFolder: "project-rosella",
    metaDescription:
      "A hand-painted mural for Rosella in Cremorne, Melbourne, with the Rosella bird and the brand's imagery painted by hand across a brick wall.",
    summary: "Brick, paint and the Rosella bird in Cremorne.",
    intro: ["We painted the Rosella bird and brand imagery across the wall by hand."],
    sections: [],
    // The parrot close-up; the full mural (IMG_2594) is the home hero.
    heroImage: "IMG_0152",
    galleryOrientation: "landscape",
    relatedProjects: ["edge-geelong", "platform-one"],
  },
  {
    slug: "edge-geelong",
    title: "Edge Geelong",
    location: "Geelong",
    galleryFolder: "project-edge",
    metaDescription:
      "Full venue signage for Edge Geelong, with hand-painted wall art, illuminated LED signage and a 17-metre glass mosaic feature wall of 240,000 hand-cut tiles.",
    summary: "Paint, print, light and 240,000 hand-cut glass tiles on the Geelong waterfront.",
    intro: [
      "The Edge is on the Geelong waterfront and had a major fit-out in 2016. Blackmilk Interior Design asked us to produce all the signage and wall graphics through the venue.",
      "The package ran from hand-painted wall art and illuminated LED signage to printed vinyl, floor mats and themed designs for the bathrooms.",
    ],
    sections: [
      {
        title: "The mosaic wall",
        body: "The centrepiece is a custom glass mosaic feature wall, 17 metres long by 1.6 metres high. Each of its 240,000 glass tiles was hand cut to 5 x 20 mm, and the wall alone took over a year to produce.",
        image: "IMG_2277",
      },
      {
        title: "Paint, light and print",
        body: "Around the mosaic, the venue uses hand-painted wall art, LED signage, printed vinyl and floor mats, all made for the same fit-out.",
        image: "IMG_7219",
      },
    ],
    heroImage: "IMG_6593",
    heroVideo: "edge",
    galleryOrientation: "landscape",
    relatedProjects: ["rocomamas", "rosella-mural"],
  },
  {
    slug: "platform-one",
    title: "Platform One",
    location: "Melbourne",
    galleryFolder: "project-platform-one",
    metaDescription:
      "Custom neon throughout Platform One in Melbourne, with a set of neon pieces designed and fabricated by HyDesign for the venue's fit-out.",
    summary: "A nightclub full of custom neon, all designed as one set.",
    intro: [
      "Neon throughout the room, with individual signs designed as one set and wall graphics to match.",
    ],
    sections: [
      {
        title: "Neon as the fit-out",
        body: "Neon runs right through the space. Each piece was drawn and made as part of one set.",
        image: "IMG_9374",
      },
    ],
    heroImage: "IMG_9381",
    galleryOrientation: "landscape",
    relatedProjects: ["rocomamas", "edge-geelong"],
  },
  {
    slug: "rocomamas",
    title: "RocoMamas",
    location: "Windsor",
    galleryFolder: "project-rocomamas",
    metaDescription:
      "Hand-painted signage, custom neon and an illuminated fascia for RocoMamas in Windsor, made and installed by HyDesign.",
    summary: "Hand-painted feature walls, custom neon and an illuminated fascia in Windsor.",
    intro: [
      "A feature wall we are proud of, with hand-painted lettering and custom neon inside the Windsor restaurant. We also made the illuminated fascia out front.",
    ],
    sections: [
      {
        title: "The feature walls",
        body: "The painted lettering and neon were made as part of the restaurant fit-out, with a different line on each wall.",
        image: "IMG_9613",
      },
    ],
    heroImage: "IMG_0535",
    heroVideo: "rocomamas",
    galleryOrientation: "landscape",
    relatedProjects: ["edge-geelong", "platform-one"],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
