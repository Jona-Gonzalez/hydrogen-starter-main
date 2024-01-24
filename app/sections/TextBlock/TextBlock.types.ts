import {LinkCms} from '~/lib/types';

interface Section {
  aboveTheFold: boolean;
  bgColor: string;
  fullWidth: boolean;
  textColor: string;
}

interface Button {
  link: LinkCms;
  style: string;
}

export interface TextBlockProps {
  buttons: Button[];
  heading: string;
  section: Section;
  subtext: string;
}
