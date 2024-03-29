interface Image {
  alt: string;
  imageDesktop: {
    src: string;
  };
  imageMobile: {
    src: string;
  };
  positionDesktop: string;
  positionMobile: string;
}

interface Video {
  autoplay: boolean;
  posterDesktop: {
    src: string;
  };
  posterMobile: {
    src: string;
  };
  sound: boolean;
  srcDesktop: string;
  srcMobile: string;
}

interface Media {
  aspectDesktop: string;
  aspectMobile: string;
  fill: boolean;
  image: Image;
  mediaOrderDesktop: string;
  mediaOrderMobile: string;
  video: Video;
}

interface Content {
  alignmentDesktop: string;
  alignmentMobile: string;
  buttons: Record<string, any>[];
  color: string;
  heading: string;
  maxWidthDesktop: string;
  subtext: string;
  superheading: string;
}

interface Section {
  aboveTheFold: boolean;
  bgColor: string;
  fullBleed: boolean;
  fullWidth: boolean;
  verticalPadding: boolean;
}

export interface HalfHeroProps {
  content: Content;
  media: Media;
  section: Section;
}

export interface HalfHeroMediaProps {
  aboveTheFold?: boolean;
  media: Media;
  videoAlt?: string;
}

export interface HalfHeroContentProps {
  aboveTheFold: boolean;
  content: Content;
}

export interface HalfHeroVideoProps {
  autoplay?: boolean;
  posterSrc?: string;
  sound?: boolean;
  videoAlt?: string;
  videoSrc: string;
}
