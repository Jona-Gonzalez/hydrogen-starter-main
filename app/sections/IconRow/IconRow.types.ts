import {ImageCms} from '~/lib/types';

interface Icon {
  icon: string;
  image?: ImageCms;
  alt?: string;
  label?: string;
}

interface Section {
  fullWidth?: boolean;
  bgColor?: string;
  textColor?: string;
  iconColor?: string;
}

export interface IconRowProps {
  heading?: string;
  icons: Icon[];
  section: Section;
  subtext?: string;
}
