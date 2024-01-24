interface Media {
  embed: string;
  aspectRatio: string;
}

interface Section {
  maxWidth: string;
  enableYPadding: boolean;
  enableXPadding: boolean;
}

export interface VideoEmbedProps {
  media: Media;
  section: Section;
}
