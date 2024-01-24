import {ImageCms, LinkCms} from '~/lib/types';

interface Section {
  aspectRatio: string;
  fullWidth: boolean;
}

interface Tile {
  alt: string;
  description: string;
  heading: string;
  image: ImageCms;
  link: LinkCms;
  position: string;
}

export interface TwoTilesProps {
  section: Section;
  tiles: Tile[];
}
