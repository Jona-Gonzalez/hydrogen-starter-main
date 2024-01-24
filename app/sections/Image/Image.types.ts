import {LinkCms} from '~/lib/types';

interface Image {
  alt: string;
  aspectDesktop: string;
  aspectMobile: string;
  imageDesktop: {
    aspectRatio: string;
    src: string;
  };
  imageMobile: {
    aspectRatio: string;
    src: string;
  };
  positionDesktop: string;
  positionMobile: string;
}

interface Section {
  maxWidth: string;
  enablePadding: boolean;
}

interface Content {
  caption: string;
  link: LinkCms;
}

export interface ImageProps {
  content: Content;
  image: Image;
  section: Section;
}
