import {ImageCms, LinkCms} from '~/lib/types';

interface Section {
  aspectRatio: string;
  bgColor: string;
  buttonStyle: string;
  fullWidth: boolean;
  textColor: string;
}

interface Tile {
  image: ImageCms;
  title: string;
  url: string;
}

interface Tab {
  tabName: string;
  tiles: Tile[];
}

export interface TabbedThreeTilesProps {
  button: LinkCms;
  heading: string;
  section: Section;
  tabs: Tab[];
}

export interface TabbedThreeTilesTabsProps {
  activeTabIndex: number;
  maxWidthClass: string;
  setActiveTabIndex: (index: number) => void;
  tabs: Tab[];
  textColor: string;
}
