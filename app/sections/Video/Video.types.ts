import {ImageCms, LinkCms} from '~/lib/types';

interface Media {
  title: string;
  srcDesktop: string;
  posterDesktop: ImageCms;
  aspectDesktop: string;
  srcMobile: string;
  posterMobile: ImageCms;
  aspectMobile: string;
}

interface Section {
  maxWidth: string;
  enableYPadding: boolean;
  enableXPadding: boolean;
}

interface Content {
  link: LinkCms;
}

interface Play {
  autoplay: boolean;
  controls: boolean;
  loop: boolean;
  pauseAndPlay: boolean;
  sound: boolean;
}

export interface VideoProps {
  content: Content;
  media: Media;
  play: Play;
  section: Section;
}

export interface VideoElementProps {
  playOptions: Play;
  posterSrc: string;
  title: string;
  videoSrc: string;
}
