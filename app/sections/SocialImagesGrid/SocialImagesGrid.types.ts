import {ImageCms} from '~/lib/types';

interface Image {
  alt: string;
  image: ImageCms;
  platform: string;
  url: string;
}

interface Section {
  fullBleed: boolean;
  fullWidth: boolean;
}

export interface SocialImagesGridProps {
  images: Image[];
  section: Section;
}
