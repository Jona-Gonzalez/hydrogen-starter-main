import {ImageCms, LinkCms} from '~/lib/types';

interface Content {
  clickableImage?: boolean;
  contentPosition?: string;
  darkOverlay?: boolean;
  hideButtons?: boolean;
  primaryButtonStyle?: string;
  secondaryButtonStyle?: string;
}

interface Tile {
  alt?: string;
  buttons?: {
    link?: LinkCms;
  }[];
  heading?: string;
  image?: ImageCms;
  position?: string;
}

interface Section {
  aspectRatio?: string;
  fullWidth?: boolean;
}

export interface ImageTilesProps {
  content: Content;
  heading?: string;
  subheading?: string;
  section: Section;
  tiles: Tile[];
}

export interface ImageTileProps {
  aspectRatio: string | undefined;
  content: Content;
  tile: Tile;
}
