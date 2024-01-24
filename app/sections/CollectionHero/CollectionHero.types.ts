import {ReactNode} from 'react';

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

interface Section {
  bgColor: string;
}

interface Text {
  color: string;
  heading: string;
  subheading: string;
}

interface Content {
  alignmentMobile: string;
  alignmentDesktop: string;
  darkOverlay: boolean;
  maxWidthMobile: string;
  maxWidthDesktop: string;
  positionMobile: string;
  positionDesktop: string;
}

export interface CollectionHeroProps {
  content: Content;
  image: Image;
  section: Section;
  text: Text;
}

export interface CollectionHeroContentProps {
  content: Content;
  text: Text;
}

export interface CollectionHeroContainerProps {
  children: ReactNode;
  cms: any;
}
