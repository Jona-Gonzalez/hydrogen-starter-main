import {ImageCms} from '~/lib/types';

interface Section {
  bgColor: string;
  fullWidth: boolean;
  textColor: string;
}

interface Slide {
  alt: string;
  image: ImageCms;
  quote: string;
}

export interface PressSliderProps {
  section: Section;
  slides: Slide[];
}

export interface PressSliderThumbProps {
  alt?: string;
  image?: ImageCms;
  isActive?: boolean;
  onClick?: () => void;
}
